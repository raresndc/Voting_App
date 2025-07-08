import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';

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
    // Request browser geolocation
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

  // Fetch nearby schools via Overpass once we have userPos
  useEffect(() => {
    if (!userPos) return;
    const [lat, lng] = userPos;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="school"](around:5000,${lat},${lng});
        way["amenity"="school"](around:5000,${lat},${lng});
        relation["amenity"="school"](around:5000,${lat},${lng});
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

  // Default center if geolocation not available yet
  const defaultCenter = [45, 25];
  const mapCenter = userPos || defaultCenter;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Voting Locations</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <MapContainer center={mapCenter} zoom={userPos ? 13 : 6} className="h-96 rounded-lg">
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
              <strong>{loc.name}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
