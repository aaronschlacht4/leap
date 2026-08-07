"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/timeline";

type Props = {
  showHeadline: boolean;
  showSubline: boolean;
  /** When true, the typography yields the canvas to the room. */
  fadeOut: boolean;
};

export default function IntroHeadline({ showHeadline, showSubline, fadeOut }: Props) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
      animate={fadeOut ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.h1
        className="text-[clamp(2.9rem,9vw,8.25rem)] font-extrabold leading-[0.96] tracking-[-0.03em] text-black"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={showHeadline ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.75, ease: EASE }}
      >
        YOUR ROOM
        <br />
        IS BORING
      </motion.h1>

      <motion.p
        className="mt-6 text-[clamp(1.05rem,1.8vw,1.5rem)] font-light tracking-[0.01em] text-neutral-800 md:mt-8"
        initial={{ opacity: 0, y: 14 }}
        animate={showSubline ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.05, ease: EASE }}
      >
        let&rsquo;s fix that.
      </motion.p>
    </motion.div>
  );
}
