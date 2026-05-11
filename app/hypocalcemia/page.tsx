"use client";

import { useState } from "react";
import Link from "next/link";
import { calcHypocalcemia, type HypocalcemiaResult } from "@/lib/calculations";
import Attribution from "@/components/Attribution";

export default function HypocalcemiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [glucDoseIV, setGlucDoseIV] = useState<string>("100");
  const [chlorDoseIV, setChlorDoseIV] = useState<string>("15");
  const [elemCaDoseOral, setElemCaDoseOral] = useState<string>("15");
  const [serumCa, setSerumCa] = useState<string>("1.4");
  const [albumin, setAlbumin] = useState<string>("20");
  const [serumPhosphate, setSerumPhosphate] = useState<string>("3");

  const [result, setResult] = useState<HypocalcemiaResult | null>(null);
  const [snap, setSnap] = useState<{ w: number; g: number; c: number; o: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const g = parseFloat(glucDoseIV) || 0;
    const c = parseFloat(chlorDoseIV) || 0;
    const o = parseFloat(elemCaDoseOral) || 0;
    setResult(calcHypocalcemia(w, g, c, o, parseFloat(serumCa) || 0, parseFloat(albumin) || 0, parseFloat(serumPhosphate) || 0));
    setSnap({ w, g, c, o });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none";

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Home</Link>
        <span className="text-slate-400">/</span>
        <span className="text-sm text-slate-600">Hypocalcemia Correction</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Hypocalcemia Correction</h1>
      <p className="text-sm text-slate-500 mb-6">Fill in patient data then click Calculate to generate orders.</p>

      {/* Inputs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
            <input type="number" min="0.1" step="0.1" value={weight} placeholder="e.g. 20"
              onChange={e => { setWeight(e.target.value); markDirty(); }} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ca Gluconate IV dose (mg/kg)</label>
            <input type="number" min="50" max="200" step="1" value={glucDoseIV}
              onChange={e => { setGlucDoseIV(e.target.value); markDirty(); }} className={inputClass} />
            <div className="text-xs text-slate-400 mt-0.5">Neonates: 100–200 | Older: 50–125</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ca Chloride IV dose (mg/kg)</label>
            <input type="number" min="10" max="20" step="1" value={chlorDoseIV}
              onChange={e => { setChlorDoseIV(e.target.value); markDirty(); }} className={inputClass} />
            <div className="text-xs text-slate-400 mt-0.5">Range: 10–20 mg/kg</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Elemental Ca oral dose (mg/kg)</label>
            <input type="number" min="8" max="19" step="1" value={elemCaDoseOral}
              onChange={e => { setElemCaDoseOral(e.target.value); markDirty(); }} className={inputClass} />
            <div className="text-xs text-slate-400 mt-0.5">Neonates: 13–19 | Older: 8–19</div>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-600 mb-3">Reference Values</div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Serum Ca (mmol/L)</label>
              <input type="number" step="0.1" value={serumCa}
                onChange={e => { setSerumCa(e.target.value); markDirty(); }} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Serum Albumin (g/L)</label>
              <input type="number" step="1" value={albumin}
                onChange={e => { setAlbumin(e.target.value); markDirty(); }} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Serum Phosphate (mmol/L)</label>
              <input type="number" step="0.1" value={serumPhosphate}
                onChange={e => { setSerumPhosphate(e.target.value); markDirty(); }} className={inputClass} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
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
          Enter patient data above and click <strong className="text-slate-600">Calculate</strong> to see calcium orders.
        </div>
      )}

      {result && !dirty && snap && (
        <div className="space-y-5">
          {/* Reference panel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-600 mb-1">Corrected Calcium (for albumin)</div>
              <div className="text-2xl font-bold text-slate-800">{result.correctedCa.toFixed(2)} mmol/L</div>
              <div className="text-xs text-slate-500 mt-1">= ((40 − albumin) × 0.02) + Ca</div>
            </div>
            <div className={`border rounded-lg p-4 ${result.crystallizationRatio > 4 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
              <div className="text-xs font-semibold text-slate-600 mb-1">Crystallization Ratio (Ca × PO₄)</div>
              <div className={`text-2xl font-bold ${result.crystallizationRatio > 4 ? "text-red-700" : "text-green-700"}`}>
                {result.crystallizationRatio.toFixed(2)}
              </div>
              <div className="text-xs mt-1">
                {result.crystallizationRatio > 4
                  ? "⚠ >4: Give IV calcium over longer period to avoid crystallization"
                  : "✓ Safe ratio (<4)"}
              </div>
            </div>
          </div>

          {/* Symptomatic */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-red-700 border-b border-red-100 pb-2 mb-4">
              Symptomatic Hypocalcemia (Convulsions, Laryngospasm, Carpopedal Spasm, Tetany)
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "Ca Gluconate 1 mL/kg IV bolus",
                  order: `Give Ca Gluconate IV bolus ${result.gluconate1mlKg.toFixed(0)} mL diluted in ${result.gluconate1mlKgDilution.toFixed(0)} mL D5W or NS over 10–30 min under CPM.`,
                  note: "Max 20 mL/dose — May repeat in 10–20 min if no response",
                },
                {
                  title: "Ca Gluconate 2 mL/kg IV bolus",
                  order: `Give Ca Gluconate IV bolus ${result.gluconate2mlKg.toFixed(0)} mL diluted in ${result.gluconate2mlKgDilution.toFixed(0)} mL D5W or NS over 10–30 min under CPM.`,
                  note: "",
                },
                {
                  title: "Ca Chloride 0.2 mL/kg IV bolus",
                  order: `Give Ca Chloride IV bolus ${result.chloride02mlKg.toFixed(1)} mL diluted in ${result.chloride02mlKg.toFixed(1)} mL NS over 10 min under CPM.`,
                  note: "Max 10 mL/dose",
                },
              ].map(({ title, order, note }) => (
                <div key={title} className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm">
                  <div className="font-semibold mb-1">{title}</div>
                  <p className="font-mono text-slate-700">{order}</p>
                  {note && <div className="text-xs text-orange-600 mt-1">{note}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* Asymptomatic unsafe */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-yellow-700 border-b border-yellow-100 pb-2 mb-4">
              Asymptomatic — Unsafe (Ca &lt; 1.6 mmol/L) — IV Only
            </h2>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm">
                <div className="font-semibold mb-1">
                  Calcium Gluconate {snap.g} mg/kg IV
                  <span className="text-xs font-normal text-orange-600 ml-2">(Max 2000 mg/dose)</span>
                </div>
                <p className="font-mono text-slate-700">
                  Give Ca Gluconate IV <strong>{result.gluconateIV_mg.toFixed(0)} mg</strong> = {result.gluconateIV_elemCa.toFixed(0)} mg elemental Ca ={" "}
                  <strong>{result.gluconateIV_vol.toFixed(0)} mL</strong> diluted in{" "}
                  <strong>{result.gluconateIV_dilution.toFixed(0)} mL</strong> D5W or NS over 20–60 min under CPM.
                </p>
                <div className="text-xs text-slate-500 mt-1">May be repeated every 6 hours.</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm">
                <div className="font-semibold mb-1">
                  Calcium Chloride {snap.c} mg/kg IV
                  <span className="text-xs font-normal text-orange-600 ml-2">(Max 1000 mg/dose)</span>
                </div>
                <p className="font-mono text-slate-700">
                  Give Ca Chloride IV <strong>{result.chlorideIV_mg.toFixed(0)} mg</strong> = {result.chlorideIV_elemCa.toFixed(0)} mg elemental Ca ={" "}
                  <strong>{result.chlorideIV_vol.toFixed(0)} mL</strong> diluted in{" "}
                  <strong>{result.chlorideIV_dilution.toFixed(0)} mL</strong> NS over {result.chlorideIV_infusionMin}–60 min under CPM.
                </p>
                <div className="text-xs text-slate-500 mt-1">May be repeated every 4–6 hours.</div>
              </div>
            </div>
          </section>

          {/* Asymptomatic safe */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-green-700 border-b border-green-100 pb-2 mb-4">
              Asymptomatic — Safe (Ca &gt; 1.6 mmol/L) — Oral Preferred
            </h2>
            <div className="space-y-3 text-sm">
              {[
                { name: "Calcium Gluconate", dose: result.gluconateOral_mg, note: "Same IV preparation can be given orally" },
                { name: "Calcium Carbonate", dose: result.carbonateOral_mg, note: "Administer with meals if using for phosphate-binding" },
                { name: "Calcium Glubionate", dose: result.glubionateOral_mg, note: "" },
              ].map(({ name, dose, note }) => (
                <div key={name} className="bg-green-50 border border-green-100 rounded-lg p-3">
                  <p className="font-mono text-slate-700">
                    <strong>{name}</strong> — {dose} mg as{" "}
                    <strong>{snap.o} mg/kg = {(snap.o * snap.w).toFixed(0)} mg elemental Ca</strong> PO every 6 hours
                  </p>
                  {note && <div className="text-xs text-slate-500 mt-1">({note})</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <Attribution />
    </div>
  );
}
