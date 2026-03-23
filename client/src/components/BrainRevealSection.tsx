/**
 * BrainRevealSection.tsx
 * IAN — Neural Cartography Design System
 * 
 * Brain reveal: top-down view transition + split-flap slice traversal
 * Cinematic camera shift from spiral to overhead perspective
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BrainTraversal from "./BrainTraversal";

gsap.registerPlugin(ScrollTrigger);

interface BrainRevealSectionProps {
  isVisible: boolean;
  scrollProgress: number;
}

export default function BrainRevealSection({ isVisible, scrollProgress }: BrainRevealSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brainProgress, setBrainProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const W = canvas.clientWidth || window.innerWidth;
    const H = canvas.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 15, 0);
    camera.lookAt(0, 0, 0);

    // ── Brain geometry (top-down view) ────────────────────────
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Materials
    const cortexMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.7,
      emissive: 0x0a0a1a,
      emissiveIntensity: 0.5,
    });

    const neuralMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      emissive: 0x2244aa,
      emissiveIntensity: 1.5,
      metalness: 0.2,
      roughness: 0.5,
    });

    // Brain hemispheres (simplified as two lobes)
    const lobeGeo = new THREE.SphereGeometry(2.5, 32, 32);
    lobeGeo.scale(1, 0.6, 1.2);

    const leftLobe = new THREE.Mesh(lobeGeo, cortexMat);
    leftLobe.position.set(-1.3, 0, 0);
    brainGroup.add(leftLobe);

    const rightLobe = new THREE.Mesh(lobeGeo, cortexMat);
    rightLobe.position.set(1.3, 0, 0);
    brainGroup.add(rightLobe);

    // Corpus callosum
    const ccGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.6, 16);
    ccGeo.rotateZ(Math.PI / 2);
    const cc = new THREE.Mesh(ccGeo, neuralMat);
    cc.position.y = 0.1;
    brainGroup.add(cc);

    // Neural pathways (lines on surface)
    const pathCount = 30;
    for (let i = 0; i < pathCount; i++) {
      const angle = (i / pathCount) * Math.PI * 2;
      const r = 1.5 + Math.random() * 1.5;
      const side = Math.random() > 0.5 ? -1 : 1;

      const points = [];
      for (let j = 0; j < 8; j++) {
        const t = j / 7;
        const a = angle + t * 0.8;
        const x = side * (0.3 + r * Math.cos(a));
        const z = r * Math.sin(a) * 0.8;
        const y = 0.3 + Math.sin(t * Math.PI) * 0.3;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.015, 4, false);
      const alpha = 0.3 + Math.random() * 0.5;
      const mat = new THREE.MeshBasicMaterial({
        color: Math.random() > 0.7 ? 0xcc8833 : 0x4488ff,
        transparent: true,
        opacity: alpha,
      });
      const tube = new THREE.Mesh(tubeGeo, mat);
      brainGroup.add(tube);
    }

    // Scan ring
    const ringGeo = new THREE.TorusGeometry(3.5, 0.02, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Measurement grid
    const gridHelper = new THREE.GridHelper(10, 10, 0x4488ff, 0x1a1a2e);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.15;
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 1);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0x6688ff, 3);
    topLight.position.set(0, 10, 0);
    scene.add(topLight);

    const fillLight = new THREE.PointLight(0xcc8833, 1, 20);
    fillLight.position.set(3, 2, 3);
    scene.add(fillLight);

    const clock = new THREE.Clock();
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow rotation
      brainGroup.rotation.y = elapsed * 0.1;

      // Pulsing ring
      ring.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.02);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(elapsed * 2) * 0.2;

      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // Map section scroll to brain traversal progress
  useEffect(() => {
    if (scrollProgress > 0.3) {
      setBrainProgress((scrollProgress - 0.3) / 0.7);
    }
  }, [scrollProgress]);

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:flex-row items-center" id="intelligence">
      {/* Left: 3D brain top-down */}
      <div className="relative w-full lg:w-1/2 h-screen">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: isVisible ? 1 : 0, transition: "opacity 1s ease" }}
        />

        {/* Overlay labels */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: isVisible ? 1 : 0, transition: "opacity 1.2s ease 0.3s" }}
        >
          {/* Top measurement */}
          <div
            className="absolute top-8 left-8 font-mono text-xs"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.5625rem",
              letterSpacing: "0.2em",
              color: "rgba(68,136,255,0.5)",
            }}
          >
            AXIAL VIEW — SUPERIOR
            <br />
            <span style={{ color: "rgba(68,136,255,0.3)" }}>SLICE DEPTH: VARIABLE</span>
          </div>

          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              style={{
                width: "200px",
                height: "200px",
                border: "1px solid rgba(68,136,255,0.1)",
                borderRadius: "50%",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "rgba(68,136,255,0.15)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: "rgba(68,136,255,0.15)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Brain traversal + split-flap */}
      <div className="relative w-full lg:w-1/2 h-screen flex flex-col items-center justify-center px-8">
        {/* Section label */}
        <div
          className="section-label mb-8 self-start"
          style={{
            color: "#aa44ff",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          03 / BRAIN REVEAL
        </div>

        <h2
          className="self-start mb-8"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "oklch(0.92 0.02 240)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.2s",
          }}
        >
          Let's build
          <br />
          <span style={{ color: "#aa44ff" }}>your ideas</span>
        </h2>

        <BrainTraversal isVisible={isVisible} scrollProgress={brainProgress} />
      </div>
    </div>
  );
}
