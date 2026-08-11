"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/timeline";
import { useIntroPhase } from "@/lib/useIntroPhase";
import IntroHeadline from "./IntroHeadline";
import WallScene3D from "./room/WallScene3D";

/**
 * Orchestrates the intro: blank canvas → headline → 3D wall → light →
 * the framed piece assembling. Scrolling is locked until it completes.
 * (Window, furniture, and companion artwork return when their 3D
 * versions are supplied.)
 */
export default function Hero() {
  const reduceMotion = useReducedMotion();
  const { atLeast, done } = useIntroPhase(reduceMotion ?? false);

  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <section className="relative h-dvh w-full bg-white pt-14">
      <div className="relative h-full w-full overflow-hidden">
        {/* The wall itself — a real 3D surface with real light */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={atLeast("roomEmerge") ? { opacity: 1 } : {}}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <WallScene3D light={atLeast("light")} art={atLeast("art")} />
        </motion.div>

        <IntroHeadline
          showHeadline={atLeast("headline")}
          showSubline={atLeast("subline")}
          fadeOut={atLeast("roomEmerge")}
        />

        {/* Closing line + scroll cue once the piece is complete */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 px-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
        >
          <p className="text-[10px] font-medium tracking-[0.3em] text-neutral-300 md:text-[11px]">
            THE WALL WAS FINE. THE ART MADE IT YOURS.
          </p>
          <a
            href="#shop"
            className="pointer-events-auto border-b border-white pb-0.5 text-[11px] font-semibold tracking-[0.24em] text-white"
          >
            SHOP THE COLLECTION
          </a>
        </motion.div>
      </div>
    </section>
  );
}
