/**
 * Central timeline for the intro sequence.
 * All phase timings live here so the sequence can be re-paced
 * without touching any component.
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const PHASES = [
  "blank", // pure white beneath the navbar
  "headline", // YOUR ROOM IS BORING
  "subline", // let's fix that.
  "roomEmerge", // text fades, the flat white becomes a physical wall
  "light", // sunlight sweeps the wall (window shadow before window)
  "window", // window constructs itself into the wall
  "furniture", // room assembles piece by piece
  "art", // artwork arrives last
  "done", // scroll unlocks, store is browsable
] as const;

export type Phase = (typeof PHASES)[number];

/** How long each phase holds before advancing (ms). Total ≈ 9.6s. */
export const PHASE_DURATIONS: Record<Phase, number> = {
  blank: 650,
  headline: 1150,
  subline: 1350,
  roomEmerge: 1050,
  light: 900,
  window: 1450,
  furniture: 1600,
  art: 1300,
  done: Infinity,
};

export function phaseIndex(phase: Phase): number {
  return PHASES.indexOf(phase);
}
