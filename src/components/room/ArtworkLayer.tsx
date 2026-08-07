"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { EASE } from "@/lib/timeline";
import CanvasArt, { type ArtDesign } from "@/components/CanvasArt";

type Props = { active: boolean };

type Piece = {
  design: ArtDesign;
  framed?: boolean;
  style: CSSProperties;
  delay: number;
  className?: string;
};

/**
 * Artwork arrives last — slight scale, soft fade, a small push toward
 * the viewer, and a wall shadow that catches as each piece lands.
 */
const PIECES: Piece[] = [
  {
    design: "arches",
    style: {
      left: "40%",
      top: "22%",
      width: "clamp(88px, 9vw, 150px)",
      aspectRatio: "10 / 13",
    },
    delay: 0,
    className: "hidden sm:block",
  },
  {
    design: "typographic",
    framed: true,
    style: {
      left: "51%",
      top: "18%",
      width: "clamp(150px, 12.5vw, 205px)",
      aspectRatio: "10 / 13",
    },
    delay: 0.32,
    className: "max-sm:left-[42%]!",
  },
  {
    design: "sunline",
    style: {
      left: "66%",
      top: "24%",
      width: "clamp(80px, 8.2vw, 136px)",
      aspectRatio: "10 / 13",
    },
    delay: 0.64,
    className: "hidden sm:block",
  },
];

export default function ArtworkLayer({ active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {PIECES.map((piece) => (
        <motion.div
          key={piece.design}
          className={`absolute ${piece.className ?? ""}`}
          style={piece.style}
          initial={{ opacity: 0, scale: 0.93, y: 8 }}
          animate={active ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.95, delay: piece.delay, ease: EASE }}
        >
          {/* wall shadow settles just after the canvas */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: piece.delay + 0.35, ease: EASE }}
            style={{
              boxShadow:
                "0 10px 22px rgba(58,46,30,0.20), 0 3px 8px rgba(58,46,30,0.12)",
            }}
          />
          <CanvasArt design={piece.design} framed={piece.framed} />
        </motion.div>
      ))}
    </div>
  );
}
