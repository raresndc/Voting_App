import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/auth/username').then(res => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>2FA Enabled:</strong> {user.twoFaEnabled ? 'Yes' : 'No'}</p>
        <p><strong>Verified:</strong> {user.verified ? 'Yes' : 'No'}</p>
      </div>
      <button
        onClick={() => navigate('/2fa-setup')}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Setup 2FA
      </button>
    </div>
)}