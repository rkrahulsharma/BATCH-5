const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/start", (req, res) => {
  const { session_name, host_name, admin_email, room_id, intervals, start_time } = req.body;

  const sql = `INSERT INTO sessions 
    (session_name, host_name, admin_email, room_id, intervals, start_time)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [session_name, host_name, admin_email, room_id, JSON.stringify(intervals), start_time], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to start session. Try again.");
    }
    res.status(200).send("Session started successfully");
  });
});

module.exports = router;