"use client";

import Link from "next/link";
import { useState } from "react";

interface Props {
  href: string;
  sigil: string;
  title: string;
  description: string;
}

export default function ModuleTile({ href, sigil, title, description }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        textDecoration: "none",
        background: "#fff",
        border: `1px solid ${hover ? "rgba(62,138,149,0.15)" : "rgba(33,51,94,0.04)"}`,
        padding: "18px 18px 16px",
        borderRadius: 18,
        boxShadow: hover
          ? "0 12px 28px rgba(33,51,94,0.12), 0 4px 8px rgba(33,51,94,0.06)"
          : "0 1px 2px rgba(33,51,94,0.05)",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition:
          "transform 220ms cubic-bezier(0.2,0.7,0.2,1), box-shadow 220ms cubic-bezier(0.2,0.7,0.2,1), border-color 220ms",
        cursor: "pointer",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* Teal halo */}
      <span
        aria-hidden
        style={{
          position: "absolute", top: -50, right: -50,
          width: 160, height: 160,
          background: "radial-gradient(circle, rgba(62,138,149,0.18), rgba(62,138,149,0) 70%)",
          zIndex: 0, pointerEvents: "none",
          borderRadius: "50%",
        }}
      />
      {/* Navy halo */}
      <span
        aria-hidden
        style={{
          position: "absolute", bottom: -60, left: -40,
          width: 140, height: 140,
          background: "radial-gradient(circle, rgba(33,51,94,0.06), rgba(33,51,94,0) 70%)",
          zIndex: 0, pointerEvents: "none",
          borderRadius: "50%",
        }}
      />

      {/* Top row: sigil + chevron */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, #E6F1F2, #D9ECEE)",
          boxShadow: "inset 0 0 0 1px rgba(62,138,149,0.18), 0 1px 2px rgba(33,51,94,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, lineHeight: 1,
          transform: hover ? "scale(1.06) rotate(-2deg)" : "scale(1)",
          transition: "transform 260ms cubic-bezier(0.2,0.7,0.2,1)",
        }}>
          {sigil}
        </span>
        <svg
          viewBox="0 0 24 24"
          style={{
            width: 16, height: 16,
            stroke: "#3E8A95", fill: "none", strokeWidth: 2.5,
            strokeLinecap: "round", strokeLinejoin: "round",
            opacity: hover ? 1 : 0.4,
            transform: hover ? "translateX(3px)" : "translateX(0)",
            transition: "transform 220ms cubic-bezier(0.2,0.7,0.2,1), opacity 220ms",
          }}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>

      {/* Title */}
      <div style={{
        position: "relative", zIndex: 1,
        fontFamily: "var(--np-font-display)", fontWeight: 600,
        fontSize: 15, color: "#21335E",
        letterSpacing: "-0.01em", lineHeight: 1.25,
        marginTop: 2,
      }}>
        {title}
      </div>

      {/* Description */}
      <div
        style={{
          position: "relative", zIndex: 1,
          fontFamily: "var(--np-font-body)", fontSize: 12,
          lineHeight: 1.45, color: "#5C6B85",
          flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
        } as React.CSSProperties}
      >
        {description}
      </div>

      {/* Animated teal bar */}
      <div style={{
        position: "relative", zIndex: 1,
        height: 2,
        width: hover ? 52 : 22,
        background: "linear-gradient(90deg, #3E8A95, #7CB3B9)",
        borderRadius: 2,
        transition: "width 320ms cubic-bezier(0.2,0.7,0.2,1)",
      }} />
    </Link>
  );
}
