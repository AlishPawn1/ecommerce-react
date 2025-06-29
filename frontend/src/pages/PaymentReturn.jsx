import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Verifying payment...");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pidx = query.get("pidx");
    const purchase_order_id = query.get("purchase_order_id");

    if (!pidx || !purchase_order_id) {
      setStatusMessage("Missing payment details.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/order/khalti/verify`,
          { params: { pidx, orderId: purchase_order_id } }
        );

        if (res.data.success) {
          setStatusMessage("✅ Payment Successful! Thank you for your order.");
          setTimeout(() => {
            navigate(`/order-success?orderId=${purchase_order_id}`);
          }, 3000);
        } else {
          setStatusMessage("❌ Payment verification failed.");
          setTimeout(() => {
            navigate(`/payment-failed?orderId=${purchase_order_id}`);
          }, 3000);
        }
      } catch (error) {
        setStatusMessage("❌ Error verifying payment. Please contact support.");
        console.error("Payment verification error:", error);
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  return (
    <section>
      <div className="container" style={{ textAlign: "center" }}>
        <h2>{statusMessage}</h2>
      </div>
    </section>
  );
};

export default PaymentReturn;
