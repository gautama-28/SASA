import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiFilter,
  FiChevronDown,
  FiSearch,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiUser,
  FiArrowUpRight,
} from "react-icons/fi";
import { RxReset } from "react-icons/rx";
import data from "../data/issues.json";
import details from "../data/reportDetails.json";

// ---- Helpers ----
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
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Processing":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "Rejected":
    default:
      return "bg-rose-100 text-rose-700 border-rose-200";
  }
}

function priorityTextClasses(priority) {
  switch (priority) {
    case "Highest":
      return "text-rose-600 font-semibold";
    case "Medium":
      return "text-orange-600";
    case "Low":
    default:
      return "text-green-700";
  }
}

// Date filter helpers
const isWithinLastDays = (iso, days) => {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const span = days * 24 * 60 * 60 * 1000;
  return now - d <= span;
};
const isWithinThisMonth = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
};
const isWithinThisYear = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear();
};

export default function Reports() {
  const { labels, rows } = data;

  // Filters and search
  const [dateRange, setDateRange] = useState("all"); // all | 7 | 30 | month | year
  const [priority, setPriority] = useState("all"); // all | Highest | Medium | Low
  const [status, setStatus] = useState("all"); // all | Completed | Processing | Rejected
  const [q, setQ] = useState("");

  // Pagination
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = rows;

    // Date filter
    if (dateRange !== "all") {
      if (dateRange === "7")
        list = list.filter((r) => isWithinLastDays(r.date, 7));
      else if (dateRange === "30")
        list = list.filter((r) => isWithinLastDays(r.date, 30));
      else if (dateRange === "month")
        list = list.filter((r) => isWithinThisMonth(r.date));
      else if (dateRange === "year")
        list = list.filter((r) => isWithinThisYear(r.date));
    }

    // Priority
    if (priority !== "all")
      list = list.filter(
        (r) => (r.priority ?? "").toLowerCase() === priority.toLowerCase()
      );

    // Status
    if (status !== "all")
      list = list.filter(
        (r) => (r.status ?? "").toLowerCase() === status.toLowerCase()
      );

    // Search
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.id ?? "").toLowerCase().includes(needle) ||
          (r.subject ?? "").toLowerCase().includes(needle) ||
          (r.address ?? "").toLowerCase().includes(needle)
      );
    }

    // Sort by date desc for consistency
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [rows, dateRange, priority, status, q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const pageRows = filtered.slice(start, end);

  const resetFilters = () => {
    setDateRange("all");
    setPriority("all");
    setStatus("all");
    setQ("");
    setPage(1);
    setOpenMenu(null);
  };

  const gotoPage = (p) => {
    const np = Math.max(1, Math.min(pageCount, p));
    setPage(np);
  };

  // ---- Filters: custom pill menus ----
  const DATE_OPTIONS = [
    { label: "Date", value: "all" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "This month", value: "month" },
    { label: "This year", value: "year" },
  ];
  const PRIORITY_OPTIONS = [
    { label: "Priority", value: "all" },
    { label: "Highest", value: "Highest" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];
  const STATUS_OPTIONS = [
    { label: "Status", value: "all" },
    { label: "Completed", value: "Completed" },
    { label: "Processing", value: "Processing" },
    { label: "Rejected", value: "Rejected" },
  ];

  const [openMenu, setOpenMenu] = useState(null); // 'date' | 'priority' | 'status' | null
  const filtersRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target))
        setOpenMenu(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function PillMenu({ id, value, options, onChange }) {
    const selectedLabel = useMemo(
      () => options.find((o) => o.value === value)?.label ?? options[0]?.label,
      [options, value]
    );
    const isOpen = openMenu === id;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(isOpen ? null : id)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedLabel}</span>
          <FiChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div
            role="listbox"
            className="absolute z-20 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black/5"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenMenu(null);
                    setPage(1);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{opt.label}</span>
                  {active && <FiCheck className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ---- Modal state ----
  const [selectedId, setSelectedId] = useState(null);
  const prevFocusRef = useRef(null)
  const closeBtnRef = useRef(null)
  const selectedRow = useMemo(
    () => filtered.find((r) => r.id === selectedId),
    [filtered, selectedId]
  );
  const extra = useMemo(
    () => details.reports.find((d) => d.id === selectedId) || {},
    [selectedId]
  );
  const closeModal = () => {
    setSelectedId(null)
    // restore focus back to trigger
    setTimeout(() => {
      try { prevFocusRef.current?.focus() } catch {}
    }, 0)
  };

  // Close modal on Escape while open
  useEffect(() => {
    if (!selectedRow) return;
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', onKey)
    // autofocus the close button
    try { closeBtnRef.current?.focus() } catch {}
    return () => document.removeEventListener('keydown', onKey)
  }, [selectedRow])

  return (
    <section className="w-full mt-6 mb-12 px-4 sm:px-8 lg:px-16 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-ubuntu text-xl font-bold text-gray-900">
            View All Reports
          </h2>
          <p className="font-lato text-sm text-gray-500">
            Monitor and manage civic issue reports
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <FiSearch className="h-5 w-5" />
          </span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Search"
            className="w-full rounded-full border border-gray-300 bg-white/90 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm backdrop-blur-sm transition hover:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3" ref={filtersRef}>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          title="Filters"
        >
          <FiFilter className="h-4 w-4 text-gray-600" />
          Filter By
        </button>

        {/* Date */}
        <PillMenu
          id="date"
          value={dateRange}
          options={DATE_OPTIONS}
          onChange={setDateRange}
        />

        {/* Priority */}
        <PillMenu
          id="priority"
          value={priority}
          options={PRIORITY_OPTIONS}
          onChange={setPriority}
        />

        {/* Status */}
        <PillMenu
          id="status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={setStatus}
        />

        <button
          type="button"
          onClick={resetFilters}
          className="ml-1 inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-sm font-medium text-rose-700 shadow-sm transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-100"
          title="Reset filters"
        >
          <RxReset className="h-4 w-4" />
          Reset Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-orange-600 to-orange-500">
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
            {pageRows.map((r, idx) => (
              <tr
                key={`${r.id}-${idx}`}
                className="border-b border-gray-300 odd:bg-gray-50 hover:bg-orange-50 transition-colors"
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
                    onClick={() => setSelectedId(r.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    View Report
                    <img
                      src="/doublearrow.svg"
                      alt="arrow"
                      className="w-4 h-4"
                    />
                  </button>
                </td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium">
            {filtered.length === 0 ? 0 : start + 1}
          </span>
          –<span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => gotoPage(1)}
            disabled={currentPage === 1}
            aria-label="First page"
            className="rounded-full border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm transition enabled:hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => gotoPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="rounded-full border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm transition enabled:hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>

          {(() => {
            const pages = [];
            if (pageCount <= 7) {
              for (let p = 1; p <= pageCount; p++) pages.push(p);
            } else {
              pages.push(1);
              const showLeftEllipsis = currentPage > 4;
              const showRightEllipsis = currentPage < pageCount - 3;
              const startPage = Math.max(2, currentPage - 1);
              const endPage = Math.min(pageCount - 1, currentPage + 1);
              if (showLeftEllipsis) pages.push("…");
              for (let p = startPage; p <= endPage; p++) pages.push(p);
              if (showRightEllipsis) pages.push("…");
              pages.push(pageCount);
            }
            return pages.map((p, idx) =>
              p === "…" ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => gotoPage(p)}
                  className={`min-w-[40px] rounded-full px-3 py-2 text-sm shadow-sm border transition ${
                    p === currentPage
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              )
            );
          })()}

          <button
            type="button"
            onClick={() => gotoPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            aria-label="Next page"
            className="rounded-full border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm transition enabled:hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => gotoPage(pageCount)}
            disabled={currentPage === pageCount}
            aria-label="Last page"
            className="rounded-full border border-gray-300 bg-white p-2 text-sm text-gray-700 shadow-sm transition enabled:hover:bg-gray-50 disabled:opacity-50"
          >
            <FiChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal: Report Details */}
      {selectedRow && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="issue-details-title"
            tabIndex={-1}
            className="relative w-full max-w-3xl rounded-2xl bg-gradient-to-b from-[#FFFFFF] to-[#E5DCDA] shadow-2xl ring-1 ring-gray-200 transition-all duration-200 ease-out"
            onKeyDown={(e) => {
              if (e.key !== 'Tab') return
              const root = e.currentTarget
              const focusables = root.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
              )
              if (!focusables.length) return
              const first = focusables[0]
              const last = focusables[focusables.length - 1]
              if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus() }
              } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus() }
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              aria-label="Close"
              ref={closeBtnRef}
              className="absolute -right-3 -top-3 grid h-10 w-10 place-content-center rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              ×
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Nagar Seva" className="h-12 w-12 rounded-lg shadow" />
                  <div>
                    <div className="text-sm font-semibold tracking-wide text-[#0D3157]">NAGAR SEVA</div>
                    <h3 id="issue-details-title" className="font-ubuntu text-2xl font-bold text-[#0D3157]">
                      ISSUE DETAILS
                    </h3>
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-gray-500">ID: <span className="font-mono font-semibold text-gray-700">{selectedRow.id}</span></div>
              </div>

              {/* Details Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white/80">
                <dl className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2">
                  {/* Issue ID */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">Issue ID</dt>
                    <dd className="px-4 py-3 text-sm font-mono text-gray-900">{selectedRow.id}</dd>
                  </div>
                  {/* Date */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">
                      <span className="inline-flex items-center gap-2"><FiCalendar className="h-4 w-4 text-gray-500"/>Date</span>
                    </dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">{formatDate(selectedRow.date)}</dd>
                  </div>
                  {/* Subject */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700">Subject</dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">{selectedRow.subject}</dd>
                  </div>
                  {/* Description */}
                  <div className="sm:col-span-2 grid grid-cols-[180px,1fr] items-start">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">Description</dt>
                    <dd className="px-4 py-3 text-sm text-gray-800 leading-relaxed">{extra.description || '—'}</dd>
                  </div>
                  {/* Location */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">
                      <span className="inline-flex items-center gap-2"><FiMapPin className="h-4 w-4 text-gray-500"/>Location</span>
                    </dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">{selectedRow.address}</dd>
                  </div>
                  {/* Priority */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">
                      <span className="inline-flex items-center gap-2"><FiTag className="h-4 w-4 text-gray-500"/>Priority</span>
                    </dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">
                      <span className={`inline-block rounded-md border px-2 py-1 text-xs ${priorityTextClasses(selectedRow.priority)}`}>
                        {selectedRow.priority}
                      </span>
                    </dd>
                  </div>
                  {/* Assistant Engineer */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">
                      <span className="inline-flex items-center gap-2"><FiUser className="h-4 w-4 text-gray-500"/>Assistant Engineer</span>
                    </dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">{extra.assistantEngineer || '—'}</dd>
                  </div>
                  {/* Junior Engineer */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 border-r border-gray-200">
                      <span className="inline-flex items-center gap-2"><FiUser className="h-4 w-4 text-gray-500"/>Junior Engineer</span>
                    </dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">{extra.juniorEngineer || '—'}</dd>
                  </div>
                  {/* Status */}
                  <div className="grid grid-cols-[180px,1fr] items-center">
                    <dt className="bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                      <span className="inline-flex items-center gap-2"><FiTag className="h-4 w-4 text-gray-500"/>Status</span>
                    </dt>
                    <dd className="px-4 py-3 text-sm text-gray-900">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium border ${statusPillClasses(selectedRow.status)}`}>
                        {selectedRow.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-center">
                <button className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-600">
                  Escalate This Issue
                  <FiArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
