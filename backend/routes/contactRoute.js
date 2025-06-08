import express from 'express';
import Contact from '../models/contact.js';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact  => submit form
router.post('/contact', submitContactForm);

// GET /api/contact-messages => fetch all messages
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
