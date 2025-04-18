const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { email, password, role } = req.body;
  const table = role === "admin" ? "admins" : "students";

  const sql = `SELECT * FROM ${table} WHERE email = ?`;

  db.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    if (!user.is_approved) {
      return res.status(403).json({
        message: role === "admin"
          ? "Your admin account is pending Super Admin approval."
          : "Your account is pending approval by your department host.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful", user });
  });
});

module.exports = router;
