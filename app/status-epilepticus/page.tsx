"use client";

import { useState } from "react";
import { calcStatusEpilepticus, type StatusEpilepticusResult } from "@/lib/calculations";
import CalcShell from "@/components/CalcShell";

function fmt(n: number, d = 1) {
  return +n.toFixed(d);
}

export default function StatusEpilepticusPage() {
  const [weight, setWeight] = useState<string>("");
  const [result, setResult] = useState<StatusEpilepticusResult | null>(null);
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  function handleCalculate() {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    setResult(calcStatusEpilepticus(w));
    setCalculatedWeight(w);
    setDirty(false);
  }

  function handleWeightChange(val: string) {
    setWeight(val);
    setDirty(true);
  }

  const r = result;

  return (
    <CalcShell
      sigil="⚡"
      title="Status Epilepticus"
      description="Enter patient weight then click Calculate to generate all medication orders."
    >
      {/* Input card */}
      <div className="np-card mb-6">
        <label className="np-label">Patient Weight (kg)</label>
        <div className="flex items-center gap-3">
          <input
            type="number" min="0.5" max="200" step="0.1"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            className="np-input" style={{ maxWidth: 180 }}
            placeholder="e.g. 15"
          />
          <button
            onClick={handleCalculate}
            disabled={!weight || parseFloat(weight) <= 0}
            className="np-btn np-btn-primary"
          >
            {r && !dirty ? "Recalculate" : "Calculate"}
          </button>
          {r && dirty && <span className="np-dirty-warn">⚠ Weight changed — click Recalculate</span>}
        </div>
        {calculatedWeight && !dirty && (
          <div className="mt-2" style={{ fontSize: 12, color: "var(--np-fg-3)" }}>
            Showing results for weight: <strong>{calculatedWeight} kg</strong>
          </div>
        )}
      </div>

      {/* Results */}
      {r && !dirty && (
        <div className="space-y-6">
          {/* Phase 1 — IV */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "var(--np-danger)", borderColor: "#FEE2E2" }}>
              Phase 1 — IV Benzodiazepines (1st dose; repeat after 5 min if no response)
            </h2>
            <div className="space-y-3">
              {[
                { drug: "Midazolam", dose: r.midazolamIV, max: "10 mg/dose" },
                { drug: "Lorazepam", dose: r.lorazepamIV, max: "4 mg/dose" },
                { drug: "Diazepam", dose: r.diazepamIV, max: "10 mg/dose" },
              ].map(({ drug, dose, max }) => (
                <div key={drug} className="flex items-start justify-between gap-4 p-3 rounded-lg border"
                  style={{ background: "var(--np-danger-soft)", borderColor: "#FCA5A5" }}>
                  <div>
                    <div className="font-semibold" style={{ color: "var(--np-fg-1)" }}>{drug}</div>
                    <div style={{ fontSize: 11, color: "var(--np-fg-3)" }}>IV over 2 minutes</div>
                  </div>
                  <div className="text-right">
                    <div className="np-value" style={{ fontSize: 20 }}>{fmt(dose)} <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg</span></div>
                    <div style={{ fontSize: 11, color: "var(--np-warning)", fontWeight: 500 }}>Max: {max}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Phase 1 alternative */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "#C2410C", borderColor: "#FED7AA" }}>
              If IV Access Not Achieved Within 3 Minutes
            </h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border" style={{ background: "#FFF7ED", borderColor: "#FED7AA" }}>
                <div className="font-semibold" style={{ color: "var(--np-fg-1)" }}>Midazolam — Buccal</div>
                <div style={{ fontSize: 13, color: "var(--np-fg-2)", marginTop: 4 }}>May use same IV preparation</div>
                <div className="np-value" style={{ marginTop: 4 }}>
                  {fmt(r.midazolamBuccalMin)} – {fmt(r.midazolamBuccalMax)}{" "}
                  <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "#C2410C", marginLeft: 8 }}>(Max: 10 mg/dose)</span>
                </div>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: "#FFF7ED", borderColor: "#FED7AA" }}>
                <div className="font-semibold" style={{ color: "var(--np-fg-1)" }}>Midazolam — Intranasal</div>
                <div className="np-value" style={{ marginTop: 4 }}>
                  {fmt(r.midazolamIntranasal)}{" "}
                  <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg</span>
                  <span style={{ fontSize: 12, fontFamily: "var(--np-font-body)", color: "var(--np-fg-3)", marginLeft: 6 }}>(divided per naris)</span>
                </div>
              </div>
              <div className="p-3 rounded-lg border" style={{ background: "#FFF7ED", borderColor: "#FED7AA" }}>
                <div className="font-semibold" style={{ color: "var(--np-fg-1)" }}>Diazepam — Rectal</div>
                <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 2 }}>Max: 20 mg/dose</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { label: "Age 2–5 yr", dose: r.diazepamRectalAge2_5 },
                    { label: "Age 6–11 yr", dose: r.diazepamRectalAge6_11 },
                    { label: "Age ≥12 yr", dose: r.diazepamRectalAge12plus },
                  ].map(({ label, dose }) => (
                    <div key={label} className="text-center">
                      <div style={{ fontSize: 11, color: "var(--np-fg-3)" }}>{label}</div>
                      <div className="np-value" style={{ fontSize: 18 }}>{fmt(dose)} <span style={{ fontSize: 12, fontFamily: "var(--np-font-body)", fontWeight: 500 }}>mg</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Phase 2 */}
          <section className="np-card">
            <h2 className="np-section-heading" style={{ color: "#7C3AED", borderColor: "#EDE9FE" }}>
              Phase 2 — After 2 Doses of Benzodiazepines (10+ minutes of seizure)
            </h2>
            <p style={{ fontSize: 12, color: "var(--np-fg-3)", marginBottom: 16 }}>
              Note: Onset is delayed. Consider an additional benzodiazepine dose while administering these agents.
            </p>
            <div className="space-y-3">
              {[
                {
                  name: "Phenobarbital",
                  content: (
                    <>
                      <div className="np-value" style={{ fontSize: 20 }}>
                        {fmt(r.phenobarbitalMin)} – {fmt(r.phenobarbitalMax)}{" "}
                        <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--np-fg-2)", marginTop: 4 }}>
                        Diluted in {fmt(r.phenobarbitalDilution)} mL NS over 10–15 minutes
                      </div>
                      <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 4 }}>
                        May repeat every 15 min. Max total: {fmt(r.phenobarbitalMaxTotal)} mg
                        <span style={{ marginLeft: 4, color: "var(--np-warning)" }}>(Max per dose: 1000 mg)</span>
                      </div>
                    </>
                  ),
                },
                {
                  name: "Levetiracetam (Keppra)",
                  content: (
                    <div className="space-y-1 mt-2">
                      <div style={{ fontSize: 13 }}>
                        <span style={{ color: "var(--np-fg-3)", fontWeight: 500 }}>Neonates: </span>
                        <span className="np-value" style={{ fontSize: 18 }}>{fmt(r.levetiracetamNeonates)}</span>
                        <span style={{ fontSize: 12, color: "var(--np-fg-2)" }}> mg — diluted in {r.levetiracetamNeonatesDilution} mL NS over 15 min</span>
                        <span style={{ fontSize: 11, color: "var(--np-warning)", marginLeft: 4 }}>(Max: 4500 mg)</span>
                      </div>
                      <div style={{ fontSize: 13 }}>
                        <span style={{ color: "var(--np-fg-3)", fontWeight: 500 }}>Older patients: </span>
                        <span className="np-value" style={{ fontSize: 18 }}>{fmt(r.levetiracetamOlder)}</span>
                        <span style={{ fontSize: 12, color: "var(--np-fg-2)" }}> mg — diluted in {fmt(r.levetiracetamOlderDilution)} mL NS over 15 min</span>
                        <span style={{ fontSize: 11, color: "var(--np-warning)", marginLeft: 4 }}>(Max: 4500 mg)</span>
                      </div>
                    </div>
                  ),
                },
                {
                  name: "Valproic Acid (Depakene) — NOT for neonates",
                  content: (
                    <>
                      <div className="np-value" style={{ fontSize: 20, marginTop: 4 }}>
                        {fmt(r.valproicAcid)}{" "}
                        <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--np-fg-2)", marginTop: 4 }}>
                        Diluted in {r.valproicAcidDilution} mL NS over 10–15 minutes
                        <span style={{ color: "var(--np-warning)", marginLeft: 4 }}>(Max: 3000 mg/dose)</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--np-fg-3)", marginTop: 6 }}>
                        2nd dose after 10 min if needed: {fmt(r.valproicAcid2nd)} mg diluted in {r.valproicAcid2ndDilution} mL NS
                      </div>
                    </>
                  ),
                },
                {
                  name: "Phenytoin",
                  content: (
                    <>
                      <div className="np-value" style={{ fontSize: 20, marginTop: 4 }}>
                        {fmt(r.phenytoin)}{" "}
                        <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--np-fg-2)", marginTop: 4 }}>
                        Undiluted over 20 minutes OR {fmt(r.phenytoinTimeMin, 0)} minutes (whichever is longer)
                        <span style={{ color: "var(--np-warning)", marginLeft: 4 }}>(Max: 1500 mg/dose)</span>
                      </div>
                    </>
                  ),
                },
                {
                  name: "Fosphenytoin",
                  content: (
                    <>
                      <div className="np-value" style={{ fontSize: 20, marginTop: 4 }}>
                        {fmt(r.fosphenytoin)}{" "}
                        <span style={{ fontSize: 13, fontFamily: "var(--np-font-body)", fontWeight: 500, color: "var(--np-fg-3)" }}>mg PE</span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--np-fg-2)", marginTop: 4 }}>
                        Diluted in {fmt(r.fosphenytoinDilution)} mL NS over 10 minutes OR {r.fosphenytoinTimeMin} minutes (whichever is longer)
                        <span style={{ color: "var(--np-warning)", marginLeft: 4 }}>(Max: 1500 mg PE/dose)</span>
                      </div>
                    </>
                  ),
                },
              ].map(({ name, content }) => (
                <div key={name} className="p-3 rounded-lg border" style={{ background: "#FAF5FF", borderColor: "#DDD6FE" }}>
                  <div className="font-semibold" style={{ color: "var(--np-fg-1)" }}>{name}</div>
                  {content}
                </div>
              ))}
            </div>
          </section>

          {/* Phase 3 */}
          <div className="np-banner np-banner-warn">
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Phase 3 — Refractory Status Epilepticus</div>
              <div style={{ fontSize: 13 }}>
                Defined as seizure activity persisting after a first-line benzodiazepine and a second-line antiseizure drug.
                These patients usually receive additional boluses of second-line antiseizure drugs or are placed in a medically
                induced coma with IV continuous infusions of an anesthetic (midazolam, propofol, or barbiturates).
              </div>
            </div>
          </div>
        </div>
      )}

      {!r && (
        <div className="np-empty">
          Enter patient weight above and click <strong>Calculate</strong> to see medication orders.
        </div>
      )}
    </CalcShell>
  );
}
