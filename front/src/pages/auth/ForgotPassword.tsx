import { useNavigate, useParams } from "react-router-dom"
import  './style/ForgotPasswordStyle.css'
import React, { useState } from "react";
import Swal from 'sweetalert2';

export default function ForgotPassword() {

  const navigate = useNavigate();

  const goToLogIn = () => {
    navigate("/register");
  };

  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const forgotPass = async (event) => {
    const raw = JSON.stringify({
      "username": username
    });

    const requestOptions = {
      method: "POST",
      body: raw,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        }, 
    };

    fetch("https://localhost:80/forgotPassword", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error('Error:', error));
      // Swal.fire({icon: 'success', title: 'Success', text: 'Password reset successfully!', timer: 1500});
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
        
      });
      Toast.fire({
        icon: "success",
        title: "Signed in successfully"
      }).then(() => {

      navigate("/sign-up");
      });
  };

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
      <form className="formForgot">
    <p className="titleForgot">Forgot Password </p>
    <p className="messageForgot">Forgot your password? No worries, reset it here. </p>
            
    <label>
        <input required placeholder="" type="text" className="inputForgot"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleInputChange} value={username}
        />
        <span className={`spanForgot ${isFocused || hasContent ? 'active' : ''}`}>Enter your username</span>
    </label> 


    <button className="submitForgot" onClick={forgotPass}>Generate password</button>
    <p className="signinForgot">Don't have an account? <a onClick={goToLogIn} href="#">Sign up now</a> </p>
    </form>
    </div>
    </>
  )
}
