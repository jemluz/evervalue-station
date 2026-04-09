export type ToneTiming = "fast" | "slow";

export type PaletteTone = {
  color: string;
  timing: ToneTiming;
};

// Grid density and viewport padding.
export const CELL_SIZE = 50;
export const CELL_PADDING = 2;
export const INITIAL_CELL_COUNT = 1200;

// Fast cadence for market accent cells (green/red).
export const FAST_MIN_ANIMATION_DURATION = 1.2;
export const FAST_ANIMATION_DURATION_VARIANCE = 2.6;
export const FAST_NEGATIVE_DELAY_WINDOW = 6;

// Slow cadence for neutral base cells (gray/orange/white).
export const SLOW_MIN_ANIMATION_DURATION = 3.8;
export const SLOW_ANIMATION_DURATION_VARIANCE = 5.4;
export const SLOW_NEGATIVE_DELAY_WINDOW = 10;

// Accent tones inspired by price movement flashes.
export const ORANGE_TONES = [
  "rgba(255, 223, 197, 0.96)",
  "rgba(255, 192, 148, 0.94)",
];
export const GREEN_TONES = ["rgba(190, 245, 199, 0.88)"];
export const RED_TONES = ["rgba(255, 198, 198, 0.88)"];

// Base neutral tones to keep the background subtle.
export const GRAY_TONES = [
  "rgba(247, 247, 247, 0.9)",
  "rgba(242, 242, 242, 0.68)",
  "rgba(237, 237, 237, 0.75)",
  "rgba(232, 232, 232, 0.63)",
  "rgba(228, 228, 228, 0.7)",
];
export const WHITE_TONES = ["rgba(255, 255, 255, 0.9)"];

// Animation variants are defined in src/app/globals.css.
export const ANIMATION_VARIANTS = [
  "eva-grid-flicker-a",
  "eva-grid-flicker-b",
  "eva-grid-flicker-c",
];

export const FAST_ACCENT_REDUCTION_PROBABILITY = 0.875;

function withTiming(colors: string[], timing: ToneTiming): PaletteTone[] {
  return colors.map((color) => ({ color, timing }));
}

// Palette distribution controls visual frequency by repeating neutral groups.
export const PALETTE: PaletteTone[] = [
  ...withTiming(GRAY_TONES, "slow"),
  ...withTiming(GRAY_TONES, "slow"),
  ...withTiming(ORANGE_TONES, "slow"),
  ...withTiming(GREEN_TONES, "fast"),
  ...withTiming(RED_TONES, "fast"),
  ...withTiming(WHITE_TONES, "slow"),
];
