import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await axios.get("/api/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      }
    }
    fetchCandidates();
  }, []);

  // const castVote = async (candidateId) => {
  //   await axios.post("/api/votes/cast", {
  //     candidateId,
  //     evuid: userEvuid,
  //     signature,
  //   });
  //   alert("Vote cast successfully");
  // };

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">Cast Your Vote</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((c, idx) => (
          <div key={c.id || idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src={c.photo}
              alt={`${c.firstName} ${c.lastName}`}
              className="h-24 w-24 rounded-full mb-4 object-cover"
            />
            <h2 className="w-full text-xl font-semibold mb-1 text-center">
              {c.firstName} {c.lastName}
            </h2>
            <p className="text-gray-500 mb-2 text-center">{c.politicalParty}</p>
            <button
              onClick={() => castVote(c.id)}
              className="mt-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
