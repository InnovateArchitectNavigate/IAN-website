/**
 * TubeSection.tsx
 * IAN — Neural Cartography Design System
 * 
 * Robotic tubular traversal section
 * WebGL shader: metallic ribbing, glowing circuitry, flowing light
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TubeShader from "./TubeShader";

gsap.registerPlugin(ScrollTrigger);

interface TubeSectionProps {
  isVisible: boolean;
}

export default function TubeSection({ isVisible }: TubeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => setProgress(self.progress),
    });

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll(".tube-animate"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            once: true,
          },
        }
      );
    }
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      id="traverse"
      style={{ background: "#050507" }}
    >
      {/* WebGL tube shader — full background */}
      <div className="absolute inset-0">
        <TubeShader isActive={isVisible} progress={progress} />
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(5,5,7,0.85) 0%, rgba(5,5,7,0.4) 50%, rgba(5,5,7,0.1) 100%)",
        }}
      />

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center min-h-screen px-12 lg:px-24 py-24 max-w-2xl"
      >
        <div
          className="tube-animate section-label mb-6"
          style={{ color: "#44ccaa", opacity: 0 }}
        >
          05 / TRAVERSAL
        </div>

        <h2
          className="tube-animate"
          style={{
            opacity: 0,
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "oklch(0.92 0.02 240)",
            marginBottom: "1.5rem",
          }}
        >
          Inside the
          <br />
          <span style={{ color: "#44ccaa" }}>machine</span>
        </h2>

        <p
          className="tube-animate"
          style={{
            opacity: 0,
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "rgba(180,195,235,0.65)",
            marginBottom: "2.5rem",
            maxWidth: "420px",
          }}
        >
          Every system IAN builds has an interior — a living architecture of circuits, signals, and structured intelligence. We don't just build the surface. We engineer what flows beneath it.
        </p>

        {/* Specs list */}
        <div className="tube-animate space-y-3" style={{ opacity: 0 }}>
          {[
            ["SIGNAL LATENCY", "< 12ms"],
            ["THROUGHPUT", "∞ scalable"],
            ["ARCHITECTURE", "event-driven"],
            ["INTELLIGENCE", "adaptive"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between max-w-xs"
              style={{
                borderBottom: "1px solid rgba(68,204,170,0.12)",
                paddingBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.15em",
                  color: "rgba(68,204,170,0.5)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.6875rem",
                  color: "rgba(68,204,170,0.9)",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: "linear-gradient(0deg, #050507 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
