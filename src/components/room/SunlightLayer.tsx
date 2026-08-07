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
      {/* Warm cast over the whole scene */}
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: "rgba(255, 236, 205, 0.16)" }}
      />

      {/* Window-shaped light on the wall, right of where the window will form */}
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

      {/* Light pooling on the floor */}
      <motion.div
        className="absolute"
        style={{
          left: "22%",
          bottom: "4%",
          width: "min(30vw, 420px)",
          height: "13%",
          transform: "skewX(-42deg)",
          filter: "blur(22px)",
          backgroundColor: "rgba(255, 238, 206, 0.4)",
        }}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 3, delay: 0.6, ease: EASE }}
      />
    </motion.div>
  );
}
