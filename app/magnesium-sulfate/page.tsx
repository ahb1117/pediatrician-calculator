"use client";

import { useState } from "react";
import { calcMagnesium, type MagnesiumResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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
    <CalcShell
      sigil="⚗️"
      title="Magnesium Sulfate"
      description="Enter patient data then click Calculate. Max dose = 2000 mg/dose."
    >
      {/* Inputs */}
      <div className="np-card mb-6 space-y-4">
        <div>
          <label className="np-label">Patient Weight (kg)</label>
          <input
            type="number" min="0.5" max="200" step="0.1"
            value={weight}
            onChange={(e) => { setWeight(e.target.value); markDirty(); }}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="np-input" style={{ maxWidth: 160 }}
            placeholder="e.g. 15"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="np-label">Hypomagnesemia dose (mg/kg) — range 25–50</label>
            <input
              type="number" min="25" max="50" step="1"
              value={hypomagDose}
              onChange={(e) => { setHypomagDose(e.target.value); markDirty(); }}
              className="np-input" style={{ maxWidth: 130 }}
            />
          </div>
          <div>
            <label className="np-label">Asthma exacerbation dose (mg/kg) — range 25–75</label>
            <input
              type="number" min="25" max="75" step="1"
              value={asthmaDose}
              onChange={(e) => { setAsthmaDose(e.target.value); markDirty(); }}
              className="np-input" style={{ maxWidth: 130 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="np-btn np-btn-primary"
          >
            {hasResults && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {hasResults && dirty && <span className="np-dirty-warn">⚠ Inputs changed — click Recalculate</span>}
          {calculatedWeight && !dirty && (
            <span style={{ fontSize: 12, color: "var(--np-fg-3)" }}>Results for {calculatedWeight} kg</span>
          )}
        </div>
      </div>

      {/* Results */}
      {!hasResults && (
        <div className="np-empty">
          Enter patient data above and click <strong>Calculate</strong> to see orders.
        </div>
      )}

      {hasResults && !dirty && (
        <div className="space-y-6">
          {hypomagResult && (
            <section className="np-card">
              <h2 className="np-section-heading" style={{ color: "#7C3AED", borderColor: "#EDE9FE" }}>
                Order For Hypomagnesemia
              </h2>
              <div className="space-y-3">
                <div className="rounded-lg border p-4" style={{ background: "#FAF5FF", borderColor: "#DDD6FE", fontFamily: "var(--np-font-mono)", fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: "#6D28D9", marginBottom: 8 }}>Order for Neonates (every 8–12 hours):</div>
                  <p style={{ color: "var(--np-fg-1)" }}>
                    Give MgSO₄ <strong>{hypomagResult.totalDose.toFixed(0)} mg</strong> diluted in{" "}
                    <strong>{hypomagResult.minDilution} – {hypomagResult.maxDilution} mL</strong> of chosen fluid
                    (e.g. NS, D5W) IV infusion over <strong>{hypomagResult.infusionHours} hour{hypomagResult.infusionHours !== 1 ? "s" : ""}</strong> under CPM.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ background: "#FAF5FF", borderColor: "#DDD6FE", fontFamily: "var(--np-font-mono)", fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: "#6D28D9", marginBottom: 8 }}>Order for Older Patients (every 6 hours):</div>
                  <p style={{ color: "var(--np-fg-1)" }}>
                    Give MgSO₄ <strong>{hypomagResult.totalDose.toFixed(0)} mg</strong> diluted in{" "}
                    <strong>{hypomagResult.minDilution} – {hypomagResult.maxDilution} mL</strong> of chosen fluid
                    (e.g. NS, D5W) IV infusion over <strong>{hypomagResult.infusionHours} hour{hypomagResult.infusionHours !== 1 ? "s" : ""}</strong> under CPM.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { label: "Total Dose", val: `${hypomagResult.totalDose.toFixed(0)} mg` },
                    { label: "Dilution Range", val: `${hypomagResult.minDilution}–${hypomagResult.maxDilution} mL` },
                    { label: "Duration", val: `${hypomagResult.infusionHours} hr` },
                  ].map(({ label, val }) => (
                    <div key={label} className="text-center p-3 rounded-lg border" style={{ background: "var(--np-surface-sunken)", borderColor: "var(--np-border)" }}>
                      <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: "var(--np-font-mono)", fontWeight: 600, fontSize: 15, color: "var(--np-secondary)" }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {asthmaResult && (
            <section className="np-card">
              <h2 className="np-section-heading" style={{ color: "var(--np-info)", borderColor: "#BFDBFE" }}>
                Order For Acute Asthma Exacerbation
              </h2>
              <div className="rounded-lg border p-4" style={{ background: "var(--np-info-soft)", borderColor: "#BFDBFE", fontFamily: "var(--np-font-mono)", fontSize: 13 }}>
                <p style={{ color: "var(--np-fg-1)" }}>
                  Give MgSO₄ <strong>{asthmaResult.totalDose.toFixed(0)} mg</strong> diluted in{" "}
                  <strong>{asthmaResult.minDilution} – {asthmaResult.maxDilution} mL</strong> of chosen fluid
                  (e.g. NS, D5W) IV infusion over 15–60 minutes under CPM.
                </p>
              </div>
              <div style={{ fontSize: 12, color: "var(--np-warning)", fontWeight: 500, marginTop: 8 }}>Maximum = 2000 mg/dose</div>
            </section>
          )}
        </div>
      )}
    </CalcShell>
  );
}
