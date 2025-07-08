import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout    from './components/Layout';

import Dashboard from './pages/Dashboard';      
import Parties   from './pages/Parties';
import Candidates from './pages/Candidates';
import Upload    from './pages/DocumentUpload';
import Vote      from './pages/Vote';
import Stats     from './pages/Stats';
import Locations from './pages/Locations';
import Profile   from './pages/Profile';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parties"   element={<Parties />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/upload"    element={<Upload />} />
          <Route path="/vote"      element={<Vote />} />
          <Route path="/stats"     element={<Stats />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/profile"   element={<Profile />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;