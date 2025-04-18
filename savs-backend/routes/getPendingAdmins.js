const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = "SELECT id, name, email, department, college FROM admins WHERE is_approved = 0";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json(result);
  });
});

module.exports = router;
