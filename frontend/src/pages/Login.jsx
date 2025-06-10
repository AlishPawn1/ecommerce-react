import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeExpired, setCodeExpired] = useState(false);
  const { setToken, setUser, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams();
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified successfully! Please log in.');
      setCurrentState('Login');
      setShowVerification(false);
    }
  }, [searchParams]);

  const resendVerificationCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/resend-code`, { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setCodeExpired(false);
      } else {
        toast.error(response.data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Error resending code:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let response;
      if (currentState === 'Sign Up') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('number', number);
        formData.append('address', address);
        if (image) {
          formData.append('image', image);
        }
        console.log('Sign Up payload:', Object.fromEntries(formData));
        response = await axios.post(`${backendUrl}/api/user/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setShowVerification(true);
          setCurrentState('Verify');
        } else {
          toast.error(response.data.message || 'Registration failed');
        }
      } else if (currentState === 'Verify') {
        console.log('Verify payload:', { email, code: verificationCode });
        response = await axios.post(`${backendUrl}/api/user/verify-code`, { email, code: verificationCode });
        if (response.data.success) {
          toast.success(response.data.message);
          setShowVerification(false);
          setCurrentState('Login');
          setVerificationCode('');
          setCodeExpired(false);
        } else {
          if (response.data.message === 'Verification code expired') {
            setCodeExpired(true);
            toast.error('Verification code expired. Please resend a new code.');
          } else {
            toast.error(response.data.message || 'Verification failed');
          }
        }
      } else {
        console.log('Login payload:', { email, password });
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (response.data.success) {
          const { token, userId, userName } = response.data;
          console.log('Full login response:', response.data); // Debug log
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('name', userName); // Consistent key 'name'
          setToken(token);
          setUser({ userId, name: userName }); // Use 'name' in user object
          toast.success('Login successful!');
          navigate('/');
        } else {
          toast.error(response.data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      {loading && <LoadingScreen />}
      <div className="container">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-900"
        >
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <h1 className="primary-font text-3xl">{currentState === 'Verify' ? 'Verify Email' : currentState}</h1>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>
          {currentState === 'Sign Up' && (
            <>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Full Name (min. 3 words)"
                required
              />
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Address (min. 2 words)"
                required
              />
              <input
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                type="text"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="Phone Number (e.g., 98xxxxxxx)"
                required
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-800"
              />
            </>
          )}
          {(currentState === 'Login' || currentState === 'Sign Up' || currentState === 'Verify') && (
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
          {currentState === 'Verify' && (
            <>
              <input
                onChange={(e) => setVerificationCode(e.target.value)}
                value={verificationCode}
                type="text"
                className="w-full px-3 py-2 border border-gray-800"
                placeholder="6-digit Verification Code"
                required
              />
              {codeExpired && (
                <p onClick={resendVerificationCode} className="cursor-pointer text-sm text-blue-600">
                  Resend Code
                </p>
              )}
            </>
          )}
          <div className="w-full flex justify-between text-sm mt-[-8px]">
            {currentState !== 'Verify' && (
              <p onClick={() => { setCurrentState('Verify'); setShowVerification(true); }} className="cursor-pointer">
                Verify code
              </p>
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
              <p
                onClick={() => {
                  setCurrentState('Login');
                  setShowVerification(false);
                  setVerificationCode('');
                  setCodeExpired(false);
                }}
                className="cursor-pointer"
              >
                Back to Login
              </p>
            )}
          </div>
          <button type="submit" className="btn-box btn-black" disabled={loading}>
            {currentState === 'Login' ? 'Sign In' : currentState === 'Sign Up' ? 'Sign Up' : 'Verify'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;