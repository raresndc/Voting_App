import { ICredentials } from "models/Credentials";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"
import GlobalState from "session/GlobalState.ts";
import Swal from 'sweetalert2';
import { useMaterialTailwindController } from "context/index.tsx";
import { Avatar } from "@material-tailwind/react";

import  './style/LoginStyle.css'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { login } from "session/Session.ts";
import Sidebar from "layout/Sidebar";
import routes from "routes/SidebarRoutes";

export default function ForgotPass() {

  const [credentials, setCredentials] = useState<ICredentials>({username: "", password: ""})

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function loginForm() {
    try {
      if(!credentials.username || credentials.username === "" ||
      !credentials.password || credentials.password === ""
      ) {
          Swal.fire({icon: 'error', title: 'Error', text: 'Username and Password must be completed!'})
          return;
      }
      
      await login(credentials.username, credentials.password);

      navigate("/dashboard/home");

    } catch (err) {
      Swal.fire({icon: 'error', title: 'Eroare', text: err});
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      loginForm();
    }
  }

  const navigateLogin = () => {
    navigate("/*")
  }

  
  const navigateForgot2 = (e) => {
    e.preventDefault();
        if(!email.trim()) {
          Swal.fire({
            icon: 'error', 
            title: 'Error', 
            text: 'Email field cannot be empty!'
          });
          return;
        } else if(!isValidEmail(email)) {
          Swal.fire({
            icon: 'error', 
            title: 'Error', 
            text: "Email field isn't valid!"
          });
          return;
        }

        navigate("/forgotPass/step2")
  }


  return(
    <>
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      <div className="container mx-auto p-4" style={{justifyContent:'center', justifyItems:'center', marginTop:'10%'}}>
            <form className="form">
                <p className="title">Restore password</p>
                <p className="message">Enter your email to restore your password </p> 
                <p className="message"> </p>
                <label>
            <input
              required
              placeholder=""
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </label>
                <button
            className={`submit ${!email.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={navigateForgot2}
            disabled={!email.trim()} // Disable if empty
          >
            Next Step
          </button> 
                {/* <button className="submit" onClick={navigateForgot2}>Next step</button> */}
                {/* <p className="signin">Already have an acount ? <a onClick={navigateLogin}>Signin</a> </p> */}
            </form>
      </div>
    </>
  )
}
