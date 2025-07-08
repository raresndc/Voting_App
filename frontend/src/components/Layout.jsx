// src/components/Layout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
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
          className="block p-4 text-2xl font-bold hover:bg-gray-700"
        >
          E‑Vote
        </Link>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg hover:bg-gray-700 transition ${
                  isActive ? "bg-gray-700" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Attribution */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 text-sm text-white/60 z-10 ml-4"
      >
        Made by E‑Vote Team
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <header className="flex justify-end items-center bg-gray-100 shadow px-6 py-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/profile")}
            className="mr-4 text-gray-800 hover:underline"
          >
            View Profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </motion.button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-auto flex-1 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
