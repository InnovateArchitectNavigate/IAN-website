# IAN Landing Page — Design Brainstorm

## Three Design Philosophies

<response>
<text>

### Approach A — "Necromorphic Precision"
**Design Movement:** Biomechanical Brutalism × Cinematic Sci-Fi

**Core Principles:**
1. Everything is a cross-section — the UI itself feels like a dissected machine
2. Asymmetric tension: heavy left anchoring, bleeding right edges
3. Monochrome with single chromatic accent (cold electric blue-white)
4. Typography as structural element — letterforms carry architectural weight

**Color Philosophy:**
- Background: near-black charcoal (#0a0a0c)
- Structural surfaces: brushed titanium (#1c1c22), oxidized chrome (#2a2a35)
- Accent: cold electric white (#e8eeff) and neural blue (#4a90d9)
- Glow: deep cobalt (#1a3a6e) for subsurface light
- Emotional intent: controlled power, engineered intelligence, restrained awe

**Layout Paradigm:**
- Vertical scroll as cinematic timeline — each section is a "frame"
- Full-bleed 3D canvas as persistent background layer
- Text blocks float as HUD overlays — left-aligned, sparse, surgical
- No traditional "sections" — transitions are dissolves, not cuts

**Signature Elements:**
1. Segmented progress indicator (vertical spine on right edge)
2. Scanline texture overlay at 3% opacity across entire experience
3. Hexagonal grid micro-pattern on metallic surfaces

**Interaction Philosophy:**
- Scroll is the only input — everything responds to scroll velocity
- Hover states: subtle blue-white glow expansion, no color changes
- Cursor: custom crosshair with radial pulse on hover

**Animation:**
- Camera: smooth cubic-bezier spiral, 0.8s lag behind scroll
- Transitions: opacity fade + subtle Z-depth shift (never slide)
- Split-flap: 80ms per flap, 12 flaps per transition, mechanical easing
- Parallax: 3 depth layers at 0.2x, 0.5x, 0.8x scroll ratios

**Typography System:**
- Display: "Space Grotesk" — geometric, technical, slightly alien
- Body: "DM Mono" — monospaced, precise, data-terminal feel
- Hierarchy: 96px / 48px / 24px / 14px — extreme contrast
- Letter-spacing: +0.15em on all caps labels

</text>
<probability>0.08</probability>
</response>

<response>
<text>

### Approach B — "Neural Cartography" ← SELECTED
**Design Movement:** Dark Bauhaus × Neuroscience Visualization × Premium Agency

**Core Principles:**
1. The page IS the object — the 3D structure is not decoration, it IS the content
2. Cartographic precision: every element feels mapped, measured, intentional
3. Light as narrative — the only color comes from internal luminescence
4. Silence between elements — generous negative space as premium signal

**Color Philosophy:**
- Background: absolute black (#050507)
- Metal: warm-cool chrome gradient (#1a1a20 → #2e2e3a)
- Primary accent: ice-white neural glow (oklch(0.92 0.02 240))
- Secondary: deep cobalt pulse (oklch(0.35 0.12 250))
- Tertiary: amber-gold circuit trace (oklch(0.65 0.15 75)) — used sparingly
- Emotional intent: vast intelligence, quiet power, precision craftsmanship

**Layout Paradigm:**
- Pinned 3D canvas behind all content — persistent anchor
- Text appears as floating cartographic annotations
- Right-rail vertical progress indicator with section labels
- Each domain section: full-bleed with 60/40 text-to-visual split

**Signature Elements:**
1. Fine hairline grid (0.5px, 4% opacity) — cartographic reference
2. Glowing circuit-trace lines connecting section transitions
3. Monogram "IAN" as structural glyph — appears/transforms throughout

**Interaction Philosophy:**
- Scroll drives everything — no click-required interactions in hero
- Magnetic hover on CTAs — elements subtly attract cursor
- Form fields: underline-only, no borders, elegant focus expansion

**Animation:**
- Three.js camera: spiral path with eased scroll mapping
- GSAP ScrollTrigger for all section choreography
- Split-flap: CSS 3D transforms, 60ms intervals, staggered columns
- Tube shader: GLSL fragment shader with time-uniform animation

**Typography System:**
- Display: "Syne" — geometric, architectural, distinctive
- Subheadings: "Space Grotesk" — technical precision
- Body/mono: "JetBrains Mono" — code-terminal intelligence
- Scale: 120px hero / 56px section / 28px sub / 16px body / 11px label

</text>
<probability>0.09</probability>
</response>

<response>
<text>

### Approach C — "Exo-Cortex"
**Design Movement:** Japanese Minimalism × Industrial Cyberpunk

**Core Principles:**
1. Reduction to essence — only what is necessary survives
2. Contrast as the primary design tool — extreme light/dark adjacency
3. The machine is beautiful — exposed mechanisms, visible structure
4. Time as texture — the experience unfolds like a slow revelation

**Color Philosophy:**
- Background: deep space black (#030305)
- Accent: single neon cyan (#00d4ff) used with extreme restraint
- Metal: cold steel (#15151e), oxidized silver (#888899)
- Emotional intent: alien precision, cold beauty, technological sublime

**Layout Paradigm:**
- Centered vertical spine — everything orbits the central axis
- Extreme typographic scale contrast
- Minimal UI chrome — almost no visible interface elements

**Signature Elements:**
1. Vertical kanji-inspired structural marks
2. Breathing pulse animation on all glow elements
3. Noise/grain texture at 8% opacity

**Interaction Philosophy:**
- Scroll as meditation — slow, deliberate, contemplative
- No hover states — the experience is passive, cinematic

**Animation:**
- Everything moves at 0.6x normal speed — deliberate, weighty
- Transitions: long dissolves (1.2s), no sudden cuts

**Typography System:**
- Display: "Bebas Neue" — industrial, compressed, powerful
- Body: "IBM Plex Mono" — technical, precise

</text>
<probability>0.06</probability>
</response>

---

## Selected Approach: B — "Neural Cartography"

**Rationale:** This approach best serves IAN's brand positioning as a fusion of creative technology agency, AI systems studio, and immersive XR lab. The cartographic metaphor aligns with the biomechanical 3D object concept — we are literally mapping intelligence. The color system (absolute black + ice-white neural glow + deep cobalt + amber circuit traces) creates the premium, restrained palette requested. Syne + Space Grotesk + JetBrains Mono provides the typographic range needed across hero, sections, and technical copy.

**Committed Design Tokens:**
- bg: #050507
- chrome-dark: #1a1a20
- chrome-mid: #2e2e3a
- neural-white: oklch(0.92 0.02 240)
- cobalt-pulse: oklch(0.35 0.12 250)
- circuit-amber: oklch(0.65 0.15 75)
- font-display: Syne
- font-technical: Space Grotesk
- font-mono: JetBrains Mono
