"use client";

import { useState } from "react";
import Link from "next/link";
import { COMPATIBILITY_DATA, type CompatibilityStatus } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

const STATUS_CONFIG: Record<CompatibilityStatus, { label: string; bg: string; text: string }> = {
  C: { label: "Compatible", bg: "bg-green-100", text: "text-green-800" },
  I: { label: "Incompatible", bg: "bg-red-100", text: "text-red-800" },
  NT: { label: "Not Tested", bg: "bg-slate-100", text: "text-slate-500" },
  V: { label: "Variable", bg: "bg-yellow-100", text: "text-yellow-800" },
};

const SOLUTIONS = ["NS", "D5W", "D10W", "D5NS", "D5halfNS", "LR"] as const;
const SOLUTION_LABELS: Record<string, string> = {
  NS: "NS",
  D5W: "D5W",
  D10W: "D10W",
  D5NS: "D5NS",
  D5halfNS: "D5½NS",
  LR: "LR",
};

export default function SolutionCompatibilityPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<CompatibilityStatus | "">("");

  const filtered = COMPATIBILITY_DATA.filter((entry) => {
    const matchName = entry.drug.toLowerCase().includes(search.toLowerCase());
    if (!filterStatus) return matchName;
    return matchName && SOLUTIONS.some((s) => entry[s] === filterStatus);
  });

  const StatusCell = ({ status }: { status: CompatibilityStatus }) => {
    const cfg = STATUS_CONFIG[status];
    return (
      <td className={`border border-slate-200 px-2 py-2 text-center text-xs font-medium rounded-sm ${cfg.bg} ${cfg.text}`}>
        {status === "NT" ? "NT" : status}
      </td>
    );
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Solution Compatibility</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Medications Solution Compatibility</h1>
      <p className="text-sm text-slate-500 mb-6">IV solution compatibility reference for PICU medications.</p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {(Object.entries(STATUS_CONFIG) as [CompatibilityStatus, typeof STATUS_CONFIG[CompatibilityStatus]][]).map(
          ([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "" : key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
                filterStatus === key ? "border-slate-400 shadow-sm" : "border-transparent"
              } ${cfg.bg} ${cfg.text}`}
            >
              <span className="font-bold">{key}</span>
              <span>{cfg.label}</span>
            </button>
          )
        )}
        {filterStatus && (
          <button onClick={() => setFilterStatus("")} className="text-xs text-slate-500 underline">
            Clear filter
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search medication..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50">
              <th className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold text-slate-700">
                Medication
              </th>
              {SOLUTIONS.map((s) => (
                <th
                  key={s}
                  className="border-b border-slate-200 px-3 py-3 text-center text-xs font-semibold text-slate-700"
                >
                  {SOLUTION_LABELS[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={entry.drug} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                <td className="border-b border-slate-100 px-4 py-2.5 text-sm font-medium text-slate-800">
                  {entry.drug}
                </td>
                {SOLUTIONS.map((s) => (
                  <StatusCell key={s} status={entry[s]} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-slate-400">No medications match your search.</div>
      )}

      <div className="mt-4 text-xs text-slate-500">
        {filtered.length} of {COMPATIBILITY_DATA.length} medications shown.
        Click a legend item to filter by compatibility status.
      </div>

      <Attribution />
    </div>
  );
}
