const express = require('express');
const router = express.Router();
const db = require('../db');

// Admin Signup Route
router.post("/", (req, res) => {
  const { name, email, password, department, college } = req.body;

  // Validate inputs
  if (!name || !email || !password || !department || !college) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Optional: check if admin already exists
  const checkSql = "SELECT * FROM admins WHERE email = ?";
  db.query(checkSql, [email], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Check Error:", checkErr);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (checkResults.length > 0) {
      return res.status(409).json({ message: "Admin already registered with this email." });
    }

    const insertSql = `
      INSERT INTO admins 
      (name, email, password, department, college, is_approved) 
      VALUES (?, ?, ?, ?, ?, FALSE)
    `;

    db.query(insertSql, [name, email, password, department, college], (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.status(500).json({ message: "Error occurred during registration" });
      }

      res.status(200).json({
        message: "Admin signup successful! Awaiting Super Admin approval.",
      });
    });
  });
});

module.exports = router;
