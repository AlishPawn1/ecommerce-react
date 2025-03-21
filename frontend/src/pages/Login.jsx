import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const { setToken, navigate, backendUrl, setUserName } = useContext(ShopContext);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            let response;
            if (currentState === 'Sign Up') {
                response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
                if (response.data.success) {
                    toast.success('Registration successful! Please log in.');
                    setCurrentState('Login');
                } else {
                    toast.error(response.data.message || 'Registration failed');
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
                    navigate('/'); // Redirect to home page
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
                        <h1 className="primary-font text-3xl">{currentState}</h1>
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
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-800"
                        placeholder="Email"
                        required
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className="w-full px-3 py-2 border border-gray-800"
                        placeholder="Password"
                        required
                    />
                    <div className="w-full flex justify-between text-sm mt-[-8px]">
                        <p className="cursor-pointer">Forgot your password?</p>
                        {currentState === 'Login' ? (
                            <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
                                Create account
                            </p>
                        ) : (
                            <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
                                Login Here
                            </p>
                        )}
                    </div>
                    <button type="submit" className="btn-box btn-black">
                        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
