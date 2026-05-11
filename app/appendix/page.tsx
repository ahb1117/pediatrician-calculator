"use client";

import { useState } from "react";
import Link from "next/link";
import { calcAppendix, type AppendixResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

interface Fluid {
  dextrose: number;
  rate: number;
}

export default function AppendixPage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [creatinine, setCreatinine] = useState<string>("");
  const [fluids, setFluids] = useState<Fluid[]>(Array(7).fill(null).map(() => ({ dextrose: 0, rate: 0 })));
  const [feedingGlucose, setFeedingGlucose] = useState<string>("0");
  const [feedingAmount, setFeedingAmount] = useState<string>("0");
  const [feedingFrequency, setFeedingFrequency] = useState<string>("0");

  const [result, setResult] = useState<AppendixResult | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    setResult(
      calcAppendix(
        w,
        parseFloat(height) || 0,
        parseFloat(length) || 0,
        parseFloat(creatinine) || 1,
        fluids,
        parseFloat(feedingGlucose) || 0,
        parseFloat(feedingAmount) || 0,
        parseFloat(feedingFrequency) || 0
      )
    );
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  function updateFluid(i: number, field: keyof Fluid, val: string) {
    setFluids((f) => f.map((row, idx) => (idx === i ? { ...row, [field]: parseFloat(val) || 0 } : row)));
    markDirty();
  }

  const inputClass = "w-full rounded border border-slate-300 px-2 py-1.5 text-sm font-mono focus:border-teal-500 focus:ring-1 focus:ring-teal-200 outline-none";

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Appendix Calculator</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Appendix — BSA, BMI, GIR &amp; eGFR Calculator</h1>
      <p className="text-sm text-slate-500 mb-6">Fill in all relevant data then click Calculate.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* BSA & BMI inputs */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-teal-700 border-b border-teal-100 pb-2 mb-4">BSA &amp; BMI</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" value={weight} placeholder="e.g. 15"
                onChange={e => { setWeight(e.target.value); markDirty(); }} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Height (cm)</label>
              <input type="number" step="0.5" value={height} placeholder="e.g. 105"
                onChange={e => { setHeight(e.target.value); markDirty(); }} className={inputClass} />
            </div>
          </div>
        </section>

        {/* eGFR inputs */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-teal-700 border-b border-teal-100 pb-2 mb-4">eGFR (Revised Schwartz)</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Patient Length / Height (cm)</label>
              <input type="number" step="0.5" value={length} placeholder="e.g. 35"
                onChange={e => { setLength(e.target.value); markDirty(); }} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Serum Creatinine (μmol/L)</label>
              <input type="number" step="1" value={creatinine} placeholder="e.g. 56"
                onChange={e => { setCreatinine(e.target.value); markDirty(); }} className={inputClass} />
            </div>
          </div>
        </section>

        {/* GIR fluids */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-teal-700 border-b border-teal-100 pb-2 mb-4">GIR — Glucose Infusion Rate</h2>
          <p className="text-xs text-slate-500 mb-3">Put 0 for unused slots (e.g. if NPO, keep feeding fields at 0).</p>
          <div className="mb-4 overflow-x-auto">
            <div className="text-xs font-semibold text-slate-600 mb-2">IV Fluids</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs text-slate-500 font-medium px-2 py-1">Fluid</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-2 py-1">Dextrose %</th>
                  <th className="text-left text-xs text-slate-500 font-medium px-2 py-1">Rate (mL/hr)</th>
                </tr>
              </thead>
              <tbody>
                {fluids.map((f, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-2 py-1.5 text-xs text-slate-500">Fluid {i + 1}</td>
                    <td className="px-2 py-1.5">
                      <input type="number" min="0" step="0.5" value={f.dextrose}
                        onChange={(e) => updateFluid(i, "dextrose", e.target.value)}
                        className="w-24 rounded border border-slate-300 px-2 py-1 text-xs font-mono focus:border-teal-500 outline-none" />
                    </td>
                    <td className="px-2 py-1.5">
                      <input type="number" min="0" step="0.1" value={f.rate}
                        onChange={(e) => updateFluid(i, "rate", e.target.value)}
                        className="w-24 rounded border border-slate-300 px-2 py-1 text-xs font-mono focus:border-teal-500 outline-none" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600 mb-2">Enteral Feeding</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Glucose content (g/dL)</label>
                <input type="number" min="0" step="0.1" value={feedingGlucose}
                  onChange={e => { setFeedingGlucose(e.target.value); markDirty(); }} className={inputClass} />
                <div className="text-xs text-slate-400 mt-0.5">EBM: 7.1 | Term: 7.1 | Preterm: 8.5</div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Amount (mL/feed)</label>
                <input type="number" min="0" step="1" value={feedingAmount}
                  onChange={e => { setFeedingAmount(e.target.value); markDirty(); }} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Frequency (every N hours)</label>
                <input type="number" min="0" step="0.5" value={feedingFrequency}
                  onChange={e => { setFeedingFrequency(e.target.value); markDirty(); }} className={inputClass} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Calculate button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCalculate}
          disabled={!weight || parseFloat(weight) <= 0}
          className="px-8 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
        >
          {result && !dirty ? "Recalculate" : "Calculate"}
        </button>
        {result && dirty && (
          <span className="text-xs text-amber-600 font-medium">⚠ Inputs changed — click Recalculate</span>
        )}
      </div>

      {!result && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Fill in the data above and click <strong className="text-slate-600">Calculate</strong> to see results.
        </div>
      )}

      {result && !dirty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BSA & BMI results */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-teal-700 border-b border-teal-100 pb-2 mb-4">BSA &amp; BMI Results</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center">
                <div className="text-xs text-teal-600 font-medium">BSA</div>
                <div className="text-3xl font-bold text-teal-800">{result.bsa}</div>
                <div className="text-xs text-teal-600">m²</div>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-center">
                <div className="text-xs text-teal-600 font-medium">BMI</div>
                <div className="text-3xl font-bold text-teal-800">{result.bmi}</div>
                <div className="text-xs text-teal-600">kg/m²</div>
              </div>
            </div>
          </div>

          {/* eGFR results */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-teal-700 border-b border-teal-100 pb-2 mb-4">eGFR Results</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Pre-term (0–12 mo)", val: result.egfr_preterm },
                { label: "Full-term (0–12 mo)", val: result.egfr_fullterm },
                { label: "Child (1–12 yr)", val: result.egfr_child },
                { label: "Adolescent (12–17 yr)", val: result.egfr_adolescent },
              ].map(({ label, val }) => (
                <div key={label} className="bg-teal-50 border border-teal-200 rounded-lg p-2 text-center">
                  <div className="text-teal-600">{label}</div>
                  <div className="font-bold text-teal-800 text-base">{val}</div>
                  <div className="text-teal-600">mL/min/1.73m²</div>
                </div>
              ))}
            </div>
          </div>

          {/* GIR results */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
            <h2 className="text-base font-semibold text-teal-700 border-b border-teal-100 pb-2 mb-4">GIR Results</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Fluids GIR", val: result.fluidsGIR },
                { label: "Feeding GIR", val: result.feedingGIR },
                { label: "Total GIR", val: result.totalGIR },
              ].map(({ label, val }) => (
                <div key={label} className={`rounded-lg p-4 text-center border ${label === "Total GIR" ? "bg-teal-100 border-teal-300" : "bg-teal-50 border-teal-200"}`}>
                  <div className="text-xs text-teal-700 font-medium">{label}</div>
                  <div className="text-3xl font-bold text-teal-800">{val}</div>
                  <div className="text-xs text-teal-600">mg/kg/min</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Attribution />
    </div>
  );
}
