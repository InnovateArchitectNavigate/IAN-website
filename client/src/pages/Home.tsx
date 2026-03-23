/**
 * Home.tsx
 * IAN — Neural Cartography Design System
 * 
 * Main page: orchestrates all sections in the cinematic scroll experience
 * 
 * Scroll structure:
 * 1. Hero + 3D Biomechanical Scene — 600vh (sticky canvas)
 * 2. Brain Reveal (top-down + split-flap traversal) — 250vh (sticky)
 * 3. Domain Sections (4 parallax chapters) — 400vh
 * 4. Tube Traversal (WebGL shader) — 150vh
 * 5. Contact Form — 100vh
 * 6. Footer
 */

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BiomechanicalScene from "@/components/BiomechanicalScene";
import HeroSection from "@/components/HeroSection";
import BrainRevealSection from "@/components/BrainRevealSection";
import DomainSections from "@/components/DomainSections";
import TubeSection from "@/components/TubeSection";
import ContactSection from "@/components/ContactSection";
import Navigation from "@/components/Navigation";
import ScrollIndicator from "@/components/ScrollIndicator";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const brainContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [brainVisible, setBrainVisible] = useState(false);
  const [tubeVisible, setTubeVisible] = useState(false);
  const [brainSectionProgress, setBrainSectionProgress] = useState(0);

  useEffect(() => {
    // Global scroll progress
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollTop / docHeight, 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Brain section
    if (brainContainerRef.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: brainContainerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => setBrainVisible(true),
          onLeave: () => setBrainVisible(false),
          onEnterBack: () => setBrainVisible(true),
          onLeaveBack: () => setBrainVisible(false),
        }),
        ScrollTrigger.create({
          trigger: brainContainerRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => setBrainSectionProgress(self.progress),
        })
      );
    }

    // Tube section
    const tubeSection = document.getElementById("traverse");
    if (tubeSection) {
      triggers.push(
        ScrollTrigger.create({
          trigger: tubeSection,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: () => setTubeVisible(true),
          onLeave: () => setTubeVisible(false),
          onEnterBack: () => setTubeVisible(true),
          onLeaveBack: () => setTubeVisible(false),
        })
      );
    }

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div style={{ background: "#050507" }}>
      {/* Fixed UI chrome */}
      <Navigation />
      <ScrollIndicator scrollProgress={scrollProgress} />

      {/* ── SECTION 1: Hero + 3D Biomechanical Scene ── */}
      <div
        ref={heroContainerRef}
        className="relative"
        id="structure"
        style={{ height: "600vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <BiomechanicalScene
            scrollContainerRef={heroContainerRef}
            onScrollProgress={setScrollProgress}
          />
          <HeroSection scrollProgress={scrollProgress} />
          <AscendingLabels scrollProgress={scrollProgress} />
        </div>
      </div>

      {/* ── SECTION 2: Brain Reveal ── */}
      <div
        ref={brainContainerRef}
        className="relative"
        id="intelligence"
        style={{ height: "250vh" }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <BrainRevealSection
            isVisible={brainVisible}
            scrollProgress={brainSectionProgress}
          />
        </div>
      </div>

      {/* ── SECTION 3: Domain Parallax Sections ── */}
      <div id="domains">
        <DomainSections />
      </div>

      {/* ── SECTION 4: Tube Traversal ── */}
      <TubeSection isVisible={tubeVisible} />

      {/* ── SECTION 5: Contact Form ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

// Ascending labels that appear at different scroll positions
function AscendingLabels({ scrollProgress }: { scrollProgress: number }) {
  const labels = [
    {
      progress: 0.08,
      text: "INNOVATE — WE IMPLEMENT",
      sub: "The biggest risk is not taking any risk",
      side: "left" as const,
    },
    {
      progress: 0.12,
      text: "ARCHITECT — EVOLVING SYSTEMS",
      sub: "By dint of building well, you get to be a good architect",
      side: "left" as const,
    },
    {
      progress: 0.16,
      text: "NAVIGATE — TRAVERSE THROUGH YOUR IMMAGINATION",
      sub: "I may not have gone where I intended to go, but I think I have ended up where I needed to be",
      side: "left" as const,
    },
    {
      progress: 0.2,
      text: "YOU'VE GOT THE BACKBONE",
      sub: "you are fierce",
      side: "left" as const,
    },
    {
      progress: 0.24,
      text: "YOU'VE GOT THE BRAIN",
      sub: "...and you know exatcly what you're doing",
      side: "left" as const,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {labels.map((label, i) => {
        const start = label.progress;
        const end = label.progress + 0.04;
        const isVisible = scrollProgress >= start && scrollProgress < end;
        const fadeIn = Math.min((scrollProgress - start) / 0.04, 1);
        const fadeOut = Math.min((end - scrollProgress) / 0.04, 1);
        const opacity = isVisible ? Math.min(fadeIn, fadeOut) : 0;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              [label.side]: "2.5rem",
              top: "38%",
              opacity,
              transition: "opacity 0.4s ease",
              textAlign: label.side,
            }}
          >
            {/* Connecting tick */}
            <div
              style={{
                width: "30px",
                height: "1px",
                background: "rgba(68,136,255,0.4)",
                marginBottom: "6px",
                marginLeft: label.side === "right" ? "auto" : "0",
              }}
            />
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.22em",
                color: "rgba(68,136,255,0.75)",
                marginBottom: "4px",
              }}
            >
              {label.text}
            </div>
            <div
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.7rem",
                color: "rgba(180,195,235,0.4)",
                letterSpacing: "0.04em",
              }}
            >
              {label.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
