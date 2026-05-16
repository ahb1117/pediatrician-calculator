"use client";

import { useState } from "react";
import { calcHypocalcemia, type HypocalcemiaResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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

  return (
    <CalcShell
      sigil="🦴"
      title="Hypocalcemia Correction"
      description="Fill in patient data then click Calculate to generate calcium orders."
    >
      {/* Inputs */}
      <div className="np-card mb-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="np-label">Weight (kg)</label>
            <input type="number" min="0.1" step="0.1" value={weight} placeholder="e.g. 20"
              onChange={e => { setWeight(e.target.value); markDirty(); }} className="np-input" />
          </div>
          <div>
            <label className="np-label">Ca Gluconate IV dose (mg/kg)</label>
            <input type="number" min="50" max="200" step="1" value={glucDoseIV}
              onChange={e => { setGlucDoseIV(e.target.value); markDirty(); }} className="np-input" />
            <div style={{ fontSize: 11, color: "var(--np-fg-4)", marginTop: 3 }}>Neonates: 100–200 | Older: 50–125</div>
          </div>
          <div>
            <label className="np-label">Ca Chloride IV dose (mg/kg)</label>
            <input type="number" min="10" max="20" step="1" value={chlorDoseIV}
              onChange={e => { setChlorDoseIV(e.target.value); markDirty(); }} className="np-input" />
            <div style={{ fontSize: 11, color: "var(--np-fg-4)", marginTop: 3 }}>Range: 10–20 mg/kg</div>
          </div>
          <div>
            <label className="np-label">Elemental Ca oral dose (mg/kg)</label>
            <input type="number" min="8" max="19" step="1" value={elemCaDoseOral}
              onChange={e => { setElemCaDoseOral(e.target.value); markDirty(); }} className="np-input" />
            <div style={{ fontSize: 11, color: "var(--np-fg-4)", marginTop: 3 }}>Neonates: 13–19 | Older: 8–19</div>
          </div>
        </div>
        <div style={{ paddingTop: 8, borderTop: "1px solid var(--np-border)" }}>
          <div style={{ fontFamily: "var(--np-font-body)", fontSize: 11, fontWeight: 700, color: "var(--np-fg-2)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
            Reference Values
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="np-label">Serum Ca (mmol/L)</label>
              <input type="number" step="0.1" value={serumCa}
                onChange={e => { setSerumCa(e.target.value); markDirty(); }} className="np-input" />
            </div>
            <div>
              <label className="np-label">Serum Albumin (g/L)</label>
              <input type="number" step="1" value={albumin}
                onChange={e => { setAlbumin(e.target.value); markDirty(); }} className="np-input" />
            </div>
            <div>
              <label className="np-label">Serum Phosphate (mmol/L)</label>
              <input type="number" step="0.1" value={serumPhosphate}
                onChange={e => { setSerumPhosphate(e.target.value); markDirty(); }} className="np-input" />
            </div>
          </div>
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
          Enter patient data above and click <strong>Calculate</strong> to see calcium orders.
        </div>
      )}

      {result && !dirty && snap && (
        <div className="space-y-5">
          {/* Reference panel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="np-card-sm">
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--np-fg-3)", marginBottom: 4 }}>Corrected Calcium (for albumin)</div>
              <div className="np-value">{result.correctedCa.toFixed(2)} <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mmol/L</span></div>
              <div style={{ fontSize: 11, fontFamily: "var(--np-font-mono)", color: "var(--np-fg-4)", marginTop: 4 }}>= ((40 − albumin) × 0.02) + Ca</div>
            </div>
            <div className="np-card-sm" style={{
              borderTop: `3px solid ${result.crystallizationRatio > 4 ? "var(--np-danger)" : "var(--np-success)"}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--np-fg-3)", marginBottom: 4 }}>Crystallization Ratio (Ca × PO₄)</div>
              <div className="np-value" style={{ color: result.crystallizationRatio > 4 ? "var(--np-danger)" : "var(--np-success)" }}>
                {result.crystallizationRatio.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: result.crystallizationRatio > 4 ? "var(--np-danger)" : "var(--np-success)", marginTop: 4 }}>
                {result.crystallizationRatio > 4
                  ? "⚠ >4: Give IV calcium over longer period"
                  : "✓ Safe ratio (<4)"}
              </div>
            </div>
          </div>

          {/* Symptomatic */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-danger)", borderColor: "#FEE2E2" }}>
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
                <div key={title} className="rounded-lg border p-4" style={{ background: "var(--np-danger-soft)", borderColor: "#FCA5A5" }}>
                  <div style={{ fontWeight: 600, color: "var(--np-fg-1)", marginBottom: 6 }}>{title}</div>
                  <p style={{ fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>{order}</p>
                  {note && <div style={{ fontSize: 11, color: "var(--np-warning)", marginTop: 4 }}>{note}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* Asymptomatic unsafe */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-warning)", borderColor: "#FEF3C7" }}>
              Asymptomatic — Unsafe (Ca &lt; 1.6 mmol/L) — IV Only
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border p-4" style={{ background: "var(--np-warning-soft)", borderColor: "#FDE68A" }}>
                <div style={{ fontWeight: 600, color: "var(--np-fg-1)", marginBottom: 4 }}>
                  Calcium Gluconate {snap.g} mg/kg IV
                  <span style={{ fontSize: 11, fontWeight: 400, color: "var(--np-warning)", marginLeft: 8 }}>(Max 2000 mg/dose)</span>
                </div>
                <p style={{ fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
                  Give Ca Gluconate IV <strong>{result.gluconateIV_mg.toFixed(0)} mg</strong> = {result.gluconateIV_elemCa.toFixed(0)} mg elemental Ca ={" "}
                  <strong>{result.gluconateIV_vol.toFixed(0)} mL</strong> diluted in{" "}
                  <strong>{result.gluconateIV_dilution.toFixed(0)} mL</strong> D5W or NS over 20–60 min under CPM.
                </p>
                <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 4 }}>May be repeated every 6 hours.</div>
              </div>
              <div className="rounded-lg border p-4" style={{ background: "var(--np-warning-soft)", borderColor: "#FDE68A" }}>
                <div style={{ fontWeight: 600, color: "var(--np-fg-1)", marginBottom: 4 }}>
                  Calcium Chloride {snap.c} mg/kg IV
                  <span style={{ fontSize: 11, fontWeight: 400, color: "var(--np-warning)", marginLeft: 8 }}>(Max 1000 mg/dose)</span>
                </div>
                <p style={{ fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
                  Give Ca Chloride IV <strong>{result.chlorideIV_mg.toFixed(0)} mg</strong> = {result.chlorideIV_elemCa.toFixed(0)} mg elemental Ca ={" "}
                  <strong>{result.chlorideIV_vol.toFixed(0)} mL</strong> diluted in{" "}
                  <strong>{result.chlorideIV_dilution.toFixed(0)} mL</strong> NS over {result.chlorideIV_infusionMin}–60 min under CPM.
                </p>
                <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 4 }}>May be repeated every 4–6 hours.</div>
              </div>
            </div>
          </section>

          {/* Asymptomatic safe */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-success)", borderColor: "#BBF7D0" }}>
              Asymptomatic — Safe (Ca &gt; 1.6 mmol/L) — Oral Preferred
            </h2>
            <div className="space-y-3">
              {[
                { name: "Calcium Gluconate", dose: result.gluconateOral_mg, note: "Same IV preparation can be given orally" },
                { name: "Calcium Carbonate", dose: result.carbonateOral_mg, note: "Administer with meals if using for phosphate-binding" },
                { name: "Calcium Glubionate", dose: result.glubionateOral_mg, note: "" },
              ].map(({ name, dose, note }) => (
                <div key={name} className="rounded-lg border p-3" style={{ background: "var(--np-success-soft)", borderColor: "#86EFAC" }}>
                  <p style={{ fontFamily: "var(--np-font-mono)", fontSize: 13, color: "var(--np-fg-1)" }}>
                    <strong>{name}</strong> — {dose} mg as{" "}
                    <strong>{snap.o} mg/kg = {(snap.o * snap.w).toFixed(0)} mg elemental Ca</strong> PO every 6 hours
                  </p>
                  {note && <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 4 }}>({note})</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </CalcShell>
  );
}
