// src/pages/Statistics.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { motion } from 'framer-motion';

// Custom tooltip to display candidate info
function CandidateTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-gray-900">
        <img
          src={data.photo}
          alt={label}
          className="h-12 w-12 rounded-full mb-2 object-cover border-2 border-gray-300"
        />
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-gray-600 mb-1">{data.politicalParty}</p>
        <p className="text-gray-700">Votes: {data.votes}</p>
      </div>
    );
  }
  return null;
}

export default function Statistics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await axios.get('/api/candidates/votes');
        const chartData = res.data.map(c => ({
          name: `${c.firstName} ${c.lastName}`,
          politicalParty: c.politicalParty,
          photo: c.photo,
          votes: c.votes,
        }));
        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch candidate votes:', err);
      }
    }
    fetchCandidates();
  }, []);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Background Circles */}
      <motion.div
        className="absolute w-80 h-80 bg-white bg-opacity-10 rounded-full top-20 left-10"
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
        className="z-10 text-4xl font-extrabold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Voting Statistics
      </motion.h1>

      <motion.div
        className="relative z-10 w-full max-w-4xl bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#FFF' }} />
            <YAxis tick={{ fill: '#FFF' }} />
            <Tooltip content={<CandidateTooltip />} />
            <Bar dataKey="votes" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
