import { z } from 'zod';

const RecordInputSchema = z.object({
  name: z.string().nonempty(),
  amount: z.number().positive(),
  category: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  description: z.string().optional(),
});

const recordExpenseEndpoint = (req, res) => {
  if (!validateInput(req.body)) {
    return res.status(400).send('Invalid input data');
  }

  const dataObject = RecordInputSchema.safeParse(req.body).data;

  // Placeholder for recording an expense

  res.send('Expense recorded successfully!');
};

export const validateInput = (data) => {
  // validate the input using the Zod schema
  const result = RecordInputSchema.safeParse(data);
  return result.success;
}

export default recordExpenseEndpoint;