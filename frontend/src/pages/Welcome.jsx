import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6 text-black">Welcome to Voting App</h1>
      <p className="mb-8 text-gray-600 max-w-md text-center">
        Secure, transparent, and user-friendly voting platform.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Log In</Link>
        <Link to="/register" className="px-6 py-2 bg-green-600 text-white rounded-lg">Register</Link>
      </div>
    </div>
  );
}