import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, loginSU, getProfile } from '../api/auth';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [isSuper, setIsSuper] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', secretKey: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setIsSuper(checked);
      if (!checked) setForm(f => ({ ...f, secretKey: '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = isSuper
        ? await loginSU(form)
        : await loginUser(form);

      const profileRes = await getProfile();
      setUser(profileRes.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err);
      if (err.response?.data?.needs2fa) {
        navigate('/2fa-setup', { state: { username: form.username } });
      } else {
        setError('Login failed: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      {/* Background Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
        className="absolute w-96 h-96 bg-white bg-opacity-10 rounded-full top-16 left-8"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
        className="absolute w-80 h-80 bg-white bg-opacity-5 rounded-full bottom-16 right-8"
      />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="relative bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md">Log In</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <label className="block mb-2 text-white">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none"
          placeholder="Enter your username"
          required
        />

        <label className="block mb-2 text-white">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none"
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center mb-4">
          <input
            id="super"
            type="checkbox"
            checked={isSuper}
            onChange={handleChange}
            className="accent-blue-500"
          />
          <label htmlFor="super" className="ml-2 text-white">
            Super Admin
          </label>
        </div>

        {isSuper && (
          <>
            <label className="block mb-2 text-white">Secret Key</label>
            <input
              name="secretKey"
              value={form.secretKey}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white focus:outline-none"
              placeholder="Enter your secret key"
              required
            />
          </>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
        >
          Submit
        </motion.button>
      </motion.form>
    </div>
  );
}
