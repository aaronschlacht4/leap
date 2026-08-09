"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/timeline";

type Props = { active: boolean };

/**
 * Sunlight cast from the (not yet visible) window.
 * A soft four-pane window shadow sweeps onto the wall before the
 * window itself exists, then keeps drifting almost imperceptibly.
 */
export default function SunlightLayer({ active }: Props) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={active ? { opacity: 1 } : {}}
      transition={{ duration: 2.2, ease: EASE }}
    >
      {/* Window-shaped light on the wall, right of where the window will form.
          The light itself carries the warmth — the wall paint stays white. */}
      <motion.div
        className="absolute"
        style={{
          left: "27%",
          top: "16%",
          width: "min(28vw, 400px)",
          height: "52%",
          transform: "skewX(-16deg) skewY(-2deg)",
          filter: "blur(30px)",
        }}
        initial={{ x: -60, opacity: 0 }}
        animate={active ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 3.2, ease: EASE }}
      >
        {/* Very slow ongoing drift so the light feels alive */}
        <motion.div
          className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[14px]"
          animate={active ? { x: [0, 14, 0] } : {}}
          transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ backgroundColor: "rgba(255, 241, 214, 0.42)" }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Wider ambient wash low on the wall */}
      <motion.div
        className="absolute"
        style={{
          left: "18%",
          bottom: "0%",
          width: "min(44vw, 640px)",
          height: "26%",
          transform: "skewX(-30deg)",
          filter: "blur(38px)",
          backgroundColor: "rgba(255, 238, 206, 0.25)",
        }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 3, delay: 0.6, ease: EASE }}
      />
    </motion.div>
  );
}
