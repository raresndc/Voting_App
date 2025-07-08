// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/auth';
import { useUser } from '../context/UserContext';
import { UserCircle } from 'lucide-react';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        clearUser();
        navigate('/login');
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/images/logo_vote.svg" alt="E-Vote Logo" className="h-16 w-auto" />
      </div>

      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <UserCircle className="h-16 w-16 text-blue-600" />
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">{user.firstName} {user.lastName}</h1>
          <p className="text-gray-500">Member since: <span className="font-medium">{new Date(user.dateOfBirth).getFullYear()}</span></p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <p className="text-gray-600"><span className="font-semibold">Age:</span> {user.age}</p>
          <p className="text-gray-600"><span className="font-semibold">Citizenship:</span> {user.citizenship}</p>
          <p className="text-gray-600"><span className="font-semibold">Date of Birth:</span> {user.dateOfBirth}</p>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600"><span className="font-semibold">Gender:</span> {user.gender}</p>
          <p className="text-gray-600"><span className="font-semibold">ID Series:</span> {user.idSeries}</p>
          <p className="text-gray-600"><span className="font-semibold">Verified:</span> {user.verified ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/2fa-setup')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Setup 2FA
        </button>
      </div>
    </div>
  );
}
