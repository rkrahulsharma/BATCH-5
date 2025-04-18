const express = require('express');
const router = express.Router();
const db = require('../db');

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const table = role === 'admin' ? 'admins' : 'students';
  const sql = `SELECT * FROM ${table} WHERE email = ? AND password = ?`;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role === 'admin' && !results[0].is_approved) {
      return res.status(403).json({ message: "Admin not approved yet" });
    }

    return res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      user: results[0]
    });
  });
});

module.exports = router;
