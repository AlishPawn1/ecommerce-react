import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderKhalti,
  verifyStripe,
  verifyKhalti,
  allOrders,
  userOrder,
  updateStatus,
  updatePaymentStatus,
  getOrdersByDays,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.get("/", adminAuth, getOrdersByDays);

// User payment routes
orderRouter.post("/place", authUser, placeOrder); // COD
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/khalti", authUser, placeOrderKhalti);
orderRouter.get("/khalti/verify", verifyKhalti);

// Payment verification routes
orderRouter.post("/verifyStripe", verifyStripe);

// User orders
orderRouter.post("/userorders", authUser, userOrder);

// Payment status update (e.g. for COD payments)
orderRouter.post("/updatePaymentStatus", authUser, updatePaymentStatus);

// Admin: Get order counts by status
orderRouter.get("/status-counts", async (req, res) => {
  try {
    const statuses = [
      "Pending",
      "Packing",
      "Shipping",
      "Out for Delivery",
      "Completed",
    ];
    const counts = {};
    for (const status of statuses) {
      counts[status] = await orderModel.countDocuments({ status });
    }
    res.json({ success: true, counts });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order counts" });
  }
});

export default orderRouter;
