/**
 * TubeShader.tsx
 * IAN — Neural Cartography Design System
 * 
 * WebGL shader: robotic tubular traversal
 * Metallic internal ribbing, glowing circuitry, flowing light pulses
 * Pure Three.js with custom GLSL fragment shader
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface TubeShaderProps {
  isActive: boolean;
  progress: number; // 0-1 traversal progress
}

const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// ── Noise functions ──────────────────────────────────────────
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash2(i);
  float b = hash2(i + vec2(1.0, 0.0));
  float c = hash2(i + vec2(0.0, 1.0));
  float d = hash2(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.0 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// ── SDF for tube interior ────────────────────────────────────
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = vUv;
  
  // Cylindrical coordinates
  float theta = uv.x * 6.28318; // 0 to 2pi around tube
  float depth = uv.y + uTime * 0.15 + uProgress * 2.0; // flowing depth
  
  // ── Base metallic surface ────────────────────────────────────
  vec3 metalColor = vec3(0.12, 0.13, 0.16);
  vec3 chromColor = vec3(0.25, 0.27, 0.32);
  
  // Radial ribbing pattern
  float ribFreq = 24.0;
  float rib = smoothstep(0.85, 1.0, abs(sin(theta * ribFreq * 0.5)));
  float ribDepth = smoothstep(0.7, 1.0, abs(sin(theta * ribFreq * 0.5 + 0.5)));
  
  // Longitudinal seams
  float seamFreq = 8.0;
  float seam = smoothstep(0.9, 1.0, abs(sin(theta * seamFreq)));
  
  vec3 surface = mix(metalColor, chromColor, rib * 0.6 + seam * 0.3);
  
  // ── Metallic sheen ───────────────────────────────────────────
  float sheen = pow(abs(sin(theta + uTime * 0.1)), 8.0) * 0.3;
  surface += vec3(0.15, 0.18, 0.25) * sheen;
  
  // ── Circuitry traces ─────────────────────────────────────────
  // Horizontal circuit lines
  float circuitH = step(0.98, fract(depth * 3.0 + noise(vec2(theta * 2.0, depth)) * 0.1));
  
  // Vertical circuit traces
  float traceAngle = floor(theta * 12.0) / 12.0;
  float traceActive = step(0.7, hash(traceAngle * 100.0 + floor(depth * 0.5)));
  float circuitV = step(0.97, fract(theta * 12.0)) * traceActive;
  
  // Circuit nodes (intersections)
  float nodeH = step(0.98, fract(depth * 3.0));
  float nodeV = step(0.97, fract(theta * 12.0));
  float node = nodeH * nodeV;
  
  // Circuit glow color
  vec3 circuitColor = vec3(0.15, 0.45, 1.0);
  vec3 amberCircuit = vec3(0.8, 0.5, 0.1);
  vec3 circuitGlow = mix(circuitColor, amberCircuit, hash(traceAngle * 50.0));
  
  float circuitMask = max(circuitH * 0.6, circuitV * 0.8) + node * 1.5;
  surface = mix(surface, circuitGlow, circuitMask * 0.7);
  
  // ── Flowing energy pulse ─────────────────────────────────────
  float pulseSpeed = 0.8;
  float pulseDepth = fract(depth * 0.3 - uTime * pulseSpeed);
  float pulse = smoothstep(0.0, 0.15, pulseDepth) * smoothstep(0.3, 0.15, pulseDepth);
  
  // Pulse travels along specific traces
  float pulseTrace = step(0.85, hash(floor(theta * 12.0) * 77.3));
  float pulseGlow = pulse * pulseTrace * 3.0;
  
  vec3 pulseColor = mix(vec3(0.2, 0.6, 1.0), vec3(0.9, 0.6, 0.1), hash(floor(theta * 12.0) * 33.0));
  surface += pulseColor * pulseGlow;
  
  // ── Central tunnel glow ──────────────────────────────────────
  // Distance from center of tube (radial)
  float radialDist = length(vPosition.xy) / 2.0;
  float centerGlow = smoothstep(0.8, 0.0, radialDist) * 0.15;
  surface += vec3(0.1, 0.3, 0.8) * centerGlow;
  
  // ── Depth fog ────────────────────────────────────────────────
  float depthFog = smoothstep(0.0, 1.0, uv.y);
  surface = mix(surface, vec3(0.02, 0.02, 0.04), depthFog * 0.6);
  
  // ── Vignette ─────────────────────────────────────────────────
  vec2 vigUv = vUv * 2.0 - 1.0;
  float vignette = 1.0 - dot(vigUv * vec2(0.3, 1.0), vigUv * vec2(0.3, 1.0));
  vignette = clamp(vignette, 0.0, 1.0);
  surface *= (0.4 + vignette * 0.6);
  
  // ── Noise texture ────────────────────────────────────────────
  float grainNoise = (hash2(vUv * 500.0 + uTime * 0.1) - 0.5) * 0.03;
  surface += grainNoise;
  
  // ── Final output ─────────────────────────────────────────────
  float alpha = 1.0;
  gl_FragColor = vec4(surface, alpha);
}
`;

export default function TubeShader({ isActive, progress }: TubeShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<{
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animId: number;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const W = canvas.clientWidth || window.innerWidth;
    const H = canvas.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 100);
    camera.position.z = 3;

    // Create tube geometry
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.3, 0.2, -2),
      new THREE.Vector3(-0.2, -0.1, -4),
      new THREE.Vector3(0.1, 0.3, -6),
      new THREE.Vector3(0, 0, -8),
    ]);

    const tubeGeo = new THREE.TubeGeometry(path, 200, 2.5, 64, false);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(W, H) },
      },
      side: THREE.BackSide,
    });

    const tube = new THREE.Mesh(tubeGeo, material);
    scene.add(tube);

    const clock = new THREE.Clock();
    let animId = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;

      // Camera moves through tube
      const t = (elapsed * 0.08) % 1;
      const pos = path.getPoint(t);
      const tangent = path.getTangent(t);
      camera.position.copy(pos);
      camera.lookAt(pos.clone().add(tangent));

      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    }
    window.addEventListener("resize", onResize);

    rendererRef.current = { renderer, material, animId };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  // Update progress uniform
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.material.uniforms.uProgress.value = progress;
    }
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
