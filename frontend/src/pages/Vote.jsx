// src/pages/Vote.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useUser();

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await axios.get('/api/candidates');
        setCandidates(res.data);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
        setError('Unable to load candidates.');
      }
    }
    fetchCandidates();
  }, []);

  const castVote = async (id) => {
    try {
      await axios.post('/api/votes/cast', { candidateId: id });
      setSuccess('Your vote was cast successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to cast vote. Please try again.');
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute w-72 h-72 bg-white bg-opacity-10 rounded-full top-24 left-12"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-white bg-opacity-5 rounded-full bottom-12 right-12"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      <motion.h1
        className="z-10 text-4xl font-extrabold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Cast Your Vote
      </motion.h1>

      {error && (
        <motion.p className="text-red-400 mb-4 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>
      )}
      {success && (
        <motion.p className="text-green-400 mb-4 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {success}
        </motion.p>
      )}

      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {candidates.map((c, idx) => (
          <motion.div
            key={c.id ?? idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center text-gray-900"
          >
            <img
              src={c.photo}
              alt={`${c.firstName} ${c.lastName}`}
              className="h-24 w-24 rounded-full mb-4 object-cover border-2 border-white"
            />
            <h2 className="text-2xl font-semibold mb-1 text-white drop-shadow-md text-center">
              {c.firstName} {c.lastName}
            </h2>
            <p className="text-white/80 mb-4 text-center">{c.politicalParty}</p>
            <motion.button
              onClick={() => castVote(c.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Vote
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
