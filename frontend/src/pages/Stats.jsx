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
import { Link } from 'react-router-dom';

// Custom tooltip to display candidate info
function CandidateTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded shadow-lg">
        <img
          src={data.photo}
          alt={label}
          className="h-12 w-12 rounded-full mb-2 object-cover"
        />
        <p className="font-semibold">{label}</p>
        <p className="text-gray-500 text-sm mb-2">{data.politicalParty}</p>
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
        // Map API response to chart data
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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Statistics</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip content={<CandidateTooltip />} />
          <Bar dataKey="votes" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
