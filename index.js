import express, { json } from 'express';
import recordExpenseEndpoint from './features/record-expense.js';

const app = express();
const port = 3000;

app.use(json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/record-expense', recordExpenseEndpoint);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});