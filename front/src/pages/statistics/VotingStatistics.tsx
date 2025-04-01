import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react';
import React, { Suspense, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Cell, Pie } from 'recharts';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
// import romaniaMap from "/romania.geojson";


const statistics = {
  candidates: [
    { name: "Marcel Ciolacu - PSD", total: 500, men: 300, women: 200 },
    { name: "Nicolae Ciucă - PNL", total: 400, men: 250, women: 150 },
    { name: "Nicușor Dan - IND", total: 300, men: 180, women: 120 }
  ],
candidateColors: {
    "Marcel Ciolacu - PSD": "#4CAF50", // Green for Candidate A
    "Nicolae Ciucă - PNL": "#FF5733", // Red for Candidate B
    "Nicușor Dan - IND": "#33B5FF", // Blue for Candidate C
  },
  voterTurnout: 68, // Percentage
  ageGroups: [
    { ageRange: "18-25", votes: 400, candidateVotes: { A: 30, B: 40, C: 30 } },
    { ageRange: "26-40", votes: 500, candidateVotes: { A: 50, B: 30, C: 20 } },
    { ageRange: "41-60", votes: 300, candidateVotes: { A: 40, B: 35, C: 25 } },
    { ageRange: "60+", votes: 200, candidateVotes: { A: 45, B: 30, C: 25 } }
  ],
  regions: [
    { region: "Arges", votes: 600 },
    { region: "Valcea", votes: 500 },
    { region: "Dolj", votes: 400 },
    { region: "Bucuresti", votes: 300 },
    { region: "Cluj", votes: 300 },
    { region: "Constanta", votes: 300 },
    { region: "Alba", votes: 250 },
    { region: "Bihor", votes: 350 },
    { region: "Bistrita-Nasaud", votes: 200 },
    { region: "Brasov", votes: 500 },
    { region: "Buzau", votes: 400 },
    { region: "Caras-Severin", votes: 250 },
    { region: "Calarasi", votes: 150 },
    { region: "Cluj", votes: 600 },
    { region: "Covasna", votes: 200 },
    { region: "Dambovita", votes: 350 },
    { region: "Galati", votes: 550 },
    { region: "Giurgiu", votes: 300 },
    { region: "Gorj", votes: 400 },
    { region: "Harghita", votes: 150 },
    { region: "Hunedoara", votes: 500 },
    { region: "Ialomita", votes: 250 },
    { region: "Iasi", votes: 550 },
    { region: "Ilfov", votes: 700 },
    { region: "Maramures", votes: 450 },
    { region: "Mehedinti", votes: 350 },
    { region: "Mures", votes: 400 },
    { region: "Neamt", votes: 300 },
    { region: "Olt", votes: 350 },
    { region: "Prahova", votes: 600 },
    { region: "Salaj", votes: 200 },
    { region: "Sibiu", votes: 550 },
    { region: "Suceava", votes: 450 },
    { region: "Teleorman", votes: 500 },
    { region: "Timis", votes: 600 },
    { region: "Tulcea", votes: 300 },
    { region: "Vaslui", votes: 250 },
    { region: "Valcea", votes: 400 },
    { region: "Vrancea", votes: 350 }
  ],
  
  districts: {
    "Arges": 500,
    "Valcea": 400,
    "Dolj": 350,
    "Bucuresti": 700,
    "Cluj": 600,
    "Constanta": 550,
    "Alba": 250,
    "Bihor": 350,
    "Bistrita-Nasaud": 200,
    "Brasov": 500,
    "Buzau": 400,
    "Caras-Severin": 250,
    "Calarasi": 150,
    "Covasna": 200,
    "Dambovita": 350,
    "Galati": 550,
    "Giurgiu": 300,
    "Gorj": 400,
    "Harghita": 150,
    "Hunedoara": 500,
    "Ialomita": 250,
    "Iasi": 550,
    "Ilfov": 700,
    "Maramures": 450,
    "Mehedinti": 350,
    "Mures": 400,
    "Neamt": 300,
    "Olt": 350,
    "Prahova": 600,
    "Salaj": 200,
    "Sibiu": 550,
    "Suceava": 450,
    "Teleorman": 500,
    "Timis": 600,
    "Tulcea": 300,
    "Vaslui": 250,
    "Vrancea": 350
  }
  
  
};

const totalVotes = statistics.candidates.reduce((acc, c) => acc + c.total, 0);
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const mapCenter: LatLngExpression = [45.9432, 24.9668]; // Coordinates for Romania
  const mapZoom = 6; // Initial zoom level for Romania
  
  // Import Romania GeoJSON map file from the public folder
  const romaniaMap = "/romania.geojson";

export default function VotingStatistics() {

  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    // Fetch the Romania GeoJSON data
    fetch(romaniaMap)
      .then(response => response.json())
      .then(data => setGeoJsonData(data));
  }, []);

  // Function to style the districts based on voting data
  const style = (feature: any) => {
    const districtName = feature.properties.name;
    const votes = statistics.districts[districtName] || 0;
    
    // Color the district based on the number of votes
    const color = votes > 600 ? "#ff5733" : votes > 400 ? "#ffbd33" : "#33ff57";
    
    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };



  return (


<div className="mt-12 mb-8 flex flex-col gap-12">
<Card>
  <CardHeader
    variant="gradient"
    color="indigo"
    className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
  >
    <Typography variant="h6" color="white">
    Voting Statistics
    </Typography>
  </CardHeader>
  <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">


  <div className="p-6 space-y-6">

      
      {/* Candidate Votes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statistics.candidates.map((candidate, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{candidate.name}</h2>
            <p>Total Votes: {candidate.total}</p>
            <p>Men Votes: {candidate.men}</p>
            <p>Women Votes: {candidate.women}</p>
            <p>Vote Share: {((candidate.total / totalVotes) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
      
      {/* Poll Bar Chart */}
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Poll Results</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statistics.candidates}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" name="Total Votes" />
            <Bar dataKey="men" fill="#82ca9d" name="Men Votes" />
            <Bar dataKey="women" fill="#ffc658" name="Women Votes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Voter Turnout */}
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Voter Turnout</h2>
        <p>{statistics.voterTurnout}% of registered voters participated.</p>
      </div>
      
      {/* Horizontal Bar Chart - Candidates Comparison */}
      <div className="p-6  border rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Candidates Performance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart layout="vertical" data={statistics.candidates} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <XAxis type="number" tick={{ fill: '#4B5563' }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#4B5563' }} />
            <Tooltip cursor={{ fill: 'rgba(75, 85, 99, 0.2)' }} />
            <Legend />
            <Bar dataKey="total" fill="#4CAF50" name="Total Votes" barSize={20} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      
      {/* Gender Voting Percentage */}
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Gender Voting Breakdown</h2>
        <p>Men: {Math.round((statistics.candidates.reduce((acc, c) => acc + c.men, 0) / statistics.candidates.reduce((acc, c) => acc + c.total, 0)) * 100)}%</p>
        <p>Women: {Math.round((statistics.candidates.reduce((acc, c) => acc + c.women, 0) / statistics.candidates.reduce((acc, c) => acc + c.total, 0)) * 100)}%</p>
      </div>
      
      {/* Age Group Distribution */}
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Age Group Voting Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={statistics.ageGroups} dataKey="votes" nameKey="ageRange" outerRadius={100} fill="#8884d8">
              {statistics.ageGroups.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Age Group Voting Proportion */}
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Age Group Voting Preferences</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statistics.ageGroups}>
            <XAxis dataKey="ageRange" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="candidateVotes.A" fill="#8884d8" name="Marcel Ciolacu - PSD"/>
            <Bar dataKey="candidateVotes.B" fill="#82ca9d" name="Nicolae Ciucă - PNL" />
            <Bar dataKey="candidateVotes.C" fill="#ffc658" name="Nicușor Dan - IND" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Geographical Voting Breakdown */}
      <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Votes by Region</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statistics.regions}>
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" fill="#708090" name="Total Votes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

            {/* Geographical Voting Breakdown */}
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Voting Statistics - Geographical Breakdown</h1>

              {/* Leaflet map */}
              {geoJsonData ? (
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ width: '100%', height: '500px' }}>
                  {/* Tile Layer - default OpenStreetMap tiles */}
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* GeoJSON layer */}
                  
                  <GeoJSON
  data={geoJsonData}
  style={style}
  onEachFeature={(feature, layer) => {
    const districtName = feature.properties.name;
    const votes = statistics.districts[districtName] || 0;
    layer.bindPopup(`<b>${districtName}</b><br>Votes: ${votes}`);
  }}
/>

                </MapContainer>
              ) : (
                <div>Loading map...</div>
              )}
            </div>


    </div>
    
  </CardBody>
</Card>
</div>













  );
}

