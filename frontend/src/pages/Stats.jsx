// src/pages/Statistics.jsx
import React, { useEffect, useState } from 'react';
// you can still use axios for candidates if you like, or import your auth API client
import axios from 'axios';
import voteApi from '../api/apiVote';       // <— voting‐service client
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
    async function fetchStats() {
      try {
        // 1) load candidate list from auth service
        const { data: candidates } = await axios.get('/api/candidates');

        // 2) for each candidate, fetch its vote-count
        const chartData = await Promise.all(
          candidates.map(async (c) => {
            const { data: votes } = await voteApi.get(`/votes/count/${c.id}`);
            return {
              name: `${c.firstName} ${c.lastName}`,
              politicalParty: c.politicalParty,
              photo: c.photo,
              votes,
            };
          })
        );

        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch candidate votes:', err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* ... your background and header animations ... */}
      <motion.div
        className="relative z-10 w-full max-w-4xl bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
