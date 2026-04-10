import {
  ANIMATION_VARIANTS,
  CELL_PADDING,
  CELL_SIZE,
  FAST_ACCENT_REDUCTION_PROBABILITY,
  FAST_ANIMATION_DURATION_VARIANCE,
  FAST_MIN_ANIMATION_DURATION,
  FAST_NEGATIVE_DELAY_WINDOW,
  GRAY_TONES,
  INITIAL_CELL_COUNT,
  PALETTE,
  SLOW_ANIMATION_DURATION_VARIANCE,
  SLOW_MIN_ANIMATION_DURATION,
  SLOW_NEGATIVE_DELAY_WINDOW,
  type ToneTiming,
} from "./animatedGrid.constants";

export type CellVisualProfile = {
  color: string;
  timing: ToneTiming;
  opacity: number;
  duration: number;
  delay: number;
  animationVariant: string;
};

// Deterministic pseudo-random helper for stable per-cell output.
export function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999.91) * 10000;
  return x - Math.floor(x);
}

// Calculates how many cells are needed to cover the current viewport.
export function getCellCount() {
  if (typeof window === "undefined") {
    return INITIAL_CELL_COUNT;
  }

  const columns = Math.ceil(window.innerWidth / CELL_SIZE) + CELL_PADDING;
  const rows = Math.ceil(window.innerHeight / CELL_SIZE) + CELL_PADDING;

  return columns * rows;
}

export function getCellVisualProfile(index: number): CellVisualProfile {
  const tone = PALETTE[Math.floor(pseudoRandom(index + 1) * PALETTE.length)];
  let { color, timing } = tone;

  // Reduces fast accent frequency to avoid visual overload.
  if (
    timing === "fast" &&
    pseudoRandom(index + 59) < FAST_ACCENT_REDUCTION_PROBABILITY
  ) {
    color =
      GRAY_TONES[Math.floor(pseudoRandom(index + 61) * GRAY_TONES.length)];
    timing = "slow";
  }

  // Independent flicker profile per cell (opacity, speed, phase, keyframe variant).
  const opacity = 0.3 + pseudoRandom(index + 7) * 0.22;
  const durationSeed = pseudoRandom(index + 13);
  const delaySeed = pseudoRandom(index + 31);
  const duration =
    timing === "fast"
      ? FAST_MIN_ANIMATION_DURATION +
        durationSeed * FAST_ANIMATION_DURATION_VARIANCE
      : SLOW_MIN_ANIMATION_DURATION +
        durationSeed * SLOW_ANIMATION_DURATION_VARIANCE;
  const delay =
    timing === "fast"
      ? -delaySeed * FAST_NEGATIVE_DELAY_WINDOW
      : -delaySeed * SLOW_NEGATIVE_DELAY_WINDOW;
  const animationVariant =
    ANIMATION_VARIANTS[
      Math.floor(pseudoRandom(index + 47) * ANIMATION_VARIANTS.length)
    ];

  return {
    color,
    timing,
    opacity,
    duration,
    delay,
    animationVariant,
  };
}
