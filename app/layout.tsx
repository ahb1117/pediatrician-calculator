import type { Metadata } from "next";
import { Montserrat, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pediatrician Calculator",
  description: "Pediatric medication dosing calculator — Version 2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${montserrat.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full">
        {/* ── Sticky Header ─────────────────────────────── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--np-border)",
        }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto",
            padding: "14px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
              <Image src="/logo.png" alt="NeoPeds logo" width={160} height={48} style={{ height: 48, width: "auto", objectFit: "contain" }} priority unoptimized />
              <span style={{
                width: 1, alignSelf: "stretch", background: "var(--np-border)",
                flexShrink: 0, margin: "2px 0",
              }} />
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{
                  fontFamily: "var(--np-font-display)", fontWeight: 700, fontSize: 18,
                  color: "var(--np-secondary)", letterSpacing: "-0.01em", lineHeight: 1,
                }}>
                  Pediatrician{" "}
                  <span style={{ color: "var(--np-primary)" }}>Calculator</span>
                </span>
                <span style={{
                  fontFamily: "var(--np-font-body)", fontWeight: 600, fontSize: 10,
                  color: "var(--np-fg-3)", letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  Version 2 · 2026
                </span>
              </span>
            </Link>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px", borderRadius: 999,
              background: "var(--np-danger-soft)", color: "#B91C1C",
              fontFamily: "var(--np-font-body)", fontSize: 12, fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: 999,
                background: "var(--np-danger)", flexShrink: 0,
                display: "inline-block",
              }} />
              Verify all doses before administration
            </div>
          </div>
        </header>

        {/* ── Main ─────────────────────────────────────── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>
          {children}
        </main>

        {/* ── Footer ───────────────────────────────────── */}
        <footer style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 56px" }}>
          <div style={{
            paddingTop: 32,
            borderTop: "1px solid var(--np-border)",
            display: "flex", flexDirection: "column", gap: 24,
          }}>
            {/* References */}
            <div>
              <div style={{
                fontFamily: "var(--np-font-body)", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--np-primary)", marginBottom: 12,
              }}>References</div>
              <ol style={{
                margin: 0, paddingLeft: 20,
                fontFamily: "var(--np-font-body)", fontSize: 13,
                color: "var(--np-fg-2)", lineHeight: 1.7,
              }}>
                <li>Lexi-Comp Pediatric and Neonatal Lexi-Drugs [database]</li>
                <li>IBM Micromedex [database]</li>
                <li>{"Gahart's 2021 Intravenous Medications — A Handbook for Nurses and Health Professionals"}</li>
                <li>Pediatric Injectable Drugs, 10th Ed</li>
              </ol>
            </div>

            {/* Attribution card */}
            <div style={{
              display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32,
              padding: "20px 24px",
              background: "var(--np-surface)", borderRadius: 14,
              boxShadow: "var(--np-shadow-xs)",
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--np-font-body)", fontSize: 11, color: "var(--np-fg-4)",
                  fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                  marginBottom: 6,
                }}>About this tool</div>
                <div style={{
                  fontFamily: "var(--np-font-body)", fontSize: 13,
                  color: "var(--np-fg-2)", lineHeight: 1.55, marginBottom: 10,
                }}>
                  An upgraded version rebuilt by
                </div>
                <div style={{
                  fontFamily: "var(--np-font-display)", fontWeight: 700, fontSize: 16,
                  color: "var(--np-secondary)",
                }}>Dr. Ahmed Hussain Buzaid</div>
                <div style={{
                  fontFamily: "var(--np-font-body)", fontSize: 12, color: "var(--np-fg-3)",
                }}>Neonatology Consultant</div>
              </div>

              <div style={{ direction: "rtl", textAlign: "right" }}>
                <div style={{
                  fontFamily: "var(--np-font-body)", fontSize: 11, color: "var(--np-fg-4)",
                  fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6,
                }}>إهداء</div>
                <div
                  lang="ar"
                  style={{
                    fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
                    fontSize: 14, color: "var(--np-fg-2)", lineHeight: 1.7,
                  }}
                >
                  يُهدى ثواب هذا العمل إلى روح المرحوم<br />
                  الدكتور أحمد يوسف بوعلي
                </div>
                <div
                  lang="ar"
                  style={{
                    fontFamily: "'Noto Naskh Arabic', 'Amiri', serif",
                    fontSize: 12, color: "var(--np-fg-4)", marginTop: 6,
                  }}
                >
                  رحمه الله وأسكنه فسيح جناته
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              fontFamily: "var(--np-font-body)", fontSize: 11, color: "var(--np-fg-4)",
              textAlign: "center", lineHeight: 1.6,
            }}>
              By using this calculator, you agree you are fully responsible for any possible undesired effect.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
