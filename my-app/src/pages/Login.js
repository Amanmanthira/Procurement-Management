import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Combine vertical and horizontal movement for the form animation
  const formAnimation = useSpring({
    opacity: isLoggedIn ? 0 : 1,
    transform: isLoggedIn
      ? 'translate(100%, -50%)' // move to bottom-right
      : 'translate(0%, 0%)', // stay in original position
    config: { tension: 220, friction: 30 },
  });

  // Combine vertical and horizontal movement for the image animation
  const imageAnimation = useSpring({
    opacity: isLoggedIn ? 0 : 1,
    transform: isLoggedIn
      ? 'translate(-100%, 50%)' // move to top-left
      : 'translate(0%, 0%)', // stay in original position
    config: { tension: 220, friction: 30 },
  });

  const handleLogin = async () => {
    const response = await loginUser({ email, password });
    console.log('Login response:', response);
    if (response?.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.role);
      setIsLoggedIn(true);
      setTimeout(() => {
        if (response.role === 'admin') {
          navigate('/ADashboard');
        } else {
          navigate('/SDashboard');
        }
      }, 1000);  // Wait for animation before navigation
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-900 overflow-hidden">
      {/* Form Side */}
      <animated.div style={formAnimation} className="flex flex-col justify-center items-center w-1/2 bg-gradient-to-r from-[#c8d6ee] to-[#092a6d] bg-opacity-70 p-8 rounded-l-lg shadow-lg">
        <div className="text-center text-white">
          <h1 className="text-6xl font-semibold mb-6">TechFix <span className='font-thin'>Portal</span></h1>
          <h3 className="text-lg mb-6">Welcome back! Please sign in</h3>
          <div className="w-full mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-3xl shadow-md hover:scale-105 transition duration-300"
          >
            Login
          </button>
          <p className="mt-4 text-sm text-blue-400 hover:text-blue-500 cursor-pointer">Forgot Password?</p>
        </div>
      </animated.div>

      {/* Image Side */}
      <animated.div style={imageAnimation} className="w-1/2 relative">
        <img
          src="https://i.pinimg.com/736x/ad/2f/aa/ad2faa427de3bb2fb5d2b0d4a9687b1a.jpg"
          alt="Background"
          className="object-cover w-full h-full opacity-80"
        />
      </animated.div>
    </div>
  );
};

export default Login;
