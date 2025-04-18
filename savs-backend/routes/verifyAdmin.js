const express = require('express');
const router = express.Router();
const db = require('../db');

// Super Admin Approval Route for Admins
router.post('/', (req, res) => {
  const { superAdminEmail, targetAdminEmail } = req.body;

  const superAdminQuery = `SELECT * FROM admins WHERE email = ? AND is_approved = TRUE`;

  db.query(superAdminQuery, [superAdminEmail], (err, results) => {
    if (err || results.length === 0) {
      return res.status(403).json({ message: 'Access denied. Invalid Super Admin.' });
    }

    // Update target admin to approved
    const updateQuery = `UPDATE admins SET is_approved = TRUE WHERE email = ?`;

    db.query(updateQuery, [targetAdminEmail], (updateErr, updateResult) => {
      if (updateErr) {
        return res.status(500).json({ message: 'Error approving admin.' });
      }
      res.status(200).json({ message: 'Admin approved successfully.' });
    });
  });
});

module.exports = router;
