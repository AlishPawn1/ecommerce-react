import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

// global variables
const currency = 'Nrp'
const deliveryCharge = 10
// gateway initilize
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin;

        // Validate amount (minimum 50 cents equivalent)
        if (amount < 50) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be at least 50 (equivalent to 0.50 currency units)'
            });
        }

        // Create order record first (unpaid)
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Prepare line items for Stripe
        const line_items = items.map((item) => ({
            price_data: {
                currency: 'npr', // Stripe uses lowercase currency codes
                product_data: {  // Fixed spelling
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100) // Ensure integer
            },
            quantity: item.quantity // Fixed: use quantity property
        }));

        // Add delivery charge if applicable
        if (deliveryCharge > 0) {
            line_items.push({
                price_data: {
                    currency: 'npr',
                    product_data: {
                        name: "Delivery Charges",
                    },
                    unit_amount: deliveryCharge * 100
                },
                quantity: 1
            });
        }

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url }); // Fixed property name
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to create Stripe session',
            error: error.message,
        });
    }
};

// verify stripe

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment: true})
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success: false});
        }
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message});    
    }
}

// Placing order using Khalti Method
const placeOrderKhalti = async (req, res) => {
    
};

// Placing order using Esewa Method
const placeOrderEsewa = async (req, res) => {
    
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
        const { orderId, status } = req.body;
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        );
        
        res.json({
            success: true,
            message: `Order #${orderId} status updated to ${status}`,
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
    verifyStripe,
    placeOrder,
    placeOrderStripe,
    placeOrderKhalti,
    placeOrderEsewa,
    allOrders,
    userOrder,
    updateStatus,
};