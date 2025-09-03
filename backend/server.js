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

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || frontendUrls.includes(origin)) {
      callback(null, origin || true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from ${req.headers.origin}`);
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

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Initialize services
let initialized = false;
async function initializeServices() {
  if (initialized) return;
  await connectDB();
  await connectCloudinary();
  initialized = true;
  console.log("✅ Services initialized successfully");
}

// For Vercel serverless function, initialize services once on cold start
initializeServices().catch((error) => {
  console.error("❌ Failed to initialize services:", error);
});

// Start Express server for local/Node.js deployment
const PORT = process.env.PORT || 5000;
initializeServices().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("❌ Failed to initialize services:", error);
});