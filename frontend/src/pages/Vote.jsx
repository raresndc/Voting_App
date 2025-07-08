import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Vote() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function fetchOptions() {
      const res = await axios.get('/api/votes/options');
      setOptions(res.data);
    }
    fetchOptions();
  }, []);

  const castVote = async (candidateId) => {
    await axios.post('/api/votes/cast', { candidateId, evuid: userEvuid, signature });
    alert('Vote cast successfully');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vote</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map(o => (
          <div key={o.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{o.name}</h2>
            <p className="text-gray-500 mb-2">{o.partyName}</p>
            <button
              onClick={() => castVote(o.id)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
)}