"use client";

/**
 * CSS/SVG-drawn canvas artworks, shared between the hero room wall
 * and the product grid so the store sells exactly what the room wears.
 */

export type ArtDesign = "arches" | "typographic" | "sunline" | "stillLife";

function Arches() {
  return (
    <svg viewBox="0 0 100 130" className="h-full w-full">
      <rect width="100" height="130" fill="#F6F2EA" />
      <path d="M22 108 V 58 A 16 16 0 0 1 54 58 V 108 Z" fill="#D9CBAF" />
      <path d="M46 108 V 44 A 17 17 0 0 1 80 44 V 108 Z" fill="#7E8C6F" />
      <path
        d="M34 108 V 70 A 12 12 0 0 1 58 70 V 108"
        fill="none"
        stroke="#1E1B17"
        strokeWidth="1.6"
      />
      <line x1="16" y1="108" x2="86" y2="108" stroke="#1E1B17" strokeWidth="1.6" />
    </svg>
  );
}

function Typographic() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-[6%] bg-white p-[12%]">
      <span className="text-[clamp(9px,1.35vw,20px)] font-extrabold leading-none tracking-[-0.02em] text-black">
        MAKE
      </span>
      <span className="text-[clamp(9px,1.35vw,20px)] font-extrabold leading-none tracking-[-0.02em] text-black">
        IT
      </span>
      <span className="text-[clamp(9px,1.35vw,20px)] font-extrabold leading-none tracking-[-0.02em] text-black">
        YOURS.
      </span>
      <span className="mt-[8%] block h-px w-[38%] bg-black" />
    </div>
  );
}

function Sunline() {
  return (
    <svg viewBox="0 0 100 130" className="h-full w-full">
      <rect width="100" height="130" fill="#FBF9F4" />
      <circle cx="50" cy="52" r="20" fill="#E4D3AC" />
      <path
        d="M10 92 Q 30 78 50 92 T 90 92"
        fill="none"
        stroke="#1E1B17"
        strokeWidth="1.6"
      />
      <path
        d="M10 102 Q 30 88 50 102 T 90 102"
        fill="none"
        stroke="#1E1B17"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function StillLife() {
  return (
    <svg viewBox="0 0 100 130" className="h-full w-full">
      <rect width="100" height="130" fill="#F3EFE6" />
      <ellipse cx="38" cy="84" rx="17" ry="24" fill="#6F8261" />
      <ellipse cx="62" cy="90" rx="13" ry="18" fill="#B8A986" />
      <line x1="14" y1="110" x2="86" y2="110" stroke="#1E1B17" strokeWidth="1.4" />
      <circle cx="66" cy="46" r="9" fill="none" stroke="#1E1B17" strokeWidth="1.3" />
    </svg>
  );
}

const DESIGNS: Record<ArtDesign, () => React.ReactElement> = {
  arches: Arches,
  typographic: Typographic,
  sunline: Sunline,
  stillLife: StillLife,
};

export default function CanvasArt({
  design,
  framed = false,
}: {
  design: ArtDesign;
  framed?: boolean;
}) {
  const Design = DESIGNS[design];
  return (
    <div
      className="h-full w-full overflow-hidden bg-white"
      style={framed ? { border: "3px solid #171512", padding: 0 } : undefined}
    >
      <Design />
    </div>
  );
}
