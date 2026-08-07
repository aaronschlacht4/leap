"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/timeline";
import SunlightLayer from "./SunlightLayer";
import Window from "./Window";
import FurnitureLayer from "./FurnitureLayer";
import ArtworkLayer from "./ArtworkLayer";

type Props = {
  emerge: boolean; // wall gains depth, floor line appears
  light: boolean; // sunlight sweeps in
  window: boolean; // window constructs itself
  furniture: boolean; // room assembles
  art: boolean; // artwork lands
};

/**
 * The white canvas becoming a physical room. Every layer animates
 * independently so the sequence can be re-ordered or re-timed freely.
 */
export default function RoomScene({
  emerge,
  light,
  window: windowActive,
  furniture,
  art,
}: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Wall — pure white warming into a physical surface */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundColor: "#FFFFFF" }}
        animate={emerge ? { backgroundColor: "#F7F4EE" } : {}}
        transition={{ duration: 1.6, ease: EASE }}
      />

      {/* Ambient depth — soft warm shadows in the corners and ceiling line */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 55%, rgba(96,78,52,0.10) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[9%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(96,78,52,0.07), rgba(96,78,52,0))",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
      />

      {/* Floor — the line surfaces first, then the plane reads as wood */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[24%]"
        style={{
          backgroundColor: "#D9C6A8",
          boxShadow: "inset 0 10px 18px rgba(96,78,52,0.16)",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.7, delay: 0.45, ease: EASE }}
      />
      {/* Baseboard */}
      <motion.div
        className="absolute inset-x-0 bottom-[24%] h-[10px]"
        style={{
          backgroundColor: "#FBFAF6",
          boxShadow: "0 2px 4px rgba(96,78,52,0.14)",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.55, ease: EASE }}
      />

      <SunlightLayer active={light} />
      <Window active={windowActive} />
      <FurnitureLayer active={furniture} />
      <ArtworkLayer active={art} />
    </div>
  );
}
