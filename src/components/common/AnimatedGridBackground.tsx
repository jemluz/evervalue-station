"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { INITIAL_CELL_COUNT } from "./animatedGrid.constants";
import { getCellCount, getCellVisualProfile } from "./animatedGrid.utils";

export function AnimatedGridBackground() {
  const [cellCount, setCellCount] = useState(INITIAL_CELL_COUNT);

  useEffect(() => {
    // Keeps coverage accurate after viewport size changes.
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
    // Decorative-only layer: hidden from accessibility tree.
    <div className="eva-grid-bg" aria-hidden="true">
      {Array.from({ length: cellCount }, (_, index) => {
        const { color, opacity, duration, delay, animationVariant } =
          getCellVisualProfile(index);

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
                "--cell-animation": animationVariant,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
