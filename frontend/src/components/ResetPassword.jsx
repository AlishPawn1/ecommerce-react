import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Optional: If you want to clear toasts on unmount
    return () => {
      toast.dismiss();
    };
  }, []);

  if (!token || !email) {
    return (
      <section className="min-h-screen flex items-center justify-center p-4">
        <div className="container">
          <p className="text-red-600 font-semibold">Invalid or missing reset token/email.</p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
        token,
        email,
        password,
      });

      if (response.data.success) {
        toast.success('Password reset successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        toast.error(response.data.message || 'Reset failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="container">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-900"
        >
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <h1 className="primary-font text-3xl">Reset Password</h1>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>

          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              aria-label="New Password"
              className="w-full px-3 py-2 border border-gray-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
            </button>
          </div>

          <div className="relative w-full">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              aria-label="Confirm New Password"
              className="w-full px-3 py-2 border border-gray-800 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-box btn-black"
            aria-busy={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;

