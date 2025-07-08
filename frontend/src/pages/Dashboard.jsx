import React from 'react';
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const voteData = [
  { name: 'Jan', votes: 400 },
  { name: 'Feb', votes: 300 },
  { name: 'Mar', votes: 500 },
  { name: 'Apr', votes: 200 },
  { name: 'May', votes: 700 },
  { name: 'Jun', votes: 600 },
];

export default function Dashboard() {
  const verificationStatus = 'Pending';
  const upcomingElection = '2025 General Election';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to eVote Chain Dashboard</h1>
        <p className="text-gray-600">Secure, transparent, blockchain-based e-voting with advanced facial recognition verification.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
        {/* Identity Verification */}
        <motion.div whileHover={{ scale: 1.05 }} className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <h2 className="text-lg font-semibold">Identity Verification</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-grow">
              <img src="/images/id-face.jpg" alt="ID/Face" className="rounded-full mb-4 w-24 h-24 object-cover" />
              <p className="mb-2 text-gray-900">
                Status: <span className={`font-bold ${verificationStatus === 'Verified' ? 'text-green-600' : 'text-yellow-600'}`}>{verificationStatus}</span>
              </p>
              <Button size="sm" className="mt-2">View Details</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Election */}
        <motion.div whileHover={{ scale: 1.05 }} className="h-full">
          <Card className="h-full flex flex-col text-gray-900">
            <CardHeader>
              <h2 className="text-lg font-semibold ">Upcoming Election</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-grow">
              <p className="mb-4 text-center">{upcomingElection}</p>
              <Button size="sm">Learn More</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vote Statistics */}
        <motion.div whileHover={{ scale: 1.05 }} className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <h2 className="text-lg font-semibold">Vote Statistics</h2>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={voteData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="votes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blockchain Status */}
        <motion.div whileHover={{ scale: 1.05 }} className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <h2 className="text-lg font-semibold">Blockchain Status</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-grow">
              <img src="/images/blockchain-diagram.jpg" alt="Blockchain Diagram" className="mb-4 w-24 h-24 object-cover rounded-full" />
              <p className="text-sm text-gray-500 text-center">Network is healthy. All transactions are being recorded in real-time.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Get Started</h2>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-gray-900">
              <p>Ready to cast your vote? Click below to participate in the upcoming election securely.</p>
            </div>
            <Button size="lg">Cast Your Vote</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
