import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter using Gmail SMTP and App Password
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email options
var mailOptions = {
  from: process.env.EMAIL_USER,
  to: "alishpau@gmail.com",
  // Replace with the receiver's actual email
  subject: "Test Email from Nodemailer",
  text: "Hello! This is a test email sent using Nodemailer with Gmail SMTP and App Password."
};

// Send email
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.error("Error sending email:", error);
  } else {
    console.log("Email sent successfully:", info.response);
    console.log("Message ID:", info.messageId);
  }
});