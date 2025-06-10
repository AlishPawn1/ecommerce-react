import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import axios from "axios";
import mongoose from "mongoose";


mongoose.model('User', userModel.schema);

// Debug: Check if axios is properly imported
console.log("Axios imported successfully:", typeof axios);

// Global variables
const currency = "npr";
const deliveryCharge = 10;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing order using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid userId format" });
        }

        if (!items || !amount || !address) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
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

        console.log("COD Order Data:", orderData);

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully using COD" });
    } catch (error) {
        console.error("COD Order Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to place order using COD",
            error: error.message,
        });
    }
};

// Placing order using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin || "http://localhost:5173";

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid userId format" });
        }

        if (!items || !amount || !address) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }

        if (amount < 50) {
            return res.status(400).json({
                success: false,
                message: "Amount must be at least 50 (equivalent to 0.50 currency units)",
            });
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

        console.log("Stripe Order Data:", orderData);

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: "npr",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        if (deliveryCharge > 0) {
            line_items.push({
                price_data: {
                    currency: "npr",
                    product_data: {
                        name: "Delivery Charges",
                    },
                    unit_amount: deliveryCharge * 100,
                },
                quantity: 1,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${origin}/payment-verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/payment-verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error("Stripe Error:", {
            message: error.message,
            stack: error.stack,
            response: error.response ? error.response.data : null,
        });
        res.status(500).json({
            success: false,
            message: "Failed to create Stripe session",
            error: error.message,
        });
    }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
    try {
        const { orderId, success } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid orderId format" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
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
        console.error("Stripe Verification Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Stripe verification failed",
            error: error.message,
        });
    }
};

// Placing order using Khalti Method
const placeOrderKhalti = async (req, res) => {
    try {
        console.log("🔍 KHALTI - Starting order placement");

        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin || "http://localhost:5173";

        // Validation
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid userId format" });
        }

        if (!items || !amount || !address) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (amount < 10) {
            return res.status(400).json({
                success: false,
                message: "Amount must be at least NPR 10 for Khalti",
            });
        }

        // Create order first
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Khalti",
            payment: false,
            date: new Date(),
        };

        console.log("💾 Creating order...");
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        console.log("✅ Order created:", newOrder._id);

        // Check for Khalti configuration
        if (!process.env.KHALTI_SECRET_KEY) {
            await orderModel.findByIdAndDelete(newOrder._id);
            return res.status(500).json({
                success: false,
                message: "Khalti configuration missing"
            });
        }

        // Prepare payload with improved formatting
        const khaltiPayload = {
            return_url: `${origin}/payment-verify?orderId=${newOrder._id}&gateway=khalti`,
            website_url: origin,
            amount: Math.round(amount * 100), // Ensure integer paisa
            purchase_order_id: newOrder._id.toString(),
            purchase_order_name: "Newari Shop Order",
            customer_info: {
                name: `${address.firstName} ${address.lastName}`.trim(),
                email: address.email.toLowerCase().trim(),
                phone: address.phone.replace(/\D/g, ''), // Remove non-digits
            },
        };

        console.log("🚀 Khalti payload:", JSON.stringify(khaltiPayload, null, 2));

        // Try multiple approaches for Khalti API
        let khaltiResponse;
        let lastError;

        // Approach 1: Standard API call
        try {
            console.log("📡 Attempt 1: Standard Khalti API call...");
            khaltiResponse = await axios.post(
                "https://a.khalti.com/api/v2/epayment/initiate/",
                khaltiPayload,
                {
                    headers: {
                        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000,
                }
            );
            console.log("✅ Standard API call successful");
        } catch (error) {
            console.log("❌ Standard API call failed:", error.response?.data || error.message);
            lastError = error;

            // Approach 2: Try with different headers
            try {
                console.log("📡 Attempt 2: Modified headers...");
                khaltiResponse = await axios.post(
                    "https://a.khalti.com/api/v2/epayment/initiate/",
                    khaltiPayload,
                    {
                        headers: {
                            "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        timeout: 20000,
                    }
                );
                console.log("✅ Modified headers approach successful");
            } catch (error2) {
                console.log("❌ Modified headers failed:", error2.response?.data || error2.message);
                lastError = error2;

                // Approach 3: Try with minimal payload
                try {
                    console.log("📡 Attempt 3: Minimal payload...");
                    const minimalPayload = {
                        return_url: `${origin}/payment-verify`,
                        website_url: origin,
                        amount: 1000, // Fixed 10 NPR for testing
                        purchase_order_id: `test_${Date.now()}`,
                        purchase_order_name: "Test Order",
                        customer_info: {
                            name: "Test User",
                            email: "test@khalti.com",
                            phone: "9800000000",
                        },
                    };

                    khaltiResponse = await axios.post(
                        "https://a.khalti.com/api/v2/epayment/initiate/",
                        minimalPayload,
                        {
                            headers: {
                                Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                                "Content-Type": "application/json",
                            },
                            timeout: 15000,
                        }
                    );
                    console.log("✅ Minimal payload approach successful");
                } catch (error3) {
                    console.log("❌ All Khalti API attempts failed");
                    lastError = error3;
                }
            }
        }

        // If all attempts failed
        if (!khaltiResponse) {
            console.log("💥 All Khalti attempts failed, cleaning up order...");
            await orderModel.findByIdAndDelete(newOrder._id);

            let errorMessage = "Khalti API request failed";
            let troubleshooting = [];

            if (lastError.response?.status === 401) {
                errorMessage = "Khalti authentication failed - Invalid or expired secret key";
                troubleshooting = [
                    "Your Khalti secret key might be expired",
                    "Get a new test secret key from Khalti merchant dashboard",
                    "Make sure your Khalti merchant account is activated"
                ];
            } else if (lastError.response?.status === 400) {
                errorMessage = "Invalid request data sent to Khalti";
                troubleshooting = [
                    "Check customer email format",
                    "Verify phone number format",
                    "Ensure amount is valid (minimum NPR 10)"
                ];
            }

            return res.status(500).json({
                success: false,
                message: errorMessage,
                error: lastError.response?.data || lastError.message,
                troubleshooting,
                khaltiStatus: lastError.response?.status
            });
        }

        // Success - validate response
        console.log("🎉 Khalti API successful!");
        console.log("📋 Response:", JSON.stringify(khaltiResponse.data, null, 2));

        if (!khaltiResponse.data?.payment_url) {
            await orderModel.findByIdAndDelete(newOrder._id);
            return res.status(500).json({
                success: false,
                message: "Khalti response missing payment URL",
                khaltiResponse: khaltiResponse.data
            });
        }

        res.status(200).json({
            success: true,
            session_url: khaltiResponse.data.payment_url,
            orderId: newOrder._id,
            message: "Khalti payment initiated successfully"
        });

    } catch (error) {
        console.log("💥 Unexpected error in placeOrderKhalti:", error);
        res.status(500).json({
            success: false,
            message: "Unexpected server error",
            error: error.message,
        });
    }
};

// Placing order using Esewa Method
const placeOrderEsewa = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin || "http://localhost:5173";

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid userId format" });
        }

        if (!items || !amount || !address) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
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

        console.log("Esewa Order Data:", orderData);

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const params = new URLSearchParams({
            amt: amount,
            psc: 0,
            pdc: deliveryCharge,
            txAmt: 0,
            tAmt: amount + deliveryCharge,
            pid: newOrder._id.toString(),
            scd: "EPAYTEST",
            su: `${origin}/payment-verify?success=true&orderId=${newOrder._id}&gateway=esewa`,
            fu: `${origin}/payment-verify?success=false&orderId=${newOrder._id}&gateway=esewa`,
        });

        const esewaURL = `https://uat.esewa.com.np/epay/main?${params.toString()}`;

        res.status(200).json({ success: true, session_url: esewaURL });
    } catch (error) {
        console.error("Esewa Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to place order using Esewa",
            error: error.message,
        });
    }
};

// Verify Khalti payment
const verifyKhalti = async (req, res) => {
    try {
        const { pidx, orderId } = req.query;

        if (!pidx || !orderId) {
            return res
                .status(400)
                .json({ success: false, message: "Missing pidx or orderId" });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid orderId format" });
        }

        const response = await axios.post(
            "https://a.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Khalti Verification Response:", response.data);

        if (response.data.status === "Completed") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(
                (await orderModel.findById(orderId)).userId,
                { cartData: {} }
            );
            return res.redirect(`/order-success?orderId=${orderId}`);
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.redirect(`/payment-failed?orderId=${orderId}`);
        }
    } catch (error) {
        console.error("Khalti Verification Error:", {
            message: error.message,
            stack: error.stack,
            response: error.response ? error.response.data : null,
        });
        res.status(500).json({
            success: false,
            message: "Khalti verification failed",
            error: error.message,
        });
    }
};

// Verify Esewa payment
const verifyEsewa = async (req, res) => {
    try {
        const { success, orderId } = req.query;

        if (!orderId) {
            return res
                .status(400)
                .json({ success: false, message: "Missing orderId" });
        }

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid orderId format" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }

        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
            return res.redirect(`/order-success?orderId=${orderId}`);
        } else {
            await orderModel.findByIdAndDelete(orderId);
            return res.redirect(`/payment-failed?orderId=${orderId}`);
        }
    } catch (error) {
        console.error("Esewa Verification Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Esewa verification failed",
            error: error.message,
        });
    }
};

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Fetch Orders Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
            error: error.message,
        });
    }
};

// User orders data for user panel
const userOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid userId format" });
        }
        const orders = await orderModel.find({ userId });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Fetch User Orders Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: error.message,
        });
    }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid orderId format" });
        }
        if (!status) {
            return res
                .status(400)
                .json({ success: false, message: "Missing status" });
        }
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }
        res.json({
            success: true,
            message: `Order #${orderId} status updated to ${status}`,
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Update Status Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
        });
    }
};

// New endpoint to update payment status for COD orders
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, payment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid orderId format" });
        }

        if (typeof payment !== "boolean") {
            return res
                .status(400)
                .json({ success: false, message: "Payment status must be a boolean" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        }

        if (order.paymentMethod !== "COD") {
            return res
                .status(400)
                .json({ success: false, message: "Payment status can only be updated for COD orders" });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { payment },
            { new: true }
        );

        res.json({
            success: true,
            message: `Order #${orderId} payment status updated to ${payment ? "Done" : "Pending"}`,
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Update Payment Status Error:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error: error.message,
        });
    }
};

const getOrdersByDays = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;

        // Start of day 'days' ago
        const start = new Date();
        start.setUTCHours(0, 0, 0, 0);
        start.setUTCDate(start.getUTCDate() - days + 1); // include today

        const orders = await orderModel.find({ date: { $gte: start } }).populate('userId', 'name');

        const formattedOrders = orders.map(order => ({
            order_id: order._id.toString(),
            user_name: order.userId?.name || 'Unknown User',
            product_name: order.items.map(item => item.name).join(', '),
            amount_due: order.amount,
            invoice_number: order._id.toString(),
            total_products: order.items.reduce((sum, item) => sum + item.quantity, 0),
            order_date: order.date,
            order_status: order.status,
            payment_method: order.paymentMethod,
            payment_status: order.payment ? "Paid" : "Pending"
        }));

        res.json({ success: true, orders: formattedOrders });
    } catch (error) {
        console.error('Error fetching orders:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
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