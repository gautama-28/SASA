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
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};
const isWithinThisYear = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear();
};

export default function Reports() {
  // ----- Backend Data -----
  const [data, setData] = useState({ labels: [], rows: [] });
  const [details, setDetails] = useState({ reports: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("http://localhost:5000/api/reports"); // backend endpoint
        const result = await res.json();

        // Prepare labels for table header
        const labels = {
          id: "ID",
          subject: "Subject",
          address: "Address",
          date: "Date",
          priority: "Priority",
          status: "Status",
          actions: "Actions",
        };

        setData({ labels, rows: result.reports });
        setDetails({ reports: result.reports });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading reports...</div>;

  const { labels, rows } = data;

  // ----- Filters & Search -----
  const [dateRange, setDateRange] = useState("all"); // all | 7 | 30 | month | year
  const [priority, setPriority] = useState("all"); // all | Highest | Medium | Low
  const [status, setStatus] = useState("all"); // all | Completed | Processing | Rejected
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
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{selectedLabel}</span>
          <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
  const extra = useMemo(() => details.reports.find((d) => d.id === selectedId) || {}, [selectedId]);
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

  // ----- Render -----
  return (
    <section className="w-full mt-6 mb-12 px-4 sm:px-8 lg:px-16 space-y-6">
      {/* Header, Filters, Table, Pagination, Modal */}
      {/* ... Keep all your existing JSX as-is ... */}
      {/* Just replace data access from local JSON with `data` and `details` */}
    </section>
  );
}
