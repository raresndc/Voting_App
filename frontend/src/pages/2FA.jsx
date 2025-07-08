// src/pages/TwoFASetup.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { setup2FA, confirm2FA } from '../api/auth';

export default function TwoFASetup() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [secret, setSecret] = useState('');
  const [uri, setUri] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.username) {
      navigate('/login');
      return;
    }
    setup2FA({ username: user.username })
      .then(res => {
        setSecret(res.data.secret);
        setUri(res.data.qrCodeUrl);
      })
      .catch(() => setError('Failed to generate 2FA setup.'));
  }, [user]);

  const handleConfirm = async () => {
    try {
      const res = await confirm2FA({ username: user.username, code });
      setUser(res.data);
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Invalid code');
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Background Circles */}
      <motion.div
        className="absolute w-96 h-96 bg-white bg-opacity-10 rounded-full top-16 left-8"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-white bg-opacity-5 rounded-full bottom-12 right-8"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      <motion.div
        className="relative z-10 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Two-Factor Authentication Setup</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {uri ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <QRCode value={uri} className="mb-4" />
            <p className="mb-2 text-gray-800">Scan the QR code with your authenticator app.</p>
            <p className="mb-4 text-sm text-gray-600">Or enter this secret manually: <span className="font-mono bg-gray-100 p-1 rounded text-gray-900">{secret}</span></p>
            <input
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full mb-4 p-2 border rounded focus:outline-none"
            />
            <motion.button
              onClick={handleConfirm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Confirm
            </motion.button>
          </motion.div>
        ) : (
          <p className="text-gray-200">Generating setup details...</p>
        )}
      </motion.div>
    </div>
  );
}
