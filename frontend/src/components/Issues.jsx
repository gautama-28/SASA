import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ----------------- Helpers -----------------
const formatDate = (iso) => new Date(iso).toLocaleDateString();

const priorityTextClasses = (priority) => {
  switch (priority) {
    case "Highest":
      return "text-red-700";
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
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/issues");
        console.log("Fetched issues:", res.data); // debugging
        setData(res.data);
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const { labels, rows } = data;

  const visibleRows = useMemo(
    () => (showAll ? rows : rows.slice(0, 5)),
    [rows, showAll]
  );

  const center = useMemo(() => {
    const found = rows.find((r) => r.lat && r.lng);
    if (found) return [Number(found.lat), Number(found.lng)];
    return [23.3441, 85.3096]; // fallback to Ranchi
  }, [rows]);

  if (loading) return <p className="text-center py-10">Loading issues...</p>;

  return (
    <section className="w-full mt-6 px-4 sm:px-8 lg:px-16 space-y-8">
      {/* ---------- Table ---------- */}
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-orange-600 to-orange-500 shadow-md">
            <tr>
              {Object.values(labels).map((label, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r, idx) => (
              <tr
                key={`${r.id}-${idx}`}
                className="border-b border-gray-200 odd:bg-gray-50 hover:bg-orange-50 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-gray-800">{r.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{r.subject}</td>
                <td className="px-6 py-4 text-gray-700">{r.address}</td>
                <td className="px-6 py-4 text-gray-600">{formatDate(r.date)}</td>
                <td className={`px-6 py-4 ${priorityTextClasses(r.priority)}`}>
                  <span className="inline-block rounded-lg border px-2 py-1 text-xs">
                    {r.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium border ${statusPillClasses(
                      r.status
                    )}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    View Report
                    <img src="./doublearrow.svg" alt="arrow" className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length > 5 && (
          <div className="p-4 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          </div>
        )}
      </div>

      {/* ---------- Map ---------- */}
      <div className="py-2">
        <h2 className="text-lg font-bold text-gray-900">Issue Heatmap</h2>
        <p className="text-sm text-gray-600">
          Explore reported issues across the city at a glance.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="relative w-full" style={{ height: "420px" }}>
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            className="rounded-b-xl z-0"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {rows.map((r, idx) => {
              if (!r.lat || !r.lng) return null;
              const pos = [Number(r.lat), Number(r.lng)];
              const color = priorityColor(r.priority);
              const icon = makeSvgIcon(color);
              return (
                <Marker key={`${r.id ?? idx}`} position={pos} icon={icon}>
                  <Popup>
                    <div style={{ minWidth: 160 }}>
                      <strong style={{ display: "block", marginBottom: 6 }}>
                        {r.subject}
                      </strong>
                      <div style={{ fontSize: 13, color: "#374151" }}>
                        {r.address}
                      </div>
                      <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
                        Priority: <span style={{ color }}>{r.priority ?? "—"}</span>
                        <br />
                        Status: {r.status ?? "—"}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
