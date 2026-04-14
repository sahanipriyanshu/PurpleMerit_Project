const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If no SMTP settings, log to console (Development Mode)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('--------------------------------------------');
    console.log('📧 DEVELOPMENT MODE: EMAIL LOG');
    console.log(`TO: ${options.email}`);
    console.log(`SUBJECT: ${options.subject}`);
    console.log(`MESSAGE: ${options.message}`);
    console.log('--------------------------------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;
