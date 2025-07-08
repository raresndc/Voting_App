// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const handleLogout = () => {
    logoutUser().finally(() => {
      clearUser();
      navigate('/login');
    });
  };

  return (
    <motion.button
      onClick={handleLogout}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 focus:outline-none"
    >
      <LogOut className="w-5 h-5" />
      <span>Logout</span>
    </motion.button>
  );
}
