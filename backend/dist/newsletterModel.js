import mongoose from "mongoose";
var newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  subscribedAt: {
    type: Date,
    "default": Date.now
  }
});
export default mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);