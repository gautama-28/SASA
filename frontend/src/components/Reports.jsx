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
  FiX
} from "react-icons/fi";
import { RxReset } from "react-icons/rx";

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
    case "High":
      return "text-orange-600 font-medium";
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
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};
const isWithinThisYear = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear();
};

export default function Reports() {
  // ----- Backend Data -----
  const [data, setData] = useState({ labels: {}, rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("http://localhost:5000/api/reports");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const result = await res.json();
        
        const transformedData = {
          labels: result.labels || {
            id: "ID",
            subject: "Subject", 
            address: "Address",
            date: "Date",
            priority: "Priority",
            status: "Status",
            actions: "Actions"
          },
          rows: result.rows || []
        };
        
        setData(transformedData);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError(err.message);
        setData({
          labels: {
            id: "ID",
            subject: "Subject",
            address: "Address", 
            date: "Date",
            priority: "Priority",
            status: "Status",
            actions: "Actions"
          },
          rows: []
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchReports();
  }, []);

  const { labels, rows } = data;

  // ----- Filters & Search -----
  const [dateRange, setDateRange] = useState("all");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  // ----- Pagination -----
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = rows;

    if (dateRange !== "all") {
      if (dateRange === "7") list = list.filter((r) => isWithinLastDays(r.date, 7));
      else if (dateRange === "30") list = list.filter((r) => isWithinLastDays(r.date, 30));
      else if (dateRange === "month") list = list.filter((r) => isWithinThisMonth(r.date));
      else if (dateRange === "year") list = list.filter((r) => isWithinThisYear(r.date));
    }

    if (priority !== "all")
      list = list.filter((r) => (r.priority ?? "").toLowerCase() === priority.toLowerCase());

    if (status !== "all")
      list = list.filter((r) => (r.status ?? "").toLowerCase() === status.toLowerCase());

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          (r.id ?? "").toLowerCase().includes(needle) ||
          (r.subject ?? "").toLowerCase().includes(needle) ||
          (r.address ?? "").toLowerCase().includes(needle)
      );
    }

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

  // ----- Filter Menus -----
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
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];
  const STATUS_OPTIONS = [
    { label: "Status", value: "all" },
    { label: "Completed", value: "Completed" },
    { label: "Processing", value: "Processing" },
    { label: "Rejected", value: "Rejected" },
  ];

  const [openMenu, setOpenMenu] = useState(null);
  const filtersRef = useRef(null);
  
  useEffect(() => {
    const onDocClick = (e) => {
      if (filtersRef.current && !filtersRef.current.contains(e.target)) setOpenMenu(null);
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
        >
          <span>{selectedLabel}</span>
          <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
        {isOpen && (
          <div className="absolute z-20 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenMenu(null);
                    setPage(1);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                    active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
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

  // ----- Modal State -----
  const [selectedId, setSelectedId] = useState(null);
  const prevFocusRef = useRef(null);
  const closeBtnRef = useRef(null);
  
  const selectedRow = useMemo(() => filtered.find((r) => r.id === selectedId), [filtered, selectedId]);
  
  const closeModal = () => {
    setSelectedId(null);
    setTimeout(() => {
      try {
        prevFocusRef.current?.focus();
      } catch {}
    }, 0);
  };

  useEffect(() => {
    if (!selectedRow) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    try {
      closeBtnRef.current?.focus();
    } catch {}
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedRow]);

  // ----- Loading & Error States -----
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <p className="text-lg font-medium text-red-800 mb-2">Error Loading Reports</p>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full mt-6 mb-12 px-4 sm:px-8 lg:px-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {filtered.length} of {rows.length} issues
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between" ref={filtersRef}>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiFilter className="h-4 w-4" />
            <span>Filter by:</span>
          </div>
          <PillMenu id="date" value={dateRange} options={DATE_OPTIONS} onChange={setDateRange} />
          <PillMenu id="priority" value={priority} options={PRIORITY_OPTIONS} onChange={setPriority} />
          <PillMenu id="status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/90 px-3 py-2 text-sm text-gray-700 shadow-sm"
          >
            <RxReset className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, subject, or address..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Address</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                    No reports found matching your criteria
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-600">{row.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{row.subject}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      <div className="flex items-center gap-1">
                        <FiMapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        {row.address}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="h-3 w-3 text-gray-400" />
                        {formatDate(row.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1 ${priorityTextClasses(row.priority)}`}>
                        <FiTag className="h-3 w-3" />
                        {row.priority}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusPillClasses(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        ref={(el) => {
                          if (selectedId === row.id) prevFocusRef.current = el;
                        }}
                        onClick={() => setSelectedId(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors"
                      >
                        <span>View</span>
                        <FiArrowUpRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {start + 1}–{end} of {filtered.length} results
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => gotoPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <FiChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => gotoPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                let pageNum;
                if (pageCount <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage > pageCount - 3) {
                  pageNum = pageCount - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => gotoPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      pageNum === currentPage
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => gotoPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => gotoPage(pageCount)}
              disabled={currentPage === pageCount}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <FiChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/25" onClick={closeModal} />
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Report Details</h3>
                <button ref={closeBtnRef} onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600">
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue ID</label>
                  <p className="text-gray-900 font-mono">{selectedRow.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-gray-900 font-semibold">{selectedRow.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{selectedRow.address}</p>
                </div>
                {selectedRow.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{selectedRow.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <p className={`font-medium ${priorityTextClasses(selectedRow.priority)}`}>
                      {selectedRow.priority}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusPillClasses(selectedRow.status)}`}>
                      {selectedRow.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date Reported</label>
                  <p className="text-gray-900">{formatDate(selectedRow.date)}</p>
                </div>
                {selectedRow.assistantEngineer && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assistant Engineer</label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <FiUser className="h-4 w-4 text-gray-400" />
                      {selectedRow.assistantEngineer}
                    </p>
                  </div>
                )}
                {selectedRow.juniorEngineer && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Junior Engineer</label>
                    <p className="text-gray-900 flex items-center gap-1">
                      <FiUser className="h-4 w-4 text-gray-400" />
                      {selectedRow.juniorEngineer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
