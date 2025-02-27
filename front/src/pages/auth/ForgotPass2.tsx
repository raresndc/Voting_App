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

  
  const navigateForgot3 = () => {
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
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input1"/>
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input2"/>
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input3"/>
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input4"/> 
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input5"/> 
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input6"/> 
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input7"/> 
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input8"/> 
            <input required="required" maxlength="1" type="text" className="otp-input" id="otp-input9"/> 
            
            </div>
            <button className="verifyButton" type="submit" onClick={navigateForgot3}>Next step</button>
              <button className="exitBtn">×</button>
              {/* <p className="resendNote">Didn't receive the code? <button className="resendBtn">Resend Code</button></p> */}
              
          </form>



      </div>
    </>
  )
}
