import { z } from 'zod';



const GroupBalenceSchema = z
  .object({
    group: z.number().int().positive(),
  })


  /**
 * Factory that accepts a db instance and returns the Express route handler.
 * @param {import('better-sqlite3').Database} db
 */
const computeBalanceEndpoint = (db) => (req, res) => {
    if (!validateInput(req.body)) {
        return res.status(400).send('Invalid input data');
      }
    
      if (!res.locals.isAuthenticated) {
        return res.status(401).send('Unauthorized');
      }
    
      const dataObject = GroupBalenceSchema.safeParse(req.body).data;

      // Grabs all records from expenses that match group id
      const stmt = db.prepare(`
    SELECT * FROM expenses 
    WHERE group = @group_id
  `);

  const result = stmt.run({
    group_id: dataObject.group
  });

  const balance = [];
  let sum = 0;
  const rows = Array.isArray(result.data) ? result.data : [];
  rows.forEach(element => {
        balance.push({name: element.name, amount: element.amount});
        sum = sum + element.amount;
        
  });
  res.status(200).json({ id: dataObject.group, message: "group balnce is" + sum + "amount is" + JSON.stringify(balance)});
};

export const validateInput = (data) => {
  // Accept a plain positive integer group id OR an object with a positive integer group field
  if (typeof data === 'number') {
    return z.number().int().positive().safeParse(data).success;
  }
  return GroupBalenceSchema.safeParse(data).success;
};
export default computeBalanceEndpoint;