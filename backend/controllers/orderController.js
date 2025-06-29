import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";
import mongoose from "mongoose";

mongoose.model('User', userModel.schema);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order with COD
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }
    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully using COD" });
  } catch (error) {
    console.error("COD Order Error:", error);
    res.status(500).json({ success: false, message: "Failed to place order using COD", error: error.message });
  }
};

// Place order with Stripe payment
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }
    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (amount < 50) {
      return res.status(400).json({ success: false, message: "Amount must be at least 50" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map(item => ({
      price_data: {
        currency: "npr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/payment-verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/payment-verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ success: false, message: "Failed to create Stripe session", error: error.message });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId format" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed or cancelled" });
    }
  } catch (error) {
    console.error("Stripe Verification Error:", error);
    res.status(500).json({ success: false, message: "Stripe verification failed", error: error.message });
  }
};

// Place order with Khalti payment
const placeOrderKhalti = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Khalti",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const khaltiPayload = {
      return_url: `${origin}/payment-return`,
      website_url: origin,
      amount: Math.round(amount * 100),
      purchase_order_id: newOrder._id.toString(),
      purchase_order_name: "Newari Shop Order",
      customer_info: {
        name: `${address.firstName || ""} ${address.lastName || ""}`.trim(),
        email: (address.email || "").toLowerCase().trim(),
        phone: (address.phone || "").replace(/\D/g, ""),
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      khaltiPayload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.payment_url) {
      await orderModel.findByIdAndDelete(newOrder._id);
      return res.status(500).json({ success: false, message: "Khalti payment URL missing" });
    }

    res.status(200).json({
      success: true,
      session_url: response.data.payment_url,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Khalti order error:", error.response?.data || error);
    res.status(500).json({ success: false, message: "Khalti error", error });
  }
};

const verifyKhalti = async (req, res) => {
  try {
    const { pidx, orderId } = req.query;

    if (!pidx || !orderId) {
      return res.status(400).json({ success: false, message: "Missing pidx or orderId" });
    }

    // Verify payment status with Khalti API
    const khaltiRes = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (khaltiRes.data.status === "Completed") {
      // Update order as paid
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Order Placed" });

      const order = await orderModel.findById(orderId);
      if (order) {
        // Clear the user cart
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }

      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      // Payment not completed, delete order
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Khalti verification error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};

// Place order with Esewa payment
const placeOrderEsewa = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const origin = req.headers.origin || "http://localhost:5173";

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }
    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Esewa",
      payment: false,
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const params = new URLSearchParams({
      amt: amount,
      psc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: newOrder._id.toString(),
      scd: "EPAYTEST", // Merchant code, replace with your actual
      su: `${origin}/payment-verify?success=true&orderId=${newOrder._id}&gateway=esewa`,
      fu: `${origin}/payment-verify?success=false&orderId=${newOrder._id}&gateway=esewa`,
    });

    const esewaURL = `https://uat.esewa.com.np/epay/main?${params.toString()}`;

    res.status(200).json({ success: true, session_url: esewaURL });
  } catch (error) {
    console.error("Esewa Error:", error);
    res.status(500).json({ success: false, message: "Failed to place order using Esewa", error: error.message });
  }
};

// Verify Esewa payment
const verifyEsewa = async (req, res) => {
  try {
    const { success, orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId format" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Paid" });
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      return res.redirect(`/order-success?orderId=${orderId}`);
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.redirect(`/payment-failed?orderId=${orderId}`);
    }
  } catch (error) {
    console.error("Esewa verification error:", error);
    res.status(500).json({ success: false, message: "Esewa verification failed", error: error.message });
  }
};

// Fetch all orders (admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message });
  }
};

// Fetch user orders
const userOrder = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId format" });
    }
    const orders = await orderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user orders", error: error.message });
  }
};

// Update order status (admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId format" });
    }
    if (!status) {
      return res.status(400).json({ success: false, message: "Missing status" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: `Order #${orderId} status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};

// Update payment status for COD orders (admin/user)
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, payment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Invalid orderId format" });
    }
    if (typeof payment !== "boolean") {
      return res.status(400).json({ success: false, message: "Payment status must be a boolean" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (order.paymentMethod !== "COD") {
      return res.status(400).json({ success: false, message: "Payment status can only be updated for COD orders" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment }, { new: true });

    res.json({
      success: true,
      message: `Order #${orderId} payment status updated to ${payment ? "Done" : "Pending"}`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Payment Status Error:", error);
    res.status(500).json({ success: false, message: "Failed to update payment status", error: error.message });
  }
};

// Get orders from last X days (admin)
const getOrdersByDays = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - days + 1);

    const orders = await orderModel.find({ date: { $gte: start } }).populate("userId", "name");

    const formattedOrders = orders.map(order => ({
      order_id: order._id.toString(),
      user_name: order.userId?.name || "Unknown User",
      product_name: order.items.map(item => item.name).join(", "),
      amount_due: order.amount,
      invoice_number: order._id.toString(),
      total_products: order.items.reduce((sum, item) => sum + item.quantity, 0),
      order_date: order.date,
      order_status: order.status,
      payment_method: order.paymentMethod,
      payment_status: order.payment ? "Paid" : "Pending",
    }));

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

export {
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
  updatePaymentStatus,
  getOrdersByDays,
};
