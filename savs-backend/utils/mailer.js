// savs-backend/utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'yourprojectemail@gmail.com',
    pass: 'yourapppassword'  // Use App Password from Google
  }
});

const sendVerificationEmail = (to, name, userType) => {
  const mailOptions = {
    from: 'yourprojectemail@gmail.com',
    to: to,
    subject: `${userType} Email Verification - SAVS`,
    html: `<h3>Hello ${name},</h3><p>Your ${userType.toLowerCase()} email has been registered successfully on SMART ATTENDANCE VERIFICATION SYSTEM.</p><p>Please verify this is you. ✅</p>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
