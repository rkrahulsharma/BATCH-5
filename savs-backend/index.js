const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Routes
// app.use('/api/signup/student', studentSignup);
// app.use('/api/signup/admin', adminSignup);
// app.use('/api/verify-admin', verifyAdmin);
// app.use('/api/verify-student', verifyStudent);
// app.use('/api/auth', authRoute);
// app.use('/api/super-admin/pending-admins', getPendingAdmins);
// app.use('/api/super-admin/approve-admin', approveAdmin);
// app.use('/api/super-admin', superAdminRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/pdf', pdfRoutes);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use('/api/sessions', sessionRoutes);
app.use('/api/pdf', pdfRoutes); // ✅ PDF routes

// Start server
app.listen(5000, () => {
  console.log('✅ Server running on http://localhost:5000');
});
