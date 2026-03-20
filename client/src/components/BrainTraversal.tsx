/**
 * BrainTraversal.tsx
 * IAN — Neural Cartography Design System
 * 
 * Top-down brain view with split-flap slice transitions
 * SVG-based brain cross-sections with procedural neural pathway rendering
 * Each slice reveals internal structures, data patterns, glowing pathways
 */

import { useEffect, useRef, useState } from "react";
import SplitFlapDisplay from "./SplitFlapDisplay";

interface BrainSlice {
  id: number;
  label: string;
  sublabel: string;
  svgPath: string;
  color: string;
  description: string;
}

const BRAIN_SLICES: BrainSlice[] = [
  {
    id: 0,
    label: "CORTEX LAYER 01",
    sublabel: "PREFRONTAL — EXECUTIVE SYSTEMS",
    svgPath: `M200,60 C240,45 280,50 310,70 C340,90 355,120 350,155 
              C345,190 325,215 295,228 C265,241 230,240 200,235 
              C170,230 140,218 120,200 C100,182 90,155 95,128 
              C100,101 120,78 145,66 C165,57 185,58 200,60 Z`,
    color: "#4488ff",
    description: "Strategic cognition, decision architecture, systems thinking",
  },
  {
    id: 1,
    label: "CORTEX LAYER 02",
    sublabel: "TEMPORAL — PATTERN RECOGNITION",
    svgPath: `M200,55 C245,40 290,48 320,72 C350,96 362,132 355,168 
              C348,204 325,230 292,244 C259,258 220,258 188,245 
              C156,232 130,208 115,178 C100,148 102,112 118,86 
              C134,60 165,52 200,55 Z`,
    color: "#6644cc",
    description: "Language processing, memory encoding, temporal sequencing",
  },
  {
    id: 2,
    label: "CORTEX LAYER 03",
    sublabel: "PARIETAL — SPATIAL INTEGRATION",
    svgPath: `M200,50 C250,35 298,46 328,75 C358,104 368,145 358,183 
              C348,221 320,248 284,260 C248,272 208,270 174,255 
              C140,240 112,212 100,178 C88,144 92,104 112,76 
              C132,48 168,42 200,50 Z`,
    color: "#44aacc",
    description: "Spatial awareness, sensory integration, architectural perception",
  },
  {
    id: 3,
    label: "NEURAL CORE",
    sublabel: "LIMBIC — INTELLIGENCE SUBSTRATE",
    svgPath: `M200,45 C255,30 308,44 338,78 C368,112 375,158 362,196 
              C349,234 318,260 280,272 C242,284 200,282 164,268 
              C128,254 98,226 86,192 C74,158 80,116 100,86 
              C120,56 158,42 200,45 Z`,
    color: "#cc8833",
    description: "Core intelligence, emotional processing, adaptive systems",
  },
  {
    id: 4,
    label: "DEEP STRUCTURE",
    sublabel: "BASAL — PROCEDURAL ARCHITECTURE",
    svgPath: `M200,40 C260,25 318,42 348,82 C378,122 382,170 366,208 
              C350,246 316,272 276,284 C236,296 192,293 156,278 
              C120,263 90,234 78,198 C66,162 72,120 94,90 
              C116,60 155,38 200,40 Z`,
    color: "#33aa66",
    description: "Automated processes, learned behaviors, system optimization",
  },
];

function NeuralPathways({ slice, animate: shouldAnimate }: { slice: BrainSlice; animate: boolean }) {
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

    // Generate neural network nodes
    const nodes: { x: number; y: number; connections: number[] }[] = [];
    const nodeCount = 30;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: 60 + Math.random() * (W - 120),
        y: 40 + Math.random() * (H - 80),
        connections: [],
      });
    }

    // Connect nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 80 && node.connections.length < 4) {
            node.connections.push(j);
          }
        }
      });
    });

    // Parse hex color
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(slice.color);

    function draw() {
      animId = requestAnimationFrame(draw);
      if (!shouldAnimate) return;

      ctx!.clearRect(0, 0, W, H);
      time += 0.016;

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((j) => {
          const other = nodes[j];
          const pulse = (Math.sin(time * 2 + i * 0.5) + 1) / 2;
          const alpha = 0.08 + pulse * 0.12;

          ctx!.beginPath();
          ctx!.moveTo(node.x, node.y);
          ctx!.lineTo(other.x, other.y);
          ctx!.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();

          // Pulse traveling along connection
          const t = (time * 0.5 + i * 0.1) % 1;
          const px = node.x + (other.x - node.x) * t;
          const py = node.y + (other.y - node.y) * t;
          const pulseAlpha = Math.sin(t * Math.PI) * 0.6;

          ctx!.beginPath();
          ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${pulseAlpha})`;
          ctx!.fill();
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = (Math.sin(time * 1.5 + i * 0.8) + 1) / 2;
        const radius = 2 + pulse * 1.5;
        const alpha = 0.4 + pulse * 0.5;

        // Glow
        const gradient = ctx!.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx!.fillStyle = gradient;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        ctx!.fill();
      });
    }

    draw();

    return () => cancelAnimationFrame(animId);
  }, [slice, shouldAnimate]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}

interface BrainTraversalProps {
  isVisible: boolean;
  scrollProgress: number; // 0-1 within this section
}

export default function BrainTraversal({ isVisible, scrollProgress }: BrainTraversalProps) {
  const [currentSlice, setCurrentSlice] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displaySlice, setDisplaySlice] = useState(0);
  const prevSliceRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;

    const targetSlice = Math.min(
      Math.floor(scrollProgress * BRAIN_SLICES.length),
      BRAIN_SLICES.length - 1
    );

    if (targetSlice !== prevSliceRef.current) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlice(targetSlice);
        setDisplaySlice(targetSlice);
        setIsTransitioning(false);
      }, 300);
      prevSliceRef.current = targetSlice;
    }
  }, [scrollProgress, isVisible]);

  const slice = BRAIN_SLICES[currentSlice];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Brain cross-section visualization */}
      <div
        className="relative"
        style={{
          width: "min(400px, 80vw)",
          height: "min(320px, 64vw)",
          opacity: isTransitioning ? 0.3 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Neural pathways canvas */}
        <NeuralPathways slice={slice} animate={isVisible} />

        {/* SVG brain outline */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 w-full h-full"
          style={{ filter: `drop-shadow(0 0 20px ${slice.color}44)` }}
        >
          {/* Outer brain shape */}
          <path
            d={slice.svgPath}
            fill="none"
            stroke={slice.color}
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Inner structure lines */}
          <path
            d={slice.svgPath}
            fill={`${slice.color}08`}
            stroke={slice.color}
            strokeWidth="0.5"
            strokeOpacity="0.3"
            transform="scale(0.85) translate(30, 22)"
          />

          {/* Corpus callosum line */}
          <line
            x1="110"
            y1="150"
            x2="290"
            y2="150"
            stroke={slice.color}
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="4 3"
          />

          {/* Vertical fissure */}
          <line
            x1="200"
            y1="60"
            x2="200"
            y2="240"
            stroke={slice.color}
            strokeWidth="0.8"
            strokeOpacity="0.3"
          />

          {/* Gyri lines */}
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${130 + i * 30},80 Q${145 + i * 30},100 ${130 + i * 30},120`}
              fill="none"
              stroke={slice.color}
              strokeWidth="0.6"
              strokeOpacity="0.25"
            />
          ))}

          {/* Scan line */}
          <line
            x1="90"
            y1="150"
            x2="310"
            y2="150"
            stroke={slice.color}
            strokeWidth="0.5"
            strokeOpacity="0.8"
            style={{
              animation: "scan-line-h 3s linear infinite",
            }}
          />

          {/* Measurement markers */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line
                x1={90 + i * 55}
                y1="58"
                x2={90 + i * 55}
                y2="66"
                stroke={slice.color}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <text
                x={90 + i * 55}
                y="54"
                textAnchor="middle"
                fill={slice.color}
                fillOpacity="0.4"
                fontSize="7"
                fontFamily="JetBrains Mono, monospace"
              >
                {(i * 25).toString().padStart(3, "0")}
              </text>
            </g>
          ))}
        </svg>

        {/* Slice indicator */}
        <div
          className="absolute top-2 right-2 font-mono text-xs"
          style={{ color: `${slice.color}99`, letterSpacing: "0.15em" }}
        >
          {(currentSlice + 1).toString().padStart(2, "0")}/{BRAIN_SLICES.length.toString().padStart(2, "0")}
        </div>
      </div>

      {/* Split-flap label display */}
      <div className="mt-6 text-center">
        <SplitFlapDisplay
          text={slice.label}
          isVisible={isVisible && !isTransitioning}
          size="sm"
          delay={0}
        />
        <div
          className="mt-2 font-mono text-xs tracking-widest"
          style={{
            color: `${slice.color}88`,
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {slice.sublabel}
        </div>
        <p
          className="mt-3 text-sm max-w-xs mx-auto"
          style={{
            color: "rgba(180,195,235,0.6)",
            fontFamily: "Space Grotesk, sans-serif",
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.4s 0.1s",
          }}
        >
          {slice.description}
        </p>
      </div>

      {/* Slice progress dots */}
      <div className="flex gap-2 mt-5">
        {BRAIN_SLICES.map((s, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentSlice ? "20px" : "6px",
              height: "6px",
              background: i === currentSlice ? s.color : "rgba(255,255,255,0.15)",
              boxShadow: i === currentSlice ? `0 0 8px ${s.color}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}
