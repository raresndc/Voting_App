import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      const res = await axios.get('/api/documents/candidates');
      setCandidates(res.data);
    }
    fetchCandidates();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Candidates</h1>
      <ul className="space-y-4">
        {candidates.map(c => (
          <li key={c.id}>
            <Link
              to={`/candidates/${c.id}`}
              className="block p-4 bg-white rounded shadow hover:bg-gray-50"
            >
              <div className="flex items-center">
                <img src={c.photoUrl} alt={c.name} className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <h2 className="text-lg font-semibold">{c.name}</h2>
                  <p className="text-gray-500">{c.partyName}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
