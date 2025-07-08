import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="p-6 text-gray-900 text-center">
      <h1 className="text-3xl font-bold mb-4">Candidates</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c, idx) => (
          <li key={idx}>
            <div className="p-6 bg-white rounded shadow flex flex-col items-center">
              <img
                src={c.photo}
                alt={`${c.firstName} ${c.lastName}`}
                className="h-24 w-24 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold mb-1">
                {c.firstName} {c.lastName}
              </h2>
              <p className="text-gray-500 mb-2">{c.politicalParty}</p>
              <p className="text-gray-600 text-sm mb-2">
                {c.gender}, {c.age} years old
              </p>
              <p className="text-gray-700 text-sm mb-4 text-center">
                {c.description}
              </p>
              <Link
                to={`/candidates/${c.id || idx}`}
                className="mt-auto text-blue-600 hover:underline"
              >
                View Profile
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
