import Contact from "../models/contact.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(200).json({ message: "Message submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
