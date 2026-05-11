"use client";

import { useState } from "react";
import Link from "next/link";
import { calcHyponatremia, type HyponatremiaResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function HyponatremiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [dose3pct, setDose3pct] = useState<string>("3");
  const [currentNa, setCurrentNa] = useState<string>("");
  const [desiredNa, setDesiredNa] = useState<string>("");

  const [result, setResult] = useState<HyponatremiaResult | null>(null);
  const [snap, setSnap] = useState<{ w: number; d: number; c: number; des: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const d = parseFloat(dose3pct) || 0;
    const c = parseFloat(currentNa) || 0;
    const des = parseFloat(desiredNa) || 0;
    setResult(calcHyponatremia(w, d, c, des));
    setSnap({ w, d, c, des });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  const deltaNaOk = result && result.deltaNa >= 4 && result.deltaNa <= 6;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Hyponatremia Correction</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Hypovolemic Hyponatremia Correction</h1>
      <p className="text-sm text-slate-500 mb-6">Enter patient data then click Calculate for 3% NaCl orders.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Weight (kg)", val: weight, set: setWeight, placeholder: "e.g. 15", step: "0.1" },
            { label: "3% NaCl dose (mL/kg) [2–5]", val: dose3pct, set: setDose3pct, placeholder: "e.g. 3", step: "0.5" },
            { label: "Current Na (mmol/L)", val: currentNa, set: setCurrentNa, placeholder: "e.g. 117", step: "1" },
            { label: "Desired Na (mmol/L)", val: desiredNa, set: setDesiredNa, placeholder: "e.g. 122", step: "1" },
          ].map(({ label, val, set, placeholder, step }) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
              <input
                type="number"
                step={step}
                value={val}
                placeholder={placeholder}
                onChange={(e) => { set(e.target.value); markDirty(); }}
                onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {result && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {result && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Inputs changed — click Recalculate</span>
          )}
          {snap && !dirty && (
            <span className="text-xs text-slate-500">Results for {snap.w} kg</span>
          )}
        </div>
      </div>

      {!result && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter patient data above and click <strong className="text-slate-600">Calculate</strong> to see orders.
        </div>
      )}

      {result && !dirty && (
        <div className="space-y-5">
          {/* Symptomatic */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-red-700 border-b border-red-100 pb-2 mb-4">
              Symptomatic Hyponatremia (Convulsions)
            </h2>
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 font-mono text-sm">
              <p className="text-slate-700">
                Give 3% NaCl IV bolus <strong>{result.symptomaticVol.toFixed(0)} mL</strong> over 20 minutes.
                <span className="text-orange-600"> (Maximum 150 mL/dose)</span>
              </p>
            </div>
            <div className="text-xs text-slate-500 mt-2">Dose range: 2–5 mL/kg</div>
          </section>

          {/* Asymptomatic unsafe */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-amber-700 border-b border-amber-100 pb-2 mb-4">
              Asymptomatic — Unsafe (Na &lt; 120 mmol/L)
            </h2>
            <div className={`mb-3 rounded-lg px-3 py-2 text-xs font-medium border ${deltaNaOk ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
              ΔNa = {result.deltaNa.toFixed(1)} mmol/L
              {deltaNaOk ? " ✓ (within 4–6 range)" : " — Target should be 4–6 mmol/L. Adjust Desired Na."}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 font-mono text-sm">
              <p className="text-slate-700">
                Give 3% NaCl <strong>{result.asymptomaticMEq.toFixed(0)} mEq (mmol)</strong>{" "}
                (= <strong>{result.asymptomaticVol.toFixed(0)} mL</strong>) diluted in{" "}
                <strong>{result.asymptomaticVol.toFixed(0)} mL</strong> D5W IV infusion over 4 hours.
              </p>
            </div>
            <div className="text-xs text-slate-500 mt-2">Target: raise Na to safe level (&gt;120 mmol/L)</div>
          </section>

          {/* Safe */}
          <section className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-green-800 mb-2">Asymptomatic — Safe (Na &gt; 120 mmol/L)</h2>
            <p className="text-sm text-green-700">Calculate fluid maintenance and deficit and give it as NS.</p>
          </section>
        </div>
      )}

      <Attribution />
    </div>
  );
}
