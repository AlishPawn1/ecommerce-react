// src/components/NewsletterBox.jsx
import React, { useState } from 'react';
import { backendUrl } from '../App'; // adjust the import path as needed

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    if (!backendUrl) {
      console.error('backendUrl is not defined');
      setErrorMsg('Backend URL not set.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {

      const res = await fetch(`${backendUrl}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Subscription failed:', errorData);
        setErrorMsg(errorData.error || 'Subscription failed');
        setStatus('error');
        return;
      }

      const data = await res.json();
    //   console.log('Subscription success:', data);

      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Subscription request error:', error);
      setErrorMsg('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section className="newsletter-section my-10 pt-10">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-2xl font-medium text-gray-800">
          Subscribe now & get 20% off
        </h2>
        <p className="text-gray-400 mt-3">Stay updated with our latest offers</p>

        <form
          onSubmit={onSubmitHandler}
          className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 outline-none py-2 px-3 "
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-black text-white text-xs px-10 py-3 uppercase cursor-pointer rounded-r hover:bg-gray-800 transition"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <p className="text-green-600 mt-2">Thank you for subscribing!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-2">{errorMsg || 'Subscription failed.'}</p>
        )}
      </div>
    </section>
  );
};

export default NewsletterBox;
