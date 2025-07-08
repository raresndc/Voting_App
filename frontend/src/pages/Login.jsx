// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginSuper } from '../api/auth';

export default function Login() {
  const [isSuper, setIsSuper] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    secretKey: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setIsSuper(checked);
      // reset secretKey on toggle off:
      if (!checked) setForm(f => ({ ...f, secretKey: '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the appropriate endpoint
      const res = isSuper
        ? await loginSuper(form)
        : await login(form);

      // 1) Store the JWT in localStorage
      localStorage.setItem('token', res.data.accessToken);

      // 2) Navigate to dashboard (or your protected area)
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err);
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl mb-6 text-gray-800">Log In</h2>

        <label className="block mb-2 text-gray-700">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <label className="block mb-2 text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <div className="flex items-center mb-4">
          <input
            id="super"
            type="checkbox"
            checked={isSuper}
            onChange={handleChange}
          />
          <label htmlFor="super" className="ml-2 text-gray-700">
            Super Admin
          </label>
        </div>

        {isSuper && (
          <>
            <label className="block mb-2 text-gray-700">Secret Key</label>
            <input
              name="secretKey"
              value={form.secretKey}
              onChange={handleChange}
              className="w-full mb-4 p-2 border rounded"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
