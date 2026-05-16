"use client";

import { useState } from "react";
import { calcInfusionRate, INFUSION_DRUGS, type InfusionDrug } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

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
    <div className="np-card-sm">
      <div style={{ fontWeight: 600, color: "var(--np-secondary)", fontFamily: "var(--np-font-display)", marginBottom: 12 }}>
        {drug.name}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label style={{ fontSize: 12, color: "var(--np-fg-3)", width: 90, flexShrink: 0 }}>Concentration</label>
          <input
            type="number" value={conc} min="0.01" step="any"
            onChange={(e) => handleChange(setConc, parseFloat(e.target.value) || 0)}
            style={{ flex: 1, borderRadius: 8, border: "1px solid var(--np-border-strong)", padding: "5px 10px", fontSize: 13, fontFamily: "var(--np-font-mono)", outline: "none", background: "var(--np-surface)" }}
          />
          <span style={{ fontSize: 12, color: "var(--np-fg-3)", width: 60, flexShrink: 0 }}>{drug.concUnit}</span>
        </div>
        <div className="flex items-center gap-2">
          <label style={{ fontSize: 12, color: "var(--np-fg-3)", width: 90, flexShrink: 0 }}>Dose</label>
          <input
            type="number" value={dose} min="0" step="any"
            onChange={(e) => handleChange(setDose, parseFloat(e.target.value) || 0)}
            style={{ flex: 1, borderRadius: 8, border: "1px solid var(--np-border-strong)", padding: "5px 10px", fontSize: 13, fontFamily: "var(--np-font-mono)", outline: "none", background: "var(--np-surface)" }}
          />
          <span style={{ fontSize: 12, color: "var(--np-fg-3)", width: 60, flexShrink: 0 }}>{drug.doseLabel}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          onClick={handleCalculate}
          disabled={weight <= 0 || conc <= 0}
          className="np-btn np-btn-primary"
          style={{ padding: "7px 14px", fontSize: 13 }}
        >
          Calculate
        </button>
        {rate !== null && !dirty ? (
          <span style={{ fontFamily: "var(--np-font-mono)", fontWeight: 700, fontSize: 20, color: "var(--np-secondary)" }}>
            {rate} <span style={{ fontSize: 12, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mL/hr</span>
          </span>
        ) : (
          <span style={{ color: "var(--np-fg-4)", fontSize: 18 }}>—</span>
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
    <CalcShell
      sigil="💉"
      title="PICU Medication Infusion Rate Calculator"
      description="Enter weight, then calculate each drug individually."
    >
      <div className="np-banner np-banner-warn mb-4">
        <span>Min infusion rate = 0.1 mL/hr. Consider more dilute preparation if rate &lt; 0.1 mL/hr.</span>
      </div>

      <div className="np-card mb-6 flex flex-wrap gap-6 items-end">
        <div>
          <label className="np-label">Patient Weight (kg)</label>
          <div className="flex items-center gap-2">
            <input
              type="number" min="0.5" max="200" step="0.1"
              value={weight} placeholder="e.g. 10"
              onChange={(e) => { setWeight(e.target.value); setDirty(true); }}
              onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
              className="np-input" style={{ maxWidth: 144 }}
            />
            <button onClick={handleCalculate} disabled={!weight || parseFloat(weight) <= 0}
              className="np-btn np-btn-primary">
              Set Weight
            </button>
          </div>
          {confirmedWeight > 0 && !dirty && (
            <div style={{ marginTop: 4, fontSize: 12, color: "var(--np-success)", fontWeight: 500 }}>✓ Weight set: {confirmedWeight} kg</div>
          )}
          {confirmedWeight > 0 && dirty && (
            <div style={{ marginTop: 4, fontSize: 12, color: "var(--np-warning)" }}>Weight changed — click Set Weight to apply</div>
          )}
        </div>
        <div>
          <label className="np-label">Search Drug</label>
          <input
            type="text" value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter medications..."
            className="np-input" style={{ maxWidth: 224, fontFamily: "var(--np-font-body)" }}
          />
        </div>
      </div>

      {confirmedWeight <= 0 && (
        <div className="np-empty">
          Enter patient weight above and click <strong>Set Weight</strong> to enable the drug calculators.
        </div>
      )}

      {confirmedWeight > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((drug) => (
            <DrugCard key={drug.name} drug={drug} weight={confirmedWeight} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 np-empty">No medications match your search.</div>
          )}
        </div>
      )}
    </CalcShell>
  );
}
