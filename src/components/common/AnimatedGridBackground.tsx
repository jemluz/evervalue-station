"use client";

import { useEffect, useState, type CSSProperties } from "react";

const CELL_SIZE = 50;
const CELL_PADDING = 2;

const ORANGE_TONES = ["rgba(255, 231, 213, 0.95)", "rgba(255, 209, 176, 0.9)"];
const GRAY_TONES = [
  "rgba(247, 247, 247, 0.9)",
  "rgba(242, 242, 242, 0.68)",
  "rgba(237, 237, 237, 0.75)",
  "rgba(232, 232, 232, 0.63)",
  "rgba(228, 228, 228, 0.7)",
];
const WHITE_TONES = ["rgba(255, 255, 255, 0.9)"];
const PALETTE = [...GRAY_TONES, ...GRAY_TONES, ...ORANGE_TONES, ...WHITE_TONES];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999.91) * 10000;
  return x - Math.floor(x);
}

function getCellCount() {
  if (typeof window === "undefined") {
    return 1200;
  }

  const columns = Math.ceil(window.innerWidth / CELL_SIZE) + CELL_PADDING;
  const rows = Math.ceil(window.innerHeight / CELL_SIZE) + CELL_PADDING;

  return columns * rows;
}

export function AnimatedGridBackground() {
  const [cellCount, setCellCount] = useState(getCellCount);

  useEffect(() => {
    const updateCellCount = () => {
      setCellCount(getCellCount());
    };

    updateCellCount();
    window.addEventListener("resize", updateCellCount);

    return () => {
      window.removeEventListener("resize", updateCellCount);
    };
  }, []);

  return (
    <div className="eva-grid-bg" aria-hidden="true">
      {Array.from({ length: cellCount }, (_, index) => {
        const color =
          PALETTE[Math.floor(pseudoRandom(index + 1) * PALETTE.length)];
        const opacity = 0.3 + pseudoRandom(index + 7) * 0.22;
        const duration = 5 + pseudoRandom(index + 13) * 8;
        const delay = -pseudoRandom(index + 31) * 12;

        return (
          <span
            key={index}
            className="eva-grid-cell"
            style={
              {
                "--cell-color": color,
                "--cell-opacity": opacity.toFixed(3),
                "--cell-duration": `${duration.toFixed(3)}s`,
                "--cell-delay": `${delay.toFixed(3)}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
