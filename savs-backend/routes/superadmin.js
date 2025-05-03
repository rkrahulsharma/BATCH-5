const express = require('express');
const router = express.Router();
const db = require('../db');

// LOGIN
router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const sql = `SELECT * FROM admins WHERE email = ? AND password = ?`;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    if (user.role !== role) {
      return res.status(403).json({ message: "Role mismatch" });
    }

    if (!user.is_approved) {
      return res.status(403).json({ message: `${role} not approved yet` });
    }

    return res.status(200).json({ message: "Login successful", user });
  });
});

// SIGNUP
router.post("/signup", (req, res) => {
  const { name, email, password, department, college, role } = req.body;

  const sql = `
    INSERT INTO admins (name, email, password, department, college, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, password, department, college, role], (err, result) => {
    if (err) {
      console.error("Signup error:", err);
      return res.status(500).json({ message: "Error occurred during registration" });
    }

    res.status(201).json({ message: "Signup successful, awaiting approval" });
  });
});

module.exports = router;
