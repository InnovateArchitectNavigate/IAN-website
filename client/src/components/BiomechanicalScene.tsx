/**
 * BiomechanicalScene.tsx
 * IAN — Neural Cartography Design System
 * 
 * Core Three.js scene: STL spine model with metallic materials, brain object on top,
 * and dual-camera system with smooth semicircular rotation transition.
 * 
 * Architecture:
 * - STL spine loaded with metallic shading
 * - Brain object (IcosahedronGeometry) positioned on spine top
 * - Camera 1: Spiral ascent around spine
 * - Camera 2: Semicircular rotation to top-down brain view
 * - GSAP ScrollTrigger orchestrates camera transitions
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface BiomechanicalSceneProps {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  onScrollProgress?: (progress: number) => void;
}

export default function BiomechanicalScene({ scrollContainerRef, onScrollProgress }: BiomechanicalSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ── Scene ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050507);
    scene.fog = new THREE.FogExp2(0x050507, 0.022);

    // ── Cameras ───────────────────────────────────────────────
    // Camera 1: Spiral ascent
    const camera1 = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera1.position.set(9, -20, 9);
    camera1.lookAt(0, -12, 0);

    // Camera 2: Top-down brain view (will be positioned after brain is loaded)
    const camera2 = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera2.position.set(0, 15, 0);
    camera2.lookAt(0, 0, 0);

    let activeCamera = camera1;

    const clock = new THREE.Clock();

    // ── Environment map ───────────────────────────────────────
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // ── Materials ─────────────────────────────────────────────
    const spineMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.95,
      roughness: 0.08,
      envMapIntensity: 1.8,
    });

    const brainMetallicMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0x1a1a2e,
      emissiveIntensity: 0.8,
      envMapIntensity: 1.5,
    });

    const glowBlueMat = new THREE.MeshStandardMaterial({
      color: 0x3366cc,
      emissive: 0x1a3388,
      emissiveIntensity: 2.0,
      metalness: 0.2,
      roughness: 0.5,
    });

    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xcc7722,
      emissive: 0x773311,
      emissiveIntensity: 1.8,
      metalness: 0.3,
      roughness: 0.5,
    });

    // ── Spine group ───────────────────────────────────────────
    const spineGroup = new THREE.Group();
    scene.add(spineGroup);

    // ── Load STL spine model ───────────────────────────────────
    const stlLoader = new STLLoader();
    let spineMesh: THREE.Mesh | null = null;
    let brainObject: THREE.Mesh | null = null;

    stlLoader.load("https://res.cloudinary.com/soggy-ink-games/image/upload/v1774034309/spine_ir6fuh.glb", (geometry) => {
      // Center and scale the geometry
      geometry.center();
      geometry.scale(0.08, 0.08, 0.08);

      spineMesh = new THREE.Mesh(geometry, spineMetallicMat);
      spineMesh.position.y = 0;
      spineMesh.castShadow = true;
      spineMesh.receiveShadow = true;
      spineGroup.add(spineMesh);

      // ── Brain object on top of spine ───────────────────────
      // TODO: Replace with OBJ brain model when available
      // const brainLoader = new OBJLoader();
      // brainLoader.load("/models/brain.obj", (object) => { ... });

      // For now: placeholder brain using IcosahedronGeometry
      const brainGeo = new THREE.IcosahedronGeometry(1.2, 5);
      brainObject = new THREE.Mesh(brainGeo, brainMetallicMat);
      brainObject.position.y = 5.5; // On top of spine
      brainObject.castShadow = true;
      brainObject.receiveShadow = true;
      spineGroup.add(brainObject);

      // Update camera2 to look at brain
      if (brainObject) {
        camera2.lookAt(brainObject.position);
      }
    });

    // ── Floating fragments ────────────────────────────────────
    const fragmentData: Array<{
      mesh: THREE.Mesh;
      rotSpeed: THREE.Vector3;
      floatOffset: number;
      floatSpeed: number;
    }> = [];

    const fragmentGeos = [
      new THREE.BoxGeometry(0.08, 0.35, 0.04),
      new THREE.BoxGeometry(0.28, 0.04, 0.04),
      new THREE.OctahedronGeometry(0.09),
      new THREE.TetrahedronGeometry(0.1),
      new THREE.BoxGeometry(0.05, 0.05, 0.22),
    ];

    for (let i = 0; i < 55; i++) {
      const geo = fragmentGeos[Math.floor(Math.random() * fragmentGeos.length)];
      const mat = Math.random() > 0.75
        ? amberMat
        : Math.random() > 0.5
        ? glowBlueMat
        : spineMetallicMat;

      const mesh = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const dist = 2.2 + Math.random() * 5;
      mesh.position.set(
        Math.cos(angle) * dist,
        -22 + Math.random() * 48,
        Math.sin(angle) * dist
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(mesh);
      fragmentData.push({
        mesh,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ),
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.4 + Math.random() * 0.6,
      });
    }

    // ── Particle system ───────────────────────────────────────
    const PARTICLE_COUNT = 1200;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pColors = new Float32Array(PARTICLE_COUNT * 3);
    const pSizes = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.2 + Math.random() * 10;
      pPositions[i * 3] = Math.cos(angle) * dist;
      pPositions[i * 3 + 1] = -24 + Math.random() * 52;
      pPositions[i * 3 + 2] = Math.sin(angle) * dist;

      const bright = 0.25 + Math.random() * 0.75;
      if (Math.random() > 0.82) {
        // Amber
        pColors[i * 3] = bright * 0.9;
        pColors[i * 3 + 1] = bright * 0.45;
        pColors[i * 3 + 2] = bright * 0.05;
      } else {
        // Blue-white
        pColors[i * 3] = bright * 0.2;
        pColors[i * 3 + 1] = bright * 0.45;
        pColors[i * 3 + 2] = bright;
      }
      pSizes[i] = 0.02 + Math.random() * 0.05;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Lighting ──────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0a0a18, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x5577ff, 2.5);
    keyLight.position.set(-6, 25, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xcc7722, 2.0, 35);
    fillLight.position.set(4, -18, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x99bbff, 1.8);
    rimLight.position.set(8, 8, -10);
    scene.add(rimLight);

    const camLight = new THREE.PointLight(0x4466ff, 1.0, 18);
    scene.add(camLight);

    const spineLight = new THREE.PointLight(0x2244ff, 1.5, 12);
    spineLight.position.set(0, 0, 0);
    scene.add(spineLight);

    // ── Spiral camera path ────────────────────────────────────
    function updateSpiralCamera(progress: number) {
      const startY = -20;
      const endY = 24;
      const y = startY + progress * (endY - startY);

      const spiralTurns = 1.8;
      const angle = progress * spiralTurns * Math.PI * 2;
      const radius = 9 - progress * 4;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      camera1.position.set(x, y, z);
      const lookY = y + 5 + progress * 4;
      camera1.lookAt(0, Math.min(lookY, 30), 0);

      camLight.position.set(x * 0.4, y + 1, z * 0.4);
      spineLight.position.y = y - 3;
    }

    // ── Semicircular camera rotation to top-down brain view ────
    function updateBrainTransitionCamera(transitionProgress: number) {
      // transitionProgress: 0 = end of spiral, 1 = top-down brain view
      
      // Start position: end of spiral (approximately)
      const spiralEndX = Math.cos(1.8 * Math.PI * 2) * (9 - 1 * 4);
      const spiralEndY = -20 + 1 * (24 - (-20));
      const spiralEndZ = Math.sin(1.8 * Math.PI * 2) * (9 - 1 * 4);

      // End position: top-down brain view
      const brainViewX = 0;
      const brainViewY = 15;
      const brainViewZ = 0;

      // Semicircular arc in the YZ plane
      const arcAngle = transitionProgress * Math.PI; // 0 to π
      const arcRadius = Math.hypot(spiralEndY - brainViewY, spiralEndZ - brainViewZ) / 2;
      const arcCenterY = (spiralEndY + brainViewY) / 2;
      const arcCenterZ = (spiralEndZ + brainViewZ) / 2;

      const x = spiralEndX + (brainViewX - spiralEndX) * transitionProgress;
      const y = arcCenterY + Math.cos(arcAngle) * arcRadius;
      const z = arcCenterZ + Math.sin(arcAngle) * arcRadius;

      camera2.position.set(x, y, z);
      if (brainObject) {
        camera2.lookAt(brainObject.position);
      }
    }

    // ── GSAP ScrollTrigger ────────────────────────────────────
    let scrollTrigger: ScrollTrigger | null = null;

    if (scrollContainerRef.current) {
      scrollTrigger = ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start: "top top",
        end: "85% bottom",
        scrub: 1.8,
        onUpdate: (self) => {
          const progress = self.progress;

          // Phase 1: Spiral ascent (0 to 0.85)
          if (progress <= 0.85) {
            activeCamera = camera1;
            updateSpiralCamera(progress / 0.85);
          }
          // Phase 2: Semicircular transition to brain view (0.85 to 1.0)
          else {
            activeCamera = camera2;
            const transitionProgress = (progress - 0.85) / 0.15;
            updateBrainTransitionCamera(transitionProgress);
          }

          onScrollProgress?.(progress);
        },
      });
    }

    // ── Render loop ───────────────────────────────────────────
    let animationId = 0;

    function animate() {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Animate fragments
      fragmentData.forEach(({ mesh, rotSpeed, floatOffset, floatSpeed }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.rotation.z += rotSpeed.z;
        mesh.position.y += Math.sin(elapsed * floatSpeed + floatOffset) * 0.0008;
      });

      // Animate brain object
      if (brainObject) {
        brainObject.rotation.x += 0.0004;
        brainObject.rotation.y += 0.0006;
        const pulse = 1 + Math.sin(elapsed * 1.2) * 0.05;
        brainObject.scale.setScalar(pulse);
      }

      // Animate spine metallic glow
      if (spineMesh && spineMesh.material instanceof THREE.MeshStandardMaterial) {
        spineMesh.material.emissiveIntensity = 0.5 + Math.sin(elapsed * 1.5) * 0.3;
      }

      // Rotate particles
      particles.rotation.y = elapsed * 0.018;

      // Animate fill light
      fillLight.intensity = 1.8 + Math.sin(elapsed * 0.7) * 0.4;
      fillLight.position.x = 4 + Math.sin(elapsed * 0.3) * 1.5;

      renderer.render(scene, activeCamera);
    }

    animate();

    // ── Resize ────────────────────────────────────────────────
    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera1.aspect = w / h;
      camera1.updateProjectionMatrix();
      camera2.aspect = w / h;
      camera2.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      if (scrollTrigger) scrollTrigger.kill();
      renderer.dispose();
      envTexture.dispose();
    };
  }, [scrollContainerRef, onScrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
