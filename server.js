'use strict';

const express = require('express');
const xss = require('xss');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for comments
const comments = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// GET all comments
app.get('/api/comments', (req, res) => {
  res.json(comments);
});

// POST a new comment (sanitized with xss library)
app.post('/api/comments', (req, res) => {
  const raw = req.body && req.body.text;
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    return res.status(400).json({ error: 'Comment text is required.' });
  }

  const sanitized = xss(raw.trim());
  const comment = {
    id: Date.now(),
    text: sanitized,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);
  res.status(201).json(comment);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
