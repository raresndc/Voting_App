import { ICredentials } from "models/Credentials";
import { useNavigate } from "react-router-dom"
import  './style/LoginStyle.css'
import { login } from "session/Session.ts";
import React, { useState } from "react";
import Swal from 'sweetalert2';


export default function LoginPage() {

  
  // LOGIN FORM --------------------------------------
  const [credentials, setCredentials] = useState<ICredentials>({username: "", password: ""})

  const navigate = useNavigate();

  async function loginForm() {
    try {
      if(!credentials.username || credentials.username === "" ||
      !credentials.password || credentials.password === ""
      ) {
          Swal.fire({icon: 'error', title: 'Error', text: 'Please insert username or password!', timer:5000})
          return;
      }
      
      await login(credentials.username, credentials.password);

      navigate("/dashboard/home");

    } catch (err) {
      Swal.fire({icon: 'error', title: 'Error', text: err});
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {

      loginForm();

    }
  }

const goToForgotPass = () => {
  navigate("/forgot-pass");
};

const goToRegister = () => {
  navigate("/register");
};

const [isFocused, setIsFocused] = useState(false);
const [hasContent, setHasContent] = useState(false);

const handleFocus = () => {
  setIsFocused(true);
};

const handleBlur = (e) => {
  if (e.target.value !== '') {
    setHasContent(true);
  } else {
    setIsFocused(false);
    setHasContent(false);
  }
};

  return(
    <>
    <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />

    <div className="center-container">
          <form className="formLog">
        <p className="titleLog">Welcome back! </p>
        <p className="messageLog">Log in to continue your journey with us. </p>            
        <label>
            <input required placeholder="" type="email" className="inputLog"
                    onChange={(e) => {setCredentials({...credentials, username: e.target.value})}}
                    onKeyPress={handleKeyPress}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
            />
            <span className={`spanLog ${isFocused || hasContent ? 'active' : ''}`}>Enter your username</span>
        </label> 
            
        <label>
            <input required placeholder="" type="password" className="inputLog"
                    onChange={(e) => {setCredentials({...credentials, password: e.target.value})}}
                    onKeyPress={handleKeyPress}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
            />
            <span className={`spanLog ${isFocused || hasContent ? 'active' : ''}`}>Enter your password</span>
        </label>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
          </div>
          <a onClick={goToForgotPass} className="text-blue-500 font-medium hover:underline" href="#"
            >Forgot Password?
          </a>
        </div>
        <button className="submitLog"  onClick={loginForm} >Login</button>
        <p className="signinLog">Don't have an account? <a onClick={goToRegister} href="#"> Sign Up</a> </p>
        </form>
        </div>
    </>
  )
}
