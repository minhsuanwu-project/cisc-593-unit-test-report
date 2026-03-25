import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateInput } from '../../features/record-expense.js';
import recordExpenseEndpoint from '../../features/record-expense.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal mock db whose prepare().run() is a spy. */
function createMockDb(runReturnValue = { lastInsertRowid: 1 }) {
  const run = vi.fn().mockReturnValue(runReturnValue);
  const prepare = vi.fn().mockReturnValue({ run });
  return { prepare, _run: run };
}

/** Build a mock Express req object. */
function createReq(body = {}) {
  return { body };
}

/** Build a mock Express res object whose methods are chainable spies. */
function createRes({ isAuthenticated = true, user = { id: 1, name: 'John Doe' } } = {}) {
  const res = {
    locals: { isAuthenticated, user },
    statusCode: 200,
    _body: null,
  };
  res.status = vi.fn().mockImplementation((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = vi.fn().mockImplementation((body) => {
    res._body = body;
    return res;
  });
  res.send = vi.fn().mockImplementation((body) => {
    res._body = body;
    return res;
  });
  return res;
}

const validExpense = {
  name: 'Groceries',
  amount: 75.5,
  category: 'Food',
  date: '2024-03-01',
  description: 'Weekly shopping',
  group: 1,
};

// ---------------------------------------------------------------------------
// validateInput
// ---------------------------------------------------------------------------

describe('validateInput', () => {
  it('returns true for a fully valid expense', () => {
    expect(validateInput(validExpense)).toBe(true);
  });

  it('returns true when optional fields (category, description) are omitted', () => {
    const { category, description, ...minimal } = validExpense;
    expect(validateInput(minimal)).toBe(true);
  });

  it('returns true when group is provided as a positive integer', () => {
    expect(validateInput({ ...validExpense, group: 3 })).toBe(true);
  });

  it('returns false when group is missing', () => {
    const { group, ...rest } = validExpense;
    expect(validateInput(rest)).toBe(false);
  });

  it('returns false when group is zero', () => {
    expect(validateInput({ ...validExpense, group: 0 })).toBe(false);
  });

  it('returns false when group is a string', () => {
    expect(validateInput({ ...validExpense, group: 'abc' })).toBe(false);
  });

  it('returns false when name is missing', () => {
    const { name, ...rest } = validExpense;
    expect(validateInput(rest)).toBe(false);
  });

  it('returns false when name is an empty string', () => {
    expect(validateInput({ ...validExpense, name: '' })).toBe(false);
  });

  it('returns false when amount is missing', () => {
    const { amount, ...rest } = validExpense;
    expect(validateInput(rest)).toBe(false);
  });

  it('returns false when amount is zero', () => {
    expect(validateInput({ ...validExpense, amount: 0 })).toBe(false);
  });

  it('returns false when amount is negative', () => {
    expect(validateInput({ ...validExpense, amount: -10 })).toBe(false);
  });

  it('returns false when amount is a string', () => {
    expect(validateInput({ ...validExpense, amount: 'fifty' })).toBe(false);
  });

  it('returns false when date is missing', () => {
    const { date, ...rest } = validExpense;
    expect(validateInput(rest)).toBe(false);
  });

  it('returns false when date is not a valid date string', () => {
    expect(validateInput({ ...validExpense, date: 'not-a-date' })).toBe(false);
  });

  it('returns false for completely empty input', () => {
    expect(validateInput({})).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// recordExpenseEndpoint handler
// ---------------------------------------------------------------------------

describe('recordExpenseEndpoint', () => {
  let db;

  beforeEach(() => {
    db = createMockDb();
  });

  it('returns 400 when input is invalid', () => {
    const req = createReq({ name: '', amount: -5, date: 'bad' });
    const res = createRes();

    recordExpenseEndpoint(db)(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid input data');
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('returns 401 when user is not authenticated', () => {
    const req = createReq(validExpense);
    const res = createRes({ isAuthenticated: false });

    recordExpenseEndpoint(db)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('inserts the expense and returns 201 with the new id on success', () => {
    db = createMockDb({ lastInsertRowid: 42 });
    const req = createReq(validExpense);
    const res = createRes();

    recordExpenseEndpoint(db)(req, res);

    expect(db.prepare).toHaveBeenCalledOnce();
    expect(db._run).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 42,
      message: 'Expense recorded successfully!',
    });
  });

  it('inserts null for omitted optional fields (category, description)', () => {
    const { category, description, ...minimalExpense } = validExpense;
    const req = createReq(minimalExpense);
    const res = createRes();

    recordExpenseEndpoint(db)(req, res);

    const runArg = db._run.mock.calls[0][0];
    expect(runArg.category).toBeNull();
    expect(runArg.description).toBeNull();
  });

  it('inserts the provided group id when group is supplied', () => {
    const req = createReq({ ...validExpense, group: 7 });
    const res = createRes();

    recordExpenseEndpoint(db)(req, res);

    const runArg = db._run.mock.calls[0][0];
    expect(runArg.group_id).toBe(7);
  });

  it('inserts the correct user_id from res.locals.user', () => {
    const user = { id: 7, name: 'Alice' };
    const req = createReq(validExpense);
    const res = createRes({ user });

    recordExpenseEndpoint(db)(req, res);

    const runArg = db._run.mock.calls[0][0];
    expect(runArg.user_id).toBe(user.id);
  });

  it('inserts the correct expense data from the request body', () => {
    const req = createReq(validExpense);
    const res = createRes();

    recordExpenseEndpoint(db)(req, res);

    const runArg = db._run.mock.calls[0][0];
    expect(runArg.name).toBe(validExpense.name);
    expect(runArg.amount).toBe(validExpense.amount);
    expect(runArg.category).toBe(validExpense.category);
    expect(runArg.date).toBe(validExpense.date);
    expect(runArg.description).toBe(validExpense.description);
  });
});