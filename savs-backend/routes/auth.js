const express = require('express');
const router = express.Router();
const db = require('../db');

// Unified Login Route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let table = '';
  if (role === 'admin') table = 'admins';
  else if (role === 'student') table = 'students';
  else if (role === 'superadmin') table = 'superadmins';
  else return res.status(400).json({ message: 'Invalid role specified' });

  try {
    const [users] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Password match check
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Approval check for admin and student
    if ((role === 'admin' || role === 'student') && !user.is_approved) {
      return res.status(403).json({
        message:
          role === 'admin'
            ? 'Your admin account is pending Super Admin approval.'
            : 'Your account is pending approval by your department host.',
      });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;