"use client";

import { useEffect, useState, useCallback } from "react";
import { PHASES, PHASE_DURATIONS, type Phase, phaseIndex } from "./timeline";

/**
 * Steps through the intro phases on the timeline defined in timeline.ts.
 * When `skip` is true (e.g. prefers-reduced-motion) it jumps straight
 * to the final state.
 */
export function useIntroPhase(skip = false) {
  const [idx, setIdx] = useState(skip ? PHASES.length - 1 : 0);
  const effectiveIdx = skip ? PHASES.length - 1 : idx;

  useEffect(() => {
    if (skip) return;
    if (idx >= PHASES.length - 1) return;
    const timer = setTimeout(
      () => setIdx((i) => Math.min(i + 1, PHASES.length - 1)),
      PHASE_DURATIONS[PHASES[idx]]
    );
    return () => clearTimeout(timer);
  }, [idx, skip]);

  const atLeast = useCallback((p: Phase) => effectiveIdx >= phaseIndex(p), [effectiveIdx]);

  return { phase: PHASES[effectiveIdx], atLeast, done: effectiveIdx >= PHASES.length - 1 };
}
