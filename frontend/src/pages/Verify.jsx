import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/auth'; // adjust import if needed
import { motion } from 'framer-motion';

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();
  const usernameFromRegister = location.state?.username || '';

  const [form, setForm] = useState({
    username: usernameFromRegister,
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/auth/verify', form);
      setSuccess('Your account was verified! You can now login.');
      navigate('/login');
    } catch (err) {
      setError('Verification failed. Please check your code or try again.');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md z-10"
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Verify Your Account</h2>
        <p className="text-white/80 mb-6 text-center">
          Enter the verification code sent to your email.
        </p>
        {error && <div className="text-red-300 text-center mb-2">{error}</div>}
        {success && <div className="text-green-300 text-center mb-2">{success}</div>}
        <div className="mb-4">
          <label className="text-white font-medium">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
            disabled={!!usernameFromRegister}
          />
        </div>
        <div className="mb-6">
          <label className="text-white font-medium">Verification Code</label>
          <input
            name="verificationCode"
            value={form.verificationCode}
            onChange={handleChange}
            required
            placeholder="Enter code"
            className="w-full p-2 rounded-lg mt-1 bg-white bg-opacity-25 text-white focus:outline-none"
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 bg-blue-600 rounded-xl text-white font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Verify
        </motion.button>
      </motion.form>
    </div>
  );
}
