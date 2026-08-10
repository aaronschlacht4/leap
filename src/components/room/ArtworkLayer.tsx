"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { EASE } from "@/lib/timeline";
import CanvasArt, { type ArtDesign } from "@/components/CanvasArt";

type Props = { active: boolean };

type Piece = {
  design: ArtDesign;
  /** framed = black gallery frame with a white mat; plain = the artwork
   *  image carries its own frame; otherwise a deep canvas wrap */
  framed?: boolean;
  plain?: boolean;
  style: CSSProperties;
  delay: number;
  className?: string;
};

const PIECES: Piece[] = [
  {
    design: "arches",
    style: {
      left: "34%",
      top: "23%",
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
      left: "67%",
      top: "19%",
      width: "clamp(140px, 12vw, 200px)",
      aspectRatio: "10 / 13",
    },
    delay: 0.32,
    className: "hidden sm:block",
  },
  // The founder's piece — framed Macintosh render, lands last, center stage
  {
    design: "macintosh",
    plain: true,
    style: {
      left: "45%",
      top: "20%",
      width: "clamp(230px, 20vw, 320px)",
      aspectRatio: "2400 / 1593",
    },
    delay: 0.64,
    className: "max-sm:left-[39%]! max-sm:top-[24%]!",
  },
];

/**
 * Artwork arrives last. Framed pieces read as glazed gallery frames —
 * mat board, glass sheen — and canvas pieces as deep wraps. Each one
 * lands with a slight scale, a soft fade, and a shadow the wall catches.
 */
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
          {/* wall shadow settles just after the piece */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: piece.delay + 0.35, ease: EASE }}
            style={{
              boxShadow:
                "10px 16px 30px rgba(45,43,38,0.24), 3px 6px 12px rgba(45,43,38,0.13)",
            }}
          />

          {piece.plain ? (
            /* self-contained artwork image — the render carries its own frame */
            <CanvasArt design={piece.design} />
          ) : piece.framed ? (
            /* gallery frame: moulding → mat → art → glass */
            <div
              className="relative h-full w-full"
              style={{
                border: "5px solid #17140F",
                backgroundColor: "#FFFFFF",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
              }}
            >
              <div className="absolute inset-[7%]" style={{ boxShadow: "inset 1px 2px 4px rgba(0,0,0,0.18)" }}>
                <CanvasArt design={piece.design} />
              </div>
              {/* glass */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(118deg, rgba(255,255,255,0) 55%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0) 65%)",
                }}
              />
            </div>
          ) : (
            /* deep canvas wrap: lit top edge, shaded right edge */
            <div className="relative h-full w-full">
              <CanvasArt design={piece.design} />
              <div
                className="absolute inset-0"
                style={{
                  boxShadow:
                    "inset 0 2px 0 rgba(255,255,255,0.55), inset -3px 0 4px rgba(58,46,30,0.18), inset 0 -2px 3px rgba(58,46,30,0.12)",
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
