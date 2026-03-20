/**
 * SplitFlapDisplay.tsx
 * IAN — Neural Cartography Design System
 * 
 * Split-flap / Solari board style transition for brain slice reveal
 * Each character flips through a sequence before landing on final value
 * CSS 3D transforms, mechanical easing, staggered columns
 */

import { useEffect, useRef, useState } from "react";

interface SplitFlapDisplayProps {
  text: string;
  isVisible: boolean;
  className?: string;
  delay?: number;
  size?: "sm" | "md" | "lg" | "xl";
}

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-_/\\|";
const FLAP_DURATION = 60; // ms per flap
const FLAPS_PER_CHAR = 10;

function SplitFlapChar({
  targetChar,
  isActive,
  delay,
  size,
}: {
  targetChar: string;
  isActive: boolean;
  delay: number;
  size: string;
}) {
  const [displayChar, setDisplayChar] = useState(" ");
  const [isFlipping, setIsFlipping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isActive) {
      setDisplayChar(" ");
      return;
    }

    const target = targetChar.toUpperCase();
    let flap = 0;
    const totalFlaps = FLAPS_PER_CHAR + Math.floor(Math.random() * 5);

    const startFlapping = () => {
      setIsFlipping(true);
      const interval = setInterval(() => {
        flap++;
        if (flap >= totalFlaps) {
          clearInterval(interval);
          setDisplayChar(target);
          setIsFlipping(false);
        } else {
          const randomChar = CHARSET[Math.floor(Math.random() * CHARSET.length)];
          setDisplayChar(randomChar);
        }
      }, FLAP_DURATION);

      return () => clearInterval(interval);
    };

    timeoutRef.current = setTimeout(startFlapping, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, targetChar, delay]);

  const sizeClasses = {
    sm: "w-5 h-7 text-xs",
    md: "w-8 h-10 text-sm",
    lg: "w-12 h-16 text-xl",
    xl: "w-20 h-28 text-4xl",
  }[size] || "w-8 h-10 text-sm";

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center overflow-hidden ${sizeClasses}`}
      style={{
        background: "linear-gradient(180deg, #0d0d12 50%, #0a0a0f 50%)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "2px",
        margin: "1px",
        perspective: "200px",
      }}
    >
      {/* Top half */}
      <div
        className="absolute top-0 left-0 right-0 flex items-end justify-center overflow-hidden"
        style={{
          height: "50%",
          background: "linear-gradient(180deg, #111118 0%, #0d0d14 100%)",
          borderBottom: "1px solid rgba(0,0,0,0.8)",
        }}
      >
        <span
          className="font-mono font-medium select-none"
          style={{
            color: isFlipping ? "rgba(100,160,255,0.9)" : "rgba(220,230,255,0.95)",
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: 1,
            paddingBottom: "2px",
            textShadow: isFlipping
              ? "0 0 12px rgba(80,140,255,0.8)"
              : "0 0 8px rgba(180,200,255,0.3)",
            transition: "color 0.05s, text-shadow 0.05s",
          }}
        >
          {displayChar}
        </span>
      </div>

      {/* Bottom half */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-start justify-center overflow-hidden"
        style={{
          height: "50%",
          background: "linear-gradient(180deg, #0a0a10 0%, #080810 100%)",
        }}
      >
        <span
          className="font-mono font-medium select-none"
          style={{
            color: isFlipping ? "rgba(80,130,220,0.7)" : "rgba(180,195,235,0.8)",
            fontFamily: '"JetBrains Mono", monospace',
            lineHeight: 1,
            paddingTop: "2px",
            textShadow: isFlipping ? "0 0 8px rgba(60,120,220,0.6)" : "none",
            transition: "color 0.05s",
          }}
        >
          {displayChar}
        </span>
      </div>

      {/* Flap animation overlay */}
      {isFlipping && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(60,120,255,0.05) 0%, transparent 50%, rgba(60,120,255,0.05) 100%)",
            animation: "flap-flicker 0.06s linear infinite",
          }}
        />
      )}

      {/* Center divider line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "50%",
          height: "1px",
          background: "rgba(0,0,0,0.9)",
          zIndex: 10,
        }}
      />
    </div>
  );
}

export default function SplitFlapDisplay({
  text,
  isVisible,
  className = "",
  delay = 0,
  size = "md",
}: SplitFlapDisplayProps) {
  const chars = text.split("");

  return (
    <div
      className={`inline-flex flex-wrap items-center ${className}`}
      style={{ gap: "1px" }}
    >
      {chars.map((char, i) => (
        <SplitFlapChar
          key={i}
          targetChar={char}
          isActive={isVisible}
          delay={delay + i * 40}
          size={size}
        />
      ))}
    </div>
  );
}
