import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'expenses.db');

/**
 * Initializes the SQLite database and creates tables if they don't exist.
 * Returns the database instance.
 */
export function initDb() {
  const db = new Database(DB_PATH);

  // Enable WAL mode for better performance
  // db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL,
      name        TEXT    NOT NULL,
      amount      REAL    NOT NULL,
      category    TEXT,
      date        TEXT    NOT NULL,
      description TEXT,
      group_id    INTEGER NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  return db;
}

export default initDb;
