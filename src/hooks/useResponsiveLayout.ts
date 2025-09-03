import { useState, useEffect } from 'react';

export interface ResponsiveLayoutConfig {
  isHorizontalLayout: boolean;
  clocksPerRow: number;
  containerWidth: number;
  containerHeight: number;
}

// Simple responsive layout detector based on viewport size.
// Switches to horizontal when we can fit at least 2 clocks at ~280px each.
export const useResponsiveLayout = (): ResponsiveLayoutConfig => {
  const [layout, setLayout] = useState<ResponsiveLayoutConfig>({
    isHorizontalLayout: false,
    clocksPerRow: 1,
    containerWidth: 0,
    containerHeight: 0,
  });

  useEffect(() => {
    const calculateLayout = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      const minClockWidth = 280; // px per clock card
      const reservedHeight = 300; // calendar + controls
      const availableHeight = containerHeight - reservedHeight;

      const canFitHorizontally = containerWidth >= minClockWidth * 2;
      const hasReasonableHeight = availableHeight >= 120; // px

      let clocksPerRow = 1;
      let isHorizontalLayout = false;

      if (canFitHorizontally && hasReasonableHeight) {
        clocksPerRow = Math.floor(containerWidth / minClockWidth);
        isHorizontalLayout = clocksPerRow > 1;
      }

      setLayout({
        isHorizontalLayout,
        clocksPerRow: Math.max(1, clocksPerRow),
        containerWidth,
        containerHeight,
      });
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () => window.removeEventListener('resize', calculateLayout);
  }, []);

  return layout;
};
