import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { ShopContext } from "../context/ShopContext";
import { toast } from 'react-toastify';

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCartItems } = useContext(ShopContext);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pidx = query.get("pidx");
    const purchase_order_id = query.get("purchase_order_id");

    if (!pidx || !purchase_order_id) {
      toast.error("Missing payment details.");
      navigate('/order');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/order/khalti/verify`,
          { params: { pidx, orderId: purchase_order_id } }
        );

        if (res.data.success) {
          setCartItems({});
          toast.success("Payment verified successfully");
          navigate('/order');
        } else {
          toast.error("Payment verification failed");
          navigate('/cart');
        }
      } catch (error) {
        toast.error("Error verifying payment. Please contact support.");
        navigate('/cart');
      }
    };

    verifyPayment();
  }, [location.search, navigate, setCartItems]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing Payment...</h2>
        <p>Please wait while we verify your payment</p>
      </div>
    </div>
  );
};

export default PaymentReturn;
