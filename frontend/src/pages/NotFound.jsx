import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 max-w-md mx-auto">
        <h1 className="text-9xl font-extrabold text-blue-600 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-4 mb-8">
          Oops! It looks like the page you're looking for doesn't exist or has
          been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
