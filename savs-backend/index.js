// Inside your C:\Users\Welcome\OneDrive\Desktop\SAVS\savs-backend\index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const studentSignup = require('./routes/studentSignup');
const adminSignup = require('./routes/adminSignup');
const verifyAdmin = require('./routes/verifyAdmin');
const verifyStudent = require('./routes/verifyStudent');
const authRoute = require('./routes/auth');
const getPendingAdmins = require('./routes/getPendingAdmins');
const approveAdmin = require('./routes/approveAdmin');
const superAdminRoutes = require('./routes/superAdminRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();

// Middleware to handle CORS
app.use(cors()); // Allow all origins
// OR, if you want to specify allowed origin (in your case frontend URL):
// app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to handle JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static directory for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Mounting
app.use('/api/signup/student', studentSignup);
app.use('/api/signup/admin', adminSignup);
app.use('/api/verify-admin', verifyAdmin);
app.use('/api/verify-student', verifyStudent);
app.use('/api/auth', authRoute);
app.use('/api/super-admin/pending-admins', getPendingAdmins);
app.use('/api/super-admin/approve-admin', approveAdmin);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/pdf', pdfRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
