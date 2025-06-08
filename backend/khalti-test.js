import axios from 'axios';

const KHALTI_SECRET_KEY = "0bdb890d7b514ec281731b27fa157eb8";

const testKhaltiKey = async () => {
  console.log("🔍 Testing Khalti Secret Key...");
  console.log("Key:", KHALTI_SECRET_KEY);
  
  const testPayload = {
    return_url: "http://localhost:5173/payment-verify",
    website_url: "http://localhost:5173",
    amount: 1000,
    purchase_order_id: `test_${Date.now()}`,
    purchase_order_name: "Test Order",
    customer_info: {
      name: "Test User",
      email: "test@khalti.com",
      phone: "9800000000",
    },
  };

  try {
    console.log("📤 Sending request to Khalti...");
    
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      testPayload,
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    console.log("✅ SUCCESS! Khalti key is working");
    console.log("Response:", response.data);
    console.log("Payment URL:", response.data.payment_url);
    
  } catch (error) {
    console.log("❌ FAILED! Khalti key test failed");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data);
    
    if (error.response?.status === 401) {
      console.log("\n🔧 SOLUTION:");
      console.log("1. Your Khalti secret key is invalid or expired");
      console.log("2. Go to: https://khalti.com/join/merchant/");
      console.log("3. Login/create account");
      console.log("4. Go to Settings → API Keys");
      console.log("5. Get a new test secret key");
      console.log("6. Replace in your .env file");
    }
  }
};

testKhaltiKey();
