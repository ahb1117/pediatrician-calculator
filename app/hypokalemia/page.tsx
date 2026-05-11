"use client";

import { useState } from "react";
import Link from "next/link";
import { calcHypokalemia, type HypokalemiaRow } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function HypokalemiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [conc, setConc] = useState<string>("60");
  const [rows, setRows] = useState<HypokalemiaRow[]>([]);
  const [snap, setSnap] = useState<{ w: number; c: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    const c = parseFloat(conc);
    if (!w || w <= 0 || !c || c <= 0) return;
    setRows(calcHypokalemia(w, c));
    setSnap({ w, c });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  const colors = [
    "bg-green-50 border-green-200",
    "bg-yellow-50 border-yellow-200",
    "bg-orange-50 border-orange-200",
    "bg-red-50 border-red-200",
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Hypokalemia Correction</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Hypokalemia Correction</h1>
      <p className="text-sm text-slate-500 mb-6">Enter patient data then click Calculate for KCl orders.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Weight (kg)</label>
            <input
              type="number" min="0.5" max="200" step="0.1"
              value={weight}
              placeholder="e.g. 10"
              onChange={(e) => { setWeight(e.target.value); markDirty(); }}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Concentration (mEq/L)</label>
            <input
              type="number" min="40" max="200" step="10"
              value={conc}
              onChange={(e) => { setConc(e.target.value); markDirty(); }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            />
            <div className="text-xs text-slate-500 mt-0.5">40–60 peripheral | up to 200 central</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {rows.length > 0 && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {rows.length > 0 && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Inputs changed — click Recalculate</span>
          )}
          {snap && !dirty && (
            <span className="text-xs text-slate-500">Results for {snap.w} kg | {snap.c} mEq/L</span>
          )}
        </div>
      </div>

      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        Maximum infusion time = over 1 hour for any chosen dose. Maximum dose = 40 mEq/dose.
      </div>

      {rows.length === 0 && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter weight and concentration then click <strong className="text-slate-600">Calculate</strong> to see KCl orders.
        </div>
      )}

      {rows.length > 0 && !dirty && (
        <div className="space-y-4 mb-0">
          {rows.map((row, i) => (
            <div key={row.kLevel} className={`border-2 rounded-xl p-5 ${colors[i]}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-bold text-slate-800 text-base">K⁺ = {row.kLevel}</div>
                <div className="text-sm font-medium text-slate-600">Over {row.hours} hour{row.hours > 1 ? "s" : ""}</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4 font-mono text-sm border border-white">
                <p className="text-slate-700">
                  Give KCl <strong>{row.roundedDose.toFixed(1)} mEq</strong>{" "}
                  (= <strong>{row.volumeKCl.toFixed(1)} mL</strong>) diluted in{" "}
                  <strong>{row.dilution} mL</strong> of chosen fluid (e.g. NS, D5W){" "}
                  IV infusion over <strong>{row.hours} hour{row.hours > 1 ? "s" : ""}</strong>.
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-slate-500">Dose/kg</div>
                  <div className="font-bold">{row.dosePerKg} mEq/kg</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">KCl Volume</div>
                  <div className="font-bold">{row.volumeKCl.toFixed(1)} mL</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">Dilution Volume</div>
                  <div className="font-bold">{row.dilution} mL</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Attribution />
    </div>
  );
}
