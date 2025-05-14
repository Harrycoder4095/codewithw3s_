// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blog.db');

// Create a "posts" table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      image TEXT,
      content TEXT NOT NULL
    )
  `);
});

module.exports = db;


// comment section

db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    name TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
