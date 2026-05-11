import Link from "next/link";
import Attribution from "@/components/Attribution";

const calculators = [
  {
    href: "/status-epilepticus",
    title: "Status Epilepticus",
    description: "Weight-based dosing for benzodiazepines, phenobarbital, levetiracetam, valproic acid, phenytoin, and fosphenytoin.",
    icon: "⚡",
    color: "bg-red-50 border-red-200 hover:bg-red-100",
  },
  {
    href: "/infusion-rate",
    title: "PICU Infusion Rate Calculator",
    description: "Calculate mL/hour infusion rates for 26 PICU medications including vasopressors, sedatives, and analgesics.",
    icon: "💉",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    href: "/magnesium-sulfate",
    title: "Magnesium Sulfate",
    description: "Dosing orders for hypomagnesemia and acute asthma exacerbation with dilution volumes and infusion times.",
    icon: "⚗️",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    href: "/metabolic-acidosis",
    title: "Metabolic Acidosis Correction",
    description: "NaHCO₃ dosing using HCO₃-based or base deficit formula with full and half correction options.",
    icon: "🧪",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    href: "/hypocalcemia",
    title: "Hypocalcemia Correction",
    description: "IV and oral calcium replacement orders for symptomatic and asymptomatic hypocalcemia with albumin correction.",
    icon: "🦴",
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  },
  {
    href: "/hyponatremia",
    title: "Hyponatremia Correction",
    description: "3% NaCl dosing for symptomatic and asymptomatic unsafe hypovolemic hyponatremia.",
    icon: "💧",
    color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
  },
  {
    href: "/hypokalemia",
    title: "Hypokalemia Correction",
    description: "KCl replacement orders tailored to potassium level with dilution and infusion time calculations.",
    icon: "⚖️",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    href: "/hypophosphatemia",
    title: "Hypophosphatemia Correction",
    description: "KPO₄ and NaPO₄ orders with K content, dilution volumes for peripheral and central lines.",
    icon: "🔬",
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  },
  {
    href: "/hyperkalemia",
    title: "Hyperkalemia Management",
    description: "Weight-based orders for calcium gluconate, NaHCO₃, insulin, furosemide, and ion exchange resins.",
    icon: "📊",
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
  },
  {
    href: "/appendix",
    title: "Appendix Calculator",
    description: "BSA, BMI, eGFR (Revised Schwartz), and Glucose Infusion Rate (GIR) from fluids and feeds.",
    icon: "📐",
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
  },
  {
    href: "/solution-compatibility",
    title: "Solution Compatibility",
    description: "IV solution compatibility reference for 33 PICU medications across NS, D5W, D10W, D5NS, D5½NS, and LR.",
    icon: "🧬",
    color: "bg-slate-50 border-slate-200 hover:bg-slate-100",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome to the Pediatrician Calculator</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Advanced pediatric medication dosing calculator for clinical use. Select a module below to get started.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-amber-100 text-amber-800 border border-amber-200 rounded-full px-3 py-1">
            For licensed healthcare professionals only
          </span>
          <span className="bg-blue-100 text-blue-800 border border-blue-200 rounded-full px-3 py-1">
            Always verify doses before administration
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className={`block rounded-xl border-2 p-5 transition-all duration-150 shadow-sm hover:shadow-md ${calc.color}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{calc.icon}</span>
              <div>
                <div className="font-semibold text-slate-800 text-base">{calc.title}</div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{calc.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl">
        <h2 className="font-semibold text-slate-700 mb-2">References</h2>
        <ol className="text-xs text-slate-500 space-y-1 list-decimal list-inside">
          <li>Lexi-Comp Pediatric and Neonatal Lexi-Drugs [database]</li>
          <li>IBM Micromedex [database]</li>
          <li>{"Gahart's 2021 Intravenous Medications — A Handbook for Nurses and Health Professionals"}</li>
          <li>Pediatric Injectable Drugs, 10th Ed</li>
        </ol>
      </div>

      <Attribution />
    </div>
  );
}
