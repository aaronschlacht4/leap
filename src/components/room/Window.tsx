"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/timeline";

type Props = { active: boolean };

const t = (delay: number, duration = 0.5) => ({
  duration,
  delay,
  ease: EASE,
});

/**
 * Architectural window that constructs itself into the wall:
 * recess → outer frame → mullions → glass → outdoor scenery → sill.
 */
export default function Window({ active }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: "6%",
        top: "10%",
        width: "clamp(118px, 24vw, 380px)",
        height: "min(54%, max(30vw, 240px))",
      }}
    >
      {/* Wall recess — the opening reads as depth before anything else */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: "#EFEAE1",
          boxShadow:
            "inset 6px 6px 14px rgba(60,50,35,0.18), inset -3px -3px 8px rgba(60,50,35,0.08)",
        }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={t(0, 0.45)}
      />

      {/* Outdoor scenery — revealed last, easing back as if focus arrives */}
      <motion.div
        className="absolute inset-[7%] overflow-hidden"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={t(0.85, 0.7)}
      >
        <svg
          viewBox="0 0 200 280"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient id="win-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9DCE6" />
              <stop offset="60%" stopColor="#E3EEEF" />
              <stop offset="100%" stopColor="#F2F4EA" />
            </linearGradient>
            <radialGradient id="win-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,244,214,0.9)" />
              <stop offset="100%" stopColor="rgba(255,244,214,0)" />
            </radialGradient>
            <linearGradient id="tree-far" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A8BA97" />
              <stop offset="100%" stopColor="#8CA07C" />
            </linearGradient>
            <linearGradient id="tree-near" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C9068" />
              <stop offset="100%" stopColor="#5E7050" />
            </linearGradient>
            <linearGradient id="win-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93A67E" />
              <stop offset="100%" stopColor="#7C8F6A" />
            </linearGradient>
          </defs>

          {/* Sky with morning haze */}
          <rect width="200" height="280" fill="url(#win-sky)" />
          <ellipse cx="150" cy="70" rx="90" ry="70" fill="url(#win-sun)" />

          {/* Distant treeline — soft, hazy */}
          <path
            d="M0 152 Q 18 132 42 144 Q 62 122 90 138 Q 112 120 140 134 Q 164 118 184 132 Q 194 128 200 134 V 280 H 0 Z"
            fill="url(#tree-far)"
            opacity="0.8"
          />

          {/* Mid canopy — irregular organic mass */}
          <path
            d="M-8 196 Q 8 168 28 176 Q 36 152 62 162 Q 76 144 98 158 Q 118 140 138 156 Q 158 146 172 162 Q 190 156 208 176 V 280 H -8 Z"
            fill="url(#tree-near)"
          />
          {/* canopy texture clumps */}
          <ellipse cx="52" cy="180" rx="26" ry="16" fill="#546547" opacity="0.5" />
          <ellipse cx="118" cy="172" rx="30" ry="18" fill="#546547" opacity="0.4" />
          <ellipse cx="170" cy="184" rx="22" ry="14" fill="#546547" opacity="0.45" />

          {/* Foreground tree with trunk and layered crown */}
          <rect x="60" y="196" width="5" height="52" rx="2" fill="#66543F" />
          <path d="M 62 196 q -3 -14 2 -26" fill="none" stroke="#66543F" strokeWidth="3" />
          <ellipse cx="63" cy="158" rx="34" ry="26" fill="#5E7050" />
          <ellipse cx="48" cy="150" rx="20" ry="15" fill="#72855F" />
          <ellipse cx="78" cy="148" rx="18" ry="13" fill="#526344" opacity="0.85" />

          {/* Ground falling toward the house */}
          <rect y="236" width="200" height="44" fill="url(#win-ground)" />
          <path d="M0 236 Q 100 228 200 238 V 244 Q 100 234 0 242 Z" fill="#A9BA90" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Glass — faint tint and a single restrained reflection */}
      <motion.div
        className="absolute inset-[7%]"
        style={{
          backgroundColor: "rgba(226, 235, 236, 0.14)",
          backgroundImage:
            "linear-gradient(115deg, rgba(255,255,255,0) 42%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 58%)",
        }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={t(0.6, 0.5)}
      />

      {/* Outer frame */}
      <motion.div
        className="absolute inset-0 border-[10px]"
        style={{
          borderColor: "#FAF8F4",
          boxShadow:
            "0 3px 14px rgba(60,50,35,0.14), inset 0 0 0 1px rgba(96,78,52,0.14), inset 3px 3px 6px rgba(96,78,52,0.10)",
        }}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={active ? { opacity: 1, scale: 1 } : {}}
        transition={t(0.18, 0.5)}
      />

      {/* Mullions — vertical grows first, then horizontal */}
      <motion.div
        className="absolute left-1/2 top-[3%] h-[94%] w-[7px] -translate-x-1/2"
        style={{ backgroundColor: "#FAF8F4", transformOrigin: "top" }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={active ? { opacity: 1, scaleY: 1 } : {}}
        transition={t(0.38, 0.45)}
      />
      <motion.div
        className="absolute left-[3%] top-1/2 h-[7px] w-[94%] -translate-y-1/2"
        style={{ backgroundColor: "#FAF8F4", transformOrigin: "left" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={active ? { opacity: 1, scaleX: 1 } : {}}
        transition={t(0.5, 0.45)}
      />

      {/* Sill */}
      <motion.div
        className="absolute -bottom-[10px] left-[-4%] h-[12px] w-[108%]"
        style={{
          backgroundColor: "#FAF8F4",
          boxShadow: "0 6px 10px rgba(60,50,35,0.14)",
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={active ? { opacity: 1, y: 0 } : {}}
        transition={t(0.7, 0.5)}
      />
    </div>
  );
}
