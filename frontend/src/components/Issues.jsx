import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ----------------- Helpers -----------------
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short", 
      year: "numeric"
    });
  } catch {
    return iso;
  }
};

const priorityTextClasses = (priority) => {
  switch (priority) {
    case "Highest":
      return "text-red-700 font-semibold";
    case "High":
      return "text-orange-700";
    case "Medium":
      return "text-yellow-700";
    case "Low":
      return "text-green-700";
    default:
      return "text-gray-700";
  }
};

const statusPillClasses = (status) => {
  switch (status) {
    case "Processing":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "Completed":
      return "border-green-200 bg-green-50 text-green-700";
    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
};

const priorityColor = (priority) => {
  switch (priority) {
    case "Highest":
      return "#EF4444"; // red
    case "High":
      return "#F59E0B"; // orange
    case "Medium":
      return "#FBBF24"; // yellow
    case "Low":
      return "#10B981"; // green
    default:
      return "#6B7280"; // gray
  }
};

// Creates a custom SVG icon for Leaflet
const makeSvgIcon = (color) =>
  L.divIcon({
    className: "",
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="#000" stroke-width="1"/>
      </svg>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

// ----------------- Main Component -----------------
export default function Issues() {
  const [data, setData] = useState({ labels: {}, rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:5000/api/issues");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching issues:", err);
        setError(err.message);
        setData({ 
          labels: { 
            id: "ID", 
            subject: "Subject", 
            address: "Address", 
            date: "Date", 
            priority: "Priority", 
            status: "Status" 
          }, 
          rows: [] 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const issues = useMemo(() => data.rows || [], [data]);
  const displayed = useMemo(() => 
    showAll ? issues : issues.slice(0, 6), 
    [issues, showAll]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-lg font-medium text-red-800 mb-2">Error Loading Issues</p>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-8 lg:px-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Municipal <span className="text-blue-600">Issues</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track and monitor all reported municipal issues across the city.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['Total', 'Processing', 'Completed', 'Rejected'].map((label) => {
          const count = label === 'Total' 
            ? issues.length
            : issues.filter(issue => issue.status === label).length;
          
          return (
            <div key={label} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="text-2xl font-bold text-blue-600">{count}</div>
              <div className="text-gray-600">{label} Issues</div>
            </div>
          );
        })}
      </div>

      {/* Map */}
      {issues.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Issues Map</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[23.3441, 85.3096]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issues
                .filter(issue => issue.lat && issue.lng)
                .map((issue) => (
                  <Marker
                    key={issue.id}
                    position={[issue.lat, issue.lng]}
                    icon={makeSvgIcon(priorityColor(issue.priority))}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">{issue.subject}</h3>
                        <p className="text-sm text-gray-600 mb-2">{issue.address}</p>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${priorityTextClasses(issue.priority)}`}>
                            {issue.priority} Priority
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${statusPillClasses(issue.status)}`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(issue.date)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Issues List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Issues</h2>
        
        {issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No issues found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {displayed.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{issue.subject}</h3>
                      <p className="text-gray-600">{issue.address}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm border ${statusPillClasses(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className={`font-medium ${priorityTextClasses(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>
                    <span className="text-gray-500">
                      ID: {issue.id} • {formatDate(issue.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {issues.length > 6 && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showAll ? 'Show Less' : `Show All (${issues.length} total)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
