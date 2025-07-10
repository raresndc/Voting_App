// src/pages/Dashboard.jsx
import React from 'react';
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useUser } from "../context/UserContext";

const voteData = [
  { name: 'Jan', votes: 400 },
  { name: 'Feb', votes: 300 },
  { name: 'Mar', votes: 500 },
  { name: 'Apr', votes: 200 },
  { name: 'May', votes: 700 },
  { name: 'Jun', votes: 600 },
];

export default function Dashboard() {
  const { user } = useUser();

  const verificationStatus = user?.identityVerification ? 'Verified' : 'Pending Verification';
  const upcomingElection = '2025 General Election';

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Background Accent Circles */}
      <motion.div
        className="absolute w-96 h-96 bg-white bg-opacity-10 rounded-full top-16 left-12"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-white bg-opacity-5 rounded-full bottom-12 right-12"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      {/* Welcome Section */}
      <motion.div
        className="z-10 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold mb-2">Welcome to eVote Chain Dashboard</h1>
        <p className="text-lg text-white/80">
          Secure, transparent, blockchain-based e-voting with advanced facial recognition verification.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Identity Verification */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Card className="h-full bg-white bg-opacity-20 backdrop-blur-lg text-gray-900">
            <CardHeader>
              <h2 className="text-lg font-semibold">Identity Verification</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <img src="/images/id-face.jpg" alt="ID/Face" className="rounded-full mb-4 w-24 h-24 object-cover border-4 border-white" />
              <p className="mb-2">
                Status: <span className={`font-bold ${verificationStatus === 'Verified' ? 'text-green-400' : 'text-yellow-400'}`}>{verificationStatus}</span>
              </p>
              <Button size="sm" className="mt-2">View Details</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Election */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Card className="h-full bg-white bg-opacity-20 backdrop-blur-lg text-gray-900">
            <CardHeader>
              <h2 className="text-lg font-semibold">Upcoming Election</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <p className="mb-4 text-indigo-400 font-medium">{upcomingElection}</p>
              <Button size="sm">Learn More</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vote Statistics */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Card className="h-full bg-white bg-opacity-20 backdrop-blur-lg text-gray-900">
            <CardHeader>
              <h2 className="text-lg font-semibold">Vote Statistics</h2>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={voteData}>
                  <XAxis dataKey="name" tick={{ fill: '#FFF', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#FFF' }} />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blockchain Status */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Card className="h-full bg-white bg-opacity-20 backdrop-blur-lg text-gray-900">
            <CardHeader>
              <h2 className="text-lg font-semibold">Blockchain Status</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <img src="/images/blockchain-diagram.jpg" alt="Blockchain Diagram" className="mb-4 w-24 h-24 object-cover rounded-full border-4 border-white" />
              <p className="text-sm text-white/80 text-center">Network is healthy. All transactions are being recorded in real-time.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="relative z-10 mt-10 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Card className="bg-white bg-opacity-20 backdrop-blur-lg text-gray-900">
          <CardHeader>
            <h2 className="text-xl font-semibold">Get Started</h2>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-white">
              <p>Ready to cast your vote? Click below to participate in the upcoming election securely.</p>
            </div>
            <Button size="lg">Cast Your Vote</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
