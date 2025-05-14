// server.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static files from current directory
app.use(express.static(__dirname));

// ✅ Serve index.html when someone visits /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Create new blog post
app.post('/api/posts', (req, res) => {
  const { title, category, image, content } = req.body;
  const sql = 'INSERT INTO posts (title, category, image, content) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, category, image, content], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to create post' });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// ✅ Get all blog posts
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ✅ Update a blog post
app.put('/api/posts/:id', (req, res) => {
  const { title, category, image, content } = req.body;
  const { id } = req.params;
  db.run(
    'UPDATE posts SET title = ?, category = ?, image = ?, content = ? WHERE id = ?',
    [title, category, image, content, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Post updated' });
    }
  );
});

// ✅ Delete a blog post
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Post deleted' });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server chal raha hai: http://localhost:${PORT}`);
});






app.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { name, message } = req.body;
  db.run(
    'INSERT INTO comments (post_id, name, message) VALUES (?, ?, ?)',
    [postId, name, message],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});



app.get('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  db.all(
    'SELECT name, message, created_at FROM comments WHERE post_id = ? ORDER BY created_at DESC',
    [postId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});
