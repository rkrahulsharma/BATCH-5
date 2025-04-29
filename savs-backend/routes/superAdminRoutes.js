const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all admins
router.get('/admins', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM admins');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Approve Admin
router.post('/approve', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('UPDATE admins SET is_approved = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Admin approved' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// Reject Admin
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

// Approve Student
router.post('/approve-student', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('UPDATE students SET is_approved = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Student approved' });
  } catch (err) {
    res.status(500).json({ error: 'Student approval failed' });
  }
});

// Reject Student
router.post('/reject-student', async (req, res) => {
  const { id } = req.body;
  try {
    await db.query('DELETE FROM students WHERE id = ?', [id]);
    res.json({ success: true, message: 'Student rejected and deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Student rejection failed' });
  }
});

// Add Student (manually by super admin if needed)
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

// Host a new session
router.post('/host-session', async (req, res) => {
  const { title, start_time, end_time } = req.body;
  try {
    await db.query('INSERT INTO sessions (title, start_time, end_time) VALUES (?, ?, ?)', [title, start_time, end_time]);
    res.json({ success: true, message: 'Session hosted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to host session' });
  }
});
// GET all sessions
router.get('/sessions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sessions');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;