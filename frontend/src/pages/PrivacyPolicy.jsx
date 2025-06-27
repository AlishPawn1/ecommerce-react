import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="mb-4">
        At Traditional Newari Shop, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Personal information (name, email, phone number, address)</li>
        <li>Payment details (securely processed via third-party gateways)</li>
        <li>Browsing and usage data (cookies, pages visited, etc.)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>To process orders and provide customer support</li>
        <li>To personalize your shopping experience</li>
        <li>To send promotional emails (only if subscribed)</li>
        <li>To improve our website and services</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p className="mb-4">
        We implement appropriate security measures to protect your data. Payment information is encrypted and never stored on our servers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell or trade your personal information. Your data may only be shared with trusted partners for services like payment processing and shipping.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cookies</h2>
      <p className="mb-4">
        We use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal information. Contact us at support@traditionshop.com to make a request.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this policy occasionally. Please review it periodically for changes. Continued use of our site means you accept the updated policy.
      </p>

      <p className="text-sm text-gray-600 mt-10">
        Last updated: June 28, 2025
      </p>
    </div>
  );
};

export default PrivacyPolicy;
