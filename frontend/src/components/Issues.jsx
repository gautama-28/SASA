import React, { useMemo, useState } from 'react'
import data from '../data/issues.json'

function formatDate(iso) {
	const d = new Date(iso)
	try {
		return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
	} catch {
		return iso
	}
}

function statusPillClasses(status) {
	switch (status) {
		case 'Completed':
			return 'bg-emerald-100 text-emerald-700'
		case 'Processing':
			return 'bg-violet-100 text-violet-700'
		case 'Rejected':
		default:
			return 'bg-rose-100 text-rose-700'
	}
}

function priorityTextClasses(priority) {
	switch (priority) {
		case 'Highest':
			return 'text-rose-600 font-semibold'
		case 'Medium':
			return 'text-indigo-600'
		case 'Low':
		default:
			return 'text-orange-500'
	}
}

export default function Issues() {
	const { labels, rows } = data
	const [showAll, setShowAll] = useState(false)

	const visibleRows = useMemo(() => (showAll ? rows : rows.slice(0, 5)), [rows, showAll])

	return (
		<section className="w-full mt-6  px-4 sm:px-8 lg:px-16">
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full table-auto">
					<thead>
						<tr className="bg-orange-500">
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.id}
							</th>
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.subject}
							</th>
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.address}
							</th>
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.date}
							</th>
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.priority}
							</th>
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.status}
							</th>
							<th className="px-6 py-3 text-left text-xs font-ubuntu font-bold uppercase tracking-wide text-white">
								{labels.report}
							</th>
						</tr>
					</thead>
					<tbody>
						{visibleRows.map((r, idx) => (
							<tr key={`${r.id}-${idx}`} className="border-b last:border-0">
								<td className="whitespace-nowrap px-6 py-5 font-mono text-sm text-gray-700">{r.id}</td>
								<td className="px-6 py-5 text-sm text-gray-900">{r.subject}</td>
								<td className="px-6 py-5 text-sm text-gray-700">{r.address}</td>
								<td className="px-6 py-5 text-sm text-gray-700">{formatDate(r.date)}</td>
								<td className={`px-6 py-5 text-sm ${priorityTextClasses(r.priority)}`}>{r.priority}</td>
								<td className="px-6 py-5">
									<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClasses(r.status)}`}>
										{r.status}
									</span>
								</td>
								<td className="px-6 py-5">
									<button type="button" className="text-indigo-600 hover:text-indigo-700 hover:underline">
										View »»
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{rows.length > 5 && (
				<div className="mt-4 mb-2 flex items-center justify-center">
					<button
						type="button"
						onClick={() => setShowAll((v) => !v)}
						className="inline-flex items-center gap-1 text-base font-semibold text-red-600 hover:text-red-700"
					>
						{showAll ? 'Show Less' : 'View All'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className={`h-5 w-5 transition-transform ${showAll ? 'rotate-180' : ''}`}
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			)}
		</section>
	)
}

