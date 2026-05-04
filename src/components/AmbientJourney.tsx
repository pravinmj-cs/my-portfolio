"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { CanvasStarField } from "./CanvasStarField";
import { useEffect, useState } from "react";
import { EarthPlanet, JupiterPlanet, MarsPlanet, SaturnPlanet } from "./CSSPlanets";

// ─── Deterministic star data (LCG — no hydration mismatch) ───────────────────
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Spectral color picker — realistic star population (M>K>G>F>A>B>O) ────────
function starColor(r: number): string {
  if (r < 0.28) return "star-orange";   // K-type — most common visible orange
  if (r < 0.48) return "";               // G-type — sun-yellow (default white-ish)
  if (r < 0.60) return "star-red";       // M-type — red-orange
  if (r < 0.72) return "star-warm";      // F-type — yellow-white
  if (r < 0.83) return "star-cool";      // A-type — pure white
  if (r < 0.93) return "star-blue";      // B-type — blue-white
  return "star-blue";                    // O-type — hottest blue (rare, brightest)
}

// Cluster attractors — pull stars toward dense regions like real star fields
// Each: [cx, cy, strength, radius] — strength 0-1, radius fraction of screen
const CLUSTERS = [
  [0.22, 0.18, 0.55, 0.28],  // upper-left cluster
  [0.68, 0.12, 0.50, 0.22],  // upper-right scatter
  [0.45, 0.46, 0.40, 0.32],  // Milky Way core region
  [0.14, 0.65, 0.45, 0.20],  // left mid cluster
  [0.78, 0.58, 0.48, 0.24],  // right mid cluster
  [0.52, 0.82, 0.42, 0.26],  // lower center scatter
];

function clusterBias(px: number, py: number, r: number): [number, number] {
  // Pick the strongest nearby cluster and gently pull toward it
  let bestStr = 0, bx = px, by = py;
  for (const [cx, cy, str, rad] of CLUSTERS) {
    const dx = cx - px, dy = cy - py;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < rad) {
      const pull = str * (1 - dist / rad);
      if (pull > bestStr) { bestStr = pull; bx = cx; by = cy; }
    }
  }
  const t = bestStr * 0.38; // blend factor — partial pull, not full snap
  return [px + (bx - px) * t + (r - 0.5) * 0.06, py + (by - py) * t + (r - 0.5) * 0.04];
}

// Galaxy dust — dense, static, cluster-biased
const galaxyStars = Array.from({ length: 340 }, (_, i) => {
  const r = lcg(i * 3 + 11);
  const rx = r(), ry = r(), ps = r(), pc = r(), jit = r();
  // Milky Way diagonal density bias
  const band = Math.max(0, 1 - Math.abs((rx - ry * 0.55 - 0.18) * 2.8));
  const [px, py] = clusterBias(rx, ry + band * 0.08, jit);
  return {
    id: i,
    left: `${Math.max(0, Math.min(100, px * 100))}%`,
    top:  `${Math.max(0, Math.min(100, py * 100))}%`,
    size: ps * 0.6 + 0.12,   // 0.12 – 0.72 px — tiny, deep background
    col: starColor(pc),
  };
});

const farStars = Array.from({ length: 200 }, (_, i) => {
  const r = lcg(i * 7 + 1);
  const rx = r(), ry = r(), ps = r(), pc = r(), jit = r();
  const [px, py] = clusterBias(rx, ry, jit);
  return {
    id: i,
    left: `${Math.max(0, Math.min(100, px * 100))}%`,
    top:  `${Math.max(0, Math.min(100, py * 100))}%`,
    size: ps * 1.1 + 0.35,   // 0.35 – 1.45 px
    delay: `${r() * 18}s`,
    dur:   `${8 + r() * 10}s`,
    col: starColor(pc),
  };
});

const midStars = Array.from({ length: 70 }, (_, i) => {
  const r = lcg(i * 13 + 500);
  const rx = r(), ry = r(), ps = r(), pc = r(), jit = r();
  const [px, py] = clusterBias(rx, ry, jit);
  return {
    id: i,
    left: `${Math.max(0, Math.min(100, px * 100))}%`,
    top:  `${Math.max(0, Math.min(100, py * 100))}%`,
    size: ps * 1.5 + 0.80,   // 0.80 – 2.30 px
    delay: `${r() * 12}s`,
    dur:   `${5 + r() * 7}s`,
    col: starColor(pc),
  };
});

const nearStars = Array.from({ length: 48 }, (_, i) => {
  const r = lcg(i * 31 + 900);
  const rx = r(), ry = r(), ps = r(), pc = r(), jit = r();
  const [px, py] = clusterBias(rx, ry, jit);
  return {
    id: i,
    left: `${Math.max(0, Math.min(100, px * 100))}%`,
    top:  `${Math.max(0, Math.min(100, py * 100))}%`,
    size: ps * 2.2 + 1.1,   // 1.1 – 3.3 px
    delay: `${r() * 10}s`,
    dur:   `${3.5 + r() * 5.5}s`,
    col: starColor(pc),
  };
});

// Prominent fixed stars — diffraction spikes, restrained glow. 9 max — any more crowds.
const brightStars = [
  { id: 0,  left: "7%",  top: "6%",  size: 3.8, delay: "0s",    dur: "7s",   col: "star-blue"   },
  { id: 1,  left: "71%", top: "4%",  size: 3.4, delay: "2.2s",  dur: "9s",   col: "star-cool"   },
  { id: 2,  left: "92%", top: "19%", size: 3.0, delay: "4.8s",  dur: "8s",   col: "star-warm"   },
  { id: 3,  left: "3%",  top: "61%", size: 3.6, delay: "0.8s",  dur: "9.5s", col: "star-blue"   },
  { id: 4,  left: "52%", top: "14%", size: 3.0, delay: "3.0s",  dur: "11s",  col: "star-cool"   },
  { id: 5,  left: "85%", top: "54%", size: 2.8, delay: "6.1s",  dur: "7s",   col: "star-orange" },
  { id: 6,  left: "37%", top: "70%", size: 3.2, delay: "3.3s",  dur: "8.5s", col: "star-cool"   },
  { id: 7,  left: "79%", top: "77%", size: 3.4, delay: "1.9s",  dur: "9s",   col: "star-red"    },
  { id: 8,  left: "27%", top: "91%", size: 2.6, delay: "7.2s",  dur: "8s",   col: "star-orange" },
];

// Shooting stars — negative top = starts above viewport, enters naturally from top edge.
// The fade-in at 3% keyframe happens while the star is off-screen so there's no pop.
// As it travels rotate(42deg) translateX(38vw) it descends into view and fades out.
const shootingStars = [
  { id: 1, top: "-18%", left: "5%",  delay: "2.0s",  dur: "20s", big: false },
  { id: 2, top: "-15%", left: "30%", delay: "13.0s", dur: "25s", big: false },
  { id: 3, top: "-20%", left: "54%", delay: "22.5s", dur: "30s", big: true  },
  { id: 4, top: "-16%", left: "16%", delay: "7.0s",  dur: "28s", big: false },
  { id: 5, top: "-14%", left: "42%", delay: "17.5s", dur: "22s", big: false },
];

// ─── Centered planet anchor ───────────────────────────────────────────────────
// All planets are anchored at viewport center (left-1/2 top-[44%]).
// Framer x/y = OFFSET from that center. Scale is the dominant z-axis transform.
function PlanetAnchor({
  x, y, scale, opacity, rotate, filter, children, className,
}: {
  x: MotionValue<number> | MotionValue<string>; y: MotionValue<number> | MotionValue<string>; scale: MotionValue<number>; opacity: MotionValue<number>; rotate?: MotionValue<number>; filter?: MotionValue<string>; children: React.ReactNode; className?: string;
}) {
  return (
    // zIndex:10 ensures planets always paint above all star/meteor layers
    <div className="pointer-events-none absolute left-1/2 top-[44%]" style={{ zIndex: 10 }}>
      <motion.div
        className={className}
        style={{
          x, y, scale, opacity,
          ...(rotate !== undefined ? { rotate } : {}),
          ...(filter !== undefined ? { filter } : {}),
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform, opacity, filter",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AmbientJourney() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const skipHeavy = isMobile || reducedMotion;

  const { scrollYProgress } = useScroll();
  // Gentle overdamped spring — smooths frame gaps without bounce or lag.
  // stiffness:60 + damping:20 + mass:0.8 = critically damped, no oscillation.
  // Other bottlenecks (blur filters, excess GPU layers) are already removed
  // so the spring computation has headroom to run without causing stutter.
  const s = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.8 });

  // ── Ambience ────────────────────────────────────────────────────────────────
  const nebulaScale   = useTransform(s, [0, 1], [0.9, 1.38]);
  const nebulaOpacity = useTransform(s, [0, 0.5, 1], [0.20, 0.52, 1.0]);
  const sunRayOpacity = useTransform(s, [0, 0.3, 0.8, 1], [0.14, 0.30, 0.50, 0.18]);


  // ── Warp flash between planets ──────────────────────────────────────────────
  const warpOpacity = useTransform(
    s,
    [0.20, 0.25, 0.29, 0.42, 0.47, 0.51, 0.61, 0.66, 0.70],
    [0,    0.60, 0,   0,    0.70, 0,    0,    0.65, 0   ]
  );

  // ── Rocket ──────────────────────────────────────────────────────────────────
  // Rocket flies bottom-left → top-right across the entire scroll journey
  const rocketX     = useTransform(s, [0, 1], ["3vw",  "84vw"]);
  const rocketY     = useTransform(s, [0, 1], ["80vh", "6vh"]);
  const rocketRot   = useTransform(s, [0, 1], [48, 52]); // nose points upper-right, slight drift
  const rocketOp    = useTransform(s, [0, 0.04, 0.40, 0.90, 1], [0, 0.95, 1.0, 0.80, 0]);

  // ══════════════════════════════════════════════════════════════════════════════
  // PLANET TRANSFORMS — Flyby trajectory design
  //
  // Each planet follows a diagonal arc: approach from one side, peak OFFSET from
  // center (so it passes BESIDE you, not AT you), then exit the opposite side.
  // This creates genuine "traveling through space" sensation vs symmetric zoom.
  //
  // Camera banking: ambient stage rotates ±2deg as you pass each planet, like a
  // spacecraft banking through a turn.
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Camera bank — spacecraft tilts as it turns toward next destination ────────
  // Gentle ±2.5° banking, timed to warp transitions between planets
  const cameraBank = useTransform(s,
    [0,    0.14, 0.23, 0.35, 0.44, 0.56, 0.67, 0.80, 1.0],
    [0,    0,    0,    0,    0,    0,    0,    0,    0   ]
  );

  // ── Earth: you're leaving it — starts large, recedes upper-right behind you ───
  // Rocket is at ~(3–20vw, 80–65vh) during this phase — bottom-left quadrant
  const earthOp = useTransform(s, [0, 0.03, 0.08, 0.14, 0.18, 0.21], [0, 0.6, 1.0, 1.0, 0.5, 0]);
  const earthSc = useTransform(s, [0,    0.04, 0.10, 0.18, 0.21], [1.3, 1.1, 0.6,  0.12, 0.01]);
  const earthX  = useTransform(s, [0,    0.04, 0.10, 0.18, 0.21], ["-6vw","4vw","18vw","34vw","48vw"]);
  const earthY  = useTransform(s, [0,    0.04, 0.10, 0.18, 0.21], ["2vh","-2vh","-8vh","-18vh","-30vh"]);

  // ── Mars: visible as faint speck from distance → explosive close flyby → recession ─
  // Rocket at ~(20–34vw, 61–50vh). Mars appears ahead-right of rocket, passes right.
  // Opacity starts near-zero early so it reads as a distant dot before the flyby.
  const marsOp = useTransform(s, [0.10, 0.16, 0.20, 0.245, 0.27, 0.30, 0.33, 0.37], [0.04, 0.12, 0.35, 0.85, 1.0, 1.0, 0.35, 0.02]);
  const marsSc = useTransform(s, [0.10, 0.16, 0.19, 0.22,  0.26, 0.29, 0.32, 0.37], [0.003, 0.006, 0.015, 0.10, 2.5, 1.0, 0.12, 0.003]);
  const marsX  = useTransform(s, [0.10, 0.16, 0.22, 0.26,  0.30, 0.37], ["12vw","14vw","14vw","16vw","20vw","32vw"]);
  const marsY  = useTransform(s, [0.10, 0.16, 0.22, 0.26,  0.30, 0.37], ["3vh", "4vh", "4vh", "6vh", "10vh","22vh"]);
  // Blur: atmospheric haze when far, sharp when close
  const marsFilter = useTransform(marsSc, [0.003, 0.06, 0.4, 4], ["blur(3px)", "blur(1.2px)", "blur(0px)", "blur(0px)"]);

  // ── Jupiter: visible as faint speck → explosive close flyby on LEFT → recession ─
  // Rocket at ~(34–52vw, 50–37vh). Jupiter appears ahead-left, passes left.
  const jupOp = useTransform(s, [0.22, 0.30, 0.34, 0.395, 0.42, 0.46, 0.50, 0.56], [0.04, 0.12, 0.35, 0.85, 1.0, 1.0, 0.35, 0.02]);
  const jupSc = useTransform(s, [0.22, 0.30, 0.34, 0.37,  0.43, 0.47, 0.51, 0.56], [0.003, 0.006, 0.018, 0.14, 3.0, 1.1, 0.14, 0.003]);
  const jupX  = useTransform(s, [0.22, 0.30, 0.37, 0.43,  0.48, 0.56], ["-10vw","-12vw","-12vw","-14vw","-20vw","-34vw"]);
  const jupY  = useTransform(s, [0.22, 0.30, 0.37, 0.43,  0.48, 0.56], ["-3vh", "-4vh", "-4vh", "-6vh", "10vh", "24vh"]);
  const jupFilter = useTransform(jupSc, [0.003, 0.06, 0.4, 4], ["blur(3px)", "blur(1.2px)", "blur(0px)", "blur(0px)"]);

  // ── Saturn: emerges as a distant speck → grows to fill everything ─────────────
  // Rocket at ~(60–84vw, 28–6vh). Saturn appears dead ahead — you fly INTO it.
  const satOp = useTransform(s, [0.48, 0.62, 0.67, 0.72, 0.85, 1.0], [0.03, 0.18, 0.45, 1.0, 1.0, 0.75]);
  const satSc = useTransform(s, [0.48, 0.62, 0.66, 0.72, 0.82, 0.92, 1.0], [0.003, 0.006, 0.025, 0.18, 2.4, 3.4, 4.5]);
  const satFilter = useTransform(satSc, [0.003, 0.06, 0.4, 4], ["blur(3px)", "blur(1.2px)", "blur(0px)", "blur(0px)"]);
  const satX  = useTransform(s, [0.62, 0.75, 0.90, 1.0], ["6vw", "3vw", "1vw", "-1vw"]);
  const satY  = useTransform(s, [0.62, 0.75, 0.90, 1.0], ["4vh", "1vh", "-1vh","-3vh"]);
  const satRt = useTransform(s, [0.62, 1.0],              [-18, 12]);

  // ── Mobile / reduced-motion: lightweight static background ──────────────────
  // All hooks are called above — safe to return early here (no hook-order issue).
  if (skipHeavy) {
    return (
      <div className="ambient-stage pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Deep space gradient */}
        <div className="absolute inset-0" style={{
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(248,225,108,.08) 0%, transparent 22%)," +
            "radial-gradient(ellipse at 80% 18%, rgba(0,209,255,.08)   0%, transparent 26%)," +
            "radial-gradient(ellipse at 68% 72%, rgba(139,92,246,.10)  0%, transparent 36%)," +
            "linear-gradient(180deg,#02030c 0%,#04051a 40%,#030412 70%,#010108 100%)",
        }} />
        {/* 60 static stars — zero animations, zero JS overhead */}
        {farStars.slice(0, 35).map(st => (
          <span key={st.id} className={`absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size, opacity: 0.28 }} />
        ))}
        {midStars.slice(0, 20).map(st => (
          <span key={st.id} className={`absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size, opacity: 0.42 }} />
        ))}
        {nearStars.slice(0, 10).map(st => (
          <span key={st.id} className={`absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size, opacity: 0.60 }} />
        ))}
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,transparent_28%,rgba(3,7,18,.50)_65%,rgba(3,7,18,.88)_100%)]" />
      </div>
    );
  }

  return (
    <motion.div
      className="ambient-stage pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ rotate: cameraBank }}
    >

      {/* ── Base deep space ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background:
          /* Barely-there colour atmosphere — just enough to break pure black */
          "radial-gradient(ellipse at 15%  10%, rgba(40,30,90,.14)   0%, transparent 35%)," +
          "radial-gradient(ellipse at 80%  18%, rgba(0,60,120,.09)   0%, transparent 30%)," +
          "radial-gradient(ellipse at 42%  50%, rgba(30,0,70,.16)    0%, transparent 45%)," +
          "radial-gradient(ellipse at 72%  70%, rgba(50,20,100,.12)  0%, transparent 38%)," +
          "radial-gradient(ellipse at 20%  78%, rgba(0,40,80,.08)    0%, transparent 28%)," +
          /* Original dark base — keep the deep space darkness */
          "linear-gradient(180deg, #02030c 0%, #04051a 40%, #030412 70%, #010108 100%)",
      }} />

      {/* ── Nebula glow — deepens as journey progresses ─────────────────────── */}
      <motion.div
        className="absolute inset-[-14%]"
        style={{
          opacity: nebulaOpacity,
          scale: nebulaScale,
          background:
            "radial-gradient(ellipse at 72% 25%, rgba(248,225,108,.12) 0%, transparent 30%)," +
            "radial-gradient(ellipse at 28% 65%, rgba(0,209,255,.16)   0%, transparent 34%)," +
            "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,.24)  0%, transparent 48%)," +
            "radial-gradient(ellipse at 15% 35%, rgba(255,80,140,.08)  0%, transparent 22%)",
        }} />

      {/* ── Sun rays from upper-left ─────────────────────────────────────────── */}
      <motion.div className="sun-rays absolute -left-[18vw] -top-[24vh] h-[76vh] w-[82vw]"
        style={{ opacity: sunRayOpacity }} />

      {/* ── Milky Way band — barely-there diagonal density ───────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "linear-gradient(112deg," +
          "transparent 15%," +
          "rgba(180,170,220,0.03) 30%," +
          "rgba(200,195,240,0.055) 42%," +
          "rgba(210,200,245,0.065) 48%," +
          "rgba(190,185,230,0.04) 58%," +
          "transparent 72%)",
      }} />

      {/* ── Nebula wisps — tonal, atmospheric, not vivid ────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(ellipse 40% 22% at 60% 25%, rgba(100,60,200,0.055) 0%, transparent 100%)," +
          "radial-gradient(ellipse 32% 16% at 20% 62%, rgba(0,120,200,0.045)  0%, transparent 100%)," +
          "radial-gradient(ellipse 26% 14% at 82% 55%, rgba(180,60,40,0.035)  0%, transparent 100%)," +
          "radial-gradient(ellipse 24% 12% at 48% 78%, rgba(0,160,140,0.030)  0%, transparent 100%)",
      }} />

      {/* ── Canvas star field — 3D perspective, scroll-driven, infinite depth ──── */}
      <CanvasStarField scrollProgress={s} />

      {/* ── Shooting stars (kept as SVG for the warm-head + long-tail detail) ── */}
      <div className="absolute inset-0 pointer-events-none">
        {shootingStars.map(m => {
          // SVG shooting star: bright warm head + long tapered tail.
          // Rotation is baked into the keyframe (rotate(42deg) translateX) so
          // NO inline transform needed here — keyframe won't override it.
          const hw      = m.big ? 3.2 : 2.2;     // head radius
          const tailLen = m.big ? 220 : 170;      // long dramatic tail
          const svgW    = tailLen + 20;
          const svgH    = 24;
          const cx      = svgW - 8;               // head at right end (leading edge)
          const cy      = svgH / 2;
          return (
            <span
              key={m.id}
              className="shooting-star"
              style={{
                top: m.top, left: m.left,
                animationName: "shooting-star",
                animationDelay: m.delay,
                animationDuration: m.dur,
              }}
            >
              <svg width={svgW} height={svgH} style={{ overflow: "visible" }}>
                <defs>
                  {/* Warm yellow-white tail gradient — fades from nothing to head */}
                  <linearGradient id={`st-${m.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(255,240,180,0)"    />
                    <stop offset="40%"  stopColor="rgba(255,235,160,0.08)" />
                    <stop offset="72%"  stopColor="rgba(255,230,140,0.38)" />
                    <stop offset="90%"  stopColor="rgba(255,245,200,0.72)" />
                    <stop offset="100%" stopColor="rgba(255,255,230,0.92)" />
                  </linearGradient>
                  {/* Head glow */}
                  <radialGradient id={`sg-${m.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#fffde8" stopOpacity="1"   />
                    <stop offset="35%"  stopColor="#ffe88a" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#ffcc44" stopOpacity="0"   />
                  </radialGradient>
                  <filter id={`sf-${m.id}`}>
                    <feGaussianBlur stdDeviation="2.5" />
                  </filter>
                </defs>

                {/* Tail — straight, tapers from transparent to near-head */}
                <rect
                  x={4} y={cy - (m.big ? 1.2 : 0.85)}
                  width={tailLen - 8} height={m.big ? 2.4 : 1.7}
                  rx="1"
                  fill={`url(#st-${m.id})`}
                />
                {/* Soft glow halo around head */}
                <circle cx={cx} cy={cy} r={hw * 5}
                  fill={`url(#sg-${m.id})`}
                  filter={`url(#sf-${m.id})`}
                  opacity={m.big ? 0.85 : 0.70}
                />
                {/* Bright head dot */}
                <circle cx={cx} cy={cy} r={hw}
                  fill="#fffde8"
                  style={{ filter: "drop-shadow(0 0 4px rgba(255,220,100,0.90)) drop-shadow(0 0 8px rgba(255,200,60,0.55))" }}
                />
              </svg>
            </span>
          );
        })}
      </div>

      {/* ── Bright notable stars — fixed, diffraction spikes ─────────────────── */}
      <div className="absolute inset-0">
        {brightStars.map(st => (
          <span key={st.id}
            className={`star-bright absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size,
              animationDelay: st.delay, animationDuration: st.dur }} />
        ))}
      </div>

      {/* ── Warp radial flash ─────────────────────────────────────────────────── */}
      {!skipHeavy && <motion.div style={{ opacity: warpOpacity }} className="absolute inset-0 warp-layer" />}

      {/* ══════════════════════════════════════════════════════════════════════════
          PLANETS — desktop only (mobile skips for perf + reduced motion)
          ══════════════════════════════════════════════════════════════════════════ */}
      {!skipHeavy && <>
        <PlanetAnchor x={earthX} y={earthY} scale={earthSc} opacity={earthOp}
          className="h-[22rem] w-[22rem] md:h-[42rem] md:w-[42rem]">
          <EarthPlanet />
          <div className="planet-glow planet-glow-earth" />
        </PlanetAnchor>

        <PlanetAnchor x={marsX} y={marsY} scale={marsSc} opacity={marsOp} filter={marsFilter}
          className="h-[22rem] w-[22rem] md:h-[40rem] md:w-[40rem]">
          <MarsPlanet />
          <div className="planet-glow planet-glow-mars" />
        </PlanetAnchor>

        <PlanetAnchor x={jupX} y={jupY} scale={jupSc} opacity={jupOp} filter={jupFilter}
          className="h-[22rem] w-[22rem] md:h-[42rem] md:w-[42rem]">
          <JupiterPlanet />
          <div className="planet-glow planet-glow-jupiter" />
        </PlanetAnchor>

        <PlanetAnchor x={satX} y={satY} scale={satSc} opacity={satOp} rotate={satRt} filter={satFilter}
          className="h-[22rem] w-[22rem] md:h-[42rem] md:w-[42rem]">
          <SaturnPlanet />
          <div className="planet-glow planet-glow-saturn" />
        </PlanetAnchor>
      </>}

      {/* ── Rocket — desktop only ────────────────────────────────────────────── */}
      {!skipHeavy && <motion.div
        className="absolute"
        style={{ x: rocketX, y: rocketY, rotate: rocketRot, opacity: rocketOp, width: 64, height: 180, zIndex: 20 }}
      >
        {/* Drift wrapper — gentle float so rocket isn't rigidly locked to path */}
        <div style={{ animation: "rocket-drift 3.4s ease-in-out infinite", willChange: "transform" }}>
        <svg viewBox="0 0 64 180" width="64" height="180" style={{ overflow: "visible" }}>
          <defs>
            {/* Hull — light silver with left-lit shading */}
            <linearGradient id="r-hull" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#a8c0d8" stopOpacity="0.92" />
              <stop offset="28%"  stopColor="#d8eaf8" stopOpacity="1.0"  />
              <stop offset="52%"  stopColor="#e8f4ff" stopOpacity="1.0"  />
              <stop offset="76%"  stopColor="#b0c8de" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#7898b8" stopOpacity="0.90" />
            </linearGradient>
            {/* Nosecone accent — warm orange-red */}
            <linearGradient id="r-nose-cap" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#d06828" stopOpacity="0.95" />
              <stop offset="45%"  stopColor="#f08840" stopOpacity="1.0"  />
              <stop offset="100%" stopColor="#b05020" stopOpacity="0.90" />
            </linearGradient>
            {/* Wing — slightly darker steel */}
            <linearGradient id="r-wing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#8099b5" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4a6080" stopOpacity="0.88" />
            </linearGradient>
            {/* Exhaust — bright warm flame: white core → orange → transparent */}
            <linearGradient id="r-exhaust" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.00" />
              <stop offset="8%"   stopColor="#ffe8b0" stopOpacity="0.96" />
              <stop offset="25%"  stopColor="#ff9e40" stopOpacity="0.78" />
              <stop offset="50%"  stopColor="#ff6010" stopOpacity="0.42" />
              <stop offset="80%"  stopColor="#e03000" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#a02000" stopOpacity="0"    />
            </linearGradient>
            {/* Exhaust outer halo — wide soft orange bloom */}
            <radialGradient id="r-bloom" cx="50%" cy="10%" r="90%">
              <stop offset="0%"   stopColor="#ffcc60" stopOpacity="0.55" />
              <stop offset="40%"  stopColor="#ff8020" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ff4000" stopOpacity="0"    />
            </radialGradient>
            {/* Engine core glow */}
            <radialGradient id="r-core" cx="50%" cy="20%" r="80%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.0"  />
              <stop offset="30%"  stopColor="#ffe090" stopOpacity="0.85" />
              <stop offset="70%"  stopColor="#ff8030" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff4000" stopOpacity="0"    />
            </radialGradient>

            <filter id="r-f-bloom" x="-150%" y="-20%" width="400%" height="140%">
              <feGaussianBlur stdDeviation="6 3" />
            </filter>
            <filter id="r-f-exhaust" x="-60%" y="0%" width="220%" height="110%">
              <feGaussianBlur stdDeviation="2.5 1.5" />
            </filter>
            <filter id="r-f-core" x="-120%" y="-80%" width="340%" height="360%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            {/* Whole-rocket rim glow — makes it pop off the dark background */}
            <filter id="r-f-glow" x="-40%" y="-10%" width="180%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* ── Exhaust bloom — slow wide pulse ── */}
          <ellipse cx="32" cy="138" rx="22" ry="42"
            fill="url(#r-bloom)" filter="url(#r-f-bloom)"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: "bloom-pulse 0.38s ease-in-out infinite" }} />

          {/* ── Main exhaust plume — rapid flicker ── */}
          <ellipse cx="32" cy="132" rx="8" ry="34"
            fill="url(#r-exhaust)" filter="url(#r-f-exhaust)"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: "flame-flicker 0.18s ease-in-out infinite" }} />

          {/* ── Bright exhaust core — offset flicker ── */}
          <ellipse cx="32" cy="120" rx="3.5" ry="12"
            fill="#fff8e8" fillOpacity="0.95"
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animation: "flame-flicker 0.22s ease-in-out infinite reverse" }} />

          {/* ── Wings (delta swept) — painted behind fuselage ── */}
          <path d="M 26,90 L 2,118 L 25,102 Z" fill="url(#r-wing)" />
          <path d="M 26,90 L 2,118"
            stroke="#9ab8d0" strokeWidth="0.8" strokeOpacity="0.65" fill="none" />
          <path d="M 38,90 L 62,118 L 39,102 Z" fill="url(#r-wing)" />
          <path d="M 38,90 L 62,118"
            stroke="#9ab8d0" strokeWidth="0.8" strokeOpacity="0.65" fill="none" />

          {/* ── Fuselage body (with rim glow filter) ── */}
          <g filter="url(#r-f-glow)">
            {/* Nosecone cap — orange accent */}
            <path d="M 32,4 C 36,4 39,10 39,24 L 32,26 L 25,24 C 25,10 28,4 32,4 Z"
              fill="url(#r-nose-cap)" />

            {/* Main hull cylinder */}
            <path d="
              M 25,24
              L 25,108 L 32,114 L 39,108
              L 39,24 Z
            " fill="url(#r-hull)" />

            {/* Left rim highlight */}
            <line x1="25" y1="24" x2="25" y2="108"
              stroke="#c8e4f8" strokeWidth="0.8" strokeOpacity="0.70" />
            {/* Right shadow edge */}
            <line x1="39" y1="24" x2="39" y2="108"
              stroke="#5878a0" strokeWidth="0.6" strokeOpacity="0.55" />

            {/* Hull band — mid-body stripe */}
            <rect x="25" y="72" width="14" height="3.5" fill="#c84020" fillOpacity="0.82" rx="0.5" />

            {/* MJP — NASA-style identifier along the fuselage */}
            <text
              x="32" y="46"
              textAnchor="middle"
              fontFamily="'Orbitron', 'Courier New', monospace"
              fontWeight="700"
              fontSize="6"
              letterSpacing="2.5"
              fill="#1c3a58"
              fillOpacity="0.80"
              transform="rotate(-90, 32, 46)"
              style={{ userSelect: "none" }}
            >MJP-52</text>

            {/* Canard fins — small, near top */}
            <path d="M 26,44 L 14,52 L 25,49 Z" fill="#8099b5" fillOpacity="0.92" />
            <path d="M 38,44 L 50,52 L 39,49 Z" fill="#8099b5" fillOpacity="0.92" />

            {/* Engine bell */}
            <path d="M 26,108 L 23,116 L 41,116 L 38,108 Z" fill="#6888a8" fillOpacity="0.92" />
            <ellipse cx="32" cy="116" rx="9" ry="3" fill="#3a5070" fillOpacity="0.90" />
          </g>

          {/* ── Engine core glow (over bell) ── */}
          <ellipse cx="32" cy="118" rx="11" ry="7"
            fill="url(#r-core)" filter="url(#r-f-core)" />
        </svg>
        </div>
      </motion.div>}

      {/* ── Vignette ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,transparent_28%,rgba(3,7,18,.50)_65%,rgba(3,7,18,.88)_100%)]" />
    </motion.div>
  );
}
