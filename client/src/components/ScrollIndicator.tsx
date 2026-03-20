/**
 * ScrollIndicator.tsx
 * IAN — Neural Cartography Design System
 * 
 * Vertical progress spine on right edge
 * Section labels + animated progress line
 */

import { useEffect, useState } from "react";

const SECTIONS = [
  { label: "ORIGIN", progress: 0 },
  { label: "ASCENT", progress: 0.15 },
  { label: "NEURAL", progress: 0.35 },
  { label: "DOMAINS", progress: 0.55 },
  { label: "TRAVERSE", progress: 0.78 },
  { label: "CONTACT", progress: 0.92 },
];

interface ScrollIndicatorProps {
  scrollProgress: number;
}

export default function ScrollIndicator({ scrollProgress }: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const activeSection = SECTIONS.reduce((acc, section, i) => {
    if (scrollProgress >= section.progress) return i;
    return acc;
  }, 0);

  return (
    <div
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-0"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 1s ease",
      }}
    >
      {/* Vertical line */}
      <div
        className="absolute right-0 top-0 bottom-0"
        style={{
          width: "1px",
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Progress fill */}
      <div
        className="absolute right-0 top-0"
        style={{
          width: "1px",
          height: `${scrollProgress * 100}%`,
          background: "linear-gradient(180deg, rgba(68,136,255,0.8), rgba(68,136,255,0.3))",
          transition: "height 0.1s",
          boxShadow: "0 0 6px rgba(68,136,255,0.4)",
        }}
      />

      {/* Section markers */}
      {SECTIONS.map((section, i) => {
        const isActive = i === activeSection;
        const isPast = scrollProgress >= section.progress;

        return (
          <div
            key={section.label}
            className="relative flex items-center gap-3 py-4"
            style={{ paddingRight: "12px" }}
          >
            {/* Label */}
            <span
              className="font-mono text-xs transition-all duration-300"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                color: isActive
                  ? "rgba(68,136,255,0.9)"
                  : isPast
                  ? "rgba(180,195,235,0.3)"
                  : "rgba(180,195,235,0.15)",
                transform: isActive ? "translateX(-4px)" : "translateX(0)",
              }}
            >
              {section.label}
            </span>

            {/* Dot */}
            <div
              className="relative transition-all duration-300"
              style={{
                width: isActive ? "6px" : "4px",
                height: isActive ? "6px" : "4px",
                borderRadius: "50%",
                background: isActive
                  ? "rgba(68,136,255,1)"
                  : isPast
                  ? "rgba(68,136,255,0.4)"
                  : "rgba(255,255,255,0.1)",
                boxShadow: isActive ? "0 0 8px rgba(68,136,255,0.8)" : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
