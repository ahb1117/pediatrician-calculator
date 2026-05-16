"use client";

import { useState } from "react";
import { calcHyperkalemia, type HyperkalemiaResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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
    <div className="np-card">
      <div style={{ fontWeight: 600, color: "var(--np-secondary)", fontFamily: "var(--np-font-display)", marginBottom: 10 }}>{title}</div>
      <div className="rounded-lg p-3 border" style={{ background: "var(--np-danger-soft)", borderColor: "#FCA5A5", fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
        {order}
      </div>
      {note && <div style={{ fontSize: 11, color: "var(--np-warning)", marginTop: 6 }}>{note}</div>}
    </div>
  );

  return (
    <CalcShell
      sigil="📊"
      title="Hyperkalemia Management"
      description="Weight-based dosing for acute hyperkalemia management. This is only a dose calculator — refer to protocol for full clinical guidance."
    >
      <div className="np-banner np-banner-warn mb-4">
        <span>This is only a dose calculator. Refer to the hyperkalemia management protocol for full clinical guidance.</span>
      </div>

      <div className="np-card mb-6">
        <label className="np-label">Patient Weight (kg)</label>
        <div className="flex items-center gap-3">
          <input
            type="number" min="0.5" max="200" step="0.1"
            value={weight} placeholder="e.g. 23"
            onChange={(e) => { setWeight(e.target.value); setDirty(true); }}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="np-input" style={{ maxWidth: 180 }}
          />
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="np-btn np-btn-primary"
          >
            {result && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {result && dirty && <span className="np-dirty-warn">⚠ Weight changed — click Recalculate</span>}
        </div>
        {calculatedWeight && !dirty && (
          <div style={{ marginTop: 8, fontSize: 12, color: "var(--np-fg-3)" }}>
            Showing results for weight: <strong>{calculatedWeight} kg</strong>
          </div>
        )}
      </div>

      {!result && (
        <div className="np-empty">
          Enter patient weight above and click <strong>Calculate</strong> to see medication orders.
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
          <div className="np-card">
            <div style={{ fontWeight: 600, color: "var(--np-secondary)", fontFamily: "var(--np-font-display)", marginBottom: 10 }}>Ventolin (Salbutamol)</div>
            {ventolin && (
              <div className="rounded-lg p-3 border" style={{ background: "var(--np-danger-soft)", borderColor: "#FCA5A5", fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
                <span style={{ fontWeight: 600 }}>{ventolin.label}:</span> Ventolin {ventolin.dose} may be repeated {ventolin.freq}
              </div>
            )}
            <div className="mt-2 grid grid-cols-2 gap-1" style={{ fontSize: 12, color: "var(--np-fg-3)" }}>
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
    </CalcShell>
  );
}
