const express = require('express');
const router = express.Router();

// Route to return super admin info
router.get('/superadmin', (req, res) => {
  const superAdminData = {
    name: "Rahul Kumar",
    email: "superadmin@savs.com",
    role: "Super Admin",
    image: "c:\Users\Welcome\Downloads\photo.jpeg" // or local image
  };
  res.json(superAdminData);
});

module.exports = router;
