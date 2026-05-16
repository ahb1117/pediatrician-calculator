"use client";

import { useState } from "react";
import { calcHyponatremia, type HyponatremiaResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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
    <CalcShell
      sigil="💧"
      title="Hypovolemic Hyponatremia Correction"
      description="Enter patient data then click Calculate for 3% NaCl orders."
    >
      <div className="np-card mb-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Weight (kg)", val: weight, set: setWeight, placeholder: "e.g. 15", step: "0.1" },
            { label: "3% NaCl dose (mL/kg) [2–5]", val: dose3pct, set: setDose3pct, placeholder: "e.g. 3", step: "0.5" },
            { label: "Current Na (mmol/L)", val: currentNa, set: setCurrentNa, placeholder: "e.g. 117", step: "1" },
            { label: "Desired Na (mmol/L)", val: desiredNa, set: setDesiredNa, placeholder: "e.g. 122", step: "1" },
          ].map(({ label, val, set, placeholder, step }) => (
            <div key={label}>
              <label className="np-label">{label}</label>
              <input
                type="number" step={step}
                value={val} placeholder={placeholder}
                onChange={(e) => { set(e.target.value); markDirty(); }}
                onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                className="np-input"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="np-btn np-btn-primary"
          >
            {result && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {result && dirty && <span className="np-dirty-warn">⚠ Inputs changed — click Recalculate</span>}
          {snap && !dirty && <span style={{ fontSize: 12, color: "var(--np-fg-3)" }}>Results for {snap.w} kg</span>}
        </div>
      </div>

      {!result && (
        <div className="np-empty">
          Enter patient data above and click <strong>Calculate</strong> to see orders.
        </div>
      )}

      {result && !dirty && (
        <div className="space-y-5">
          {/* Symptomatic */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-danger)", borderColor: "#FEE2E2" }}>
              Symptomatic Hyponatremia (Convulsions)
            </h2>
            <div className="rounded-lg border p-4" style={{ background: "var(--np-danger-soft)", borderColor: "#FCA5A5", fontFamily: "var(--np-font-mono)", fontSize: 13 }}>
              <p style={{ color: "var(--np-fg-1)" }}>
                Give 3% NaCl IV bolus <strong>{result.symptomaticVol.toFixed(0)} mL</strong> over 20 minutes.
                <span style={{ color: "var(--np-warning)", marginLeft: 4 }}>(Maximum 150 mL/dose)</span>
              </p>
            </div>
            <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 8 }}>Dose range: 2–5 mL/kg</div>
          </section>

          {/* Asymptomatic unsafe */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-warning)", borderColor: "#FEF3C7" }}>
              Asymptomatic — Unsafe (Na &lt; 120 mmol/L)
            </h2>
            <div className={`mb-3 rounded-lg px-3 py-2 text-xs font-medium border`} style={{
              background: deltaNaOk ? "var(--np-success-soft)" : "var(--np-warning-soft)",
              borderColor: deltaNaOk ? "#86EFAC" : "#FDE68A",
              color: deltaNaOk ? "var(--np-success)" : "var(--np-warning)",
              fontFamily: "var(--np-font-body)", fontSize: 12,
            }}>
              ΔNa = {result.deltaNa.toFixed(1)} mmol/L
              {deltaNaOk ? " ✓ (within 4–6 range)" : " — Target should be 4–6 mmol/L. Adjust Desired Na."}
            </div>
            <div className="rounded-lg border p-4" style={{ background: "var(--np-warning-soft)", borderColor: "#FDE68A", fontFamily: "var(--np-font-mono)", fontSize: 13 }}>
              <p style={{ color: "var(--np-fg-1)" }}>
                Give 3% NaCl <strong>{result.asymptomaticMEq.toFixed(0)} mEq (mmol)</strong>{" "}
                (= <strong>{result.asymptomaticVol.toFixed(0)} mL</strong>) diluted in{" "}
                <strong>{result.asymptomaticVol.toFixed(0)} mL</strong> D5W IV infusion over 4 hours.
              </p>
            </div>
            <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 8 }}>Target: raise Na to safe level (&gt;120 mmol/L)</div>
          </section>

          {/* Safe */}
          <div className="np-banner np-banner-info">
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Asymptomatic — Safe (Na &gt; 120 mmol/L)</div>
              <div>Calculate fluid maintenance and deficit and give it as NS.</div>
            </div>
          </div>
        </div>
      )}
    </CalcShell>
  );
}
