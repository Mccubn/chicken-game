import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api';

// Coordinates for bars on South Broadway, Denver (approx.)
const bars = [
  { name: 'Bar 1', position: { lat: 39.7123, lng: -104.9887 } },
  { name: 'Bar 2', position: { lat: 39.7095, lng: -104.9871 } },
  { name: 'Bar 3', position: { lat: 39.7071, lng: -104.9860 } },
];

// Define play area boundary polygon (approx rectangular area)
const areaCoords = [
  { lat: 39.7140, lng: -104.9905 },
  { lat: 39.7140, lng: -104.9840 },
  { lat: 39.7060, lng: -104.9840 },
  { lat: 39.7060, lng: -104.9905 },
];

const containerStyle = {
  width: '100%',
  height: '100%',
};

const GameMap = ({ photos, role, uploadPhoto }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  });
  const [map, setMap] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const handleBarClick = (bar) => {
    setSelectedBar(bar);
  };

  const handlePhotoUpload = (e) => {
    if (!selectedBar) return;
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('barName', selectedBar.name);
      formData.append('lat', selectedBar.position.lat);
      formData.append('lng', selectedBar.position.lng);
      uploadPhoto(formData);
      e.target.value = null;
    }
  };

  if (loadError) return (
    <div className="card" style={{ textAlign: 'center', margin: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
      <h3 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>Map Error</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Unable to load the game map</p>
    </div>
  );
  
  if (!isLoaded) return (
    <div className="card" style={{ textAlign: 'center', margin: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Loading Map</h3>
      <div className="loading-dots" style={{ color: 'var(--text-secondary)' }}>Initializing</div>
    </div>
  );

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 39.7095, lng: -104.9880 }}
        zoom={15}
        onLoad={onMapLoad}
      >
        {/* Play area boundary */}
        <Polygon
          paths={areaCoords}
          options={{
            fillColor: '#FF0000',
            fillOpacity: 0.05,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
        {/* Bars markers */}
        {bars.map((bar, idx) => (
          <Marker
            key={idx}
            position={bar.position}
            label={bar.name}
            onClick={() => handleBarClick(bar)}
          />
        ))}
        {/* Photos markers */}
        {photos.map((p, idx) => (
          <Marker key={`photo-${idx}`} position={{ lat: p.lat, lng: p.lng }} icon={{ url: p.url, scaledSize: new window.google.maps.Size(32, 32) }} />
        ))}
      </GoogleMap>
      {role !== 'chicken' && selectedBar && (
        <div className="card" style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          left: '1rem', 
          maxWidth: '300px',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1rem'
            }}>
              📸
            </div>
            <div>
              <h4 style={{ 
                margin: 0, 
                color: 'var(--text-primary)', 
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {selectedBar.name}
              </h4>
              <p style={{ 
                margin: 0, 
                color: 'var(--text-secondary)', 
                fontSize: '0.75rem' 
              }}>
                Upload drink photo
              </p>
            </div>
          </div>
          
          <label className="btn btn-secondary" style={{ 
            width: '100%', 
            textAlign: 'center',
            cursor: 'pointer',
            display: 'block'
          }}>
            📁 Choose Photo
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default GameMap;