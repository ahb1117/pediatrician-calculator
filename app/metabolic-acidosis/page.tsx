"use client";

import { useState } from "react";
import Link from "next/link";
import { calcMetabolicAcidosis, type MetabolicAcidosisResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function MetabolicAcidosisPage() {
  const [weight, setWeight] = useState<string>("");
  const [hco3, setHco3] = useState<string>("");
  const [baseDef, setBaseDef] = useState<string>("");
  const [result, setResult] = useState<MetabolicAcidosisResult | null>(null);
  const [snap, setSnap] = useState<{ w: number; h: number; b: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    const h = parseFloat(hco3);
    const b = parseFloat(baseDef);
    if (!w || w <= 0) return;
    setResult(calcMetabolicAcidosis(w, h || 0, b || 0));
    setSnap({ w, h: h || 0, b: b || 0 });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  const OrderBox = ({ label, dose }: { label: string; dose: number }) => (
    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 font-mono text-sm">
      <div className="text-xs font-semibold text-orange-700 mb-1">{label}</div>
      <p className="text-slate-700">
        Give NaHCO₃ <strong>{dose} mEq</strong> mixed with 1:1 mL of sterile water for injection
        or D5W IV infusion over 4–8 hours.
      </p>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Metabolic Acidosis Correction</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Metabolic Acidosis Correction</h1>
      <p className="text-sm text-slate-500 mb-6">Fill in patient data then click Calculate to generate NaHCO₃ orders.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: "Weight (kg)", val: weight, set: setWeight, placeholder: "e.g. 18" },
            { label: "Serum HCO₃ (mmol/L)", val: hco3, set: setHco3, placeholder: "e.g. 13" },
            { label: "Base Deficit (mmol/L)", val: baseDef, set: setBaseDef, placeholder: "e.g. 7" },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={val}
                placeholder={placeholder}
                onChange={(e) => { set(e.target.value); markDirty(); }}
                onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {result && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {result && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Inputs changed — click Recalculate</span>
          )}
          {snap && !dirty && (
            <span className="text-xs text-slate-500">Results for {snap.w} kg | HCO₃ {snap.h} | BD {snap.b}</span>
          )}
        </div>
      </div>

      {!result && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter patient data above and click <strong className="text-slate-600">Calculate</strong> to see NaHCO₃ orders.
        </div>
      )}

      {result && !dirty && snap && (
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-orange-700 border-b border-orange-100 pb-2 mb-4">
              Formula Based on Serum HCO₃
            </h2>
            <div className="text-xs text-slate-500 mb-3 font-mono">
              = 0.5 × {snap.w} kg × (24 − {snap.h}) = {(0.5 * snap.w * (24 - snap.h)).toFixed(1)} mEq
            </div>
            <div className="space-y-3">
              <OrderBox label="FULL Correction" dose={result.fullHCO3} />
              <OrderBox label="HALF Correction" dose={result.halfHCO3} />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-orange-700 border-b border-orange-100 pb-2 mb-4">
              Formula Based on Base Deficit
            </h2>
            <div className="text-xs text-slate-500 mb-3 font-mono">
              = 0.3 × {snap.w} kg × {snap.b} = {(0.3 * snap.w * snap.b).toFixed(1)} mEq
            </div>
            <div className="space-y-3">
              <OrderBox label="FULL Correction" dose={result.fullBD} />
              <OrderBox label="HALF Correction" dose={result.halfBD} />
            </div>
          </section>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-amber-800">Maximum Dose Per Day</div>
              <div className="text-xs text-amber-600 mt-1">Based on patient weight (8 mEq/kg/day)</div>
            </div>
            <div className="text-2xl font-bold text-amber-700">{result.maxPerDay} mEq/day</div>
          </div>
        </div>
      )}

      <Attribution />
    </div>
  );
}
