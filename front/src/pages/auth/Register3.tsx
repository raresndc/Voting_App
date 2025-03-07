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

export default function Register3() {

  const [credentials, setCredentials] = useState<ICredentials>({username: "", password: ""})

  const [cnp, setCnp] = useState("");
  const isValidCnp = /^\d{13}$/.test(cnp);

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

  const navigateLogin = (e) => {
    // e.preventDefault();

    // if(!isValidCnp) {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Error',
    //     text: 'CNP must be exactly 13 digits!'
    //   });
    //   return;
    // }


    navigate("/*")
  }



  return(
    <>
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      <div className="container mx-auto p-4" style={{justifyContent:'center', justifyItems:'center', marginTop:'10%'}}>
          <form className="form">
              <p className="title">Register </p>
              <p className="message">Signup now and get full access to our app. </p>
                  <div className="flex">
                  <label>
                      <input required placeholder="" type="text" className="input"/>
                      <span>Firstname</span>
                  </label>

                  <label>
                      <input required placeholder="" type="text" className="input"/>
                      <span>Lastname</span>
                  </label>
              </div>  
              <label>
                  <input required placeholder="" type="text" className="input"/>
                  <span>CNP</span>
              </label> 
                  
              <label>
                  <input required placeholder="" type="password" className="input"/>
                  <span>Password</span>
              </label>
              <label>
                  <input required placeholder="" type="password" className="input"/>
                  <span>Confirm password</span>
              </label>

              {/* <button
            className={`submit ${!isValidCnp ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            onClick={navigateLogin}
            disabled={!isValidCnp}
          >
            Next Step
          </button> */}
              <button className="submit">Submit</button>
              <p className="signin  cursor-pointer">Already have an acount ? <a onClick={navigateLogin}>Signin</a> </p>
          </form>
      </div>
    </>
  )
}


// verify

// import { ICredentials } from "models/Credentials";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import './style/LoginStyle.css';

// export default function Register3() {
//   const [credentials, setCredentials] = useState<ICredentials>({ username: "", password: "" });
//   const [cnp, setCnp] = useState("");
//   const [cnpError, setCnpError] = useState("");
//   const navigate = useNavigate();

//   // Function to check if CNP is valid (exactly 13 digits)
//   const validateCnp = (value: string) => {
//     if (!/^\d{13}$/.test(value)) {
//       setCnpError("CNP must be exactly 13 digits.");
//       return false;
//     }
//     setCnpError("");
//     return true;
//   };

//   // Handle CNP input change
//   const handleCnpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCnp(value);
//     validateCnp(value); // Validate as user types
//   };

//   // Handle form submission
//   const navigateNextStep = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateCnp(cnp)) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "CNP must be exactly 13 digits!",
//       });
//       return;
//     }

//     // Proceed to the next step
//     navigate("/*");
//   };

//   return (
//     <>
//       <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
//       <div className="container mx-auto p-4" style={{ justifyContent: "center", justifyItems: "center", marginTop: "10%" }}>
//         <form className="form" onSubmit={navigateNextStep}>
//           <p className="title">Register</p>
//           <p className="message">Signup now and get full access to our app.</p>
//           <div className="flex">
//             <label>
//               <input required placeholder="" type="text" className="input" />
//               <span>Firstname</span>
//             </label>

//             <label>
//               <input required placeholder="" type="text" className="input" />
//               <span>Lastname</span>
//             </label>
//           </div>
//           <label>
//             <input
//               required
//               placeholder=""
//               type="text"
//               className="input"
//               value={cnp}
//               onChange={handleCnpChange}
//             />
//             <span>CNP</span>
//             {cnpError && <p className="error-message">{cnpError}</p>} {/* Show error message */}
//           </label>

//           <label>
//             <input required placeholder="" type="password" className="input" />
//             <span>Password</span>
//           </label>
//           <label>
//             <input required placeholder="" type="password" className="input" />
//             <span>Confirm password</span>
//           </label>

//           <button
//             className={`submit ${cnpError ? "opacity-50 cursor-not-allowed" : ""}`}
//             type="submit"
//             disabled={!!cnpError}
//           >
//             Next Step
//           </button>

//           <p className="signin cursor-pointer">
//             Already have an account? <a onClick={navigateNextStep}>Signin</a>
//           </p>
//         </form>
//       </div>
//     </>
//   );
// }

