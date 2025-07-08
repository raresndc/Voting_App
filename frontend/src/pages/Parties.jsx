// src/components/Parties.jsx
import React, { useEffect, useState } from 'react';
import { listParties } from '../api/parties';

export default function Parties() {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    listParties()
      .then(res => setParties(res.data))
      .catch(err => console.error('load parties failed', err));
  }, []);

return (
  <div>
    <h1 className="text-3xl font-bold mb-4 text-gray-900 text-center">Political Parties</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-900">
      {parties.map(p => (
        <div
          key={p.id}
          className="bg-white p-4 rounded shadow text-center"    
        >
          {p.logoUrl && (
            <img
              src={p.logoUrl}
              alt={p.name}
              className="h-16 mb-2 mx-auto"                         
            />
          )}
          <h2 className="text-xl font-semibold">{p.name}</h2>
          {p.description && (
            <p className="mt-2 text-gray-600">{p.description}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);
}
