import React, { useEffect, useMemo, useRef, useState } from 'react'

function Analytics() {
  // Dropdown state and outside-click handling
  const [csvMenuOpen, setCsvMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setCsvMenuOpen(false)
      }
    }
    function onEsc(e) {
      if (e.key === 'Escape') setCsvMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  // Sample reports data (replace with real data when backend is ready)
  const reports = useMemo(
    () => [
      { id: 1001, title: 'Pothole near Main St', category: 'Road', status: 'Open', createdAt: '2025-09-10T10:12:00Z' },
      { id: 1002, title: 'Streetlight not working', category: 'Utilities', status: 'In Progress', createdAt: '2025-09-04T18:45:00Z' },
      { id: 1003, title: 'Overflowing trash bin', category: 'Sanitation', status: 'Resolved', createdAt: '2025-08-28T07:30:00Z' },
      { id: 1004, title: 'Water leakage report', category: 'Utilities', status: 'Open', createdAt: '2025-09-01T12:20:00Z' },
      { id: 1005, title: 'Broken bench in park', category: 'Parks', status: 'Resolved', createdAt: '2025-09-08T09:00:00Z' },
    ],
    []
  )

  function isWithinLastDays(dateISO, days) {
    const d = new Date(dateISO)
    const now = new Date()
    const ms = days * 24 * 60 * 60 * 1000
    return now - d <= ms
  }

  function isWithinThisMonth(dateISO) {
    const d = new Date(dateISO)
    const now = new Date()
    return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth()
  }

  function toCSV(rows) {
    if (!rows || rows.length === 0) return 'id,title,category,status,createdAt\n'
    const headers = Object.keys(rows[0])
    const escape = (v) => {
      if (v == null) return ''
      const s = String(v)
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
      return s
    }
    const lines = [headers.join(',')]
    for (const r of rows) {
      lines.push(headers.map((h) => escape(r[h])).join(','))
    }
    return lines.join('\n') + '\n'
  }

  function downloadCSV(rows, filename) {
    const csv = toCSV(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleExport(range) {
    let filtered = reports
    const nowStr = new Date().toISOString().slice(0, 10)
    switch (range) {
      case '7d':
        filtered = reports.filter((r) => isWithinLastDays(r.createdAt, 7))
        downloadCSV(filtered, `reports_last_7_days_${nowStr}.csv`)
        break
      case '30d':
        filtered = reports.filter((r) => isWithinLastDays(r.createdAt, 30))
        downloadCSV(filtered, `reports_last_30_days_${nowStr}.csv`)
        break
      case 'month':
        filtered = reports.filter((r) => isWithinThisMonth(r.createdAt))
        downloadCSV(filtered, `reports_this_month_${nowStr}.csv`)
        break
      default:
        downloadCSV(filtered, `reports_all_${nowStr}.csv`)
    }
    setCsvMenuOpen(false)
  }

  return (
    <div className="">
  <header className="flex items-center justify-between px-16 pt-4 pb-2">
        {/* Left: Title and subtitle */}
        <div>
          <h1 className="font-ubuntu text-xl font-black text-gray-900 md:text-2xl">
            Admin Dashboard
          </h1>
          <p className="font-lato text-sm text-gray-500">
            Manage civic reports and community engagement
          </p>
        </div>

        {/* Right: Admin profile with hover dropdown */}
        <div className="relative group">
          {/* Profile summary */}
          <div className="flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-gray-50 cursor-pointer">
            {/* Avatar (initials) */}
            <div className="grid h-10 w-10 place-content-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xs font-semibold text-white shadow-sm">
              MR
            </div>

            {/* Name + role */}
            <div className="hidden text-right sm:block">
              <div className="text-sm font-medium text-gray-900">Moni Roy</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>

            {/* Caret */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 text-gray-500 transition-transform group-hover:rotate-180"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Dropdown */}
          <div className="pointer-events-none absolute right-0 z-20 mt-2 w-40 origin-top-right scale-95 rounded-lg border border-gray-100 bg-white p-1 opacity-0 shadow-lg ring-1 ring-black/5 transition-all duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto">
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-gray-400 group-hover:text-red-500"
                aria-hidden="true"
              >
                <path d="M16 17a1 1 0 110 2H7a3 3 0 01-3-3V8a3 3 0 013-3h9a1 1 0 110 2H7a1 1 0 00-1 1v8a1 1 0 001 1h9z" />
                <path d="M20.707 11.293l-3-3a1 1 0 10-1.414 1.414L17.586 11H11a1 1 0 100 2h6.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* KPI section: 3/4 width, compact cards */}
      <section className="w-3/4 px-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Reports */}
          <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="absolute right-3 top-3 grid h-8 w-8 place-content-center rounded-full bg-indigo-50">
              <img src="/totalReport.svg" alt="Total Reports" className="h-12 w-12" />
            </div>
            <p className="font-lato text-[11px] text-gray-500">Total Reports</p>
            <div className="font-ubuntu text-xl font-bold text-gray-900">40,689</div>
            <div className="mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-emerald-600"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75V14a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zm0 0l3.5 3.5a.75.75 0 11-1.06 1.06L10 5.06 7.56 7.56a.75.75 0 11-1.06-1.06L10 3z" clipRule="evenodd"/></svg>
              <span className="text-[11px] font-medium text-emerald-600">8.5% Up</span>
              <span className="text-[11px] text-gray-400">from yesterday</span>
            </div>
          </div>

          {/* Active Issues */}
          <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="absolute right-3 top-3 grid h-8 w-8 place-content-center rounded-full bg-yellow-50">
              <img src="/ActiveIssue.svg" alt="Active Issues" className="h-12 w-12" />
            </div>
            <p className="font-lato text-[11px] text-gray-500">Active Issues</p>
            <div className="font-ubuntu text-xl font-bold text-gray-900">10,293</div>
            <div className="mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-emerald-600"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75V14a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zm0 0l3.5 3.5a.75.75 0 11-1.06 1.06L10 5.06 7.56 7.56a.75.75 0 11-1.06-1.06L10 3z" clipRule="evenodd"/></svg>
              <span className="text-[11px] font-medium text-emerald-600">1.3% Up</span>
              <span className="text-[11px] text-gray-400">from past week</span>
            </div>
          </div>

          {/* Total Solved */}
          <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="absolute right-3 top-3 grid h-8 w-8 place-content-center rounded-full bg-green-50">
              <img src="/TotalSolved.svg" alt="Total Solved" className="h-12 w-12" />
            </div>
            <p className="font-lato text-[11px] text-gray-500">Total Solved</p>
            <div className="font-ubuntu text-xl font-bold text-gray-900">$89,000</div>
            <div className="mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 rotate-180 text-rose-600"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75V14a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zm0 0l3.5 3.5a.75.75 0 11-1.06 1.06L10 5.06 7.56 7.56a.75.75 0 11-1.06-1.06L10 3z" clipRule="evenodd"/></svg>
              <span className="text-[11px] font-medium text-rose-600">4.3% Down</span>
              <span className="text-[11px] text-gray-400">from yesterday</span>
            </div>
          </div>

          {/* Pending Issues */}
          <div className="relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="absolute right-3 top-3 grid h-8 w-8 place-content-center rounded-full bg-orange-50">
              <img src="/PendingIssue.svg" alt="Pending Issues" className="h-12 w-12" />
            </div>
            <p className="font-lato text-[11px] text-gray-500">Pending Issues</p>
            <div className="font-ubuntu text-xl font-bold text-gray-900">2,040</div>
            <div className="mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 text-emerald-600"><path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75V14a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3zm0 0l3.5 3.5a.75.75 0 11-1.06 1.06L10 5.06 7.56 7.56a.75.75 0 11-1.06-1.06L10 3z" clipRule="evenodd"/></svg>
              <span className="text-[11px] font-medium text-emerald-600">1.8% Up</span>
              <span className="text-[11px] text-gray-400">from yesterday</span>
            </div>
          </div>
        </div>
      </section>

      {/* View Reports header with CSV download dropdown */}
  <section className="mt-6 w-full px-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-ubuntu text-lg font-bold text-gray-900">View Reports</h2>
            <p className="font-lato text-sm text-gray-500">Monitor and manage civic issue reports</p>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setCsvMenuOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={csvMenuOpen}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Download CSV
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-4 w-4 transition-transform ${csvMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {csvMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5"
              >
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Export Range
                </div>
                <button
                  role="menuitem"
                  onClick={() => handleExport('all')}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  All reports
                  <span className="text-[10px] text-gray-400">CSV</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleExport('7d')}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Last 7 days
                  <span className="text-[10px] text-gray-400">CSV</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleExport('30d')}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Last 30 days
                  <span className="text-[10px] text-gray-400">CSV</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => handleExport('month')}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  This month
                  <span className="text-[10px] text-gray-400">CSV</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Analytics