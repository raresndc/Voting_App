// src/components/Vote.jsx
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import tokenService from "../api/tokenService";
import voteApi from "../api/apiVote";
import API from "../api/auth";
import { motion } from "framer-motion";

export default function Vote() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [profileLoading, setProfileLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const [tokenPair, setTokenPair] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [voteState, setVoteState] = useState({}); // key: candidateId, value: {loading, error, success}

  const hasIssued = useRef(false);

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user, navigate]);

  // Fetch profile to check verification
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await API.get('/api/auth/profile'); // GET /api/auth/profile
        setIsVerified(res.data.identityVerification);
      } catch (err) {
        setGlobalError("Could not verify your identity. Please try again.");
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [user]);

  // Fetch candidates once (only if verified)
  useEffect(() => {
    if (profileLoading || !isVerified) return;
    API.get("/api/candidates")
      .then((res) => setCandidates(res.data))
      .catch((err) => {
        setGlobalError("Could not load candidates. Please try again.");
      });
  }, [profileLoading, isVerified]);

  // Issue the blind‐sig token once after login & verification
  useEffect(() => {
    if (!user || profileLoading || !isVerified || hasIssued.current) return;
    hasIssued.current = true;

    (async () => {
      try {
        const pair = await tokenService.issueBlindToken();
        setTokenPair(pair);
      } catch (err) {
        setGlobalError("Could not get voting token. Please refresh or re-login.");
      } finally {
        setLoadingToken(false);
      }
    })();
  }, [user, profileLoading, isVerified]);

  const handleVote = async (candidateId) => {
    setVoteState((prev) => ({
      ...prev,
      [candidateId]: { loading: true, error: null, success: null },
    }));
    try {
      await voteApi.post("/votes/cast", {
        token: tokenPair.token,
        signature: tokenPair.signature,
        candidateId,
      });
      setVoteState((prev) => ({
        ...prev,
        [candidateId]: { loading: false, error: null, success: "Your vote was cast anonymously!" },
      }));
      setTimeout(() => navigate("/stats"), 1000);
    } catch (e) {
      setVoteState((prev) => ({
        ...prev,
        [candidateId]: {
          loading: false,
          error: "Failed to cast vote: " + (e.response?.data?.message || e.message || "Unknown error"),
          success: null,
        },
      }));
    }
  };

  // Show loader while profile or token is loading
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
        <span className="text-lg animate-pulse">Verifying your account…</span>
      </div>
    );
  }

  // Block unverified users
  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6">
        <div className="max-w-md text-center bg-red-700 bg-opacity-80 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-4">
            Your account is not verified. Please complete identity verification to participate in voting.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate('/profile')}
          >
            Go to Verification
          </button>
        </div>
      </div>
    );
  }

  if (loadingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <span className="text-lg animate-pulse">Preparing your anonymous voting token…</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white">
      {/* Background Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-white bg-opacity-10 rounded-full top-20 left-10"
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
        className="text-4xl font-extrabold mb-8 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Vote for Your Candidate
      </motion.h1>

      {globalError && (
        <div className="mb-6 px-4 py-3 bg-red-700 bg-opacity-80 text-white rounded-lg font-semibold shadow z-20">
          {globalError}
        </div>
      )}

      <ul className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {candidates.length === 0 ? (
          <li className="col-span-full text-center text-white/70">
            No candidates available.
          </li>
        ) : (
          candidates.map((c) => {
            const state = voteState[c.id] || {};
            return (
              <motion.li key={c.id} whileHover={{ scale: 1.05 }} className="h-full">
                <div className="relative p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg flex flex-col items-center text-gray-900 h-full min-h-[360px]">
                  <img
                    src={c.photo}
                    alt={`${c.firstName} ${c.lastName}`}
                    className="h-24 w-24 rounded-full mb-4 object-cover border-4 border-white"
                  />
                  <h2 className="text-2xl font-semibold mb-1 text-white drop-shadow-md">
                    {c.firstName} {c.lastName}
                  </h2>
                  <p className="text-white/80 mb-2">{c.politicalParty}</p>
                  {c.gender && c.age && (
                    <p className="text-white/70 text-sm mb-2">
                      {c.gender}, {c.age} years old
                    </p>
                  )}
                  <button
                    className={`mt-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                      !tokenPair || state.loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!tokenPair || state.loading}
                    onClick={() => handleVote(c.id)}
                  >
                    {state.loading ? "Voting…" : "Vote"}
                  </button>
                  {state.error && (
                    <div className="mt-3 text-sm text-red-200">{state.error}</div>
                  )}
                  {state.success && (
                    <div className="mt-3 text-sm text-green-200">{state.success}</div>
                  )}
                </div>
              </motion.li>
            );
          })
        )}
      </ul>
    </div>
  );
}
