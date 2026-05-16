import ModuleTile from "@/components/ModuleTile";

const calculators = [
  {
    href: "/status-epilepticus",
    sigil: "⚡",
    title: "Status Epilepticus",
    description:
      "Weight-based dosing for benzodiazepines, phenobarbital, levetiracetam, valproic acid, phenytoin, and fosphenytoin.",
  },
  {
    href: "/infusion-rate",
    sigil: "💉",
    title: "PICU Infusion Rate Calculator",
    description:
      "Calculate mL/hour infusion rates for 26 PICU medications including vasopressors, sedatives, and analgesics.",
  },
  {
    href: "/magnesium-sulfate",
    sigil: "⚗️",
    title: "Magnesium Sulfate",
    description:
      "Dosing orders for hypomagnesemia and acute asthma exacerbation with dilution volumes and infusion times.",
  },
  {
    href: "/metabolic-acidosis",
    sigil: "🧪",
    title: "Metabolic Acidosis Correction",
    description:
      "NaHCO₃ dosing using HCO₃-based or base deficit formula with full and half correction options.",
  },
  {
    href: "/hypocalcemia",
    sigil: "🦴",
    title: "Hypocalcemia Correction",
    description:
      "IV and oral calcium replacement orders for symptomatic and asymptomatic hypocalcemia with albumin correction.",
  },
  {
    href: "/hyponatremia",
    sigil: "💧",
    title: "Hyponatremia Correction",
    description:
      "3% NaCl dosing for symptomatic and asymptomatic unsafe hypovolemic hyponatremia.",
  },
  {
    href: "/hypokalemia",
    sigil: "⚖️",
    title: "Hypokalemia Correction",
    description:
      "KCl replacement orders tailored to potassium level with dilution and infusion time calculations.",
  },
  {
    href: "/hypophosphatemia",
    sigil: "🔬",
    title: "Hypophosphatemia Correction",
    description:
      "KPO₄ and NaPO₄ orders with K content, dilution volumes for peripheral and central lines.",
  },
  {
    href: "/hyperkalemia",
    sigil: "📊",
    title: "Hyperkalemia Management",
    description:
      "Weight-based orders for calcium gluconate, NaHCO₃, insulin, furosemide, and ion exchange resins.",
  },
  {
    href: "/appendix",
    sigil: "📐",
    title: "Appendix Calculator",
    description:
      "BSA, BMI, eGFR (Revised Schwartz), and Glucose Infusion Rate (GIR) from fluids and feeds.",
  },
  {
    href: "/solution-compatibility",
    sigil: "🧬",
    title: "Solution Compatibility",
    description:
      "IV solution compatibility reference for 33 PICU medications across NS, D5W, D10W, D5NS, D5½NS, and LR.",
  },
];

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 8 }}>
      {/* Hero */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          fontFamily: "var(--np-font-body)", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--np-primary)",
        }}>
          Pediatric · Dosing
        </div>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--np-font-display)", fontWeight: 700,
          fontSize: "clamp(28px, 4vw, 42px)",
          color: "var(--np-secondary)",
          letterSpacing: "-0.02em", lineHeight: 1.1,
        }}>
          Welcome to the Pediatrician Calculator
        </h1>
        <p style={{
          margin: 0,
          fontFamily: "var(--np-font-body)", fontSize: 16,
          color: "var(--np-fg-2)", lineHeight: 1.55, maxWidth: 640,
        }}>
          Advanced pediatric medication dosing calculator for clinical use.
          Select a module below to get started.
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--np-font-body)", fontWeight: 600, fontSize: 11,
            padding: "5px 12px", borderRadius: 999,
            background: "var(--np-primary-soft)", color: "#245862",
          }}>
            For licensed healthcare professionals only
          </span>
          <span style={{
            fontFamily: "var(--np-font-body)", fontWeight: 600, fontSize: 11,
            padding: "5px 12px", borderRadius: 999,
            background: "var(--np-warning-soft)", color: "#92400E",
          }}>
            Always verify doses before administration
          </span>
        </div>
      </div>

      {/* Module grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: 16,
      }}>
        {calculators.map((calc) => (
          <ModuleTile key={calc.href} {...calc} />
        ))}
      </div>
    </div>
  );
}
