import Link from "next/link";

interface Props {
  sigil: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function CalcShell({ sigil, title, description, children }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 4 }}>
      {/* Back link */}
      <Link
        href="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content",
          textDecoration: "none",
          fontFamily: "var(--np-font-body)", fontWeight: 600, fontSize: 13,
          color: "var(--np-primary)",
          transition: "color 120ms",
        }}
      >
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        All modules
      </Link>

      {/* Page heading */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <span style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: "linear-gradient(135deg, #E6F1F2, #D9ECEE)",
          boxShadow: "inset 0 0 0 1px rgba(62,138,149,0.18), 0 2px 6px rgba(33,51,94,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, lineHeight: 1, marginTop: 2,
        }}>
          {sigil}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h1 style={{
            margin: 0,
            fontFamily: "var(--np-font-display)", fontWeight: 700, fontSize: 32,
            color: "var(--np-secondary)", letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            {title}
          </h1>
          <p style={{
            margin: 0,
            fontFamily: "var(--np-font-body)", fontSize: 14, lineHeight: 1.5,
            color: "var(--np-fg-2)", maxWidth: 640,
          }}>
            {description}
          </p>
        </div>
      </div>

      {/* Page content */}
      {children}
    </div>
  );
}
