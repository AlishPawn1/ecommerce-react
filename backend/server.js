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

const app = express();

// Log all environment variables (optional for debugging)
console.log('All process.env:', process.env);
console.log('FRONTEND_URLS:', process.env.FRONTEND_URLS);
console.log('MONGODB_URL:', process.env.MONGODB_URL);

// Parse comma-separated FRONTEND_URLS and clean them
const frontendUrls = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(url => url);

console.log('Sanitized FRONTEND_URLS:', frontendUrls);

// Connect to DB and Cloudinary
(async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log('✅ Services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error.message, error.stack);
    process.exit(1);
  }
})();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: (origin, callback) => {
    console.log('Request Origin:', origin);
    if (!origin || frontendUrls.includes(origin)) {
      console.log('✅ Allowing Origin:', origin || 'server-side/no-origin');
      callback(null, origin || true); // true means allow any if no origin
    } else {
      console.error('❌ CORS rejected origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api', contactRouter);
app.use('/api/dashboard', dashboardRouter);

// Root route for server check
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

// API health route
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