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

export default orderRouter;
