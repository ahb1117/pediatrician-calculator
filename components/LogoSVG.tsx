export default function LogoSVG({ height = 48 }: { height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 88"
      fill="none"
      style={{ height, width: "auto", display: "block" }}
      aria-label="NeoPeds Medical Resource"
    >
      <defs>
        <linearGradient id="np-grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6CC0CA" />
          <stop offset="100%" stopColor="#3E8A95" />
        </linearGradient>
      </defs>

      {/* Heart outline */}
      <path
        d="M 44 80
           C 12 58 2 43 2 28
           C 2 14 13 6 26 6
           C 34 6 41 11 44 18
           C 47 11 54 6 62 6
           C 75 6 86 14 86 28
           C 86 43 76 58 44 80 Z"
        stroke="url(#np-grad)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Baby — fetal curl, lower-left */}
      <circle cx="27" cy="54" r="5.5" stroke="url(#np-grad)" strokeWidth="2.5" />
      <path
        d="M 26 59.5 C 19 68 16 63 20 57"
        stroke="url(#np-grad)" strokeWidth="2.5" strokeLinecap="round"
      />
      <path
        d="M 20 57 C 22 52 27 52 27 49.5"
        stroke="url(#np-grad)" strokeWidth="2.5" strokeLinecap="round"
      />

      {/* Child — standing, arms spread, center */}
      <circle cx="44" cy="29" r="6" stroke="url(#np-grad)" strokeWidth="2.5" />
      <line x1="44" y1="35" x2="44" y2="55" stroke="url(#np-grad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="31" y1="44" x2="57" y2="44" stroke="url(#np-grad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="55" x2="37" y2="68" stroke="url(#np-grad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="55" x2="51" y2="68" stroke="url(#np-grad)" strokeWidth="2.5" strokeLinecap="round" />

      {/* NeoPeds */}
      <text
        x="100" y="52"
        fontFamily="var(--np-font-display, Montserrat, Arial, sans-serif)"
        fontSize="30"
        fill="#21335E"
      >
        <tspan fontWeight="500">Neo</tspan>
        <tspan fontWeight="800">Peds</tspan>
      </text>

      {/* MEDICAL RESOURCE */}
      <text
        x="102" y="68"
        fontFamily="var(--np-font-body, Inter, Arial, sans-serif)"
        fontSize="11"
        fontWeight="600"
        letterSpacing="2.4"
        fill="#94A3B8"
      >
        MEDICAL RESOURCE
      </text>
    </svg>
  );
}
