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
import chatRoute from './routes/chat.js';
import subscribeRoute from './routes/subscribe.js';
import messageRoute from './routes/messageRoute.js';
import newsletterRoute from './routes/newsletterRoute.js';

const app = express();

// Define allowed origins
const allowedOrigins = [
  'https://newari-traditional-shop.vercel.app',
  'https://newari-traditional-admin.vercel.app',
  'https://frontend-9h9d5yjpi-alishpawn1s-projects.vercel.app',
  'https://admin-9vyo55tqd-alishpawn1s-projects.vercel.app',
  'https://admin-c9qij4b6x-alishpawn1s-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.FRONTEND_URLS || '')
    .split(',')
    .map(url => url.trim().replace(/\/+$/, ''))
    .filter(Boolean)
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Log requests for debugging
  console.log(`${req.method} ${req.url} from ${origin || 'unknown'}`);
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api', contactRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/chat', chatRoute);
app.use('/api/subscribe', subscribeRoute);
app.use('/api/newsletter', newsletterRoute);
app.use('/api/messages', messageRoute);

// Health check routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Newari Traditional Shop Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    version: '1.0.0',
    endpoints: [
      '/api/user',
      '/api/product',
      '/api/cart',
      '/api/order',
      '/api/dashboard',
      '/api/chat',
      '/api/subscribe',
      '/api/newsletter',
      '/api/messages'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      origin: req.headers.origin
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize services
let initialized = false;
async function initializeServices() {
  if (initialized) return;
  
  try {
    await connectDB();
    await connectCloudinary();
    initialized = true;
    console.log('✅ Services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    throw error;
  }
}

// Start server
const PORT = process.env.PORT || 4000;

initializeServices()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('📍 Allowed origins:', allowedOrigins);
      console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });