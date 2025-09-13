import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG marker generator
function makeSvgIcon(color = '#e11d48') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="48" viewBox="0 0 24 36">
      <path d="M12 0C7 0 3 4 3 9c0 7 9 20.6 9 20.6S21 16 21 9c0-5-4-9-9-9z" fill="${color}"/>
      <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
    </svg>`;
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
    iconSize: [34, 48],
    iconAnchor: [17, 48],
    popupAnchor: [0, -44]
  });
}

// Priority color mapping
const priorityColor = (p) => {
  if (!p) return '#6b7280';
  const s = String(p).toLowerCase();
  if (s === 'highest') return '#dc2626'; // red
  if (s === 'high') return '#f97316'; // orange  
  if (s === 'medium') return '#f59e0b'; // amber
  if (s === 'low') return '#10b981'; // green
  return '#3b82f6'; // default blue
};

// Format date helper
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return iso;
  }
};

export default function IssuesMap({ reportsProp }) {
  const [issuesData, setIssuesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch issues from backend API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/issues');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setIssuesData(result.rows || []);
      } catch (err) {
        console.error('Error fetching issues for map:', err);
        setError(err.message);
        setIssuesData([]);
      } finally {
        setLoading(false);
      }
    };

    // Use prop data if provided, otherwise fetch from API
    if (Array.isArray(reportsProp) && reportsProp.length > 0) {
      setIssuesData(reportsProp);
      setLoading(false);
    } else {
      fetchIssues();
    }
  }, [reportsProp]);

  // Get map center from first report with coordinates
  const center = useMemo(() => {
    const found = issuesData.find(r => r.lat != null && r.lng != null);
    if (found) return [Number(found.lat), Number(found.lng)];
    return [23.3441, 85.3096]; // Default center (Ranchi)
  }, [issuesData]);

  // Filter reports that have valid coordinates
  const reportsWithCoords = useMemo(() => {
    return issuesData.filter(report => 
      report.lat != null && 
      report.lng != null && 
      !isNaN(Number(report.lat)) && 
      !isNaN(Number(report.lng))
    );
  }, [issuesData]);

  if (loading) {
    return (
      <div className="rounded-lg shadow-md overflow-hidden bg-gray-100 flex items-center justify-center" style={{ minHeight: 420 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg shadow-md overflow-hidden bg-red-50 border border-red-200 flex items-center justify-center" style={{ minHeight: 420 }}>
        <div className="text-center p-6">
          <p className="text-red-800 font-medium mb-2">Error loading map</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md overflow-hidden" style={{ minHeight: 420 }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reportsWithCoords.map((report) => (
          <Marker
            key={report.id}
            position={[Number(report.lat), Number(report.lng)]}
            icon={makeSvgIcon(priorityColor(report.priority))}
          >
            <Popup>
              <div className="min-w-[200px] p-2">
                <h3 className="font-semibold text-base mb-2 text-gray-900">
                  {report.subject || 'Issue'}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>Address:</strong> {report.address || 'No address'}
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Priority:</strong> 
                    <span className={`ml-1 font-medium ${
                      report.priority === 'Highest' ? 'text-red-600' :
                      report.priority === 'High' ? 'text-orange-600' :
                      report.priority === 'Medium' ? 'text-yellow-600' :
                      report.priority === 'Low' ? 'text-green-600' : 
                      'text-gray-600'
                    }`}>
                      {report.priority || 'Unknown'}
                    </span>
                  </p>
                  
                  <p className="text-gray-700">
                    <strong>Status:</strong> 
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      report.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status || 'Unknown'}
                    </span>
                  </p>
                  
                  {report.date && (
                    <p className="text-gray-600 text-xs">
                      <strong>Date:</strong> {formatDate(report.date)}
                    </p>
                  )}
                  
                  <p className="text-gray-500 text-xs">
                    <strong>ID:</strong> {report.id}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {reportsWithCoords.length === 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <p className="text-gray-600 text-center">
            No issues with location data found
          </p>
        </div>
      )}
    </div>
  );
}
