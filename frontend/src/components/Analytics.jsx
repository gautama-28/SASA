import React from 'react'

function Analytics() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-16 pt-6 pb-3">
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
    </div>
  )
}

export default Analytics