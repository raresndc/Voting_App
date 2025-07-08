// src/pages/Candidates.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await axios.get('/api/candidates');
        setCandidates(res.data);
      } catch (err) {
        console.error('Failed to fetch candidates:', err);
      }
    }
    fetchCandidates();
  }, []);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white">
      {/* Background Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-white bg-opacity-10 rounded-full top-20 left-10"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-white bg-opacity-5 rounded-full bottom-10 right-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      <motion.h1
        className="text-4xl font-extrabold mb-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our Candidates
      </motion.h1>

      <ul className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {candidates.map((c, idx) => (
          <motion.li
            key={c.id || idx}
            whileHover={{ scale: 1.05 }}
            className=""
          >
            <div className="p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg flex flex-col items-center text-gray-900 h-full">
              <img
                src={c.photo}
                alt={`${c.firstName} ${c.lastName}`}
                className="h-24 w-24 rounded-full mb-4 object-cover border-4 border-white"
              />
              <h2 className="text-2xl font-semibold mb-1 text-white drop-shadow-md">
                {c.firstName} {c.lastName}
              </h2>
              <p className="text-white/80 mb-2">
                {c.politicalParty}
              </p>
              <p className="text-white/70 text-sm mb-2">
                {c.gender}, {c.age} years old
              </p>
              <p className="text-white/80 text-sm mb-4 text-center">
                {c.description}
              </p>
              <Link
                to={`/candidates/${c.id || idx}`}
                className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Profile
              </Link>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
