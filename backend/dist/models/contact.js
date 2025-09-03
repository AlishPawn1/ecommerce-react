import mongoose from "mongoose";
var contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
  // If you want subject, add here:
  // subject: { type: String }
}, {
  timestamps: true
});
var Contact = mongoose.model("Contact", contactSchema);
export default Contact;