"use client";

import { useState } from "react";
import { COMPATIBILITY_DATA, type CompatibilityStatus } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

const STATUS_CONFIG: Record<CompatibilityStatus, { label: string; bg: string; text: string; border: string }> = {
  C:  { label: "Compatible",   bg: "var(--np-success-soft)", text: "var(--np-success)", border: "#86EFAC" },
  I:  { label: "Incompatible", bg: "var(--np-danger-soft)",  text: "var(--np-danger)",  border: "#FCA5A5" },
  NT: { label: "Not Tested",   bg: "var(--np-surface-sunken)", text: "var(--np-fg-4)", border: "var(--np-border)" },
  V:  { label: "Variable",     bg: "var(--np-warning-soft)", text: "var(--np-warning)", border: "#FDE68A" },
};

const SOLUTIONS = ["NS", "D5W", "D10W", "D5NS", "D5halfNS", "LR"] as const;
const SOLUTION_LABELS: Record<string, string> = {
  NS: "NS", D5W: "D5W", D10W: "D10W", D5NS: "D5NS", D5halfNS: "D5½NS", LR: "LR",
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
      <td style={{
        padding: "8px 10px", textAlign: "center", fontSize: 12, fontWeight: 600,
        background: cfg.bg, color: cfg.text, border: "1px solid var(--np-border)",
      }}>
        {status === "NT" ? "NT" : status}
      </td>
    );
  };

  return (
    <CalcShell
      sigil="🧬"
      title="Solution Compatibility"
      description="IV solution compatibility reference for 33 PICU medications."
    >
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {(Object.entries(STATUS_CONFIG) as [CompatibilityStatus, typeof STATUS_CONFIG[CompatibilityStatus]][]).map(
          ([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "" : key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: cfg.bg, color: cfg.text,
                border: `2px solid ${filterStatus === key ? cfg.border : "transparent"}`,
                cursor: "pointer",
                fontFamily: "var(--np-font-body)",
                transition: "border-color 120ms",
              }}
            >
              <span style={{ fontWeight: 700 }}>{key}</span>
              <span>{cfg.label}</span>
            </button>
          )
        )}
        {filterStatus && (
          <button onClick={() => setFilterStatus("")}
            style={{ fontSize: 12, color: "var(--np-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
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
          className="np-input" style={{ maxWidth: 256, fontFamily: "var(--np-font-body)" }}
        />
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderColor: "var(--np-border)" }}>
        <table className="w-full text-sm border-collapse" style={{ background: "var(--np-surface)" }}>
          <thead>
            <tr style={{ background: "var(--np-surface-sunken)" }}>
              <th style={{
                borderBottom: "1px solid var(--np-border)", padding: "12px 16px",
                textAlign: "left", fontSize: 11, fontWeight: 700,
                color: "var(--np-fg-2)", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                Medication
              </th>
              {SOLUTIONS.map((s) => (
                <th key={s} style={{
                  borderBottom: "1px solid var(--np-border)", padding: "12px 12px",
                  textAlign: "center", fontSize: 11, fontWeight: 700,
                  color: "var(--np-fg-2)", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  {SOLUTION_LABELS[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={entry.drug} style={{ background: i % 2 === 0 ? "var(--np-surface)" : "var(--np-surface-sunken)" }}>
                <td style={{
                  borderBottom: "1px solid var(--np-border)", padding: "10px 16px",
                  fontSize: 13, fontWeight: 500, color: "var(--np-fg-1)",
                  fontFamily: "var(--np-font-body)",
                }}>
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
        <div className="np-empty mt-4">No medications match your search.</div>
      )}

      <div style={{ marginTop: 12, fontSize: 12, color: "var(--np-fg-3)" }}>
        {filtered.length} of {COMPATIBILITY_DATA.length} medications shown.
        Click a legend item to filter by compatibility status.
      </div>
    </CalcShell>
  );
}
