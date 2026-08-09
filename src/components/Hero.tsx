"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/timeline";
import { useIntroPhase } from "@/lib/useIntroPhase";
import IntroHeadline from "./IntroHeadline";
import RoomScene from "./room/RoomScene";

/**
 * Orchestrates the intro: blank canvas → headline → room → art.
 * Scrolling is locked until the transformation completes.
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
      <div className="relative h-full w-full">
        <RoomScene
          emerge={atLeast("roomEmerge")}
          light={atLeast("light")}
          window={atLeast("window")}
          furniture={atLeast("furniture")}
          art={atLeast("art")}
        />

        <IntroHeadline
          showHeadline={atLeast("headline")}
          showSubline={atLeast("subline")}
          fadeOut={atLeast("roomEmerge")}
        />

        {/* Closing line + scroll cue once the room is complete */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-8 z-20 flex flex-col items-center gap-3 px-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
        >
          <p className="text-[10px] font-medium tracking-[0.3em] text-neutral-700 md:text-[11px]">
            THE ROOM WAS FINE. THE ART MADE IT YOURS.
          </p>
          <a
            href="#shop"
            className="pointer-events-auto border-b border-black pb-0.5 text-[11px] font-semibold tracking-[0.24em] text-black"
          >
            SHOP THE COLLECTION
          </a>
        </motion.div>
      </div>
    </section>
  );
}
