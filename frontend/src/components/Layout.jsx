// src/components/Layout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";

// Sidebar links
const links = [
  { to: "/parties", label: "Political Parties" },
  { to: "/candidates", label: "Candidates" },
  { to: "/upload", label: "Document Upload" },
  { to: "/vote", label: "Vote" },
  { to: "/stats", label: "Statistics" },
  { to: "/locations", label: "Physical Voting Locations" },
];

export default function Layout() {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearUser();
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Link
          to="/dashboard"
          className="block p-4 text-xl font-bold hover:bg-gray-700"
        >
          E-Vote
        </Link>
        <nav className="flex-1 px-2 space-y-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 text-sm text-white/80 z-10"
      >
        <span>Made by E-Vote Team</span>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center bg-white shadow px-4 py-2">
          <button
            className="mr-4 text-gray-700 hover:underline"
            onClick={() => navigate("/profile")}
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
