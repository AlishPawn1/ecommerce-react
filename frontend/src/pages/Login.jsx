import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const { setToken, navigate, backendUrl, setUserName } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams();

  // Handle verification link redirect
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully! Please log in.');
      setCurrentState('Login');
      setShowVerification(false);
    }
  }, [searchParams]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (currentState === 'Sign Up') {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          toast.success(response.data.message);
          setShowVerification(true);
          setCurrentState('Verify');
        } else {
          toast.error(response.data.message || 'Registration failed');
        }
      } else if (currentState === 'Verify') {
        response = await axios.post(`${backendUrl}/api/user/verify-code`, { email, code: verificationCode });
        if (response.data.success) {
          toast.success(response.data.message);
          setShowVerification(false);
          setCurrentState('Login');
          setVerificationCode('');
        } else {
          toast.error(response.data.message || 'Verification failed');
        }
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userName', response.data.userName);
          setUserName(response.data.userName);
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-900">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <h1 className="primary-font text-3xl">{currentState === 'Verify' ? 'Verify Email' : currentState}</h1>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
          {currentState === 'Sign Up' && (
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Name"
              required
            />
          )}
          {(currentState === 'Login' || currentState === 'Sign Up' || showVerification) && (
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Email"
              required
            />
          )}
          {(currentState === 'Login' || currentState === 'Sign Up') && (
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Password"
              required
            />
          )}
          {showVerification && (
            <input
              onChange={(e) => setVerificationCode(e.target.value)}
              value={verificationCode}
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="6-digit Verification Code"
              required
            />
          )}
          <div className="w-full flex justify-between text-sm mt-[-8px]">
            {currentState !== 'Verify' && (
              <p className="cursor-pointer">Forgot your password?</p>
            )}
            {currentState === 'Login' ? (
              <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
                Create account
              </p>
            ) : currentState === 'Sign Up' ? (
              <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
                Login Here
              </p>
            ) : (
              <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
                Back to Login
              </p>
            )}
          </div>
          <button type="submit" className="btn-box btn-black">
            {currentState === 'Login' ? 'Sign In' : currentState === 'Sign Up' ? 'Sign Up' : 'Verify'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;