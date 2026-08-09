"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { EASE } from "@/lib/timeline";

type Props = { active: boolean };

/** Seconds between each piece settling into place. */
const STEP = 0.35;

/**
 * POV composition: the viewer faces the white wall straight on. No floor
 * is visible — furniture anchors to the bottom edge of the frame and is
 * cropped there. Window light comes from the left, so objects cast soft
 * neutral shadows to their right.
 */
function Settle({
  order,
  active,
  className,
  style,
  children,
}: {
  order: number;
  active: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={`absolute ${className ?? ""}`}
      style={style}
      initial={{ opacity: 0, y: 26 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: order * STEP, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const WALL_SHADOW = {
  filter:
    "drop-shadow(14px 12px 20px rgba(50,48,42,0.20)) drop-shadow(4px 4px 8px rgba(50,48,42,0.10))",
};

function SofaSvg() {
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full" style={WALL_SHADOW}>
      <defs>
        <linearGradient id="sf-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1EFE9" />
          <stop offset="100%" stopColor="#DFDBD0" />
        </linearGradient>
        <linearGradient id="sf-cushion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F3ED" />
          <stop offset="100%" stopColor="#E2DED2" />
        </linearGradient>
        <linearGradient id="sf-seat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F5EF" />
          <stop offset="100%" stopColor="#E6E2D6" />
        </linearGradient>
        <linearGradient id="sf-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EEEBE3" />
          <stop offset="100%" stopColor="#D8D4C8" />
        </linearGradient>
        <linearGradient id="sf-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7E3D8" />
          <stop offset="100%" stopColor="#D2CDC0" />
        </linearGradient>
        <linearGradient id="pl-linen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EBE5D7" />
          <stop offset="100%" stopColor="#D1C9B5" />
        </linearGradient>
        <linearGradient id="pl-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8F9B81" />
          <stop offset="100%" stopColor="#646F58" />
        </linearGradient>
        {/* soft blur for shading shapes — no hard cartoon edges */}
        <filter id="sf-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="sf-softer" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        {/* woven fabric grain */}
        <filter id="sf-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.32  0 0 0 0 0.30  0 0 0 0 0.26  0 0 0 0.07 0"
          />
        </filter>
        <clipPath id="sf-clip">
          <rect x="34" y="16" width="532" height="130" rx="18" />
          <rect x="0" y="64" width="66" height="236" rx="24" />
          <rect x="534" y="64" width="66" height="236" rx="24" />
          <rect x="34" y="146" width="532" height="154" rx="10" />
        </clipPath>
      </defs>

      {/* back frame */}
      <rect x="34" y="16" width="532" height="130" rx="18" fill="url(#sf-back)" />

      {/* back cushions — domed tops, blurred creases beneath */}
      {[48, 226, 404].map((x) => (
        <g key={x}>
          <rect x={x} y="28" width="148" height="112" rx="18" fill="url(#sf-cushion)" />
          <ellipse cx={x + 74} cy="38" rx="62" ry="12" fill="#FFFFFF" opacity="0.55" filter="url(#sf-soft)" />
          <rect x={x + 8} y="126" width="132" height="12" rx="6" fill="#8E866F" opacity="0.30" filter="url(#sf-soft)" />
          {/* side compression creases */}
          <rect x={x + 2} y="52" width="6" height="70" rx="3" fill="#8E866F" opacity="0.18" filter="url(#sf-soft)" />
          <rect x={x + 140} y="52" width="6" height="70" rx="3" fill="#8E866F" opacity="0.18" filter="url(#sf-soft)" />
        </g>
      ))}

      {/* arms */}
      <rect x="0" y="64" width="66" height="236" rx="24" fill="url(#sf-arm)" />
      <rect x="534" y="64" width="66" height="236" rx="24" fill="url(#sf-arm)" />
      <rect x="52" y="84" width="14" height="216" fill="#867E68" opacity="0.16" filter="url(#sf-soft)" />
      <rect x="534" y="84" width="14" height="216" fill="#867E68" opacity="0.16" filter="url(#sf-soft)" />
      <ellipse cx="33" cy="72" rx="26" ry="10" fill="#FFFFFF" opacity="0.6" filter="url(#sf-soft)" />
      <ellipse cx="567" cy="72" rx="26" ry="10" fill="#FFFFFF" opacity="0.6" filter="url(#sf-soft)" />

      {/* seat cushions */}
      <rect x="60" y="146" width="238" height="62" rx="14" fill="url(#sf-seat)" />
      <rect x="302" y="146" width="238" height="62" rx="14" fill="url(#sf-seat)" />
      <ellipse cx="179" cy="154" rx="100" ry="9" fill="#FFFFFF" opacity="0.5" filter="url(#sf-soft)" />
      <ellipse cx="421" cy="154" rx="100" ry="9" fill="#FFFFFF" opacity="0.5" filter="url(#sf-soft)" />
      {/* gap between seat cushions */}
      <rect x="296" y="150" width="8" height="56" rx="4" fill="#8E866F" opacity="0.22" filter="url(#sf-soft)" />
      {/* seat front crease */}
      <rect x="56" y="200" width="488" height="10" rx="5" fill="#8E866F" opacity="0.26" filter="url(#sf-soft)" />

      {/* base — runs off the bottom edge of the frame */}
      <rect x="34" y="206" width="532" height="94" fill="url(#sf-base)" />
      <rect x="34" y="206" width="532" height="8" fill="#6E6752" opacity="0.14" filter="url(#sf-soft)" />

      {/* throw pillows — slouched, softly shaded */}
      <g transform="rotate(-8 128 118)">
        <rect x="86" y="76" width="84" height="84" rx="22" fill="url(#pl-linen)" />
        <ellipse cx="128" cy="90" rx="34" ry="9" fill="#FFFFFF" opacity="0.5" filter="url(#sf-soft)" />
        <rect x="92" y="140" width="72" height="12" rx="6" fill="#8E866F" opacity="0.28" filter="url(#sf-soft)" />
      </g>
      <g transform="rotate(7 462 120)">
        <rect x="420" y="80" width="82" height="82" rx="22" fill="url(#pl-green)" />
        <ellipse cx="461" cy="94" rx="33" ry="9" fill="#FFFFFF" opacity="0.30" filter="url(#sf-soft)" />
        <rect x="426" y="142" width="70" height="12" rx="6" fill="#3C4433" opacity="0.35" filter="url(#sf-soft)" />
      </g>

      {/* ambient occlusion where the back meets the seat */}
      <rect x="44" y="136" width="512" height="14" rx="7" fill="#6E6752" opacity="0.16" filter="url(#sf-softer)" />

      {/* woven texture across the whole silhouette */}
      <rect x="0" y="0" width="600" height="300" clipPath="url(#sf-clip)" filter="url(#sf-grain)" opacity="0.5" />
    </svg>
  );
}

/** Monstera leaf instances: [x, y, rotation, scale, brightness] */
const LEAVES: Array<[number, number, number, number, number]> = [
  [70, 158, -30, 0.85, 0.94],
  [152, 152, 28, 0.9, 1],
  [110, 122, -4, 1.02, 1.05],
  [52, 198, -56, 0.62, 0.88],
  [166, 200, 52, 0.68, 0.9],
  [130, 108, 12, 0.72, 1.08],
];

function PlantSvg() {
  return (
    <svg viewBox="0 0 220 360" className="h-full w-full" style={WALL_SHADOW}>
      <defs>
        <linearGradient id="mon-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#84956E" />
          <stop offset="100%" stopColor="#4F5D44" />
        </linearGradient>
        <linearGradient id="mon-pot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F0EEE9" />
          <stop offset="55%" stopColor="#DAD6CB" />
          <stop offset="100%" stopColor="#BFBAAC" />
        </linearGradient>
        <filter id="mon-soft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        {/* Monstera silhouette: heart-shaped blade, edge slits, midrib holes */}
        <mask id="mon-mask" maskUnits="userSpaceOnUse" x="-62" y="-142" width="124" height="154">
          <path
            d="M 0 2 C -10 -2 -30 -10 -40 -30 C -50 -50 -52 -82 -42 -102 C -32 -120 -14 -126 0 -126 C 14 -126 32 -120 42 -102 C 52 -82 50 -50 40 -30 C 30 -10 10 -2 0 2 Z"
            fill="#FFFFFF"
          />
          <path d="M -48 -40 L -7 -52 L -46 -60 Z" fill="#000000" />
          <path d="M -50 -68 L -7 -78 L -48 -86 Z" fill="#000000" />
          <path d="M -44 -96 L -7 -100 L -38 -110 Z" fill="#000000" />
          <path d="M 48 -54 L 7 -64 L 46 -72 Z" fill="#000000" />
          <path d="M 50 -82 L 7 -90 L 46 -98 Z" fill="#000000" />
          <path d="M 42 -108 L 7 -108 L 36 -118 Z" fill="#000000" />
          <circle cx="-12" cy="-68" r="3.2" fill="#000000" />
          <circle cx="10" cy="-86" r="2.8" fill="#000000" />
          <circle cx="13" cy="-58" r="2.4" fill="#000000" />
        </mask>
        <g id="mon-blade">
          <g mask="url(#mon-mask)">
            <rect x="-62" y="-142" width="124" height="154" fill="url(#mon-leaf)" />
            <path d="M 0 0 L 0 -120" stroke="#3F4B37" strokeWidth="2.4" opacity="0.6" fill="none" />
            {[-32, -56, -80, -102].map((t) => (
              <g key={t}>
                <path
                  d={`M 0 ${t} Q -18 ${t - 8} -36 ${t - 13}`}
                  stroke="#3F4B37"
                  strokeWidth="1.1"
                  opacity="0.4"
                  fill="none"
                />
                <path
                  d={`M 0 ${t - 12} Q 18 ${t - 20} 36 ${t - 25}`}
                  stroke="#3F4B37"
                  strokeWidth="1.1"
                  opacity="0.4"
                  fill="none"
                />
              </g>
            ))}
            {/* sheen along the upper-left of the blade */}
            <ellipse cx="-14" cy="-92" rx="18" ry="34" fill="#FFFFFF" opacity="0.12" />
          </g>
        </g>
      </defs>

      {/* stems */}
      {LEAVES.map(([x, y], i) => (
        <path
          key={i}
          d={`M 110 258 Q ${(110 + x) / 2} ${y + 66} ${x} ${y + 4}`}
          fill="none"
          stroke="#41503A"
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      ))}

      {/* dark interior mass — occlusion between overlapping leaves */}
      <ellipse cx="110" cy="170" rx="46" ry="56" fill="#39452F" opacity="0.4" filter="url(#mon-soft)" />

      {/* leaves */}
      {LEAVES.map(([x, y, rot, s, b], i) => (
        <use
          key={i}
          href="#mon-blade"
          transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
          style={{ filter: `brightness(${b})` }}
        />
      ))}

      {/* pot — matte ceramic, cropped by the bottom of the frame */}
      <path d="M 60 252 h 100 a 6 6 0 0 1 6 7 l -10 101 h -92 l -10 -101 a 6 6 0 0 1 6 -7 z" fill="url(#mon-pot)" />
      <rect x="52" y="246" width="116" height="16" rx="8" fill="#E4E1D8" />
      <rect x="52" y="256" width="116" height="6" fill="#6E6752" opacity="0.12" filter="url(#mon-soft)" />
      <path d="M 68 268 l 8 92 h 9 l -9 -92 z" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
}

function LampSvg() {
  return (
    <svg viewBox="0 0 180 560" className="h-full w-full" style={WALL_SHADOW}>
      <defs>
        <linearGradient id="lp-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DDD8CB" />
          <stop offset="45%" stopColor="#F6F2E8" />
          <stop offset="100%" stopColor="#D5D0C1" />
        </linearGradient>
        <radialGradient id="lp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,235,195,0.5)" />
          <stop offset="100%" stopColor="rgba(255,235,195,0)" />
        </radialGradient>
        <filter id="lp-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* warm halo on the wall */}
      <ellipse cx="90" cy="105" rx="115" ry="95" fill="url(#lp-glow)" />

      {/* drum shade — cylindrical shading, soft rims */}
      <path d="M 34 28 h 112 l 10 118 h -132 z" fill="url(#lp-shade)" />
      <ellipse cx="90" cy="28" rx="56" ry="7" fill="#ECE8DC" />
      <ellipse cx="90" cy="146" rx="66" ry="8" fill="#B9B3A1" opacity="0.55" filter="url(#lp-soft)" />
      {/* light spilling from the bottom of the shade */}
      <ellipse cx="90" cy="152" rx="52" ry="10" fill="rgba(255,238,200,0.65)" filter="url(#lp-soft)" />

      {/* stem with a catch-light */}
      <rect x="86" y="154" width="8" height="406" fill="#221F1A" />
      <rect x="87.5" y="154" width="2" height="406" fill="#57503F" />
      <rect x="84" y="150" width="12" height="8" rx="3" fill="#221F1A" />
    </svg>
  );
}

export default function FurnitureLayer({ active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 1 — sofa, anchored to the bottom edge */}
      <Settle
        order={0}
        active={active}
        className="left-1/2 -translate-x-1/2 md:left-[53%]"
        style={{
          bottom: "-1%",
          width: "clamp(330px, 40vw, 640px)",
          aspectRatio: "2 / 1",
        }}
      >
        <SofaSvg />
      </Settle>

      {/* 2 — monstera, slightly in front of the sofa's left arm */}
      <Settle
        order={1}
        active={active}
        className="max-sm:left-[2%]!"
        style={{
          left: "27%",
          bottom: "-1%",
          width: "clamp(120px, 11vw, 190px)",
          aspectRatio: "22 / 36",
        }}
      >
        <PlantSvg />
      </Settle>

      {/* 3 — floor lamp (desktop only), base cropped by the frame */}
      <Settle
        order={2}
        active={active}
        className="hidden md:block"
        style={{
          left: "85%",
          bottom: "-1%",
          width: "clamp(96px, 8.5vw, 150px)",
          aspectRatio: "18 / 56",
        }}
      >
        <LampSvg />
      </Settle>
    </div>
  );
}
