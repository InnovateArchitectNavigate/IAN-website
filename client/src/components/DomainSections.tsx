/**
 * DomainSections.tsx
 * IAN — Neural Cartography Design System
 * 
 * Four parallax domain sections with animated canvas visuals
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DomainSection {
  id: string;
  index: number;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accentColor: string;
  secondaryColor: string;
  visual: "cube" | "neural" | "rings" | "hex";
}

const DOMAINS: DomainSection[] = [
  {
    id: "software",
    index: 1,
    label: "01 / DOMAIN",
    title: "SOFTWARE\nARCHITECTURE",
    subtitle: "Systems built to endure",
    description:
      "We architect software systems with the precision of structural engineering and the elegance of fine craft. From distributed infrastructure to microservice ecosystems — every system is designed for scale, resilience, and longevity.",
    tags: ["DISTRIBUTED SYSTEMS", "API DESIGN", "CLOUD ARCHITECTURE", "DEVOPS", "PERFORMANCE"],
    accentColor: "#4488ff",
    secondaryColor: "#1a2a66",
    visual: "cube",
  },
  {
    id: "ai",
    index: 2,
    label: "02 / DOMAIN",
    title: "AI SYSTEMS\n& INTELLIGENCE",
    subtitle: "Machines that think, learn, adapt",
    description:
      "We build AI systems that go beyond automation — systems that perceive, reason, and evolve. From large language model integrations to custom neural architectures, we engineer intelligence that serves human ambition.",
    tags: ["LLM INTEGRATION", "NEURAL NETWORKS", "COMPUTER VISION", "AUTOMATION", "AGENTS"],
    accentColor: "#aa44ff",
    secondaryColor: "#3a1166",
    visual: "neural",
  },
  {
    id: "xr",
    index: 3,
    label: "03 / DOMAIN",
    title: "IMMERSIVE XR\n& CREATIVE TECH",
    subtitle: "Reality, extended",
    description:
      "We design and build immersive experiences that dissolve the boundary between physical and digital. AR overlays, VR environments, spatial computing interfaces — we create the spaces where imagination becomes inhabitable.",
    tags: ["SPATIAL COMPUTING", "WEBXR", "AR / VR", "3D ENVIRONMENTS", "HAPTICS"],
    accentColor: "#44ccaa",
    secondaryColor: "#0a3328",
    visual: "rings",
  },
  {
    id: "digital",
    index: 4,
    label: "04 / DOMAIN",
    title: "DIGITAL PRODUCT\n& WEB SYSTEMS",
    subtitle: "Interfaces that feel inevitable",
    description:
      "We craft digital products and web experiences that feel inevitable — as if they could not have been designed any other way. Motion, typography, interaction, and engineering converge into products that users remember.",
    tags: ["PRODUCT DESIGN", "MOTION UI", "WEB EXPERIENCES", "DESIGN SYSTEMS", "FRONTEND"],
    accentColor: "#cc8833",
    secondaryColor: "#3a2200",
    visual: "hex",
  },
];

function DomainVisualCanvas({ visual, accentColor }: { visual: string; accentColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    let animId = 0;
    let time = 0;

    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });
    const rgb = hexToRgb(accentColor);
    const cx = W / 2;
    const cy = H / 2;

    function draw() {
      animId = requestAnimationFrame(draw);
      time += 0.01;
      ctx!.clearRect(0, 0, W, H);

      if (visual === "cube") {
        // Isometric rotating cube wireframe
        const size = 75;
        const angle = time * 0.4;
        const vertices3D: [number, number, number][] = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        ];

        const projected = vertices3D.map(([x, y, z]) => {
          // Rotate Y
          const rx = x * Math.cos(angle) - z * Math.sin(angle);
          const rz = x * Math.sin(angle) + z * Math.cos(angle);
          // Rotate X slightly
          const ry = y * Math.cos(0.5) - rz * Math.sin(0.5);
          const rz2 = y * Math.sin(0.5) + rz * Math.cos(0.5);
          const scale = 300 / (300 + rz2 * size * 0.3);
          return [cx + rx * size * scale, cy + ry * size * scale, rz2] as [number, number, number];
        });

        const edges = [
          [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]
        ];

        edges.forEach(([a, b]) => {
          const depth = (projected[a][2] + projected[b][2]) / 2;
          const alpha = 0.2 + (depth + 1) * 0.2;
          ctx!.beginPath();
          ctx!.moveTo(projected[a][0], projected[a][1]);
          ctx!.lineTo(projected[b][0], projected[b][1]);
          ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.max(0.1, Math.min(0.7, alpha))})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
        });

        projected.forEach(([px, py]) => {
          ctx!.beginPath();
          ctx!.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
          ctx!.fill();
        });

        // Glow center
        const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 60);
        grd.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.06)`);
        grd.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
        ctx!.fillStyle = grd;
        ctx!.fillRect(0, 0, W, H);

      } else if (visual === "neural") {
        // Pulsing neural network
        const nodeCount = 14;
        const nodes = Array.from({ length: nodeCount }, (_, i) => {
          const a = (i / nodeCount) * Math.PI * 2 + time * 0.15;
          const r = 50 + Math.sin(time * 1.2 + i * 0.8) * 18;
          return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
        });

        // Center node
        nodes.push({ x: cx, y: cy });

        nodes.forEach((node, i) => {
          nodes.forEach((other, j) => {
            if (i < j) {
              const dist = Math.hypot(node.x - other.x, node.y - other.y);
              if (dist < 90) {
                const alpha = 0.25 * (1 - dist / 90);
                ctx!.beginPath();
                ctx!.moveTo(node.x, node.y);
                ctx!.lineTo(other.x, other.y);
                ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
                ctx!.lineWidth = 0.8;
                ctx!.stroke();
              }
            }
          });

          const pulse = (Math.sin(time * 2 + i * 0.7) + 1) / 2;
          const r = i === nodeCount ? 5 : 2.5 + pulse * 1.5;
          const alpha = 0.5 + pulse * 0.4;

          // Glow
          const grd = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 4);
          grd.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 0.3})`);
          grd.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
          ctx!.fillStyle = grd;
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, r * 4, 0, Math.PI * 2);
          ctx!.fill();

          ctx!.beginPath();
          ctx!.arc(node.x, node.y, r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
          ctx!.fill();
        });

      } else if (visual === "rings") {
        // Concentric animated rings
        for (let r = 15; r < 120; r += 18) {
          const phase = time * 1.5 - r * 0.04;
          const alpha = 0.12 + Math.sin(phase) * 0.1;
          const width = 0.5 + Math.sin(phase + 1) * 0.3;

          ctx!.beginPath();
          ctx!.arc(cx, cy, r, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.max(0.02, alpha)})`;
          ctx!.lineWidth = width;
          ctx!.stroke();
        }

        // Rotating arc segments
        for (let i = 0; i < 6; i++) {
          const startAngle = (i / 6) * Math.PI * 2 + time * 0.3;
          const endAngle = startAngle + Math.PI * 0.25;
          ctx!.beginPath();
          ctx!.arc(cx, cy, 85, startAngle, endAngle);
          ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.5)`;
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }

        // Center dot
        const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 20);
        grd.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.4)`);
        grd.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx!.fill();

      } else if (visual === "hex") {
        // Nested rotating hexagons
        for (let ring = 1; ring <= 4; ring++) {
          const r = ring * 32;
          const dir = ring % 2 === 0 ? 1 : -1;
          const rot = time * 0.25 * dir;
          const alpha = 0.35 / ring;

          ctx!.beginPath();
          for (let i = 0; i <= 6; i++) {
            const a = (i / 6) * Math.PI * 2 + rot;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            if (i === 0) ctx!.moveTo(px, py);
            else ctx!.lineTo(px, py);
          }
          ctx!.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
          ctx!.lineWidth = ring === 1 ? 1.5 : 1;
          ctx!.stroke();

          // Vertices
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + rot;
            const px = cx + Math.cos(a) * r;
            const py = cy + Math.sin(a) * r;
            ctx!.beginPath();
            ctx!.arc(px, py, 2, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha * 2})`;
            ctx!.fill();
          }
        }

        // Center glow
        const grd = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 30);
        grd.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.15)`);
        grd.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`);
        ctx!.fillStyle = grd;
        ctx!.beginPath();
        ctx!.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [visual, accentColor]);

  return (
    <canvas ref={canvasRef} width={340} height={340} className="w-full h-full" />
  );
}

function DomainCard({ domain, index }: { domain: DomainSection; index: number }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Parallax background layer
    if (bgLayerRef.current) {
      gsap.to(bgLayerRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Content entrance
    if (contentRef.current) {
      const elements = contentRef.current.querySelectorAll(".animate-in");
      gsap.fromTo(
        elements,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
            once: true,
          },
        }
      );
    }
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#050507" }}
    >
      {/* Parallax background */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0"
        style={{ transform: "scale(1.15)" }}
      >
        {/* Radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: isEven
              ? `radial-gradient(ellipse 55% 70% at 85% 50%, ${domain.secondaryColor}55 0%, transparent 65%)`
              : `radial-gradient(ellipse 55% 70% at 15% 50%, ${domain.secondaryColor}55 0%, transparent 65%)`,
          }}
        />

        {/* Fine grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${domain.accentColor}08 1px, transparent 1px),
              linear-gradient(90deg, ${domain.accentColor}08 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Side accent bar */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            [isEven ? "right" : "left"]: 0,
            width: "2px",
            background: `linear-gradient(180deg, transparent 0%, ${domain.accentColor}55 30%, ${domain.accentColor}55 70%, transparent 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 lg:px-16 py-24">
        <div
          className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-16 lg:gap-24`}
        >
          {/* Text */}
          <div ref={contentRef} className="flex-1 max-w-lg">
            <div
              className="animate-in section-label mb-5"
              style={{ color: domain.accentColor, opacity: 0 }}
            >
              {domain.label}
            </div>

            <h2
              className="animate-in"
              style={{
                opacity: 0,
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                color: "oklch(0.92 0.02 240)",
                whiteSpace: "pre-line",
                marginBottom: "1.25rem",
              }}
            >
              {domain.title}
            </h2>

            <p
              className="animate-in"
              style={{
                opacity: 0,
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: domain.accentColor,
                marginBottom: "1rem",
              }}
            >
              {domain.subtitle}
            </p>

            <p
              className="animate-in"
              style={{
                opacity: 0,
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.9375rem",
                lineHeight: 1.8,
                color: "rgba(180,195,235,0.65)",
                marginBottom: "2rem",
              }}
            >
              {domain.description}
            </p>

            <div className="animate-in flex flex-wrap gap-2" style={{ opacity: 0 }}>
              {domain.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.5625rem",
                    letterSpacing: "0.14em",
                    color: `${domain.accentColor}cc`,
                    border: `1px solid ${domain.accentColor}2a`,
                    background: `${domain.accentColor}0a`,
                    padding: "0.375rem 0.75rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="flex-shrink-0">
            <div
              className="relative"
              style={{
                width: "340px",
                height: "340px",
                border: `1px solid ${domain.accentColor}1a`,
                background: `radial-gradient(circle at center, ${domain.secondaryColor}22 0%, transparent 70%)`,
              }}
            >
              <DomainVisualCanvas visual={domain.visual} accentColor={domain.accentColor} />

              {/* Corner marks */}
              {[
                "top-0 left-0 border-t-2 border-l-2",
                "top-0 right-0 border-t-2 border-r-2",
                "bottom-0 left-0 border-b-2 border-l-2",
                "bottom-0 right-0 border-b-2 border-r-2",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute ${cls} w-4 h-4`}
                  style={{ borderColor: `${domain.accentColor}55` }}
                />
              ))}

              {/* Index label */}
              <div
                className="absolute -bottom-6 right-0 font-mono text-xs"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.2em",
                  color: `${domain.accentColor}44`,
                }}
              >
                {domain.index.toString().padStart(2, "0")} / 04
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DomainSections() {
  return (
    <div>
      {DOMAINS.map((domain, i) => (
        <DomainCard key={domain.id} domain={domain} index={i} />
      ))}
    </div>
  );
}
