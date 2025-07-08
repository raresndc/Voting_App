import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import { useUser } from '../context/UserContext';

export default function LogoutButton() {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const handleLogout = () => {
    logoutUser().finally(() => {
      clearUser();
      navigate('/login');
    });
  };

  return (
    <button
      className="text-red-600 hover:underline"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}