import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const shiftouser = ()=>{
    navigate('/home')
  }
  const handleLogin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await response.json(); 
      console.log(data); 

      if (data.token) { 
        localStorage.setItem('token', data.token); // Store token in localStorage
        setIsAuthenticated(true); // Set authenticated state to true
        setError('');
        navigate('/admin'); // Redirect to the Admin page
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.log('Error Response:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">Admin Login</h2>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        <div className="mt-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full mt-6 p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Login
        </button>

        <button
          onClick={shiftouser}
          className="w-full mt-6 p-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          User
        </button>
        
      </div>
    </div>
  );
};

export default AdminLogin;
