"use client";

import { useState } from "react";
import { calcHypophosphatemia, type PhosphateDoseRow } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

export default function HypophosphatemiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [kConc, setKConc] = useState<string>("60");
  const [rows, setRows] = useState<PhosphateDoseRow[]>([]);
  const [snap, setSnap] = useState<{ w: number; k: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    const k = parseFloat(kConc);
    if (!w || w <= 0 || !k || k <= 0) return;
    setRows(calcHypophosphatemia(w, k));
    setSnap({ w, k });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  return (
    <CalcShell
      sigil="🔬"
      title="Hypophosphatemia Correction"
      description="Enter patient data then click Calculate for KPO₄ and NaPO₄ orders."
    >
      {/* Dose guidance */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { phos: "PHOS > 0.6 mmol/L", dose: "0.16–0.31 mmol/kg" },
          { phos: "PHOS 0.3–0.6 mmol/L", dose: "0.32–0.43 mmol/kg" },
          { phos: "PHOS < 0.3 mmol/L", dose: "0.44–0.64 mmol/kg" },
        ].map(({ phos, dose }) => (
          <div key={phos} className="rounded-lg p-3 border" style={{ background: "var(--np-primary-soft)", borderColor: "#A5D3D8", fontSize: 12 }}>
            <div style={{ fontWeight: 600, color: "var(--np-secondary)" }}>{phos}</div>
            <div style={{ color: "var(--np-primary)", marginTop: 2 }}>→ {dose}</div>
          </div>
        ))}
      </div>

      <div className="np-card mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 400 }}>
          <div>
            <label className="np-label">Weight (kg)</label>
            <input type="number" min="0.5" max="200" step="0.1"
              value={weight} placeholder="e.g. 10"
              onChange={(e) => { setWeight(e.target.value); markDirty(); }}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="np-input" />
          </div>
          <div>
            <label className="np-label">K Concentration (mEq/L)</label>
            <input type="number" min="40" max="200" step="10"
              value={kConc}
              onChange={(e) => { setKConc(e.target.value); markDirty(); }}
              className="np-input" />
            <div style={{ fontSize: 11, color: "var(--np-fg-4)", marginTop: 3 }}>40–60 peripheral | up to 200 central</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleCalculate} disabled={!weight || parseFloat(weight) <= 0}
            className="np-btn np-btn-primary">
            {rows.length > 0 && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {rows.length > 0 && dirty && <span className="np-dirty-warn">⚠ Inputs changed — click Recalculate</span>}
          {snap && !dirty && <span style={{ fontSize: 12, color: "var(--np-fg-3)" }}>Results for {snap.w} kg | {snap.k} mEq/L</span>}
        </div>
      </div>

      <div className="np-banner np-banner-warn mb-4">
        <span>Max: 45 mmol phosphate/dose | 66 mEq K/dose. Safest to give 0.4+ mmol/kg doses over 6 hours.</span>
      </div>

      {rows.length === 0 && (
        <div className="np-empty">
          Enter weight and K concentration then click <strong>Calculate</strong> to see phosphate orders.
        </div>
      )}

      {rows.length > 0 && !dirty && (
        <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderColor: "var(--np-border)" }}>
          <table className="np-table">
            <thead>
              <tr>
                <th style={{ background: "var(--np-primary-soft)", color: "var(--np-primary)" }}>Dose (mmol/kg)</th>
                <th style={{ background: "var(--np-primary-soft)", color: "var(--np-primary)" }}>KPO₄ Order</th>
                <th style={{ background: "var(--np-primary-soft)", color: "var(--np-primary)" }}>NaPO₄ Order</th>
                <th style={{ background: "var(--np-primary-soft)", color: "var(--np-primary)", textAlign: "center" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.dosePerKg}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--np-primary)" }}>{row.dosePerKg}</div>
                    <div style={{ fontSize: 11, color: "var(--np-fg-3)" }}>= {row.phosphateMmol.toFixed(2)} mmol</div>
                  </td>
                  <td style={{ fontFamily: "var(--np-font-mono)", fontSize: 12 }}>
                    Give KPO₄ <strong>{row.phosphateMmol.toFixed(2)} mmol</strong> (= <strong>{row.kpo4_rounded} mL</strong>){" "}
                    diluted in <strong>{row.kDilution} mL</strong> (NS/D5W)
                    <div style={{ color: "var(--np-fg-3)", marginTop: 2 }}>K content: {row.kContent.toFixed(2)} mEq = {row.kPerKg} mEq/kg</div>
                  </td>
                  <td style={{ fontFamily: "var(--np-font-mono)", fontSize: 12 }}>
                    Give NaPO₄ <strong>{row.phosphateMmol.toFixed(2)} mmol</strong> (= <strong>{row.kpo4_rounded} mL</strong>)
                    <div style={{ color: "var(--np-fg-3)", marginTop: 2 }}>
                      Peripheral: {row.naPO4_peripheral.toFixed(1)} mL D5W |{" "}
                      Central: {row.naPO4_central.toFixed(1)} mL D5W
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ fontWeight: 700, color: "var(--np-primary)", fontSize: 15 }}>{row.infusionHours}h</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CalcShell>
  );
}
