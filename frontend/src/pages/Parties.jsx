// src/components/Parties.jsx
import React, { useEffect, useState } from 'react';
import { listParties } from '../api/parties';
import { motion } from 'framer-motion';

export default function Parties() {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    listParties()
      .then(res => setParties(res.data))
      .catch(err => console.error('load parties failed', err));
  }, []);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white">
      {/* Background Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-white bg-opacity-10 rounded-full top-16 left-12"
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

      <motion.h1
        className="text-4xl font-extrabold mb-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Political Parties
      </motion.h1>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {parties.map((p, idx) => (
          <motion.div
            key={p.id || idx}
            whileHover={{ scale: 1.03 }}
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center text-gray-900 h-full"
            transition={{ type: 'spring', stiffness: 120 }}
          >
            {p.logoUrl && (
              <img
                src={p.logoUrl}
                alt={p.name}
                className="h-20 w-auto mb-4 rounded-full border-2 border-white"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2 text-white drop-shadow-md">{p.name}</h2>
            {p.description && (
              <p className="text-white/80 text-sm text-center">{p.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
