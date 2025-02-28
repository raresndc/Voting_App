import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Dashboard } from 'layout/Dashboard.tsx';
import GlobalState from 'session/GlobalState.ts';
import { checkToken, isAuthenticated, readSessionFromCookies } from 'session/Session.ts';
import LoginPage from 'pages/auth/LoginPage.tsx';
import HomePage from 'pages/home/HomePage.tsx';
import Register from 'pages/auth/Register.tsx';
import Register2 from 'pages/auth/Register2.tsx';
import Register3 from 'pages/auth/Register3.tsx';
import ForgotPass from 'pages/auth/ForgotPass.tsx';
import ForgotPass2 from 'pages/auth/ForgotPass2.tsx';
import ForgotPass3 from 'pages/auth/ForgotPass3.tsx';
import AboutPage from 'pages/auth/AboutPage.tsx';
import LandingPage from 'pages/landing/LandingPage.tsx';

const app = observer(() => {

  GlobalState.setNavigate(useNavigate());
  GlobalState.setLocation(useLocation());

  useEffect(() => {
    setInterval(() => {
      readSessionFromCookies();
        if(isAuthenticated()) {
          checkToken();
        }
    }, 1000 * 20)
  }, [])

  return <>
    <Routes>
      {
        !isAuthenticated() ? 
        <>
          <Route path="/*" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/step2" element={<Register2 />} />
          <Route path="/register/step3" element={<Register3 />} />
          <Route path="/forgotPass" element={<ForgotPass />} />
          <Route path="/forgotPass/step2" element={<ForgotPass2 />} />
          <Route path="/forgotPass/step3" element={<ForgotPass3 />} />
          <Route path="/about" element={<AboutPage />} />
        </>
          :
        <>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/*" element={<Dashboard />} />
        </>
      }
      
    </Routes>
  </>
})

export default app;
