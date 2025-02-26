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

export default function LoginPage() {

  const [credentials, setCredentials] = useState<ICredentials>({username: "", password: ""})

  const navigate = useNavigate();

  async function loginForm() {
    try {
      if(!credentials.username || credentials.username === "" ||
      !credentials.password || credentials.password === ""
      ) {
          Swal.fire({icon: 'error', title: 'Eroare', text: 'Trebuie completate username si password!'})
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

  const navigateRegister = () => {
    navigate("/register")
  }
  const navigateForgot= () => {
    navigate("/forgotPass")
  }

  const navigateAbout= () => {
    navigate("/about")
  }

  return(
    <>
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      <div className="container mx-auto p-4" style={{justifyContent:'center', justifyItems:'center', marginTop:'10%'}}>
        <form className="form">
            <p className="title">Welcome back! </p>
            <p className="message">Log in to continue your journey with us. </p>     
            <label>
                <input required placeholder="" type="email" className="input"/>
                <span>Enter your username</span>
            </label> 
                
            <label>
                <input required placeholder="" type="password" className="input"/>
                <span>Enter your password</span>
            </label>
            <p className="forgotpass cursor-pointer"> <a onClick={navigateForgot}>Forgot password?</a> </p>
            <button className="submit">Login</button>
            <p className="signin  cursor-pointer">Don't have an account? <a onClick={navigateRegister}>Sign Up</a> </p>
            {/* <p className="signin">You want to know more about us? </p> */}
            <p className="signin  cursor-pointer"> Visit the page <a onClick={navigateAbout}>About</a> for more informations </p>
           
        </form>
      </div>
    </>
  )
}
