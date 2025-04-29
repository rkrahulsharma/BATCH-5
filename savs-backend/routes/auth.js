const express = require('express');
const router = express.Router();
const db = require('../db');

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  // Determine which table to query
  const table = role === 'student' ? 'students' : 'admins';

  const sql = `SELECT * FROM ${table} WHERE email = ? AND password = ?`;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Role mismatch check (for admin/superadmin)
    if ((role === 'admin' || role === 'superadmin') && user.role !== role) {
      return res.status(403).json({ message: "Role mismatch. Please select the correct role." });
    }

    // Approval checks
    if ((role === 'admin' || role === 'superadmin') && !user.is_approved) {
      return res.status(403).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not approved yet.` });
    }

    if (role === 'student' && !user.is_approved) {
      return res.status(403).json({ message: "Student not approved yet." });
    }

    return res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      user
    });
  });
});

module.exports = router;
