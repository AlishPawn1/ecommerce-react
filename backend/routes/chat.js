import express from "express";
import Product from "../models/productModel.js";

const chatRoute = express.Router();

chatRoute.post("/", async (req, res) => {
  const { message } = req.body;
  const lower = message?.toLowerCase()?.trim() || "";

  console.log("💬 Received:", lower);

  // Greeting detection
  const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
  if (greetings.some((greet) => lower.startsWith(greet))) {
    return res.json({ reply: "Hello! How can I assist you today?" });
  }

  try {
    // Try to find product by name or description ONLY if the message looks like a product query
    if (
      lower.includes("have") ||
      lower.includes("show") ||
      lower.includes("product") ||
      lower.includes("price") ||
      lower.includes("buy")
    ) {
      const product = await Product.findOne({
        $or: [
          { name: { $regex: lower, $options: "i" } },
          { description: { $regex: lower, $options: "i" } },
        ],
      });
      if (product) {
        return res.json({
          reply: `Yes, we have "${product.name}". Price: Rs.${product.price}`,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image?.[0] || "",
          },
        });
      }
    }

    // Popular products suggestion
    if (lower.includes("best sellers") || lower.includes("popular products")) {
      const popularProducts = await Product.find({ bestseller: true }).limit(3);
      if (popularProducts.length > 0) {
        const names = popularProducts.map((p) => p.name).join(", ");
        return res.json({
          reply: `Our best sellers include: ${names}. Ask me about any of them!`,
        });
      }
      return res.json({
        reply: "Sorry, we don't have best sellers to show right now.",
      });
    }

    // Common questions
    if (lower.includes("price")) {
      return res.json({
        reply:
          "Prices vary depending on the product. Can you tell me which item?",
      });
    }
    if (lower.includes("delivery")) {
      return res.json({ reply: "We offer delivery within 3-5 business days." });
    }
    if (lower.includes("return")) {
      return res.json({
        reply: "You can return items within 7 days of delivery.",
      });
    }
    if (
      lower.includes("payment") ||
      lower.includes("payment methods") ||
      lower.includes("payment options")
    ) {
      return res.json({ reply: "We accept COD, Stripe, eSewa, and Khalti." });
    }
    if (lower.includes("shipping cost") || lower.includes("shipping fee")) {
      return res.json({
        reply:
          "Shipping costs depend on your location and order size. Free shipping on orders above Rs.3000!",
      });
    }
    if (lower.includes("order status") || lower.includes("track order")) {
      return res.json({
        reply:
          "You can track your order status in your account dashboard or provide your order ID here.",
      });
    }
    if (lower.includes("cancel order") || lower.includes("return order")) {
      return res.json({
        reply:
          "Orders can be cancelled within 24 hours of purchase. Returns accepted within 7 days of delivery.",
      });
    }
    if (
      lower.includes("discount") ||
      lower.includes("offer") ||
      lower.includes("sale")
    ) {
      return res.json({
        reply:
          "We regularly offer discounts and sales. Follow our newsletter or website for the latest offers!",
      });
    }
    if (lower.includes("store location") || lower.includes("address")) {
      return res.json({
        reply: "We are located at Bhaktapur, and also available online 24/7!",
      });
    }
    if (lower.includes("contact") || lower.includes("support")) {
      return res.json({
        reply:
          "You can reach our support team at support@traditionshop.com or call +977-984-6543210.",
      });
    }
    if (lower.includes("product availability") || lower.includes("in stock")) {
      return res.json({
        reply:
          "You can ask about any product by name to check its availability.",
      });
    }
    if (
      lower.includes("what product") ||
      lower.includes("show product") ||
      lower.includes("products available")
    ) {
      return res.json({
        reply:
          "We have sarees, jewelry, topis, and more! Ask about any item by name.",
      });
    }

    // Fallback message for unrecognized input
    return res.json({ reply: "I'm not sure how to help with that yet." });
  } catch (error) {
    console.error("❌ Chat route error:", error);
    res.status(500).json({ reply: "Something went wrong on the server." });
  }
});

export default chatRoute;
