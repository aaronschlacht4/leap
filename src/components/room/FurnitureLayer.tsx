"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { EASE } from "@/lib/timeline";

type Props = { active: boolean };

/** Seconds between each piece settling into place. */
const STEP = 0.35;

/**
 * POV composition: the viewer faces the wall straight on. No floor is
 * visible — furniture is anchored to the bottom edge of the frame and
 * cropped there. Sunlight comes from the window on the left, so every
 * object casts a soft shadow to its right on the wall.
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
    "drop-shadow(16px 12px 22px rgba(70,55,35,0.22)) drop-shadow(4px 4px 8px rgba(70,55,35,0.10))",
};

function SofaSvg() {
  return (
    <svg viewBox="0 0 600 300" className="h-full w-full" style={WALL_SHADOW}>
      <defs>
        <linearGradient id="sofa-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1EADC" />
          <stop offset="100%" stopColor="#E0D5C0" />
        </linearGradient>
        <linearGradient id="sofa-cushion" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4EEE0" />
          <stop offset="70%" stopColor="#E9E0CC" />
          <stop offset="100%" stopColor="#DDD1B9" />
        </linearGradient>
        <linearGradient id="sofa-seat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6F0E2" />
          <stop offset="100%" stopColor="#E6DCC6" />
        </linearGradient>
        <linearGradient id="sofa-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EAE1CE" />
          <stop offset="100%" stopColor="#D9CDB4" />
        </linearGradient>
        <linearGradient id="sofa-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7DCC6" />
          <stop offset="100%" stopColor="#D5C8AD" />
        </linearGradient>
        <linearGradient id="pillow-linen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EDE2CC" />
          <stop offset="100%" stopColor="#D6C7A8" />
        </linearGradient>
        <linearGradient id="pillow-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93A181" />
          <stop offset="100%" stopColor="#6A785C" />
        </linearGradient>
      </defs>

      {/* back frame */}
      <rect x="34" y="16" width="532" height="130" rx="18" fill="url(#sofa-back)" />

      {/* back cushions */}
      {[46, 224, 402].map((x) => (
        <g key={x}>
          <rect x={x} y="28" width="152" height="112" rx="16" fill="url(#sofa-cushion)" />
          {/* top-light highlight */}
          <path
            d={`M ${x + 10} 44 Q ${x + 76} 26 ${x + 142} 44 L ${x + 142} 52 Q ${x + 76} 36 ${x + 10} 52 Z`}
            fill="#FFFFFF"
            opacity="0.35"
          />
          {/* crease shadow at cushion base */}
          <rect x={x + 6} y="130" width="140" height="10" rx="5" fill="#B9A98C" opacity="0.35" />
        </g>
      ))}

      {/* arms */}
      <rect x="0" y="64" width="66" height="236" rx="24" fill="url(#sofa-arm)" />
      <rect x="534" y="64" width="66" height="236" rx="24" fill="url(#sofa-arm)" />
      {/* arm inner-edge occlusion */}
      <rect x="56" y="80" width="10" height="220" fill="#8A7B5F" opacity="0.14" />
      <rect x="534" y="80" width="10" height="220" fill="#8A7B5F" opacity="0.14" />
      {/* arm top highlights */}
      <path d="M 8 74 Q 33 58 58 74 L 58 84 Q 33 68 8 84 Z" fill="#FFFFFF" opacity="0.4" />
      <path d="M 542 74 Q 567 58 592 74 L 592 84 Q 567 68 542 84 Z" fill="#FFFFFF" opacity="0.4" />

      {/* seat cushions */}
      <rect x="60" y="146" width="238" height="62" rx="14" fill="url(#sofa-seat)" />
      <rect x="302" y="146" width="238" height="62" rx="14" fill="url(#sofa-seat)" />
      {/* seat front crease */}
      <rect x="60" y="200" width="480" height="8" rx="4" fill="#A69575" opacity="0.28" />

      {/* base — runs to the bottom edge (cropped by the viewport) */}
      <rect x="34" y="206" width="532" height="94" fill="url(#sofa-base)" />
      <rect x="34" y="206" width="532" height="6" fill="#8A7B5F" opacity="0.18" />

      {/* throw pillows */}
      <g transform="rotate(-8 128 118)">
        <rect x="86" y="76" width="84" height="84" rx="18" fill="url(#pillow-linen)" />
        <path d="M 96 92 Q 128 78 160 92 L 160 100 Q 128 86 96 100 Z" fill="#FFFFFF" opacity="0.4" />
      </g>
      <g transform="rotate(7 462 120)">
        <rect x="420" y="80" width="82" height="82" rx="18" fill="url(#pillow-green)" />
        <path d="M 430 96 Q 461 82 492 96 L 492 104 Q 461 90 430 104 Z" fill="#FFFFFF" opacity="0.28" />
      </g>
    </svg>
  );
}

function PlantSvg() {
  const leaves: Array<[number, number, number, number, string]> = [
    // [cx, cy, length, rotation, gradient id]
    [78, 130, 96, -38, "leaf-a"],
    [140, 118, 104, 24, "leaf-b"],
    [104, 92, 112, -8, "leaf-c"],
    [62, 170, 78, -62, "leaf-b"],
    [156, 162, 82, 55, "leaf-a"],
    [122, 74, 88, 8, "leaf-d"],
    [92, 108, 70, -22, "leaf-d"],
  ];
  return (
    <svg viewBox="0 0 220 360" className="h-full w-full" style={WALL_SHADOW}>
      <defs>
        <linearGradient id="leaf-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#879972" />
          <stop offset="100%" stopColor="#5C6B4E" />
        </linearGradient>
        <linearGradient id="leaf-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#758861" />
          <stop offset="100%" stopColor="#4E5C42" />
        </linearGradient>
        <linearGradient id="leaf-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93A57E" />
          <stop offset="100%" stopColor="#66774F" />
        </linearGradient>
        <linearGradient id="leaf-d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9DAE88" />
          <stop offset="100%" stopColor="#707F5B" />
        </linearGradient>
        <linearGradient id="pot-ceramic" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EFE8D8" />
          <stop offset="55%" stopColor="#E0D6C0" />
          <stop offset="100%" stopColor="#C6B99E" />
        </linearGradient>
      </defs>

      {/* stems */}
      {leaves.map(([cx, cy], i) => (
        <path
          key={i}
          d={`M 110 250 Q ${(110 + cx) / 2} ${cy + 60} ${cx} ${cy + 14}`}
          fill="none"
          stroke="#4E5B43"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      ))}

      {/* leaves — oval blades with a midrib and side veins */}
      {leaves.map(([cx, cy, len, rot, grad], i) => (
        <g key={i} transform={`rotate(${rot} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={len * 0.30} ry={len * 0.52} fill={`url(#${grad})`} />
          <line
            x1={cx}
            y1={cy - len * 0.48}
            x2={cx}
            y2={cy + len * 0.48}
            stroke="#42503A"
            strokeWidth="1.6"
            opacity="0.55"
          />
          {[-0.28, -0.06, 0.18].map((t) => (
            <path
              key={t}
              d={`M ${cx} ${cy + len * t} Q ${cx + len * 0.16} ${cy + len * (t - 0.1)} ${cx + len * 0.26} ${cy + len * (t - 0.16)}`}
              fill="none"
              stroke="#42503A"
              strokeWidth="1"
              opacity="0.35"
            />
          ))}
          <ellipse
            cx={cx - len * 0.1}
            cy={cy - len * 0.18}
            rx={len * 0.10}
            ry={len * 0.26}
            fill="#FFFFFF"
            opacity="0.14"
          />
        </g>
      ))}

      {/* pot — cropped at the bottom of the frame */}
      <path d="M 62 244 h 96 a 6 6 0 0 1 6 7 l -9 109 h -90 l -9 -109 a 6 6 0 0 1 6 -7 z" fill="url(#pot-ceramic)" />
      <rect x="54" y="238" width="112" height="16" rx="8" fill="#E6DCC8" />
      <rect x="54" y="238" width="112" height="16" rx="8" fill="#8A7B5F" opacity="0.1" />
      <path d="M 66 260 l 7 96 h 8 l -8 -96 z" fill="#FFFFFF" opacity="0.25" />
    </svg>
  );
}

function LampSvg() {
  return (
    <svg viewBox="0 0 180 560" className="h-full w-full" style={WALL_SHADOW}>
      <defs>
        <linearGradient id="lamp-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DFD5BC" />
          <stop offset="45%" stopColor="#F7F1E1" />
          <stop offset="100%" stopColor="#D8CDB2" />
        </linearGradient>
        <radialGradient id="lamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,232,185,0.55)" />
          <stop offset="100%" stopColor="rgba(255,232,185,0)" />
        </radialGradient>
      </defs>

      {/* warm halo on the wall */}
      <ellipse cx="90" cy="105" rx="115" ry="95" fill="url(#lamp-glow)" />

      {/* drum shade — slight taper, cylindrical shading */}
      <path d="M 34 28 h 112 l 10 118 h -132 z" fill="url(#lamp-shade)" />
      <ellipse cx="90" cy="28" rx="56" ry="7" fill="#EDE5D1" />
      <ellipse cx="90" cy="146" rx="66" ry="8" fill="#C9BDA1" opacity="0.6" />
      {/* light spilling from the bottom of the shade */}
      <ellipse cx="90" cy="152" rx="52" ry="10" fill="rgba(255,236,196,0.7)" />

      {/* stem with a catch-light */}
      <rect x="86" y="154" width="8" height="406" fill="#221E18" />
      <rect x="87.5" y="154" width="2" height="406" fill="#5A5244" />
      {/* finial */}
      <rect x="84" y="150" width="12" height="8" rx="3" fill="#221E18" />
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

      {/* 2 — plant, slightly in front of the sofa's left arm */}
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
