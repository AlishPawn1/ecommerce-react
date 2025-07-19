import express from 'express';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Contact from '../models/contact.js';

const router = express.Router();

router.get('/metrics', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { payment: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalUsers = await User.countDocuments();
    const totalFeedback = await Contact.countDocuments();
    const totalPending = await Order.countDocuments({ status: 'Order Placed' });
    const totalPacking = await Order.countDocuments({ status: 'Packing' });
    const totalShipping = await Order.countDocuments({ status: 'Shipping' });
    const totalOutForDelivery = await Order.countDocuments({ status: 'Out for Delivery' });
    const totalCompleted = await Order.countDocuments({ status: 'Delivered' });

    res.json({
      success: true,
      data: {
        totalSales: totalSales[0]?.total || 0,
        totalUsers,
        totalFeedback,
        totalPending,
        totalPacking,
        totalShipping,
        totalOutForDelivery,
        totalCompleted,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;