import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import contactRouter from './routes/contactRoute.js';

// App config
const app = express();
const port = process.env.PORT || 4000;

// Log environment variables for debugging
console.log('FRONTEND_URLS:', process.env.FRONTEND_URLS);
console.log('MONGODB_URL:', process.env.MONGODB_URL);

// Parse and sanitize FRONTEND_URLS (comma-separated list)
const frontendUrls = (process.env.FRONTEND_URLS)
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''));
console.log('Sanitized FRONTEND_URLS:', frontendUrls);

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    console.log('Request Origin:', origin);
    console.log('Allowed Origins:', frontendUrls);
    console.log('Origin Type:', typeof origin);
    console.log('Is Origin in Allowed List?:', frontendUrls.includes(origin));
    if (frontendUrls.includes(origin) || !origin) {
      console.log('Allowing Origin:', origin || frontendUrls[0]);
      callback(null, origin || frontendUrls[0]);
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
console.log('Raw FRONTEND_URLS from .env:', process.env.FRONTEND_URLS);
// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api', contactRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Server error' });
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));