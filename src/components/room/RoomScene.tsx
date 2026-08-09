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
      {/* Wall — the page's own white, unchanged. Depth comes only from
          neutral shadow, so the canvas visibly becomes the wall. */}
      <div className="absolute inset-0 bg-white" />

      {/* Ambient depth — soft neutral falloff in the corners */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 40%, rgba(0,0,0,0) 60%, rgba(40,38,34,0.08) 100%)",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[8%]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(40,38,34,0.05), rgba(40,38,34,0))",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
      />

      {/* Grounding — soft occlusion where out-of-frame furniture meets the wall */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[13%]"
        style={{
          background:
            "linear-gradient(to top, rgba(40,38,34,0.10), rgba(40,38,34,0))",
        }}
        initial={{ opacity: 0 }}
        animate={emerge ? { opacity: 1 } : {}}
        transition={{ duration: 1.7, delay: 0.45, ease: EASE }}
      />

      <SunlightLayer active={light} />
      <Window active={windowActive} />
      <FurnitureLayer active={furniture} />
      <ArtworkLayer active={art} />
    </div>
  );
}
