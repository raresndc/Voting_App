import { ICredentials } from "models/Credentials";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Avatar } from "@material-tailwind/react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { login } from "session/Session.ts";
import "./style/LoginStyle.css";

export default function AboutPage() {
  const [credentials, setCredentials] = useState<ICredentials>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  async function loginForm() {
    try {
      if (!credentials.username || !credentials.password) {
        Swal.fire({
          icon: "error",
          title: "Eroare",
          text: "Username and Password must be filled!",
        });
        return;
      }

      await login(credentials.username, credentials.password);
      navigate("/dashboard/home");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Eroare", text: err });
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      loginForm();
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl bg-white/90">
        <CardHeader className="flex justify-center pb-4 border-b">
          <Avatar
            src="/votingLogo.png"
            alt="Voting App Logo"
            size="xxl"
            className="shadow-lg"
          />
        </CardHeader>
        <CardBody className="text-center">
          <Typography variant="h4" color="blue-gray" className="font-semibold">
            Welcome to Voting App
          </Typography>
          <Typography color="blue-gray" className="mt-2 text-lg">
            A secure and transparent digital platform that allows users to
            cast their votes in elections using blockchain technology. 
            Ensuring integrity, anonymity, and tamper-proof results.
          </Typography>
        </CardBody>
        <div className="flex justify-center mt-6">
          <Button
            variant="gradient"
            color="indigo"
            size="lg"
            className="rounded-full px-6"
            onClick={() => navigate("/dashboard/home")}
          >
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
}
