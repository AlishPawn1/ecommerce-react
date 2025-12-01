import "dotenv/config";
import express from "express";
// import serverless from "serverless-http";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import chatRoute from "./routes/chat.js";
import subscribeRoute from "./routes/subscribe.js";
import newsletterRoute from "./routes/newsletterRoute.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendUrls = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

console.log("📋 Configured frontend URLs:", frontendUrls);

const corsOptions = {
  origin: (origin, callback) => {
    console.log("🌐 CORS request from origin:", origin);
    
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    // Check if origin is in allowed list
    if (frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      console.log("✅ Allowed origins:", frontendUrls);
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Support legacy browsers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Initialize services for serverless
const initPromise = initializeServices().catch((error) => {
  console.error("❌ Failed to initialize services:", error);
  throw error;
});

// Ensure initialization before handling requests
app.use(async (req, res, next) => {
  try {
    await initPromise;
    next();
  } catch (error) {
    console.error("❌ Service initialization failed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Service initialization failed",
      error: error.message 
    });
  }
});

// Additional CORS headers for better compatibility
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`${req.method} ${req.url} from ${origin}`);
  
  // Set CORS headers explicitly for better compatibility
  if (frontendUrls.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  }
  
  next();
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api", contactRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/chat", chatRoute);
app.use("/api/subscribe", subscribeRoute);
app.use("/api/newsletter", newsletterRoute);

// Health checks
app.get("/", (req, res) => res.status(200).send("Server is running!"));
app.get("/api", (req, res) => res.status(200).json({ message: "API Working" }));

// CORS test endpoint
app.get("/api/cors-test", (req, res) => {
  res.status(200).json({ 
    success: true,
    message: "CORS is working",
    origin: req.headers.origin,
    allowedOrigins: frontendUrls,
    timestamp: new Date().toISOString()
  });
});

// Catch-all handler for non-API routes
app.get("*", (req, res) => {
  if (req.url.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "API endpoint not found" });
  }
  res.status(200).send("Backend server is running! Use /api endpoints for API access.");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.message);
  console.error("Stack trace:", err.stack);
  console.error("Request details:", {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    userAgent: req.headers['user-agent']
  });
  
  // Handle CORS errors specifically
  if (err.message.includes('CORS')) {
    return res.status(403).json({ 
      success: false, 
      message: "CORS error: Origin not allowed",
      origin: req.headers.origin,
      allowedOrigins: frontendUrls
    });
  }
  
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Initialize services
let initialized = false;
async function initializeServices() {
  if (initialized) return;
  
  console.log("🔄 Initializing services...");
  console.log("Node.js version:", process.version);
  console.log("Environment check:", {
    MONGODB_URL: process.env.MONGODB_URL ? "✓ Set" : "✗ Missing",
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME ? "✓ Set" : "✗ Missing",
    JWT_SECRET: process.env.JWT_SECRET ? "✓ Set" : "✗ Missing"
  });
  
  try {
    console.log("🔗 Connecting to MongoDB...");
    await connectDB();
    console.log("☁️ Configuring Cloudinary...");
    await connectCloudinary();
    initialized = true;
    console.log("✅ Services initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize services:", error.message);
    console.error("❌ Full error:", error);
    throw error;
  }
}

// Start Express server for local/Node.js deployment only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  initPromise.then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }).catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
}

// Export for Vercel serverless function
export default app;