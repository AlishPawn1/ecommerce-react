import express from 'express';
import nodemailer from 'nodemailer';
import NewsletterSubscriber from '../models/newsletterModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    try {
        // Save email to DB (prevent duplicates)
        const existing = await NewsletterSubscriber.findOne({ email });
        if (!existing) {
            await NewsletterSubscriber.create({ email });

            // Setup transporter (use your SMTP credentials here)
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false, // use TLS
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false // optional: helps with some SSL issues
                }
            });

            // Email options
            const mailOptions = {
                from: '"Traditional Newari Shop" <no-reply@yourshop.com>',
                to: email,
                subject: 'Subscription Confirmation',
                text: `Thank you for subscribing to our newsletter! You'll get 20% off on your next purchase.`,
                html: `<p>Thank you for subscribing to our newsletter! You'll get <strong>20% off</strong> on your next purchase.</p>`,
            };

            // Send email
            await transporter.sendMail(mailOptions);

            return res.json({ success: true, message: 'Subscribed successfully' });
        } else {
            // Do NOT send email for duplicates
            return res.json({ success: true, message: 'Already subscribed' });
        }

    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ error: 'Failed to send confirmation email' });
    }
});

function validateEmail(email) {
    // Basic regex email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default router;
