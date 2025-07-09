import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Parties from './pages/Parties';
import Candidates from './pages/Candidates';
import AddCandidate from './pages/AddCandidate';
import EditCandidate from './pages/EditCandidate'; 
import Upload from './pages/DocumentUpload';
import Vote from './pages/Vote';
import Stats from './pages/Stats';
import Locations from './pages/Locations';
import Profile from './pages/Profile';
import TwoFASetup from './pages/2FA';
import { UserProvider, useUser } from './context/UserContext';
import { getProfile } from './api/auth';

function AppInner() {
  console.log('🚀 AppInner rendered');

  const { setUser, clearUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProfile()
      .then(res => setUser(res.data))
      .catch(() => {
        clearUser();
        const publicPaths = ['/', '/login', '/register'];
        if (!publicPaths.includes(location.pathname)) {
          navigate('/');
        }
      });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parties" element={<Parties />} />
          <Route path="/candidates" element={<Candidates />} />
          {/* <Route path="/candidates/:id" element={<CandidateProfile />} /> */}
          <Route path="/candidates/add" element={<AddCandidate />} />
          <Route path="/candidates/edit/:id" element={<EditCandidate />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/2fa-setup" element={<TwoFASetup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppInner />
    </UserProvider>
  );
}
