import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const LoginPage = () => {
  const Navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [email, setemail] = useState('');
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = {
      "email": email,
      "name": "user",
    };
    window.sessionStorage.setItem("user",JSON.stringify( user));
    Navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-sm text-center text-white">
        <h2 className="text-3xl mb-6 font-bold text-purple-400">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <button 
            type="submit" 
            className="w-full p-3 mb-4 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition duration-300">
            Login
          </button>
          <button 
            type="button" 
            onClick={() => loginWithRedirect()} 
            className="w-full p-3 bg-purple-500 rounded-lg text-white font-semibold hover:bg-purple-600 transition duration-300">
            Log In with Other Methods
          </button>
        </form>
        <p className="mt-6 text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
