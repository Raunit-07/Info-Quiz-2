import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'quiz.db');

const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite database:', err.message);
    process.exit(1);
  }

  console.log('✅ SQLite database opened at', dbPath);
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )`
  );
});

const query = (sql, params = [], callback) => {
  const command = sql.trim().split(' ')[0].toUpperCase();

  if (command === 'SELECT') {
    db.all(sql, params, callback);
  } else {
    db.run(sql, params, function (err) {
      callback(err, this);
    });
  }
};

export default { query };