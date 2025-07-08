// src/pages/Locations.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import { motion } from 'framer-motion';

// Helper to change map view when user location is obtained
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserPos([coords.latitude, coords.longitude]);
        },
        err => {
          console.warn('Geolocation error:', err);
          setError('Could not determine your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    if (!userPos) return;
    const [lat, lng] = userPos;
    const query = `
      [out:json][timeout:25];
      (
        node[\"amenity\"=\"school\"](around:5000,${lat},${lng});
        way[\"amenity\"=\"school\"](around:5000,${lat},${lng});
        relation[\"amenity\"=\"school\"](around:5000,${lat},${lng});
      );
      out center;
    `;
    axios
      .post(
        'https://overpass-api.de/api/interpreter',
        query,
        { headers: { 'Content-Type': 'text/plain' } }
      )
      .then(({ data }) => {
        const schools = data.elements.map(el => {
          const sLat = el.lat ?? el.center?.lat;
          const sLng = el.lon ?? el.center?.lon;
          return {
            id: el.id,
            name: el.tags?.name || 'Unnamed School',
            lat: sLat,
            lng: sLng,
          };
        });
        setLocations(schools);
      })
      .catch(err => console.error('OSM query failed', err));
  }, [userPos]);

  const defaultCenter = [45, 25];
  const mapCenter = userPos || defaultCenter;

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen text-white overflow-hidden">
      {/* Background Animations */}
      <motion.div
        className="absolute w-80 h-80 bg-white bg-opacity-10 rounded-full top-16 left-12"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-white bg-opacity-5 rounded-full bottom-12 right-12"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      <motion.h1
        className="z-10 text-4xl font-extrabold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Voting Locations
      </motion.h1>

      {error && <motion.p className="z-10 text-red-400 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.p>}

      <motion.div
        className="relative z-10 w-full max-w-4xl h-[500px] rounded-xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <MapContainer center={mapCenter} zoom={userPos ? 13 : 6} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {userPos && <ChangeView center={userPos} zoom={13} />}
          {userPos && (
            <Marker position={userPos}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          {locations.map(loc => (
            <Marker position={[loc.lat, loc.lng]} key={loc.id}>
              <Popup>
                <strong className="text-gray-900">{loc.name}</strong>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>
    </div>
  );
}
