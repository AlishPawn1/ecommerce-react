import express from "express";
import NewsletterSubscriber from "../models/newsletterModel.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Admin: Get all newsletter subscribers
router.get("/", async (req, res) => {
  try {
    const subs = await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
    res.json({ success: true, subscribers: subs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
