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

export default function ForgotPass3() {

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

  const navigateLogin = () => {
    navigate("/*")
  }



  return(
    <>
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      <div className="container mx-auto p-4" style={{justifyContent:'center', justifyItems:'center', marginTop:'10%'}}>
          <form className="form">
              <p className="title">Restore password </p>
              <p className="message">Enter your new password below. </p>        
              <label>
                  <input required placeholder="" type="password" className="input"/>
                  <span>Password</span>
              </label>
              <label>
                  <input required placeholder="" type="password" className="input"/>
                  <span>Confirm password</span>
              </label>
              <button className="submit">Restore password</button>
              {/* <p className="signin">Already have an acount ? <a onClick={navigateLogin}>Signin</a> </p> */}
          </form>
      </div>
    </>
  )
}
