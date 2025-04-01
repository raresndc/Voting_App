import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Dashboard } from 'layout/Dashboard.tsx';
import GlobalState from 'session/GlobalState.ts';
import { checkToken, isAuthenticated, readSessionFromCookies } from 'session/Session.ts';
import LoginPage from 'pages/auth/LoginPage.tsx';
import HomePage from 'pages/home/HomePage.tsx';

import MapPage from 'pages/map/MapPage';
import AddUserDocument from 'pages/document/AddUserDocument.tsx';
import ForgotPassword from 'pages/auth/ForgotPassword.tsx';
import Register from 'pages/auth/Register.tsx';



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
          <Route path="/*" element={<LoginPage />} />
        </>
          :
          
        <>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/*" element={<Dashboard />} />
          
        </>
      }
      <Route path="/forgot-pass" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />

    </Routes>

    {/* <ScreenauploadColumnprocessed/> */}
  </>
})

export default app;
