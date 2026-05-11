"use client";

import { useState } from "react";
import Link from "next/link";
import { calcInfusionRate, INFUSION_DRUGS, type InfusionDrug } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

function DrugCard({ drug, weight }: { drug: InfusionDrug; weight: number }) {
  const [conc, setConc] = useState(drug.defaultConc);
  const [dose, setDose] = useState(drug.defaultDose);
  const [rate, setRate] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    if (weight <= 0 || conc <= 0) return;
    setRate(calcInfusionRate(weight, dose, conc, drug.doseUnit));
    setDirty(false);
  }

  function handleChange<T>(setter: (v: T) => void, val: T) {
    setter(val);
    setDirty(true);
    setRate(null);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="font-semibold text-slate-800 mb-3">{drug.name}</div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 w-24 flex-shrink-0">Concentration</label>
          <input
            type="number"
            value={conc}
            min="0.01"
            step="any"
            onChange={(e) => handleChange(setConc, parseFloat(e.target.value) || 0)}
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm font-mono focus:border-blue-500 outline-none"
          />
          <span className="text-xs text-slate-500 w-16 flex-shrink-0">{drug.concUnit}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 w-24 flex-shrink-0">Dose</label>
          <input
            type="number"
            value={dose}
            min="0"
            step="any"
            onChange={(e) => handleChange(setDose, parseFloat(e.target.value) || 0)}
            className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm font-mono focus:border-blue-500 outline-none"
          />
          <span className="text-xs text-slate-500 w-16 flex-shrink-0">{drug.doseLabel}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={handleCalculate}
          disabled={weight <= 0 || conc <= 0}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md transition-colors"
        >
          Calculate
        </button>
        {rate !== null && !dirty ? (
          <span className="text-xl font-bold text-blue-700">
            {rate} <span className="text-sm font-normal text-slate-500">mL/hr</span>
          </span>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </div>
    </div>
  );
}

export default function InfusionRatePage() {
  const [weight, setWeight] = useState<string>("");
  const [confirmedWeight, setConfirmedWeight] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    setConfirmedWeight(w);
    setDirty(false);
  }

  const filtered = INFUSION_DRUGS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">PICU Infusion Rate Calculator</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">PICU Medication Infusion Rate Calculator</h1>
      <p className="text-sm text-slate-500 mb-1">Enter weight, then calculate each drug individually.</p>
      <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        Min infusion rate = 0.1 mL/hr. Consider more dilute preparation if rate &lt; 0.1 mL/hr.
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Patient Weight (kg)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.5"
              max="200"
              step="0.1"
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setDirty(true); }}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="w-36 rounded-md border border-slate-300 px-3 py-2 text-base font-mono shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="e.g. 10"
            />
            <button
              onClick={handleCalculate}
              disabled={!weight || parseFloat(weight) <= 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              Set Weight
            </button>
          </div>
          {confirmedWeight > 0 && !dirty && (
            <div className="mt-1 text-xs text-green-600 font-medium">✓ Weight set: {confirmedWeight} kg</div>
          )}
          {confirmedWeight > 0 && dirty && (
            <div className="mt-1 text-xs text-amber-600">Weight changed — click Set Weight to apply</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Search Drug</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter medications..."
            className="w-56 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {confirmedWeight <= 0 && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-12 text-center text-slate-400">
          Enter patient weight above and click <strong className="text-slate-600">Set Weight</strong> to enable the drug calculators.
        </div>
      )}

      {confirmedWeight > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((drug) => (
            <DrugCard key={drug.name} drug={drug} weight={confirmedWeight} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-400">No medications match your search.</div>
          )}
        </div>
      )}

      <Attribution />
    </div>
  );
}
