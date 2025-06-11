import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import contactRouter from './routes/contactRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';

// App config
const app = express();

// Log environment variables for debugging
console.log('FRONTEND_URLS:', process.env.FRONTEND_URLS);
console.log('MONGODB_URL:', process.env.MONGODB_URL);

// Parse and sanitize FRONTEND_URLS (comma-separated list)
const frontendUrls = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(url => url); // Remove empty strings
console.log('Sanitized FRONTEND_URLS:', frontendUrls);

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({
  origin: (origin, callback) => {
    console.log('Request Origin:', origin);
    console.log('Allowed Origins:', frontendUrls);
    if (frontendUrls.includes(origin) || !origin) {
      console.log('Allowing Origin:', origin || frontendUrls[0] || true);
      callback(null, origin || frontendUrls[0] || true);
    } else {
      console.error('CORS rejected origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api', contactRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API Working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

// Export for Vercel
module.exports = app;