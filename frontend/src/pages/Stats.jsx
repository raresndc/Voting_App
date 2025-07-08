import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Stats() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/votes/summaries').then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Statistics</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
)}