import nodemailer from 'nodemailer';

// Configure Nodemailer transport with Gmail (You can use another provider if needed)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
  },
});

// Function to send verification email
const sendEmail = async (toEmail, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your verified sender email
    to: toEmail,
    subject: subject,
    html: message, // The message sent in HTML format
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

export { sendEmail };
