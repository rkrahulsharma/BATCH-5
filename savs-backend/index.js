const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const superAdminRoutes = require("./routes/superadmin");
const studentSignup = require("./routes/studentSignup");
const adminSignup = require("./routes/adminSignup");
const auth = require("./routes/auth");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/signup/student", studentSignup);
app.use("/api/signup/admin", adminSignup);
app.use("/api/auth", auth);
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
// MySQL test
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
    connection.release();
  }
});

// Routes
app.use("/api/superadmin", superAdminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
