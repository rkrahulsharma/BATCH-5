const express = require('express');
const router = express.Router();
const db = require('../db'); // your DB connection

// GET all admins
router.get('/admins', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM admins');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// POST /approve
router.post('/approve', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('UPDATE admins SET is_approved = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Admin approved' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// POST /reject
router.post('/reject', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM admins WHERE id = ?', [id]);
    res.json({ success: true, message: 'Admin rejected and deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed' });
  }
});
// GET all students
router.get('/students', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});
router.post('/add-student', async (req, res) => {
  const { name, email, department, guardian_email } = req.body;
  try {
    await db.query(
      'INSERT INTO students (name, email, department, guardian_email) VALUES (?, ?, ?, ?)',
      [name, email, department, guardian_email]
    );
    res.json({ success: true, message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student' });
  }
});
// GET all session reports
router.get('/reports', async (req, res) => {
  try {
    const [sessions] = await db.query('SELECT * FROM sessions');
    const [participants] = await db.query('SELECT * FROM attendance');
    res.json({ sessions, participants });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});
router.post('/host-session', async (req, res) => {
  const { title, start_time, end_time } = req.body;
  try {
    await db.query('INSERT INTO sessions (title, start_time, end_time) VALUES (?, ?, ?)', [title, start_time, end_time]);
    res.json({ success: true, message: 'Session hosted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to host session' });
  }
});



module.exports = router;
