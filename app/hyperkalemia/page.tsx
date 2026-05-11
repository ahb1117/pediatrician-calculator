"use client";

import { useState } from "react";
import Link from "next/link";
import { calcHyperkalemia, type HyperkalemiaResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function HyperkalemiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [result, setResult] = useState<HyperkalemiaResult | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    setResult(calcHyperkalemia(w));
    setCalculatedWeight(w);
    setDirty(false);
  }

  const ventolin = calculatedWeight
    ? calculatedWeight < 1
      ? { label: "Neonates", dose: "0.25 to 0.5 mL + 3 mL NS Neb", freq: "Q2h PRN" }
      : calculatedWeight < 25
      ? { label: "Weight < 25 kg", dose: "0.5 mL + 3 mL NS Neb", freq: "PRN" }
      : calculatedWeight <= 50
      ? { label: "Weight 25–50 kg", dose: "1 mL + 3 mL NS Neb", freq: "PRN" }
      : { label: "Weight > 50 kg", dose: "2–4 mL + 3 mL NS Neb", freq: "PRN" }
    : null;

  const OrderCard = ({ title, order, note }: { title: string; order: string; note?: string }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="font-semibold text-slate-700 mb-3">{title}</div>
      <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 font-mono text-sm text-slate-700">{order}</div>
      {note && <div className="text-xs text-orange-600 mt-2">{note}</div>}
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Hyperkalemia Management</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Hyperkalemia Management</h1>
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        This is only a dose calculator. Refer to the hyperkalemia management protocol for full clinical guidance.
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Patient Weight (kg)</label>
        <div className="flex items-center gap-3">
          <input
            type="number" min="0.5" max="200" step="0.1"
            value={weight}
            placeholder="e.g. 23"
            onChange={(e) => { setWeight(e.target.value); setDirty(true); }}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="w-48 rounded-md border border-slate-300 px-3 py-2 text-base font-mono shadow-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {result && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {result && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Weight changed — click Recalculate</span>
          )}
        </div>
        {calculatedWeight && !dirty && (
          <div className="mt-2 text-xs text-slate-500">Showing results for weight: <strong>{calculatedWeight} kg</strong></div>
        )}
      </div>

      {!result && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter patient weight above and click <strong className="text-slate-600">Calculate</strong> to see medication orders.
        </div>
      )}

      {result && !dirty && (
        <div className="space-y-4">
          <OrderCard
            title="Calcium Gluconate"
            order={`Calcium gluconate ${result.caGluconate_mg.toFixed(0)} mg = ${result.caGluconate_elemCa.toFixed(0)} mg elemental calcium = ${result.caGluconate_ml.toFixed(0)} mL IV bolus over 5 minutes (can be repeated × 2 times).`}
            note="Maximum per dose = 2000 mg"
          />
          <OrderCard
            title="NaHCO₃"
            order={`NaHCO₃ ${result.nahco3_min.toFixed(0)} to ${result.nahco3_max.toFixed(0)} mEq mixed with 1:1 mL of D5W IV over 5–10 minutes.`}
            note={`Maximum per dose = ${result.nahco3_max.toFixed(0)} mEq`}
          />
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="font-semibold text-slate-700 mb-3">Ventolin (Salbutamol)</div>
            {ventolin && (
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 font-mono text-sm text-slate-700">
                <span className="font-semibold">{ventolin.label}:</span> Ventolin {ventolin.dose} may be repeated {ventolin.freq}
              </div>
            )}
            <div className="mt-2 text-xs text-slate-500 grid grid-cols-2 gap-1">
              <div>Neonates: 0.25–0.5 mL + 3 mL NS</div>
              <div>&lt;25 kg: 0.5 mL + 3 mL NS</div>
              <div>25–50 kg: 1 mL + 3 mL NS</div>
              <div>&gt;50 kg: 2–4 mL + 3 mL NS</div>
            </div>
          </div>
          <OrderCard
            title="Furosemide (Lasix)"
            order={`Furosemide ${result.furosemide_min.toFixed(0)} to ${result.furosemide_max.toFixed(0)} mg IV stat.`}
            note="Maximum per dose = 200 mg"
          />
          <OrderCard
            title="Insulin (Regular)"
            order={`Regular insulin ${result.insulin_units.toFixed(1)} unit${result.insulin_units !== 1 ? "s" : ""} + ${result.insulin_d25.toFixed(0)} mL of D25 or ${result.insulin_d5w.toFixed(0)} mL D5W IV infusion over 30 minutes.`}
          />
          <OrderCard
            title="Kayexalate (Sodium Polystyrene Sulfonate)"
            order={`Kayexalate ${result.kayexalate_g.toFixed(0)} grams PO Q6 hours, or PR Q2 hours.`}
            note="Maximum per dose: 15 g PO, 50 g PR"
          />
          <OrderCard
            title="Calcium Resonium (Calcium Polystyrene Sulfonate)"
            order={`Calcium Resonium ${result.caResonium_g.toFixed(0)} grams PO, or PR Q6 hours.`}
            note="Maximum per dose: 15 g PO, 30 g PR"
          />
        </div>
      )}

      <Attribution />
    </div>
  );
}
