import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function testKhalti() {
  try {
    const payload = {
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      website_url: "http://localhost:5173",
      amount: 1000, // 10 NPR in paisa
      purchase_order_id: "test1234567890",
      purchase_order_name: "Test Order",
      customer_info: {
        name: "Test User",
        email: "test@example.com",
        phone: "9800000000",
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Khalti test response:", response.data);
  } catch (error) {
    console.error("Khalti test error:", error.response?.data || error.message);
  }
}

testKhalti();
