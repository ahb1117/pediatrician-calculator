"use client";

import { useState } from "react";
import Link from "next/link";
import { calcStatusEpilepticus, type StatusEpilepticusResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

function fmt(n: number, d = 1) {
  return +n.toFixed(d);
}

export default function StatusEpilepticusPage() {
  const [weight, setWeight] = useState<string>("");
  const [result, setResult] = useState<StatusEpilepticusResult | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    setResult(calcStatusEpilepticus(w));
    setCalculatedWeight(w);
    setDirty(false);
  }

  function handleWeightChange(val: string) {
    setWeight(val);
    setDirty(true);
  }

  const r = result;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Status Epilepticus</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Status Epilepticus Medications Calculator</h1>
      <p className="text-sm text-slate-500 mb-6">Enter patient weight then click Calculate to generate all medication orders.</p>

      {/* Input card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Patient Weight (kg)</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0.5"
            max="200"
            step="0.1"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="w-48 rounded-md border border-slate-300 px-3 py-2 text-base font-mono shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder="e.g. 15"
          />
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {r && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {r && dirty && (
            <span className="text-xs text-amber-600 font-medium">⚠ Weight changed — click Recalculate</span>
          )}
        </div>
        {calculatedWeight && !dirty && (
          <div className="mt-2 text-xs text-slate-500">Showing results for weight: <strong>{calculatedWeight} kg</strong></div>
        )}
      </div>

      {/* Results */}
      {r && !dirty && (
        <div className="space-y-6">
          {/* Phase 1 — IV */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-red-700 border-b border-red-100 pb-2 mb-4">
              Phase 1 — IV Benzodiazepines (1st dose; repeat after 5 min if no response)
            </h2>
            <div className="space-y-3">
              {[
                { drug: "Midazolam", dose: r.midazolamIV, max: "10 mg/dose" },
                { drug: "Lorazepam", dose: r.lorazepamIV, max: "4 mg/dose" },
                { drug: "Diazepam", dose: r.diazepamIV, max: "10 mg/dose" },
              ].map(({ drug, dose, max }) => (
                <div key={drug} className="flex items-start justify-between gap-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <div className="font-semibold text-slate-800">{drug}</div>
                    <div className="text-xs text-slate-500">IV over 2 minutes</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-700">{fmt(dose)} mg</div>
                    <div className="text-xs text-orange-600 font-medium">Max: {max}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 1 alternative */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-orange-700 border-b border-orange-100 pb-2 mb-4">
              If IV Access Not Achieved Within 3 Minutes
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="font-semibold text-slate-800">Midazolam — Buccal</div>
                <div className="text-sm text-slate-600 mt-1">May use same IV preparation</div>
                <div className="text-lg font-bold text-orange-700 mt-1">
                  {fmt(r.midazolamBuccalMin)} – {fmt(r.midazolamBuccalMax)} mg
                  <span className="text-xs font-normal text-orange-600 ml-2">(Max: 10 mg/dose)</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="font-semibold text-slate-800">Midazolam — Intranasal</div>
                <div className="text-lg font-bold text-orange-700 mt-1">
                  {fmt(r.midazolamIntranasal)} mg <span className="text-sm font-normal text-slate-500">(divided per naris)</span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <div className="font-semibold text-slate-800">Diazepam — Rectal</div>
                <div className="text-xs text-slate-500 mt-1">Max: 20 mg/dose</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { label: "Age 2–5 yr", dose: r.diazepamRectalAge2_5 },
                    { label: "Age 6–11 yr", dose: r.diazepamRectalAge6_11 },
                    { label: "Age ≥12 yr", dose: r.diazepamRectalAge12plus },
                  ].map(({ label, dose }) => (
                    <div key={label} className="text-center">
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="font-bold text-orange-700">{fmt(dose)} mg</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Phase 2 */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-purple-700 border-b border-purple-100 pb-2 mb-4">
              Phase 2 — After 2 Doses of Benzodiazepines (10+ minutes of seizure)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Note: Onset is delayed. Consider an additional benzodiazepine dose while administering these agents.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="font-semibold text-slate-800">Phenobarbital</div>
                <div className="text-lg font-bold text-purple-700 mt-1">
                  {fmt(r.phenobarbitalMin)} – {fmt(r.phenobarbitalMax)} mg
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Diluted in {fmt(r.phenobarbitalDilution)} mL NS over 10–15 minutes
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  May repeat every 15 min. Max total: {fmt(r.phenobarbitalMaxTotal)} mg
                  <span className="ml-1 text-orange-600">(Max per dose: 1000 mg)</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="font-semibold text-slate-800">Levetiracetam (Keppra)</div>
                <div className="mt-2 space-y-1">
                  <div>
                    <span className="text-xs font-medium text-slate-500">Neonates: </span>
                    <span className="font-bold text-purple-700">{fmt(r.levetiracetamNeonates)} mg</span>
                    <span className="text-xs text-slate-500"> diluted in {r.levetiracetamNeonatesDilution} mL NS over 15 min</span>
                    <span className="text-xs text-orange-600 ml-1">(Max: 4500 mg)</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">Older patients: </span>
                    <span className="font-bold text-purple-700">{fmt(r.levetiracetamOlder)} mg</span>
                    <span className="text-xs text-slate-500"> diluted in {fmt(r.levetiracetamOlderDilution)} mL NS over 15 min</span>
                    <span className="text-xs text-orange-600 ml-1">(Max: 4500 mg)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="font-semibold text-slate-800">Valproic Acid (Depakene) — NOT for neonates</div>
                <div className="text-lg font-bold text-purple-700 mt-1">{fmt(r.valproicAcid)} mg</div>
                <div className="text-xs text-slate-600 mt-1">
                  Diluted in {r.valproicAcidDilution} mL NS over 10–15 minutes
                  <span className="text-orange-600 ml-1">(Max: 3000 mg/dose)</span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  2nd dose after 10 min if needed: {fmt(r.valproicAcid2nd)} mg diluted in {r.valproicAcid2ndDilution} mL NS
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="font-semibold text-slate-800">Phenytoin</div>
                <div className="text-lg font-bold text-purple-700 mt-1">{fmt(r.phenytoin)} mg</div>
                <div className="text-xs text-slate-600 mt-1">
                  Undiluted over 20 minutes OR {fmt(r.phenytoinTimeMin, 0)} minutes (whichever is longer)
                  <span className="text-orange-600 ml-1">(Max: 1500 mg/dose)</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="font-semibold text-slate-800">Fosphenytoin</div>
                <div className="text-lg font-bold text-purple-700 mt-1">{fmt(r.fosphenytoin)} mg PE</div>
                <div className="text-xs text-slate-600 mt-1">
                  Diluted in {fmt(r.fosphenytoinDilution)} mL NS over 10 minutes OR {r.fosphenytoinTimeMin} minutes (whichever is longer)
                  <span className="text-orange-600 ml-1">(Max: 1500 mg PE/dose)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Phase 3 */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="text-base font-semibold text-amber-800 mb-2">Phase 3 — Refractory Status Epilepticus</h2>
            <p className="text-sm text-amber-700">
              Defined as seizure activity persisting after a first-line benzodiazepine and a second-line antiseizure drug.
              These patients usually receive additional boluses of second-line antiseizure drugs or are placed in a medically
              induced coma with IV continuous infusions of an anesthetic (midazolam, propofol, or barbiturates).
            </p>
          </section>
        </div>
      )}

      {!r && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter patient weight above and click <strong className="text-slate-600">Calculate</strong> to see medication orders.
        </div>
      )}

      <Attribution />
    </div>
  );
}
