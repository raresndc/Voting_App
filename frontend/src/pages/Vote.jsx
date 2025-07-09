// src/components/Vote.jsx
import React, { useState, useEffect, useRef } from "react"; // <-- import useRef
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import tokenService from "../api/tokenService";
import voteApi from "../api/apiVote";
import API from "../api/auth";

export default function Vote() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [tokenPair, setTokenPair] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingToken, setLoadingToken] = useState(true);

  const hasIssued = useRef(false); // <-- ref to track if we already asked

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user, navigate]);

  // Fetch candidates once
  useEffect(() => {
    API.get("/api/candidates")
      .then((res) => setCandidates(res.data))
      .catch(console.error);
  }, []);

  // Issue the blind‐sig token exactly once *after* login
  useEffect(() => {
    if (!user || hasIssued.current) return; // skip if no user or already issued
    hasIssued.current = true; // mark as done

    (async () => {
      try {
        const pair = await tokenService.issueBlindToken();
        console.log("Blind token issued", pair);
        setTokenPair(pair);
      } catch (err) {
        console.error("Token issuance failed", err);
        alert("Could not get voting token. Please refresh or re-login.");
      } finally {
        setLoadingToken(false);
      }
    })();
  }, [user]);

  if (loadingToken) {
    return <div>Preparing your anonymous voting token…</div>;
  }

  return (
    <div className="vote-container">
      {candidates.map((c) => (
        <div key={c.id} className="candidate-card">
          <img
            src={c.photo}
            alt={`${c.firstName} ${c.lastName}`}
            className="candidate-photo"
          />
          <div className="candidate-details">
            <h3>
              {c.firstName} {c.lastName}
            </h3>
            <p>Party: {c.politicalParty}</p>
            <button
              className="vote-button"
              disabled={!tokenPair}
              onClick={async () => {
                try {
                  await voteApi.post("/votes/cast", {
                    token: tokenPair.token,
                    signature: tokenPair.signature,
                    candidateId: c.id,
                  });
                  alert("Your vote was cast anonymously!");
                } catch (e) {
                  console.error("Cast error:", e);
                  alert(
                    "Failed to cast vote: " + (e.response?.data || e.message)
                  );
                }
              }}
            >
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
