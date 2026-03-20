/**
 * HeroSection.tsx
 * IAN — Neural Cartography Design System
 * 
 * Hero overlay: IAN title, tagline, scroll prompt
 * Appears over the 3D scene, fades as user scrolls
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface HeroSectionProps {
  scrollProgress: number;
}

export default function HeroSection({ scrollProgress }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ delay: 0.6 });
    tl.fromTo(
      heroRef.current.querySelectorAll(".hero-animate"),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: "power3.out" }
    );
  }, []);

  const opacity = Math.max(0, 1 - scrollProgress * 10);
  const translateY = scrollProgress * -80;

  return (
    <div
      ref={heroRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 10,
      }}
    >
      {/* Bottom-left content block */}
      <div
        className="absolute"
        style={{
      bottom: "12vh",
        left: "clamp(2rem, 4vw, 4rem)",
        maxWidth: "42vw",
        }}
      >
        {/* System label */}
        <div
          className="hero-animate flex items-center gap-3 mb-6"
          style={{ opacity: 0 }}
        >
          <div
            style={{
              width: "20px",
              height: "1px",
              background: "rgba(68,136,255,0.6)",
            }}
          />
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.5625rem",
              letterSpacing: "0.25em",
              color: "rgba(68,136,255,0.7)",
            }}
          >
            INTELLIGENCE · ARCHITECTURE · NOW
          </span>
        </div>

        {/* Main title */}
        <h1
          className="hero-animate"
          style={{
            opacity: 0,
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(5.5rem, 16vw, 14rem)",
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: "-0.045em",
            color: "oklch(0.92 0.02 240)",
            marginBottom: "2rem",
            textShadow: "0 0 120px rgba(68,136,255,0.12)",
          }}
        >
          IAN
        </h1>

        {/* Tagline */}
        <p
          className="hero-animate"
          style={{
            opacity: 0,
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            color: "rgba(180,195,235,0.55)",
            lineHeight: 1.7,
            marginBottom: "3rem",
            maxWidth: "400px",
          }}
        >
          A creative technology studio fusing software architecture, artificial intelligence, immersive XR, and digital craft into systems that endure.
        </p>

        {/* Scroll prompt */}
        <div
          className="hero-animate flex items-center gap-4"
          style={{ opacity: 0 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              animation: "float-vertical 2.2s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: "1px",
                height: "36px",
                background: "linear-gradient(180deg, transparent, rgba(68,136,255,0.7))",
              }}
            />
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "rgba(68,136,255,0.9)",
                boxShadow: "0 0 10px rgba(68,136,255,0.7)",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.28em",
              color: "rgba(180,195,235,0.3)",
            }}
          >
            SCROLL TO ASCEND
          </span>
        </div>
      </div>

      {/* Top-right: IAN monogram */}
      <div
        className="hero-animate absolute"
        style={{
          opacity: 0,
          top: "2rem",
          right: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "rgba(68,136,255,0.4)",
            textAlign: "right",
            lineHeight: 1.8,
          }}
        >
          CREATIVE TECHNOLOGY<br />STUDIO
        </div>
        <div
          style={{
            width: "1px",
            height: "32px",
            background: "rgba(68,136,255,0.2)",
          }}
        />
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "1.25rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "rgba(220,230,255,0.6)",
          }}
        >
          IAN
        </div>
      </div>
    </div>
  );
}
