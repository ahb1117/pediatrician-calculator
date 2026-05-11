import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pediatrician Calculator",
  description: "Pediatric medication dosing calculator — Version 2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🏥</span>
              <div>
                <div className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                  Pediatrician Calculator
                </div>
                <div className="text-xs text-slate-500">Version 2 — 2026</div>
              </div>
            </a>
            <div className="text-xs text-slate-500 text-right hidden sm:block">
              <div className="font-medium text-amber-600">⚠ For licensed professionals only</div>
              <div>Verify all doses before administration</div>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6 w-full">
          {children}
        </main>
        <footer className="border-t border-slate-200 mt-8 py-4 text-center text-xs text-slate-500">
          <p>References: Lexi-Comp, IBM Micromedex, Gahart&apos;s 2021 IV Medications, Pediatric Injectable Drugs 10th Ed</p>
          <p className="mt-1">By using this calculator, you agree you are fully responsible for any possible undesired effect.</p>
        </footer>
      </body>
    </html>
  );
}
