import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    // Proceed with sign-up logic (e.g., API request)
    // navigate("/somePage");
    alert("Sign up successful!");
  };

  return (
    <div className="signup-page">
      <header className="header">
      <button className="logo" onClick={() => navigate("/")}>VoteApp</button>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </header>

      <main className="signup-form-container">
        <h1>Create an Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-submit-btn">
            Sign Up
          </button>
        </form>
      </main>

      <footer className="footer">
        <p>&copy; 2024 VoteApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SignUpPage;
