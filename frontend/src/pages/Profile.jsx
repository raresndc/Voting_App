// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getProfile } from '../api/auth';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        clearUser();
        navigate('/login');
      });
  }, []);

  if (loading) {
    return (
      <motion.p
        className="text-center mt-10 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading...
      </motion.p>
    );
  }

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Background Accents */}
      <motion.div
        className="absolute w-96 h-96 bg-white bg-opacity-10 rounded-full top-16 left-12"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-white bg-opacity-5 rounded-full bottom-12 right-12"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      <motion.div
        className="relative z-10 max-w-3xl w-full bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl shadow-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/logo_vote.svg"
            alt="E-Vote Logo"
            className="h-16 w-auto"
          />
        </div>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <UserCircle className="h-16 w-16 text-blue-400" />
          <div>
            <h1 className="text-4xl font-extrabold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-white/80">
              Member since:{' '}
              <span className="font-medium">
                {new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  year: 'numeric'
                }).format(new Date(user.createdDate))}
              </span>
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-900">
          {/* Left Column */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Age:</span> {user.age}
            </p>
            <p>
              <span className="font-semibold">Citizenship:</span> {user.citizenship}
            </p>
            <p>
              <span className="font-semibold">Date of Birth:</span> {user.dateOfBirth}
            </p>
            <p>
              <span className="font-semibold">Phone Number:</span> {user.phoneNo}
            </p>
          </div>
          {/* Right Column */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Gender:</span> {user.gender}
            </p>
            <p>
              <span className="font-semibold">ID Series:</span> {user.idSeries}
            </p>
            <p>
              <span className="font-semibold">Personal ID Number:</span> {user.personalIdNo}
            </p>
            <p>
              <span className="font-semibold">Verified:</span>{' '}
              <span className={user.verified ? 'text-green-600' : 'text-red-600'}>
                {user.verified ? 'Yes' : 'No'}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/2fa-setup')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Setup 2FA
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
