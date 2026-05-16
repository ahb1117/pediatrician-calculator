"use client";

import { useState } from "react";
import { calcHypokalemia, type HypokalemiaRow } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

export default function HypokalemiaPage() {
  const [weight, setWeight] = useState<string>("");
  const [conc, setConc] = useState<string>("60");
  const [rows, setRows] = useState<HypokalemiaRow[]>([]);
  const [snap, setSnap] = useState<{ w: number; c: number } | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    const c = parseFloat(conc);
    if (!w || w <= 0 || !c || c <= 0) return;
    setRows(calcHypokalemia(w, c));
    setSnap({ w, c });
    setDirty(false);
  }

  function markDirty() { setDirty(true); }

  const severityColors = [
    { bg: "var(--np-success-soft)", border: "#86EFAC" },
    { bg: "var(--np-warning-soft)", border: "#FDE68A" },
    { bg: "#FFF7ED", border: "#FED7AA" },
    { bg: "var(--np-danger-soft)", border: "#FCA5A5" },
  ];

  return (
    <CalcShell
      sigil="⚖️"
      title="Hypokalemia Correction"
      description="Enter patient data then click Calculate for KCl orders."
    >
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
            <label className="np-label">Concentration (mEq/L)</label>
            <input type="number" min="40" max="200" step="10"
              value={conc}
              onChange={(e) => { setConc(e.target.value); markDirty(); }}
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
          {snap && !dirty && <span style={{ fontSize: 12, color: "var(--np-fg-3)" }}>Results for {snap.w} kg | {snap.c} mEq/L</span>}
        </div>
      </div>

      <div className="np-banner np-banner-warn mb-4">
        <span>Maximum infusion time = over 1 hour for any chosen dose. Maximum dose = 40 mEq/dose.</span>
      </div>

      {rows.length === 0 && (
        <div className="np-empty">
          Enter weight and concentration then click <strong>Calculate</strong> to see KCl orders.
        </div>
      )}

      {rows.length > 0 && !dirty && (
        <div className="space-y-4 mb-0">
          {rows.map((row, i) => (
            <div key={row.kLevel} className="rounded-xl border-2 p-5" style={{
              background: severityColors[i]?.bg ?? "var(--np-surface-sunken)",
              borderColor: severityColors[i]?.border ?? "var(--np-border)",
            }}>
              <div className="flex items-center justify-between mb-3">
                <div style={{ fontWeight: 700, color: "var(--np-secondary)", fontSize: 15, fontFamily: "var(--np-font-display)" }}>
                  K⁺ = {row.kLevel}
                </div>
                <div style={{ fontSize: 13, color: "var(--np-fg-2)" }}>Over {row.hours} hour{row.hours > 1 ? "s" : ""}</div>
              </div>
              <div className="rounded-lg p-4 border" style={{ background: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.9)" }}>
                <p style={{ fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
                  Give KCl <strong>{row.roundedDose.toFixed(1)} mEq</strong>{" "}
                  (= <strong>{row.volumeKCl.toFixed(1)} mL</strong>) diluted in{" "}
                  <strong>{row.dilution} mL</strong> of chosen fluid (e.g. NS, D5W){" "}
                  IV infusion over <strong>{row.hours} hour{row.hours > 1 ? "s" : ""}</strong>.
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2" style={{ fontSize: 12 }}>
                <div className="text-center">
                  <div style={{ color: "var(--np-fg-3)" }}>Dose/kg</div>
                  <div style={{ fontWeight: 700, color: "var(--np-secondary)" }}>{row.dosePerKg} mEq/kg</div>
                </div>
                <div className="text-center">
                  <div style={{ color: "var(--np-fg-3)" }}>KCl Volume</div>
                  <div style={{ fontWeight: 700, color: "var(--np-secondary)" }}>{row.volumeKCl.toFixed(1)} mL</div>
                </div>
                <div className="text-center">
                  <div style={{ color: "var(--np-fg-3)" }}>Dilution Volume</div>
                  <div style={{ fontWeight: 700, color: "var(--np-secondary)" }}>{row.dilution} mL</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CalcShell>
  );
}
