import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">
        <button className="logo" onClick={() => navigate("/")}>VoteMeUp</button>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>Log In</button>
          <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          {/* <button className="signup-btn">Sign Up</button> */}
        </div>
      </header>

      <main className="hero-section">
        <h1>Empower Your Voice</h1>
        <p>Join a community where every vote counts. Sign up to start voting today!</p>
        <div className="demo">
          <img src="images/voting_process.jpg" alt="Voting Demo" />
        </div>
      </main>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Create Polls</h3>
            <p>Design and share polls easily.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Results</h3>
            <p>View live updates as votes come in.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Voting</h3>
            <p>Your vote, your privacy.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 VoteMeUp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
