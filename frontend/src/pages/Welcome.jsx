// src/pages/Welcome.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 overflow-hidden">
      {/* Background Animation Circles */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
        className="absolute w-72 h-72 bg-white bg-opacity-10 rounded-full top-20 left-10"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0.8] }}
        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
        className="absolute w-96 h-96 bg-white bg-opacity-5 rounded-full bottom-10 right-10"
      />

      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 z-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg">
          Welcome to<br />E-Vote Chain
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto">
          Secure, transparent, and blockchain-based voting platform for the modern citizen.
        </p>
      </motion.div>

      {/* Interactive Buttons */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 120 }}
        className="flex space-x-4 z-10"
      >
        <Link
          to="/login"
          className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-white font-semibold hover:bg-opacity-40 transition"
        >
          Log In
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-white font-semibold hover:bg-opacity-40 transition"
        >
          Register
        </Link>
      </motion.div>

      {/* Footer Animation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 text-sm text-white/80 z-10"
      >
        <span>Made by E-Vote Team</span>
      </motion.div>
    </div>
  );
}
