"use client";

import { useState } from "react";
import { calcAppendix, type AppendixResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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

  return (
    <CalcShell
      sigil="📐"
      title="Appendix — BSA, BMI, GIR &amp; eGFR"
      description="Fill in all relevant data then click Calculate."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* BSA & BMI inputs */}
        <section className="np-card">
          <h2 className="np-section-heading" style={{ color: "var(--np-primary)", borderColor: "var(--np-primary-soft)" }}>
            BSA &amp; BMI
          </h2>
          <div className="space-y-3">
            <div>
              <label className="np-label">Weight (kg)</label>
              <input type="number" step="0.1" value={weight} placeholder="e.g. 15"
                onChange={e => { setWeight(e.target.value); markDirty(); }} className="np-input" />
            </div>
            <div>
              <label className="np-label">Height (cm)</label>
              <input type="number" step="0.5" value={height} placeholder="e.g. 105"
                onChange={e => { setHeight(e.target.value); markDirty(); }} className="np-input" />
            </div>
          </div>
        </section>

        {/* eGFR inputs */}
        <section className="np-card">
          <h2 className="np-section-heading" style={{ color: "var(--np-primary)", borderColor: "var(--np-primary-soft)" }}>
            eGFR (Revised Schwartz)
          </h2>
          <div className="space-y-3">
            <div>
              <label className="np-label">Patient Length / Height (cm)</label>
              <input type="number" step="0.5" value={length} placeholder="e.g. 35"
                onChange={e => { setLength(e.target.value); markDirty(); }} className="np-input" />
            </div>
            <div>
              <label className="np-label">Serum Creatinine (μmol/L)</label>
              <input type="number" step="1" value={creatinine} placeholder="e.g. 56"
                onChange={e => { setCreatinine(e.target.value); markDirty(); }} className="np-input" />
            </div>
          </div>
        </section>

        {/* GIR fluids */}
        <section className="np-card lg:col-span-2">
          <h2 className="np-section-heading" style={{ color: "var(--np-primary)", borderColor: "var(--np-primary-soft)" }}>
            GIR — Glucose Infusion Rate
          </h2>
          <p style={{ fontSize: 12, color: "var(--np-fg-3)", marginBottom: 12 }}>
            Put 0 for unused slots (e.g. if NPO, keep feeding fields at 0).
          </p>
          <div className="mb-4 overflow-x-auto">
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--np-fg-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              IV Fluids
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--np-surface-sunken)" }}>
                  <th className="text-left px-2 py-1" style={{ fontSize: 11, color: "var(--np-fg-3)", fontWeight: 600 }}>Fluid</th>
                  <th className="text-left px-2 py-1" style={{ fontSize: 11, color: "var(--np-fg-3)", fontWeight: 600 }}>Dextrose %</th>
                  <th className="text-left px-2 py-1" style={{ fontSize: 11, color: "var(--np-fg-3)", fontWeight: 600 }}>Rate (mL/hr)</th>
                </tr>
              </thead>
              <tbody>
                {fluids.map((f, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--np-border)" }}>
                    <td className="px-2 py-1.5" style={{ fontSize: 12, color: "var(--np-fg-3)" }}>Fluid {i + 1}</td>
                    <td className="px-2 py-1.5">
                      <input type="number" min="0" step="0.5" value={f.dextrose}
                        onChange={(e) => updateFluid(i, "dextrose", e.target.value)}
                        style={{ width: 96, borderRadius: 8, border: "1px solid var(--np-border-strong)", padding: "5px 10px", fontSize: 13, fontFamily: "var(--np-font-mono)", outline: "none", background: "var(--np-surface)" }} />
                    </td>
                    <td className="px-2 py-1.5">
                      <input type="number" min="0" step="0.1" value={f.rate}
                        onChange={(e) => updateFluid(i, "rate", e.target.value)}
                        style={{ width: 96, borderRadius: 8, border: "1px solid var(--np-border-strong)", padding: "5px 10px", fontSize: 13, fontFamily: "var(--np-font-mono)", outline: "none", background: "var(--np-surface)" }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--np-fg-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Enteral Feeding
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="np-label">Glucose content (g/dL)</label>
                <input type="number" min="0" step="0.1" value={feedingGlucose}
                  onChange={e => { setFeedingGlucose(e.target.value); markDirty(); }} className="np-input" />
                <div style={{ fontSize: 11, color: "var(--np-fg-4)", marginTop: 3 }}>EBM: 7.1 | Term: 7.1 | Preterm: 8.5</div>
              </div>
              <div>
                <label className="np-label">Amount (mL/feed)</label>
                <input type="number" min="0" step="1" value={feedingAmount}
                  onChange={e => { setFeedingAmount(e.target.value); markDirty(); }} className="np-input" />
              </div>
              <div>
                <label className="np-label">Frequency (every N hours)</label>
                <input type="number" min="0" step="0.5" value={feedingFrequency}
                  onChange={e => { setFeedingFrequency(e.target.value); markDirty(); }} className="np-input" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCalculate}
          disabled={!weight || parseFloat(weight) <= 0}
          className="np-btn np-btn-primary"
        >
          {result && !dirty ? "Recalculate" : "Calculate"}
        </button>
        {result && dirty && <span className="np-dirty-warn">⚠ Inputs changed — click Recalculate</span>}
      </div>

      {!result && (
        <div className="np-empty">
          Fill in the data above and click <strong>Calculate</strong> to see results.
        </div>
      )}

      {result && !dirty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-primary)", borderColor: "var(--np-primary-soft)" }}>BSA &amp; BMI Results</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "BSA", val: result.bsa, unit: "m²" },
                { label: "BMI", val: result.bmi, unit: "kg/m²" },
              ].map(({ label, val, unit }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: "var(--np-primary-soft)", border: "1px solid #A5D3D8" }}>
                  <div style={{ fontSize: 11, color: "var(--np-primary)", fontWeight: 600 }}>{label}</div>
                  <div className="np-value" style={{ fontSize: 28, color: "var(--np-secondary)" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--np-primary)" }}>{unit}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-primary)", borderColor: "var(--np-primary-soft)" }}>eGFR Results</h2>
            <div className="grid grid-cols-2 gap-2" style={{ fontSize: 12 }}>
              {[
                { label: "Pre-term (0–12 mo)", val: result.egfr_preterm },
                { label: "Full-term (0–12 mo)", val: result.egfr_fullterm },
                { label: "Child (1–12 yr)", val: result.egfr_child },
                { label: "Adolescent (12–17 yr)", val: result.egfr_adolescent },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ background: "var(--np-primary-soft)", border: "1px solid #A5D3D8" }}>
                  <div style={{ color: "var(--np-primary)" }}>{label}</div>
                  <div style={{ fontFamily: "var(--np-font-mono)", fontWeight: 700, fontSize: 15, color: "var(--np-secondary)" }}>{val}</div>
                  <div style={{ color: "var(--np-primary)", fontSize: 10 }}>mL/min/1.73m²</div>
                </div>
              ))}
            </div>
          </div>

          <div className="np-card lg:col-span-2">
            <h2 className="np-section-heading" style={{ color: "var(--np-primary)", borderColor: "var(--np-primary-soft)" }}>GIR Results</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Fluids GIR", val: result.fluidsGIR, highlight: false },
                { label: "Feeding GIR", val: result.feedingGIR, highlight: false },
                { label: "Total GIR", val: result.totalGIR, highlight: true },
              ].map(({ label, val, highlight }) => (
                <div key={label} className="rounded-lg p-4 text-center border" style={{
                  background: highlight ? "#B3D9DD" : "var(--np-primary-soft)",
                  borderColor: highlight ? "#7CB3B9" : "#A5D3D8",
                }}>
                  <div style={{ fontSize: 12, color: "var(--np-primary)", fontWeight: 600 }}>{label}</div>
                  <div className="np-value" style={{ fontSize: 28, color: "var(--np-secondary)" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "var(--np-primary)" }}>mg/kg/min</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </CalcShell>
  );
}
