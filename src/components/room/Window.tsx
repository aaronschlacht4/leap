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
          {/* Sky */}
          <rect width="200" height="280" fill="#DCE7E9" />
          <rect width="200" height="120" fill="#E4EDEE" />
          {/* Distant treeline */}
          <path
            d="M0 150 Q 25 128 55 142 Q 80 118 110 138 Q 140 116 170 136 Q 188 128 200 138 V 280 H 0 Z"
            fill="#9AAE8D"
          />
          {/* Near foliage */}
          <path
            d="M-10 190 Q 30 158 70 180 Q 105 152 150 178 Q 180 162 210 184 V 280 H -10 Z"
            fill="#77896B"
          />
          {/* Tree trunks */}
          <rect x="52" y="176" width="4" height="40" fill="#6B5B48" />
          <ellipse cx="54" cy="166" rx="26" ry="22" fill="#647A58" />
          <rect x="148" y="188" width="3.4" height="34" fill="#6B5B48" />
          <ellipse cx="150" cy="178" rx="21" ry="18" fill="#5C7050" />
          {/* Ground */}
          <rect y="228" width="200" height="52" fill="#8B9C7C" />
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
          boxShadow: "0 2px 10px rgba(60,50,35,0.10)",
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
