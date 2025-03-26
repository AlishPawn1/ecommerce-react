import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import stripePackage from 'stripe';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Placing order using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: 'Order placed successfully using COD' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order using COD',
            error: error.message,
        });
    }
};

// Placing order using Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentInfo } = req.body;

        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            payment_method: paymentInfo.paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
        });

        if (paymentIntent.status === 'succeeded') {
            const orderData = {
                userId,
                items,
                address,
                amount,
                paymentMethod: 'Stripe',
                payment: true,
                date: Date.now(),
            };

            const newOrder = new orderModel(orderData);
            await newOrder.save();

            // Clear the user's cart after placing the order
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.status(201).json({
                success: true,
                message: 'Order placed successfully using Stripe',
                order: newOrder,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment failed using Stripe',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to place order using Stripe',
            error: error.message,
        });
    }
};

// Placing order using Khalti Method
const placeOrderKhalti = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentInfo } = req.body;

        // Mock Khalti payment integration
        // Replace this with actual Khalti API calls
        const paymentSuccess = true; // Assume payment is successful

        if (paymentSuccess) {
            const orderData = {
                userId,
                items,
                address,
                amount,
                paymentMethod: 'Khalti',
                payment: true,
                date: Date.now(),
            };

            const newOrder = new orderModel(orderData);
            await newOrder.save();

            // Clear the user's cart after placing the order
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.status(201).json({
                success: true,
                message: 'Order placed successfully using Khalti',
                order: newOrder,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment failed using Khalti',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to place order using Khalti',
            error: error.message,
        });
    }
};

// Placing order using Esewa Method
const placeOrderEsewa = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentInfo } = req.body;

        // Mock Esewa payment integration
        // Replace this with actual Esewa API calls
        const paymentSuccess = true; // Assume payment is successful

        if (paymentSuccess) {
            const orderData = {
                userId,
                items,
                address,
                amount,
                paymentMethod: 'Esewa',
                payment: true,
                date: Date.now(),
            };

            const newOrder = new orderModel(orderData);
            await newOrder.save();

            // Clear the user's cart after placing the order
            await userModel.findByIdAndUpdate(userId, { cartData: {} });

            res.status(201).json({
                success: true,
                message: 'Order placed successfully using Esewa',
                order: newOrder,
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment failed using Esewa',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to place order using Esewa',
            error: error.message,
        });
    }
};

// All orders data for admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find(); // Fetch all orders from the database
        res.status(200).json({
            success: true,
            orders: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all orders',
            error: error.message,
        });
    }
};

// User orders data for user panel
const userOrder = async (req, res) => {
    try {
        const userId = req.body.userId; // Extract userId from request body
        const orders = await orderModel.find({ userId }); // Fetch orders for the user
        res.status(200).json({
            success: true,
            orders: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user orders',
            error: error.message,
        });
    }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status: newStatus },
            { new: true } // Return the updated order
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.status(200).json({
            success: true,
            message: `Order #${orderId} status updated to ${newStatus}`,
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message,
        });
    }
};

export {
    placeOrder,
    placeOrderStripe,
    placeOrderKhalti,
    placeOrderEsewa,
    allOrders,
    userOrder,
    updateStatus,
};