import 'dotenv/config';
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

// Middleware to parse JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse and sanitize frontend URLs
const frontendUrls = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// CORS config
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || frontendUrls.includes(origin)) {
      callback(null, origin || true);
    } else {
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

app.get('/', (req, res) => res.status(200).send('Server is running!'));
app.get('/api', (req, res) => res.status(200).json({ message: 'API Working' }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Server error' });
});

// Async service initialization outside handler, to avoid cold-start delays
let initialized = false;
async function initializeServices() {
  if (initialized) return;
  try {
    await connectDB();
    await connectCloudinary();
    console.log('✅ Services initialized successfully');
    initialized = true;
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    // You can decide how to handle this on Vercel
  }
}

// Vercel serverless function entrypoint
export default async function handler(req, res) {
  if (!initialized) await initializeServices();
  app(req, res);
}