// src/components/IssuesMap.jsx
import React, { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import data from '../data/issues.json' // your issues.json file

// 🔹 Custom SVG marker generator
function makeSvgIcon(color = '#e11d48') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="48" viewBox="0 0 24 36">
      <path d="M12 0C7 0 3 4 3 9c0 7 9 20.6 9 20.6S21 16 21 9c0-5-4-9-9-9z" fill="${color}"/>
      <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
    </svg>`
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg),
    iconSize: [34, 48],
    iconAnchor: [17, 48],
    popupAnchor: [0, -44]
  })
}

// 🔹 Priority color mapping
const priorityColor = (p) => {
  if (!p) return '#6b7280'
  const s = String(p).toLowerCase()
  if (s === 'highest') return '#dc2626' // red
  if (s === 'medium') return '#f97316' // orange
  if (s === 'low') return '#10b981' // green
  return '#3b82f6' // default blue
}

export default function IssuesMap({ reportsProp }) {
  // Prefer props, fallback to local JSON
  const reports = useMemo(() => {
    if (Array.isArray(reportsProp)) return reportsProp
    if (data && data.rows) return data.rows
    if (Array.isArray(data)) return data
    return []
  }, [reportsProp])

  // Default map center = first report with lat/lng
  const center = useMemo(() => {
    const found = reports.find(r => r.lat != null && r.lng != null)
    if (found) return [Number(found.lat), Number(found.lng)]
    return [23.3441, 85.3096] // fallback center
  }, [reports])

  return (
    <div className="rounded-lg shadow-md overflow-hidden" style={{ minHeight: 300 }}>
      <MapContainer center={center} zoom={13} style={{ height: '420px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((r, idx) => {
          if (!r || r.lat == null || r.lng == null) return null
          const position = [Number(r.lat), Number(r.lng)]
          const color = priorityColor(r.priority)
          const icon = makeSvgIcon(color)

          return (
            <Marker key={r.id ?? idx} position={position} icon={icon}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong style={{ display: 'block', marginBottom: 6 }}>
                    {r.subject ?? r.title}
                  </strong>
                  <div style={{ fontSize: 13, color: '#374151' }}>{r.address}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>
                    Priority:{' '}
                    <span style={{ color, fontWeight: 600 }}>{r.priority ?? '—'}</span>
                    <br />
                    Status: {r.status ?? '—'}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
