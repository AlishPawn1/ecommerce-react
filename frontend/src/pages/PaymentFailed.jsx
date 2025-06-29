import React from "react";
import { useSearchParams, Link } from "react-router-dom";

const PaymentFailed = () => {
    const [params] = useSearchParams();
    const orderId = params.get("orderId");

    return (
        <section>
            <div className="container">
                <div className="min-h-[75vh] flex items-center justify-center text-center">
                    <div className="max-w-md bg-white shadow-lg rounded-xl p-6">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">❌ Payment Failed</h1>
                        <p className="text-gray-700 mb-2">Your payment could not be verified.</p>
                        {orderId && (
                            <p className="text-sm text-gray-500 mb-4">Order ID: <strong>{orderId}</strong></p>
                        )}
                        <Link to="/" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Try Again
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentFailed;
