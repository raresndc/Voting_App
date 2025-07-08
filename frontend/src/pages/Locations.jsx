import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

export default function Locations() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('/api/votes/locations').then(res => setLocations(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Voting Locations</h1>
      <MapContainer center={[45, 25]} zoom={6} className="h-96">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map(loc => (
          <Marker position={[loc.lat, loc.lng]} key={loc.id}>
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
)}