"use client";

import { useState } from "react";
import Link from "next/link";
import { calcMagnesium, type MagnesiumResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function MagnesiumSulfatePage() {
  const [weight, setWeight] = useState<string>("");
  const [hypomagDose, setHypomagDose] = useState<string>("50");
  const [asthmaDose, setAsthmaDose] = useState<string>("75");

  const [hypomagResult, setHypomagResult] = useState<MagnesiumResult | null>(null);
  const [asthmaResult, setAsthmaResult] = useState<MagnesiumResult | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    const hd = parseFloat(hypomagDose);
    const ad = parseFloat(asthmaDose);
    if (!w || w <= 0) return;
    setHypomagResult(hd > 0 ? calcMagnesium(w, hd) : null);
    setAsthmaResult(ad > 0 ? calcMagnesium(w, ad) : null);
    setCalculatedWeight(w);
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  const hasResults = hypomagResult || asthmaResult;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Magnesium Sulfate</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Magnesium Sulfate</h1>
      <p className="text-sm text-slate-500 mb-6">Enter patient data then click Calculate. Max dose = 2000 mg/dose.</p>

      {/* Inputs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Patient Weight (kg)</label>
          <input
            type="number" min="0.5" max="200" step="0.1"
            value={weight}
            onChange={(e) => { setWeight(e.target.value); markDirty(); }}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="w-40 rounded-md border border-slate-300 px-3 py-2 text-base font-mono shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder="e.g. 15"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hypomagnesemia dose (mg/kg) — range 25–50
            </label>
            <input
              type="number" min="25" max="50" step="1"
              value={hypomagDose}
              onChange={(e) => { setHypomagDose(e.target.value); markDirty(); }}
              className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Asthma exacerbation dose (mg/kg) — range 25–75
            </label>
            <input
              type="number" min="25" max="75" step="1"
              value={asthmaDose}
              onChange={(e) => { setAsthmaDose(e.target.value); markDirty(); }}
              className="w-32 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {hasResults && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {hasResults && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Inputs changed — click Recalculate</span>
          )}
          {calculatedWeight && !dirty && (
            <span className="text-xs text-slate-500">Results for {calculatedWeight} kg</span>
          )}
        </div>
      </div>

      {/* Results */}
      {!hasResults && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter patient data above and click <strong className="text-slate-600">Calculate</strong> to see orders.
        </div>
      )}

      {hasResults && !dirty && (
        <div className="space-y-6">

          {hypomagResult && (
            <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-purple-700 border-b border-purple-100 pb-2 mb-4">
                Order For Hypomagnesemia
              </h2>
              <div className="space-y-3">
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 font-mono text-sm">
                  <div className="font-semibold text-purple-800 mb-2">Order for Neonates (every 8–12 hours):</div>
                  <p className="text-slate-700">
                    Give MgSO₄ <strong>{hypomagResult.totalDose.toFixed(0)} mg</strong> diluted in{" "}
                    <strong>{hypomagResult.minDilution} – {hypomagResult.maxDilution} mL</strong> of chosen fluid
                    (e.g. NS, D5W) IV infusion over <strong>{hypomagResult.infusionHours} hour{hypomagResult.infusionHours !== 1 ? "s" : ""}</strong> under CPM.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 font-mono text-sm">
                  <div className="font-semibold text-purple-800 mb-2">Order for Older Patients (every 6 hours):</div>
                  <p className="text-slate-700">
                    Give MgSO₄ <strong>{hypomagResult.totalDose.toFixed(0)} mg</strong> diluted in{" "}
                    <strong>{hypomagResult.minDilution} – {hypomagResult.maxDilution} mL</strong> of chosen fluid
                    (e.g. NS, D5W) IV infusion over <strong>{hypomagResult.infusionHours} hour{hypomagResult.infusionHours !== 1 ? "s" : ""}</strong> under CPM.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="text-center p-2 bg-slate-50 rounded border">
                    <div className="text-xs text-slate-500">Total Dose</div>
                    <div className="font-bold text-slate-800">{hypomagResult.totalDose.toFixed(0)} mg</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded border">
                    <div className="text-xs text-slate-500">Dilution Range</div>
                    <div className="font-bold text-slate-800">{hypomagResult.minDilution}–{hypomagResult.maxDilution} mL</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded border">
                    <div className="text-xs text-slate-500">Duration</div>
                    <div className="font-bold text-slate-800">{hypomagResult.infusionHours} hr</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {asthmaResult && (
            <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-semibold text-blue-700 border-b border-blue-100 pb-2 mb-4">
                Order For Acute Asthma Exacerbation
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 font-mono text-sm">
                <p className="text-slate-700">
                  Give MgSO₄ <strong>{asthmaResult.totalDose.toFixed(0)} mg</strong> diluted in{" "}
                  <strong>{asthmaResult.minDilution} – {asthmaResult.maxDilution} mL</strong> of chosen fluid
                  (e.g. NS, D5W) IV infusion over 15–60 minutes under CPM.
                </p>
              </div>
              <div className="text-xs text-orange-600 font-medium mt-2">Maximum = 2000 mg/dose</div>
            </section>
          )}
        </div>
      )}

      <Attribution />
    </div>
  );
}
