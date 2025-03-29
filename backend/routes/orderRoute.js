import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderKhalti, placeOrderEsewa, allOrders, userOrder, updateStatus, verifyStripe } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// payment features 
orderRouter.post('/place', authUser, placeOrder);  
orderRouter.post('/stripe', authUser, placeOrderStripe);  
orderRouter.post('/khalti', authUser, placeOrderKhalti);  
orderRouter.post('/esewa', authUser, placeOrderEsewa); 

// user feature
orderRouter.post('/userorders', authUser, userOrder)

// verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter;