"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { EASE } from "@/lib/timeline";

type Props = { active: boolean };

/** Seconds between each piece of furniture settling into place. */
const STEP = 0.3;

/** Rises a few pixels into place, then its floor shadow catches up. */
function Settle({
  order,
  active,
  className,
  style,
  shadowWidth = "86%",
  children,
}: {
  order: number;
  active: boolean;
  className?: string;
  style?: CSSProperties;
  shadowWidth?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={`absolute ${className ?? ""}`}
      style={style}
      initial={{ opacity: 0, y: 18 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: order * STEP, ease: EASE }}
    >
      {children}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -7,
          width: shadowWidth,
          height: 10,
          backgroundColor: "rgba(58, 46, 30, 0.20)",
          filter: "blur(7px)",
          borderRadius: "50%",
        }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: order * STEP + 0.3, ease: EASE }}
      />
    </motion.div>
  );
}

export default function FurnitureLayer({ active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 1 — floor becomes more defined: plank seams surface */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[24%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(92,72,48,0.10) 0 1px, transparent 1px 96px)",
        }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE }}
      />

      {/* 2 — rug */}
      <Settle
        order={1}
        active={active}
        className="left-1/2 -translate-x-1/2 md:left-[53%]"
        style={{ bottom: "5.5%", width: "min(90vw, 720px)", height: "8.5%" }}
        shadowWidth="96%"
      >
        <div
          className="h-full w-full"
          style={{
            backgroundColor: "#E9E1D0",
            border: "1px solid #DCD2BD",
            boxShadow: "inset 0 0 24px rgba(120,100,70,0.10)",
          }}
        />
      </Settle>

      {/* 3 — low-profile sofa */}
      <Settle
        order={2}
        active={active}
        className="left-1/2 -translate-x-1/2 md:left-[53%]"
        style={{
          bottom: "9.5%",
          width: "clamp(270px, 34vw, 540px)",
          height: "clamp(104px, 11vw, 175px)",
        }}
      >
        <div className="relative h-full w-full">
          {/* back cushions */}
          <div className="absolute inset-x-0 top-0 flex h-[42%] gap-[3px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-full flex-1"
                style={{
                  backgroundColor: "#E7DFCF",
                  borderRadius: 3,
                  boxShadow: "inset 0 -6px 10px rgba(110,90,60,0.12)",
                }}
              />
            ))}
          </div>
          {/* seat */}
          <div className="absolute inset-x-0 top-[42%] flex h-[28%] gap-[3px]">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-full flex-1"
                style={{
                  backgroundColor: "#EDE6D6",
                  borderRadius: 3,
                  boxShadow: "inset 0 5px 8px rgba(110,90,60,0.08)",
                }}
              />
            ))}
          </div>
          {/* base */}
          <div
            className="absolute inset-x-[1%] top-[70%] h-[18%]"
            style={{ backgroundColor: "#E2DAC9", borderRadius: 2 }}
          />
          {/* legs */}
          {["6%", "32%", "66%", "92%"].map((left) => (
            <div
              key={left}
              className="absolute bottom-0 h-[12%] w-[3px]"
              style={{ left, backgroundColor: "#26221D" }}
            />
          ))}
          {/* throw pillows */}
          <div
            className="absolute left-[4%] top-[26%] h-[34%] w-[13%]"
            style={{
              backgroundColor: "#D9CBAF",
              borderRadius: 3,
              transform: "rotate(-7deg)",
              boxShadow: "inset -4px -4px 8px rgba(110,90,60,0.14)",
            }}
          />
          <div
            className="absolute right-[5%] top-[28%] h-[32%] w-[12%]"
            style={{
              backgroundColor: "#7E8C6F",
              borderRadius: 3,
              transform: "rotate(6deg)",
              boxShadow: "inset -4px -4px 8px rgba(50,60,40,0.22)",
            }}
          />
        </div>
      </Settle>

      {/* 4 — side table, with decor (step 7) resting on its top */}
      <div
        className="absolute hidden md:block"
        style={{
          left: "75.5%",
          bottom: "10%",
          width: "clamp(74px, 6.5vw, 104px)",
          height: "clamp(64px, 5.6vw, 90px)",
        }}
      >
        <Settle order={3} active={active} className="inset-0">
          <div className="relative h-full w-full">
            <div
              className="absolute inset-x-0 top-0 h-[10%]"
              style={{ backgroundColor: "#B2946E", borderRadius: 2 }}
            />
            <div
              className="absolute left-1/2 top-[10%] h-[76%] w-[7%] -translate-x-1/2"
              style={{ backgroundColor: "#A5875F" }}
            />
            <div
              className="absolute bottom-0 left-1/2 h-[6%] w-[52%] -translate-x-1/2"
              style={{ backgroundColor: "#A5875F", borderRadius: "50%" }}
            />
          </div>
        </Settle>

        {/* 7 — small decor: stacked books and a vase on the tabletop */}
        <Settle
          order={6}
          active={active}
          style={{ bottom: "94%", left: "10%", width: "80%", height: "58%" }}
          shadowWidth="0%"
        >
          <div className="relative h-full w-full">
            <div
              className="absolute bottom-0 left-0 h-[14%] w-[62%]"
              style={{ backgroundColor: "#2C2823" }}
            />
            <div
              className="absolute bottom-[14%] left-[4%] h-[13%] w-[56%]"
              style={{ backgroundColor: "#C7B899" }}
            />
            <div
              className="absolute bottom-[27%] left-[2%] h-[12%] w-[59%]"
              style={{ backgroundColor: "#8A8478" }}
            />
            <div
              className="absolute bottom-0 right-[4%] h-[52%] w-[22%]"
              style={{ backgroundColor: "#CFC0A8", borderRadius: "40% 40% 8% 8%" }}
            />
            <div
              className="absolute bottom-[48%] right-[12%] h-[52%] w-[1.5px]"
              style={{ backgroundColor: "#7A6E58", transform: "rotate(8deg)" }}
            />
            <div
              className="absolute bottom-[50%] right-[16%] h-[44%] w-[1.5px]"
              style={{ backgroundColor: "#7A6E58", transform: "rotate(-10deg)" }}
            />
          </div>
        </Settle>
      </div>

      {/* 5 — floor lamp (desktop only) */}
      <Settle
        order={4}
        active={active}
        className="hidden md:block"
        style={{
          left: "86%",
          bottom: "10.5%",
          width: "clamp(80px, 7vw, 120px)",
          height: "clamp(210px, 24vw, 360px)",
        }}
        shadowWidth="55%"
      >
        <div className="relative h-full w-full">
          {/* soft glow behind the shade */}
          <div
            className="absolute left-1/2 top-[2%] h-[30%] w-[150%] -translate-x-1/2"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,232,190,0.5) 0%, rgba(255,232,190,0) 68%)",
            }}
          />
          {/* shade */}
          <div
            className="absolute left-1/2 top-0 h-[22%] w-[88%] -translate-x-1/2"
            style={{
              backgroundColor: "#F1EBDB",
              clipPath: "polygon(14% 0, 86% 0, 100% 100%, 0 100%)",
              boxShadow: "inset 0 -8px 12px rgba(120,100,60,0.16)",
            }}
          />
          {/* pole + base */}
          <div
            className="absolute left-1/2 top-[22%] h-[74%] w-[2px] -translate-x-1/2"
            style={{ backgroundColor: "#1E1B17" }}
          />
          <div
            className="absolute bottom-0 left-1/2 h-[2.5%] w-[46%] -translate-x-1/2"
            style={{ backgroundColor: "#1E1B17", borderRadius: "50%" }}
          />
        </div>
      </Settle>

      {/* 6 — plant */}
      <Settle
        order={5}
        active={active}
        className="max-sm:left-[4%]!"
        style={{
          left: "27%",
          bottom: "10.5%",
          width: "clamp(84px, 8vw, 132px)",
          height: "clamp(130px, 13vw, 210px)",
        }}
        shadowWidth="70%"
      >
        <svg viewBox="0 0 100 160" className="h-full w-full">
          <g stroke="none">
            <path d="M50 96 C 46 60 28 46 12 40 C 26 66 36 78 46 98 Z" fill="#6F8261" />
            <path d="M50 98 C 52 56 66 40 86 32 C 74 62 60 78 54 100 Z" fill="#59684E" />
            <path d="M49 100 C 44 72 40 52 46 28 C 56 52 56 76 53 100 Z" fill="#7E8F6E" />
            <path d="M50 100 C 60 82 74 74 90 72 C 76 90 62 96 54 102 Z" fill="#6F8261" />
            <path d="M50 100 C 40 84 26 78 10 78 C 24 94 40 98 47 103 Z" fill="#535F47" />
          </g>
          {/* pot */}
          <path d="M30 100 H 70 L 65 152 H 35 Z" fill="#CDBFA5" />
          <path d="M30 100 H 70 L 69 108 H 31 Z" fill="#C1B295" />
        </svg>
      </Settle>

    </div>
  );
}
