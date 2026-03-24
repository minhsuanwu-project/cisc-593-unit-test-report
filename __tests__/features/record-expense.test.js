import {validateInput} from '../../features/record-expense';


test('should return true for valid input', () => {
    const validInput = {
        name: 'Grace',
        amount: 50,
        category: 'Food',
        date: '2023-10-01',
        description: 'Weekly grocery shopping'
    };
    expect(validateInput(validInput)).toBe(true);
});

test('should return false for missing required fields', () => {
    const invalidInput = {
        amount: 50,
        category: 'Food',
        date: '2023-10-01',
        description: 'Weekly grocery shopping'
    };
    expect(validateInput(invalidInput)).toBe(false);
});