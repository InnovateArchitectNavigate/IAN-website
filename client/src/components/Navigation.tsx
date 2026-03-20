/**
 * Navigation.tsx
 * IAN — Neural Cartography Design System
 * 
 * Minimal fixed navigation: IAN monogram + section indicators
 * Appears after initial scroll, disappears on fast scroll down
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "STRUCTURE", href: "#structure" },
  { label: "INTELLIGENCE", href: "#intelligence" },
  { label: "DOMAINS", href: "#domains" },
  { label: "CONTACT", href: "#contact" },
];

export default function Navigation() {
  const navRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = 0;

    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;

      // Show after 1 viewport height
      setIsVisible(y > vh * 0.5);
      setScrolled(y > vh * 0.1);

      lastY = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-700"
      style={{
        opacity: 1,
        transform: "translateY(0)",
        background: scrolled
          ? "linear-gradient(180deg, rgba(5,5,7,0.95) 0%, rgba(5,5,7,0) 100%)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {/* Logo */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="flex items-center gap-3 group"
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "32px",
            height: "32px",
            border: "1px solid rgba(68,136,255,0.4)",
            transition: "all 0.3s",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "0.875rem",
              fontWeight: 800,
              color: "rgba(68,136,255,0.9)",
              letterSpacing: "-0.02em",
            }}
          >
            I
          </span>
          {/* Corner accent */}
          <div
            className="absolute -top-px -right-px w-1.5 h-1.5"
            style={{ background: "rgba(68,136,255,0.6)" }}
          />
        </div>
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "0.875rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "rgba(220,230,255,0.9)",
          }}
        >
          IAN
        </span>
      </a>

      {/* Nav items */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.href)}
            className="relative group"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.625rem",
              letterSpacing: "0.2em",
              color: "rgba(180,195,235,0.5)",
              background: "none",
              border: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(68,136,255,0.9)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(180,195,235,0.5)";
            }}
          >
            {item.label}
            <span
              className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              style={{ background: "rgba(68,136,255,0.5)" }}
            />
          </button>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => scrollToSection("#contact")}
        className="ian-btn hidden md:block"
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "0.6875rem",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "0.625rem 1.5rem",
          border: "1px solid rgba(68,136,255,0.3)",
          color: "rgba(220,230,255,0.8)",
          background: "transparent",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "rgba(68,136,255,0.7)";
          btn.style.color = "rgba(68,136,255,1)";
          btn.style.boxShadow = "0 0 20px rgba(68,136,255,0.15)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.borderColor = "rgba(68,136,255,0.3)";
          btn.style.color = "rgba(220,230,255,0.8)";
          btn.style.boxShadow = "none";
        }}
      >
        Begin
      </button>
    </nav>
  );
}
