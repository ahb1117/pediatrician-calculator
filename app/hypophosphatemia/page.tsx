"use client";

import { useState } from "react";
import Link from "next/link";
import { calcHypophosphatemia, type PhosphateDoseRow } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function HypophosphatemiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [kConc, setKConc] = useState<string>("60");
  const [rows, setRows] = useState<PhosphateDoseRow[]>([]);
  const [snap, setSnap] = useState<{ w: number; k: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    const k = parseFloat(kConc);
    if (!w || w <= 0 || !k || k <= 0) return;
    setRows(calcHypophosphatemia(w, k));
    setSnap({ w, k });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Hypophosphatemia Correction</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Hypophosphatemia Correction</h1>
      <p className="text-sm text-slate-500 mb-6">Enter patient data then click Calculate for KPO₄ and NaPO₄ orders.</p>

      {/* Dose guidance */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { phos: "PHOS > 0.6 mmol/L", dose: "0.16–0.31 mmol/kg" },
          { phos: "PHOS 0.3–0.6 mmol/L", dose: "0.32–0.43 mmol/kg" },
          { phos: "PHOS < 0.3 mmol/L", dose: "0.44–0.64 mmol/kg" },
        ].map(({ phos, dose }) => (
          <div key={phos} className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-xs">
            <div className="font-semibold text-indigo-800">{phos}</div>
            <div className="text-indigo-600 mt-0.5">→ {dose}</div>
          </div>
        ))}
      </div>

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
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">K Concentration (mEq/L)</label>
            <input
              type="number" min="40" max="200" step="10"
              value={kConc}
              onChange={(e) => { setKConc(e.target.value); markDirty(); }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
            />
            <div className="text-xs text-slate-500 mt-0.5">40–60 peripheral | up to 200 central</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {rows.length > 0 && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {rows.length > 0 && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Inputs changed — click Recalculate</span>
          )}
          {snap && !dirty && (
            <span className="text-xs text-slate-500">Results for {snap.w} kg | {snap.k} mEq/L</span>
          )}
        </div>
      </div>

      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        Max: 45 mmol phosphate/dose | 66 mEq K/dose. Safest to give 0.4+ mmol/kg doses over 6 hours.
      </div>

      {rows.length === 0 && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter weight and K concentration then click <strong className="text-slate-600">Calculate</strong> to see phosphate orders.
        </div>
      )}

      {rows.length > 0 && !dirty && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="w-full text-sm border-collapse bg-white">
            <thead>
              <tr className="bg-indigo-50">
                <th className="border border-indigo-200 px-3 py-2 text-left text-xs text-indigo-700">Dose (mmol/kg)</th>
                <th className="border border-indigo-200 px-3 py-2 text-left text-xs text-indigo-700">KPO₄ Order</th>
                <th className="border border-indigo-200 px-3 py-2 text-left text-xs text-indigo-700">NaPO₄ Order</th>
                <th className="border border-indigo-200 px-3 py-2 text-center text-xs text-indigo-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.dosePerKg} className="hover:bg-indigo-50/50">
                  <td className="border border-slate-200 px-3 py-3">
                    <div className="font-bold text-indigo-700">{row.dosePerKg}</div>
                    <div className="text-xs text-slate-500">= {row.phosphateMmol.toFixed(2)} mmol</div>
                  </td>
                  <td className="border border-slate-200 px-3 py-3 font-mono text-xs text-slate-700">
                    Give KPO₄ <strong>{row.phosphateMmol.toFixed(2)} mmol</strong> (= <strong>{row.kpo4_rounded} mL</strong>){" "}
                    diluted in <strong>{row.kDilution} mL</strong> (NS/D5W)
                    <div className="text-slate-500 mt-0.5">K content: {row.kContent.toFixed(2)} mEq = {row.kPerKg} mEq/kg</div>
                  </td>
                  <td className="border border-slate-200 px-3 py-3 font-mono text-xs text-slate-700">
                    Give NaPO₄ <strong>{row.phosphateMmol.toFixed(2)} mmol</strong> (= <strong>{row.kpo4_rounded} mL</strong>)
                    <div className="text-slate-500 mt-0.5">
                      Peripheral: {row.naPO4_peripheral.toFixed(1)} mL D5W |{" "}
                      Central: {row.naPO4_central.toFixed(1)} mL D5W
                    </div>
                  </td>
                  <td className="border border-slate-200 px-3 py-3 text-center">
                    <span className="font-bold text-indigo-700">{row.infusionHours}h</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Attribution />
    </div>
  );
}
