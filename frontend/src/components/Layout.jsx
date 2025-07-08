// src/components/Layout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Sidebar links
const links = [
  { to: '/parties',    label: 'Political Parties' },
  { to: '/candidates', label: 'Candidates' },
  { to: '/upload',     label: 'Document Upload' },
  { to: '/vote',       label: 'Vote' },
  { to: '/stats',      label: 'Statistics' },
  { to: '/locations',  label: 'Physical Voting Locations' },
];

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');       // back to welcome
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <Link to="/dashboard" className="block p-4 text-xl font-bold hover:bg-gray-700">
          E-Vote
        </Link>
        <nav className="flex-1 px-2 space-y-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? 'bg-gray-700' : ''
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center bg-white shadow px-4 py-2">
          <button
            className="mr-4 text-gray-700 hover:underline"
            onClick={() => navigate('/profile')}
          >
            View Profile
          </button>
          <button
            className="text-red-600 hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="p-4 overflow-auto flex-1 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
