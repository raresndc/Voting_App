import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register2() {
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

  // Check if all OTP fields are filled
  const isOtpComplete = otp.every((digit) => digit !== "");

  const navigateStep3 = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isOtpComplete) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please complete the OTP before proceeding!",
      });
      return;
    }

    navigate("/register/step3");
  };

  return (
    <>
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <form className="otp-Form">
          <span className="mainHeading">Enter OTP</span>
          <p className="otpSubheading">
            We have sent a verification code to your email
          </p>
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
          <button
            className={`verifyButton ${!isOtpComplete ? "opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            onClick={navigateStep3}
            disabled={!isOtpComplete}
          >
            Next Step
          </button>
          <button className="exitBtn">×</button>
          <p className="resendNote">
            Didn't receive the code?{" "}
            <button className="resendBtn">Resend Code</button>
          </p>
        </form>
      </div>
    </>
  );
}
