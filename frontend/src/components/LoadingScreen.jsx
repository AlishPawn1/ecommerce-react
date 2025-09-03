// LoadingScreen.js
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner">
        <svg viewBox="0 0 50 50" className="spinner-svg">
          <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
        </svg>
      </div>
    </div>
  );
};

export default LoadingScreen;
