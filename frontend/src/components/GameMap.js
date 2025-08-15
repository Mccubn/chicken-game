import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Polygon, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

// Default center for South Broadway, Denver
const DEFAULT_CENTER = { lat: 39.7095, lng: -104.9880 };

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
    libraries: ['places'],
  });
  
  const [map, setMap] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);
  const [bars, setBars] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [loadingBars, setLoadingBars] = useState(false);
  const [loadingDirections, setLoadingDirections] = useState(false);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    // Search for bars in the area after map loads
    searchNearbyBars();
  }, []);

  // Search for nearby bars using Google Places API
  const searchNearbyBars = useCallback(async () => {
    if (!map || !window.google) return;
    
    setLoadingBars(true);
    try {
      const service = new window.google.maps.places.PlacesService(map);
      
      const request = {
        location: DEFAULT_CENTER,
        radius: 2000, // 2km radius
        type: ['bar', 'night_club', 'restaurant'],
        keyword: 'bar'
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const barData = results.slice(0, 10).map(place => ({
            id: place.place_id,
            name: place.name,
            position: place.geometry.location,
            rating: place.rating,
            address: place.vicinity,
            openNow: place.opening_hours?.open_now,
            photos: place.photos
          }));
          setBars(barData);
        } else {
          console.error('Places API error:', status);
          // Fallback to default bars if API fails
          setBars([
            { id: '1', name: 'Bar 1', position: { lat: 39.7123, lng: -104.9887 } },
            { id: '2', name: 'Bar 2', position: { lat: 39.7095, lng: -104.9871 } },
            { id: '3', name: 'Bar 3', position: { lat: 39.7071, lng: -104.9860 } },
          ]);
        }
        setLoadingBars(false);
      });
    } catch (error) {
      console.error('Error searching bars:', error);
      setLoadingBars(false);
    }
  }, [map]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          return location;
        },
        (error) => {
          console.error('Error getting location:', error);
          return null;
        }
      );
    }
  }, []);

  // Get directions to selected bar
  const getDirections = useCallback(async (destination) => {
    if (!userLocation || !window.google) return;
    
    setLoadingDirections(true);
    try {
      const directionsService = new window.google.maps.DirectionsService();
      
      const request = {
        origin: userLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.WALKING
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Directions error:', status);
        }
        setLoadingDirections(false);
      });
    } catch (error) {
      console.error('Error getting directions:', error);
      setLoadingDirections(false);
    }
  }, [userLocation]);

  const handleBarClick = (bar) => {
    setSelectedBar(bar);
    // Clear previous directions
    setDirections(null);
    
    // Get user location and directions if not already set
    if (!userLocation) {
      getUserLocation().then(location => {
        if (location) {
          getDirections(bar.position);
        }
      });
    } else {
      getDirections(bar.position);
    }
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
      {/* Top Controls */}
      <div style={{ 
        position: 'absolute', 
        top: '1rem', 
        left: '1rem', 
        zIndex: 1000,
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button 
          className="btn btn-secondary"
          onClick={searchNearbyBars}
          disabled={loadingBars}
          style={{ 
            fontSize: '0.8rem',
            padding: '0.5rem 1rem'
          }}
        >
          {loadingBars ? '🔍 Searching...' : '🔍 Find Bars'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={getUserLocation}
          style={{ 
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, var(--accent), #0891b2)'
          }}
        >
          📍 My Location
        </button>
      </div>

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
        
        {/* Directions */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3b82f6',
                strokeWeight: 4,
                strokeOpacity: 0.8
              }
            }}
          />
        )}
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(24, 24),
              anchor: new window.google.maps.Point(12, 12)
            }}
          />
        )}
      </GoogleMap>
      {selectedBar && (
        <div className="card" style={{ 
          position: 'absolute', 
          bottom: '1rem', 
          left: '1rem', 
          maxWidth: '350px',
          boxShadow: 'var(--shadow-xl)'
        }}>
          {/* Bar Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem'
            }}>
              🍺
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                margin: '0 0 0.25rem 0', 
                color: 'var(--text-primary)', 
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {selectedBar.name}
              </h4>
              {selectedBar.address && (
                <p style={{ 
                  margin: 0, 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.8rem' 
                }}>
                  📍 {selectedBar.address}
                </p>
              )}
              {selectedBar.rating && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  marginTop: '0.25rem'
                }}>
                  <span style={{ color: 'var(--warning)' }}>⭐</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {selectedBar.rating}/5
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Directions Info */}
          {directions && (
            <div style={{ 
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🚶‍♂️</span>
                <span style={{ 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}>
                  Walking Directions
                </span>
              </div>
              {directions.routes[0]?.legs[0] && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div>⏱️ {directions.routes[0].legs[0].duration?.text}</div>
                  <div>📏 {directions.routes[0].legs[0].distance?.text}</div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {role !== 'chicken' && (
              <label className="btn btn-secondary" style={{ 
                flex: 1,
                textAlign: 'center',
                cursor: 'pointer',
                display: 'block',
                fontSize: '0.8rem',
                padding: '0.5rem'
              }}>
                📁 Upload Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }}
                />
              </label>
            )}
            
            <button 
              className="btn"
              onClick={() => getUserLocation()}
              style={{ 
                flex: 1,
                fontSize: '0.8rem',
                padding: '0.5rem',
                background: 'linear-gradient(135deg, var(--success), #059669)'
              }}
            >
              📍 Get Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMap;