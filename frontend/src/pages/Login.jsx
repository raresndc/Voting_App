// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginSU, loginSA, login2FA, getProfile } from "../api/auth";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

export default function Login() {
  // role: 'user' | 'super_user' | 'super_admin'
  const [role, setRole] = useState('user');
  const [stage, setStage] = useState('initial'); // 'initial' or '2fa'
  const [form, setForm] = useState({
    username: "",
    password: "",
    secretKey: "",
    code: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submitInitial = async () => {
    setError("");
    try {
      let res;
      if (role === 'super_user') {
        res = await loginSU(form);
      } else if (role === 'super_admin') {
        res = await loginSA(form);
      } else {
        res = await loginUser(form);
      }

      if (res.data?.needs2fa) {
        setStage('2fa');
        return;
      }

      const profile = await getProfile();
      setUser(profile.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const submit2FA = async () => {
    setError("");
    try {
      await login2FA({
        username: form.username,
        password: form.password,
        code: form.code
      });
      const profile = await getProfile();
      setUser(profile.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid 2FA code');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    stage === 'initial' ? submitInitial() : submit2FA();
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      {/* animated circles omitted for brevity */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="relative bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md">
          {stage === 'initial' ? 'Log In' : 'Enter 2FA Code'}
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Role selector (only on initial stage) */}
        {stage === 'initial' && (
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
                className="accent-blue-500 mr-2"
              />
              User
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="super_user"
                checked={role === "super_user"}
                onChange={() => setRole("super_user")}
                className="accent-blue-500 mr-2"
              />
              Super User
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="role"
                value="super_admin"
                checked={role === "super_admin"}
                onChange={() => setRole("super_admin")}
                className="accent-blue-500 mr-2"
              />
              Super Admin
            </label>
          </div>
        )}

        {/* Username/password always show on initial stage */}
        {stage === 'initial' && (
          <>
            <label className="block mb-2 text-white">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white"
              placeholder="Username"
              required
            />

            <label className="block mb-2 text-white">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white"
              placeholder="Password"
              required
            />

            {/* Secret Key: only for super admin */}
            {role === 'super_admin' && (
              <>
                <label className="block mb-2 text-white">Secret Key</label>
                <input
                  name="secretKey"
                  value={form.secretKey}
                  onChange={handleChange}
                  className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white"
                  placeholder="Secret Key"
                  required
                />
              </>
            )}
          </>
        )}

        {/* 2FA stage: code input */}
        {stage === '2fa' && (
          <>
            <label className="block mb-2 text-white">2FA Code</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full mb-4 p-2 rounded bg-white bg-opacity-25 text-white placeholder-white"
              placeholder="Enter code"
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
          {stage === 'initial' ? 'Submit' : 'Verify'}
        </motion.button>
      </motion.form>
    </div>
  );
}
