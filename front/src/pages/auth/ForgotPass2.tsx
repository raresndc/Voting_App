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

export default function ForgotPass2() {

  const [credentials, setCredentials] = useState<ICredentials>({username: "", password: ""})

  const navigate = useNavigate();

    // State to store OTP values
    const [otp, setOtp] = useState<string[]>(new Array(9).fill(""));
  
    // Function to update OTP state
    const handleOtpChange = (index: number, value: string) => {
      // Only allow numbers (0-9)
      if (!/^\d?$/.test(value)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Input",
          text: "Please enter only a number.",
        });
        return;
      }

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Move to the next input field automatically when a digit is entered
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    };

    const isOtpComplete = otp.every((digit) => digit !== "");

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

  
  const navigateForgot3 = (e) => {
    e.preventDefault();

    if (!isOtpComplete) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please complete the OTP before proceeding!",
      });
      return;
    }

    navigate("/forgotPass/step3")
  }


  return(
    <>
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      <div className="container mx-auto p-4" style={{justifyContent:'center', justifyItems:'center', marginTop:'10%'}}> 
          <form className="otp-Form">
          
            <span className="mainHeading">Enter OTP</span>
            <p className="otpSubheading">We have sent a verification code to your email</p>
            <div className="inputContainer">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-input${index}`}
                maxLength={1}
                type="text"
                className="otp-input text-center"
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onFocus={(e) => e.target.select()} // Select input value on focus
              />
            ))}
          </div>
            <button className="verifyButton" type="submit" onClick={navigateForgot3}>Next step</button>
              <button className="exitBtn">×</button>
              {/* <p className="resendNote">Didn't receive the code? <button className="resendBtn">Resend Code</button></p> */}
              
          </form>
      </div>
    </>
  )
}
