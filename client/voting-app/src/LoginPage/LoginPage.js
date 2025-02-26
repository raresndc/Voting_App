import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";



const LoginPage = () => {
    const navigate = useNavigate();
  return (
    // <div className="login-page">
    //     <header className="header">
    //         <button className="logo" onClick={() => navigate("/")}>VoteApp</button>
    //         <div className="auth-buttons">
    //         <button className="login-btn" onClick={() => navigate("/login")}>
    //             Log In
    //         </button>
    //         <button className="signup-btn">Sign Up</button>
    //         </div>
    //     </header>

    //   <h1>Log In</h1>
    //   <form>
    //     <div className="form-group">
    //       <label htmlFor="email">Email:</label>
    //       <input type="email" id="email" name="email" required />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="password">Password:</label>
    //       <input type="password" id="password" name="password" required />
    //     </div>
    //     <button type="submit" className="login-btn">Log In</button>
    //   </form>

    //   <footer className="footer">
    //     <p>&copy; 2024 VoteApp. All rights reserved.</p>
    //   </footer>
    // </div>
<div className="login-page">
  <form class="form">
      <p class="title">Login </p>
      <p class="message">Signup now and get full access to our app. </p>
              
      <label>
          <input required="" placeholder="" type="email" class="input"/>
          <span>Email</span>
      </label> 
          
      <label>
          <input required="" placeholder="" type="password" class="input"/>
          <span>Password</span>
      </label>
      {/* <label>
          <input required="" placeholder="" type="password" class="input"/>
          <span>Confirm password</span>
      </label> */}
      <button class="submit">Submit</button>
      <p class="signin">Already have an acount ? <a href="#">Signin</a> </p>
  </form>
</div>
  );
};

export default LoginPage;
