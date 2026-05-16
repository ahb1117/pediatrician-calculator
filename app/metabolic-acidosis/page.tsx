"use client";

import { useState } from "react";
import { calcMetabolicAcidosis, type MetabolicAcidosisResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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
    <div className="rounded-lg border p-4" style={{ background: "#FFF7ED", borderColor: "#FED7AA" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#C2410C", marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{label}</div>
      <p style={{ fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
        Give NaHCO₃ <strong>{dose} mEq</strong> mixed with 1:1 mL of sterile water for injection
        or D5W IV infusion over 4–8 hours.
      </p>
    </div>
  );

  return (
    <CalcShell
      sigil="🧪"
      title="Metabolic Acidosis Correction"
      description="Fill in patient data then click Calculate to generate NaHCO₃ orders."
    >
      <div className="np-card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: "Weight (kg)", val: weight, set: setWeight, placeholder: "e.g. 18" },
            { label: "Serum HCO₃ (mmol/L)", val: hco3, set: setHco3, placeholder: "e.g. 13" },
            { label: "Base Deficit (mmol/L)", val: baseDef, set: setBaseDef, placeholder: "e.g. 7" },
          ].map(({ label, val, set, placeholder }) => (
            <div key={label}>
              <label className="np-label">{label}</label>
              <input
                type="number" min="0" step="0.1"
                value={val}
                placeholder={placeholder}
                onChange={(e) => { set(e.target.value); markDirty(); }}
                onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                className="np-input"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="np-btn np-btn-primary"
          >
            {result && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {result && dirty && <span className="np-dirty-warn">⚠ Inputs changed — click Recalculate</span>}
          {snap && !dirty && (
            <span style={{ fontSize: 12, color: "var(--np-fg-3)" }}>
              Results for {snap.w} kg | HCO₃ {snap.h} | BD {snap.b}
            </span>
          )}
        </div>
      </div>

      {!result && (
        <div className="np-empty">
          Enter patient data above and click <strong>Calculate</strong> to see NaHCO₃ orders.
        </div>
      )}

      {result && !dirty && snap && (
        <div className="space-y-6">
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "#C2410C", borderColor: "#FED7AA" }}>
              Formula Based on Serum HCO₃
            </h2>
            <div style={{ fontFamily: "var(--np-font-mono)", fontSize: 12, color: "var(--np-fg-3)", marginBottom: 12 }}>
              = 0.5 × {snap.w} kg × (24 − {snap.h}) = {(0.5 * snap.w * (24 - snap.h)).toFixed(1)} mEq
            </div>
            <div className="space-y-3">
              <OrderBox label="FULL Correction" dose={result.fullHCO3} />
              <OrderBox label="HALF Correction" dose={result.halfHCO3} />
            </div>
          </section>

          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "#C2410C", borderColor: "#FED7AA" }}>
              Formula Based on Base Deficit
            </h2>
            <div style={{ fontFamily: "var(--np-font-mono)", fontSize: 12, color: "var(--np-fg-3)", marginBottom: 12 }}>
              = 0.3 × {snap.w} kg × {snap.b} = {(0.3 * snap.w * snap.b).toFixed(1)} mEq
            </div>
            <div className="space-y-3">
              <OrderBox label="FULL Correction" dose={result.fullBD} />
              <OrderBox label="HALF Correction" dose={result.halfBD} />
            </div>
          </section>

          <div className="np-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 600, color: "var(--np-secondary)", fontFamily: "var(--np-font-display)" }}>Maximum Dose Per Day</div>
              <div style={{ fontSize: 12, color: "var(--np-fg-3)", marginTop: 2 }}>Based on patient weight (8 mEq/kg/day)</div>
            </div>
            <div className="np-value">{result.maxPerDay} <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mEq/day</span></div>
          </div>
        </div>
      )}
    </CalcShell>
  );
}
