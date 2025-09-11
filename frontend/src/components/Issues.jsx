import React, { useMemo, useState } from "react";
import data from "../data/issues.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// -------- Helpers --------
function formatDate(iso) {
  const d = new Date(iso);
  try {
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function statusPillClasses(status) {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "Processing":
      return "bg-violet-100 text-violet-700";
    case "Rejected":
    default:
      return "bg-rose-100 text-rose-700";
  }
}

function priorityTextClasses(priority) {
  switch (priority) {
    case "Highest":
      return "text-rose-600 font-bold";
    case "Medium":
      return "text-orange-600";
    case "Low":
    default:
      return "text-green-700";
  }
}

function makeSvgIcon(color = "#e11d48") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="48" viewBox="0 0 24 36">
      <path d="M12 0C7 0 3 4 3 9c0 7 9 20.6 9 20.6S21 16 21 9c0-5-4-9-9-9z" fill="${color}"/>
      <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
    </svg>`;
  return new L.Icon({
    iconUrl: "data:image/svg+xml;utf8," + encodeURIComponent(svg),
    iconSize: [34, 48],
    iconAnchor: [17, 48],
    popupAnchor: [0, -44],
  });
}

function priorityColor(priority) {
  if (!priority) return "#6b7280";
  const p = priority.toLowerCase();
  if (p === "highest") return "#dc2626";
  if (p === "medium") return "#f97316";
  return "#10b981";
}

// -------- Main Component --------
export default function Issues() {
  const { labels, rows } = data;
  const [showAll, setShowAll] = useState(false);

  const visibleRows = useMemo(
    () => (showAll ? rows : rows.slice(0, 5)),
    [rows, showAll]
  );

  // Find map center
  const center = useMemo(() => {
    const found = rows.find((r) => r.lat && r.lng);
    if (found) return [Number(found.lat), Number(found.lng)];
    return [23.3441, 85.3096]; // fallback (Ranchi, Jharkhand example)
  }, [rows]);

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
                <td className="px-6 py-4 font-medium text-gray-900">
                  {r.subject}
                </td>
                <td className="px-6 py-4 text-gray-700">{r.address}</td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(r.date)}
                </td>
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
                    <img
                      src="./doublearrow.svg"
                      alt="arrow"
                      className="w-4 h-4"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                      <div
                        style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}
                      >
                        Priority:{" "}
                        <span style={{ color }}>{r.priority ?? "—"}</span>
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
