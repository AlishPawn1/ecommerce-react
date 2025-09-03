import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import axios from "axios";

const EmailVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState("Verifying your email...");

  const email = searchParams.get("email");
  const code = searchParams.get("code");
  const verified = searchParams.get("verified");

  useEffect(() => {
    // If user is redirected back after successful verification
    if (verified === "true") {
      setVerifying(false);
      setMessage("Email verified successfully! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    // If we have email and code, verify them
    if (email && code) {
      axios
        .get(
          `${backendUrl}/api/user/verify-email?email=${encodeURIComponent(email)}&code=${code}`,
        ) // Corrected endpoint
        .then((response) => {
          if (response.data.success) {
            setVerifying(false);
            setMessage("Email verified successfully! Redirecting to login...");
            setTimeout(() => {
              navigate("/login?verified=true");
            }, 3000);
          } else {
            setVerifying(false);
            setMessage(
              response.data.message || "Verification failed. Please try again.",
            );
            toast.error(response.data.message || "Verification failed");
          }
        })
        .catch((error) => {
          setVerifying(false);
          setMessage(
            error.response?.data?.message ||
              "Verification failed. Please try again.",
          );
          toast.error(error.response?.data?.message || "Verification failed");
        });
    } else {
      setVerifying(false);
      setMessage(
        "Invalid verification link. Please try again or contact support.",
      );
    }
  }, [email, code, navigate, verified]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>

        {verifying ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <p
              className={`text-lg ${message.includes("success") ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </p>
            {!message.includes("success") && (
              <button
                onClick={() => navigate("/login")}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerify;
