import React, { useEffect, useState, Component, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css"

import MarkerClusterGroup from "@christopherpickering/react-leaflet-markercluster";
import {
  GeoSearchControl,
  OpenStreetMapProvider
} from "leaflet-geosearch";

import "../map/style/MapStyle.css";

import "leaflet-geosearch/dist/geosearch.css";

import { Circle, Icon } from "leaflet";
import { Polyline, LayersControl } from "react-leaflet";
import L from "leaflet";
import { DevicePhoneMobileIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { LocateControl } from "./LocateControl.tsx";


const MarkerIcon = new Icon({
  iconUrl: '/marker_2.png',
  iconSize: [50, 50]
});

const listData = [
  {
    id: 1,
    text: "International School of Bucharest",
    lng: 26.1677,
    lat: 44.4678,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Șoseaua Gării Cățelu nr. 1R, Bucharest, Sector 3"
  },
  {
    id: 2,
    text: "British School of Bucharest",
    lng: 26.0833,
    lat: 44.5000,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Strada Erou Iancu Nicolae 55, Voluntari 077190"
  },
  {
    id: 3,
    text: "American International School of Bucharest",
    lng: 26.0944,
    lat: 44.4856,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Șoseaua Pipera-Tunari 196, Voluntari 077190"
  },
  {
    id: 4,
    text: "Cambridge School of Bucharest",
    lng: 26.0667,
    lat: 44.4667,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Strada Agronomiei 21, Bucharest 021585"
  },
  {
    id: 5,
    text: "Bucharest Christian Academy",
    lng: 26.1000,
    lat: 44.4667,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Strada Erou Iancu Nicolae 55, Voluntari 077190"
  },
  {
    id: 6,
    text: "SEK Bucharest International School",
    lng: 26.0833,
    lat: 44.4500,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Bulevardul Dacia 99, Bucharest 030167"
  },
  {
    id: 7,
    text: "Verita International School",
    lng: 26.1000,
    lat: 44.4833,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Strada Mareșal Alexandru Averescu 14-18, Bucharest 011455"
  },
  {
    id: 8,
    text: "Hermann Oberth International German School",
    lng: 26.0833,
    lat: 44.4667,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Strada Mareșal Alexandru Averescu 14-18, Bucharest 011455"
  },
  {
    id: 9,
    text: "French International School of Bucharest (EFI Bucarest)",
    lng: 26.1000,
    lat: 44.4500,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Bulevardul Dacia 99, Bucharest 030167"
  },
  {
    id: 10,
    text: "Bucharest-Beirut International School",
    lng: 26.0667,
    lat: 44.4333,
    phone: "Phone No: +40 21 202 2300",
    location: "Address: Strada Agronomiei 21, Bucharest 021585"
  }
];


export default function MapPage() {

  const { BaseLayer, LayerGroup } = LayersControl;

  const [map, setMap] = useState(null);
  // const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(listData[0] || {});

  const mapRef = useRef(null);

  useEffect(() => {
    // Check if the map is available before using it
    if (mapRef.current) {
      console.log("Map object:", mapRef.current);
    } else {
      console.error('Map not available');
    }
  }, [mapRef.current]); // Dependency array ensures the effect runs when mapRef changes

  const handleDropdownChange = (event) => {
    const selectedId = event.target.value;
    const selectedLocation = listData.find(location => location.id === parseInt(selectedId));
    setSelectedLocation(selectedLocation || {});

    // Handle map-related logic if needed
    if (mapRef.current && selectedLocation) {
      console.log("Latitude:", selectedLocation.lat);
      console.log("Longitude:", selectedLocation.lng);
      console.log("Current zoom level:", mapRef.current.getZoom());
      mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 17);
    }
  };

  return (
    <>
      <div className="card-map">
        <div id="map">
          <MapContainer
            style={{ height: '100%', borderRadius: 'inherit' }}
            center={[44.434194, 26.093602]}
            zoom={12}
            maxZoom={18}
            ref={mapRef}
          >
            <LocateControl position="topleft"/>

            <SearchField apiKey={""} />
            <LayersControl position="topleft" >
              <BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </BaseLayer>

              <BaseLayer name="Google Map" >
                <TileLayer
                  attribution="&copy; Google Maps"
                  url="https://mt0.google.com/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"

                />
              </BaseLayer>

              <BaseLayer name="Google Map traffic" >
                <TileLayer
                  attribution="&copy; Google Maps"
                  url="https://mt0.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}"
                />
              </BaseLayer>

              <BaseLayer name="Google Map Sattelite Hybrid">
                <TileLayer url="https://mt0.google.com/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
              </BaseLayer>

            </LayersControl>



            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 1000 }}>
                <select className="select-hospital" onChange={handleDropdownChange} value={selectedLocation.id || ""}   >
                  <option value="" disabled>Select a location</option>
                  {listData.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.text}
                    </option>
                  ))}

                </select>
              </div>
            </div>



            {selectedLocation && (
              <Marker
                position={[selectedLocation.lat, selectedLocation.lng]}
                icon={MarkerIcon}
              >
                <Popup>
                  <div style={{ fontWeight: 'bold' }}>{selectedLocation.text}</div>
                  <div>{selectedLocation.phone}</div>
                  <div>{selectedLocation.location}</div>
                  <a
                    href={`https://waze.com/ul?ll=${selectedLocation.lat},${selectedLocation.lng}&navigate=yes`}
                    target="_blank"
                    rel="noopener noreferrer" // Add rel attribute for security
                  >
                    Open in Waze
                  </a>
                </Popup>
              </Marker>
            )}

            <MarkerClusterGroup>
              {CreatePoint(100).map(({ x, y }, index) => (
                <Marker key={index} position={[y, x]} icon={MarkerIcon}>
                  <Popup>
                    <b>
                      座標-{y} ，{x}
                    </b>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>

          </MapContainer>
        </div>
      </div>


    </>

  );
}


function CreatePoint(count) {
  let arr = [];
  for (let i = 0; i < count; i++) {
    let longitude = Math.random() * (120.5 - 121.4) + 121.4;
    let latitude = Math.random() * (23 - 24.6) + 24.6;
    arr.push({ x: longitude, y: latitude });
  }
  arr.push({ x: 121.5145955, y: 25.0461928 });
  console.log(arr);
  return arr;
}

const SearchField = ({ apiKey }) => {
  const provider = new OpenStreetMapProvider();

  const searchControl = new GeoSearchControl({
    provider: provider,
    style: "button"
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};
