import React, { useEffect, useState } from 'react';
import { listParties } from '../api/parties';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';  // <--- import UserContext

export default function Parties() {
  const [parties, setParties] = useState([]);
  const { user } = useUser(); // <-- get current user

  useEffect(() => {
    listParties()
      .then(res => setParties(res.data))
      .catch(err => console.error('load parties failed', err));
  }, []);

  // Filtering logic: if Super User, show only assigned party
  const displayedParties = React.useMemo(() => {
    if (user?.role === 'ROLE_SUPER_USER' && user.politicalParty) {
      // Try to match by party name (assuming that's unique)
      return parties.filter(
        p => p.name === user.politicalParty
      );
    }
    return parties;
  }, [user, parties]);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* ...your animated background and heading... */}
      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {displayedParties.map((p, idx) => (
          <motion.div
            key={p.id || idx}
            className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 flex flex-col items-center text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            {/* ...card content... */}
            {p.logoUrl && (
              <img
                src={p.logoUrl}
                alt={p.name}
                className="h-20 w-auto mb-4 rounded-full border-2 border-white"
              />
            )}
            <h2 className="text-2xl font-semibold mb-2 text-white drop-shadow-md">{p.name}</h2>
            {p.description && (
              <p className="text-white/80 text-sm text-center">{p.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
