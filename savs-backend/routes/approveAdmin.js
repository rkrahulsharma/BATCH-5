const express = require('express');
const router = express.Router();
const db = require('../db');

router.put('/:id', (req, res) => {
  const adminId = req.params.id;
  const sql = "UPDATE admins SET is_approved = 1 WHERE id = ?";
  db.query(sql, [adminId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Approval failed' });
    res.status(200).json({ message: 'Admin approved successfully!' });
  });
});

module.exports = router;
