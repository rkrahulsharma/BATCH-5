const express = require('express');
const router = express.Router();
const db = require('../db');

// Host/Admin Approval Route for Students
router.post('/', (req, res) => {
  const { adminEmail, targetStudentEmail } = req.body;

  const adminQuery = `SELECT * FROM admins WHERE email = ? AND is_approved = TRUE`;

  db.query(adminQuery, [adminEmail], (err, adminResults) => {
    if (err || adminResults.length === 0) {
      return res.status(403).json({ message: 'Access denied. Invalid Admin.' });
    }

    const { department, college } = adminResults[0];

    // Check if student belongs to same dept and college
    const studentQuery = `
      SELECT * FROM students 
      WHERE email = ? AND department = ? AND college = ? AND is_approved = FALSE
    `;

    db.query(studentQuery, [targetStudentEmail, department, college], (stuErr, stuResults) => {
      if (stuErr || stuResults.length === 0) {
        return res.status(404).json({ message: 'Student not found or not in same dept/college.' });
      }

      const approveStudentQuery = `UPDATE students SET is_approved = TRUE WHERE email = ?`;

      db.query(approveStudentQuery, [targetStudentEmail], (finalErr, result) => {
        if (finalErr) {
          return res.status(500).json({ message: 'Error approving student.' });
        }

        res.status(200).json({ message: 'Student approved successfully.' });
      });
    });
  });
});

module.exports = router;

