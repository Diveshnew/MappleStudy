const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'Gmail', // Use Gmail (or replace with your service)
      host: process.env.MAIL_HOST,
      port: 587, // Use 465 for SSL, 587 for TLS
      secure: false, // True for SSL, false for TLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `MappleStudy <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return null; // Return null on failure
  }
};

module.exports = mailSender;
