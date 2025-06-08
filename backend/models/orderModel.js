import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
      quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
      size: { type: String, required: false }, // Optional, as some items may not have a size
    },
  ],
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"],
  },
  address: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, match: [/.+\@.+\..+/, "Invalid email"] },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true }, // String to support international formats
    country: { type: String, required: true },
    phone: { type: String, required: true }, // String to support international formats
  },
  status: {
    type: String,
    required: true,
    enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Order Placed",
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["COD", "Stripe", "Khalti", "Esewa"],
  },
  payment: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Add indexes for common queries
orderSchema.index({ userId: 1 });
orderSchema.index({ date: -1 });

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;