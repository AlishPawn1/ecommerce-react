import React from "react";

const LoadingSpinner = ({ size = "md", color = "primary", className = "" }) => {
  // Size classes
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  // Color classes
  const colorClasses = {
    primary: "border-t-blue-500",
    secondary: "border-t-purple-500",
    success: "border-t-green-500",
    danger: "border-t-red-500",
    warning: "border-t-yellow-500",
    light: "border-t-gray-200",
    dark: "border-t-gray-800",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-solid border-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ borderTopColor: "currentColor" }}
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
export default LoadingSpinner;
