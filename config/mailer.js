const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILID,
    pass: process.env.MAILKEY
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: `"Hotel California" <${process.env.MAILID}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email sending failed: ${error.message}`);
    // Do not throw so that API transactions do not fail if email config is incorrect
    return null;
  }
};

module.exports = sendEmail;
