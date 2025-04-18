const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Routes
const studentSignup = require('./routes/studentSignup');
const adminSignup = require('./routes/adminSignup');
const verifyAdmin = require('./routes/verifyAdmin');
const verifyStudent = require('./routes/verifyStudent');
const authRoute = require('./routes/auth');
const getPendingAdmins = require('./routes/getPendingAdmins');
const approveAdmin = require('./routes/approveAdmin');
const superAdminRoutes = require('./routes/superAdminRoutes');
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route mounting
app.use('/api/signup/student', studentSignup);
app.use('/api/signup/admin', adminSignup);
app.use('/api/verify-admin', verifyAdmin);
app.use('/api/verify-student', verifyStudent);
app.use('/api/auth', authRoute);
app.use('/api/super-admin/pending-admins', getPendingAdmins);
app.use('/api/super-admin/approve-admin', approveAdmin);
app.use('/api/super-admin', superAdminRoutes);
// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
