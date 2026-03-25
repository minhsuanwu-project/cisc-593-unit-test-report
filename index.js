import express, { json } from 'express';
import { initDb } from './db.js';
import recordExpenseEndpoint from './features/record-expense.js';

const app = express();
const port = 3000;

// Initialize (and create if missing) the SQLite database
const db = initDb();

app.use(json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Pass the db instance into the endpoint factory
app.post('/record-expense', recordExpenseEndpoint(db));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});