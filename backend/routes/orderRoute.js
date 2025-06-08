import express from "express";
import axios from "axios";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderKhalti,
  placeOrderEsewa,
  verifyStripe,
  verifyKhalti,
  verifyEsewa,
  allOrders,
  userOrder,
  updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/khalti", authUser, placeOrderKhalti);
orderRouter.post("/esewa", authUser, placeOrderEsewa);

// Verify payment
orderRouter.post("/verifyStripe", verifyStripe);
orderRouter.get("/verifyKhalti", verifyKhalti);
orderRouter.get("/verifyEsewa", verifyEsewa);

// User features
orderRouter.post("/userorders", authUser, userOrder);

orderRouter.get('/test-khalti', async (req, res) => {
  try {
    console.log('Testing Khalti API...');
    console.log('KHALTI_SECRET_KEY:', process.env.KHALTI_SECRET_KEY);
    
    const testPayload = {
      return_url: "http://localhost:5173/test",
      website_url: "http://localhost:5173",
      amount: 1000,
      purchase_order_id: "test_123",
      purchase_order_name: "Test Order",
      customer_info: {
        name: "Test User",
        email: "test@example.com",
        phone: "9800000000",
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      testPayload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, response: response.data });
  } catch (error) {
    console.log('Khalti test error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data || error.message 
    });
  }
});

export default orderRouter;