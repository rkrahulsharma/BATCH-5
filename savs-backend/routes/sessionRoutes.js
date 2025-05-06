const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure the db module is correctly imported
const { exec } = require('child_process');
const path = require('path');

router.post('/start', async (req, res) => {
  const { title, code, adminName, intervals } = req.body;

  if (!title || !code || !adminName || !intervals || intervals.length < 3) {
    return res.status(400).json({ message: 'Missing required session data.' });
  }

  try {
    // Insert session data into the database
    await db.query(
      'INSERT INTO sessions (title, code, admin_name, intervals, is_active, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, code, adminName, JSON.stringify(intervals), true]
    );

    // Full path to the jj folder
    const jjFolderPath = path.resolve(__dirname, '../../jj');

    // Use PM2 to start the jj app
    exec(`pm2 start npm --name "jj-app" -- start --prefix ${jjFolderPath}`, (pm2Error, stdout, stderr) => {
      if (pm2Error) {
        console.error(`Error starting jj with PM2: ${pm2Error.message}`);
        return res.status(500).json({ message: `Failed to execute jj: ${pm2Error.message}` });
      }
      if (stderr) {
        console.warn(`PM2 stderr: ${stderr}`);
      }
      console.log(`PM2 stdout: ${stdout}`);
      res.json({ message: 'Session started successfully and jj folder executed.' });
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Failed to start session.' });
  }
});

module.exports = router;