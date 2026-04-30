"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { EarthPlanet, JupiterPlanet, MarsPlanet, SaturnPlanet } from "./CSSPlanets";

// ─── Deterministic star data (LCG — no hydration mismatch) ───────────────────
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// Galaxy dust — hundreds of static pinpoints, no twinkle, pure depth
const galaxyStars = Array.from({ length: 260 }, (_, i) => {
  const r = lcg(i * 3 + 11);
  const px = r(), py = r(), ps = r();
  // Slightly denser band along a diagonal (Milky Way hint)
  const bandBias = Math.max(0, 1 - Math.abs((px - py * 0.6 - 0.2) * 3));
  const topVal   = py * 100 + bandBias * 8;
  const col = ps < 0.18 ? "star-blue" : ps < 0.30 ? "star-warm" : "";
  return {
    id: i,
    left: `${px * 100}%`,
    top:  `${Math.min(topVal, 100)}%`,
    size: ps * 0.5 + 0.2,          // 0.2 – 0.7 px
    col,
  };
});

const farStars = Array.from({ length: 140 }, (_, i) => {
  const r = lcg(i * 7 + 1);
  const px = r(), py = r(), ps = r(), pc = r();
  const col = pc < 0.16 ? "star-blue" : pc < 0.28 ? "star-warm" : pc < 0.40 ? "star-cool" : "";
  return {
    id: i,
    left: `${px * 100}%`,
    top:  `${py * 100}%`,
    size: ps * 1.1 + 0.4,          // 0.4 – 1.5 px
    delay: `${r() * 14}s`,
    dur:   `${6 + r() * 8}s`,
    col,
  };
});

const midStars = Array.from({ length: 72 }, (_, i) => {
  const r = lcg(i * 13 + 500);
  const px = r(), py = r(), ps = r(), pc = r();
  const col = pc < 0.20 ? "star-blue" : pc < 0.34 ? "star-warm" : "";
  return {
    id: i,
    left: `${px * 100}%`,
    top:  `${py * 100}%`,
    size: ps * 1.5 + 0.8,          // 0.8 – 2.3 px
    delay: `${r() * 10}s`,
    dur:   `${4 + r() * 6}s`,
    col,
  };
});

const nearStars = Array.from({ length: 28 }, (_, i) => {
  const r = lcg(i * 31 + 900);
  return {
    id: i,
    left: `${r() * 100}%`,
    top:  `${r() * 100}%`,
    size: r() * 2.2 + 1.2,         // 1.2 – 3.4 px
    delay: `${r() * 8}s`,
    dur:   `${3 + r() * 5}s`,
  };
});

// Notable bright stars — large, spike glow, fixed (no parallax drift)
const brightStars = [
  { id: 0, left: "8%",  top: "7%",  size: 3.5, delay: "0s",    dur: "7s",  col: "star-blue" },
  { id: 1, left: "72%", top: "4%",  size: 3.0, delay: "2.2s",  dur: "9s",  col: "" },
  { id: 2, left: "91%", top: "22%", size: 2.8, delay: "4.8s",  dur: "8s",  col: "star-warm" },
  { id: 3, left: "18%", top: "38%", size: 3.2, delay: "1.4s",  dur: "10s", col: "star-blue" },
  { id: 4, left: "84%", top: "55%", size: 2.6, delay: "6.1s",  dur: "7s",  col: "" },
  { id: 5, left: "38%", top: "71%", size: 3.0, delay: "3.3s",  dur: "8.5s",col: "star-cool" },
  { id: 6, left: "62%", top: "84%", size: 2.5, delay: "5.7s",  dur: "6.5s",col: "star-warm" },
  { id: 7, left: "4%",  top: "62%", size: 3.4, delay: "0.8s",  dur: "9.5s",col: "" },
];
const meteors = [
  { id: 1, top: "-8%",  left: "14%", delay: "2.2s",  dur: "9s",    w: 200, dir: "right" },
  { id: 2, top: "-10%", left: "74%", delay: "6.5s",  dur: "11.5s", w: 240, dir: "left"  },
  { id: 3, top: "-6%",  left: "46%", delay: "13.0s", dur: "10s",   w: 170, dir: "right" },
];

// ─── Centered planet anchor ───────────────────────────────────────────────────
// All planets are anchored at viewport center (left-1/2 top-[44%]).
// Framer x/y = OFFSET from that center. Scale is the dominant z-axis transform.
function PlanetAnchor({
  x, y, scale, opacity, rotate, children, className,
}: {
  x: MotionValue<number> | MotionValue<string>; y: MotionValue<number> | MotionValue<string>; scale: MotionValue<number>; opacity: MotionValue<number>; rotate?: MotionValue<number>; children: React.ReactNode; className?: string;
}) {
  return (
    // Static CSS centers the anchor point at mid-screen
    <div className="pointer-events-none absolute left-1/2 top-[44%]">
      <motion.div
        className={className}
        style={{
          x, y, scale, opacity,
          ...(rotate !== undefined ? { rotate } : {}),
          // Pull the element back so its own center aligns with the anchor
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AmbientJourney() {
  const { scrollYProgress } = useScroll();
  const s = useSpring(scrollYProgress, { stiffness: 95, damping: 28, mass: 0.28 });

  // ── Ambience ────────────────────────────────────────────────────────────────
  const nebulaScale   = useTransform(s, [0, 1], [0.9, 1.38]);
  const nebulaOpacity = useTransform(s, [0, 0.5, 1], [0.20, 0.52, 1.0]);
  const sunRayOpacity = useTransform(s, [0, 0.3, 0.8, 1], [0.14, 0.30, 0.50, 0.18]);

  // ── Star parallax (3 depth layers) ─────────────────────────────────────────
  const farDrift  = useTransform(s, [0, 1], ["0vh",   "-6vh"]);
  const midDrift  = useTransform(s, [0, 1], ["0vh",  "-16vh"]);
  const nearDrift = useTransform(s, [0, 1], ["0vh",  "-32vh"]);

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
  const rocketOp    = useTransform(s, [0, 0.06, 0.45, 0.88, 1], [0, 0.62, 0.72, 0.52, 0]);

  // ══════════════════════════════════════════════════════════════════════════════
  // PLANET TRANSFORMS
  //
  // Rule: scale is the z-axis (0.02 = distant speck → 2.5 = fills viewport).
  // x/y are small offsets from center — the planet never pans across the screen.
  // At closest approach the planet is LARGER than the viewport.
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Earth: you are launching from home ──────────────────────────────────────
  // Starts close (large), shrinks as you depart, drifts slightly upper-right
  const earthOp = useTransform(s, [0, 0.04, 0.17, 0.25], [0, 0.82, 0.65, 0]);
  const earthSc = useTransform(s, [0, 0.05, 0.17, 0.25], [1.0, 1.15, 0.45, 0.03]);
  const earthX  = useTransform(s, [0, 0.05, 0.17, 0.25], ["8vw",  "8vw",  "18vw",  "30vw"]);
  const earthY  = useTransform(s, [0, 0.05, 0.17, 0.25], ["0vh",  "-2vh", "-10vh", "-22vh"]);

  // ── Mars: first pitstop ──────────────────────────────────────────────────────
  // Tiny speck → rushes at you → fills frame → rockets below-left
  const marsOp = useTransform(s, [0.19, 0.27, 0.33, 0.40, 0.46], [0, 0.50, 0.80, 0.48, 0]);
  const marsSc = useTransform(s, [0.19, 0.33, 0.40, 0.46],        [0.03, 2.2,  0.7,  0.03]);
  const marsX  = useTransform(s, [0.19, 0.33, 0.40, 0.46],        ["6vw",  "0vw",  "-6vw",  "-18vw"]);
  const marsY  = useTransform(s, [0.19, 0.33, 0.40, 0.46],        ["4vh",  "0vh",  "10vh",  "26vh"]);

  // ── Jupiter: second pitstop — orbital pressure ───────────────────────────────
  // Biggest flyby — at peak it fills 2.5× the viewport
  const jupOp = useTransform(s, [0.39, 0.48, 0.55, 0.62, 0.67], [0, 0.45, 0.85, 0.48, 0]);
  const jupSc = useTransform(s, [0.39, 0.55, 0.62, 0.67],        [0.03, 2.6,  0.8,  0.03]);
  const jupX  = useTransform(s, [0.39, 0.55, 0.62, 0.67],        ["7vw",  "0vw",  "-7vw",  "-20vw"]);
  const jupY  = useTransform(s, [0.39, 0.55, 0.62, 0.67],        ["4vh",  "0vh",  "12vh",  "28vh"]);

  // ── Saturn: destination — you fly INTO it ────────────────────────────────────
  // Grows endlessly. Never exits. You arrive here.
  const satOp = useTransform(s, [0.60, 0.70, 0.82, 0.93, 1.0], [0, 0.48, 0.85, 0.90, 0.62]);
  const satSc = useTransform(s, [0.60, 0.82, 0.93, 1.0],        [0.03, 2.0,  3.0,  4.0]);
  const satX  = useTransform(s, [0.60, 0.82, 1.0],              ["6vw",  "2vw",  "0vw"]);
  const satY  = useTransform(s, [0.60, 0.82, 1.0],              ["4vh",  "0vh",  "-2vh"]);
  const satRt = useTransform(s, [0.60, 1.0],                    [-14, 8]);

  return (
    <div className="ambient-stage pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* ── Base deep space ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(circle at 18% 12%, rgba(248,225,108,.10) 0%, transparent 26%)," +
          "radial-gradient(circle at 76% 28%, rgba(0,209,255,.13) 0%, transparent 34%)," +
          "radial-gradient(circle at 54% 58%, rgba(139,92,246,.17) 0%, transparent 42%)," +
          "linear-gradient(180deg,#03040e 0%,#05041a 50%,#010108 100%)",
      }} />

      {/* ── Nebula glow — deepens as journey progresses ─────────────────────── */}
      <motion.div
        className="absolute inset-[-14%] blur-2xl"
        style={{
          opacity: nebulaOpacity,
          scale: nebulaScale,
          background:
            "radial-gradient(ellipse at 70% 28%, rgba(248,225,108,.10) 0%, transparent 30%)," +
            "radial-gradient(ellipse at 30% 68%, rgba(0,209,255,.14) 0%, transparent 34%)," +
            "radial-gradient(ellipse at 52% 50%, rgba(139,92,246,.22) 0%, transparent 48%)",
        }} />

      {/* ── Sun rays from upper-left ─────────────────────────────────────────── */}
      <motion.div className="sun-rays absolute -left-[18vw] -top-[24vh] h-[76vh] w-[82vw]"
        style={{ opacity: sunRayOpacity }} />

      {/* ── Milky Way luminous band (very faint diagonal haze) ───────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "linear-gradient(118deg," +
          "transparent 15%," +
          "rgba(160,185,240,0.028) 32%," +
          "rgba(190,210,255,0.045) 48%," +
          "rgba(160,185,240,0.028) 64%," +
          "transparent 80%)",
        filter: "blur(48px)",
        mixBlendMode: "screen",
      }} />

      {/* ── Galaxy dust — static, no parallax, deepest background ───────────── */}
      <div className="absolute inset-0">
        {galaxyStars.map(st => (
          <span key={st.id}
            className={`star-galaxy absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top,
              width: st.size, height: st.size }} />
        ))}
      </div>

      {/* ── Far stars (barely move — they are distant suns) ──────────────────── */}
      <motion.div style={{ y: farDrift }} className="absolute inset-0">
        {farStars.map(st => (
          <span key={st.id}
            className={`star-dot star-far absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size,
              animationDelay: st.delay, animationDuration: st.dur }} />
        ))}
      </motion.div>

      {/* ── Mid stars ────────────────────────────────────────────────────────── */}
      <motion.div style={{ y: midDrift }} className="absolute inset-0">
        {midStars.map(st => (
          <span key={st.id}
            className={`star-dot star-mid absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size,
              animationDelay: st.delay, animationDuration: st.dur }} />
        ))}
      </motion.div>

      {/* ── Near stars + meteors (fastest layer) ─────────────────────────────── */}
      <motion.div style={{ y: nearDrift }} className="absolute inset-0">
        {nearStars.map(st => (
          <span key={st.id} className="star-dot star-near absolute rounded-full bg-white"
            style={{ left: st.left, top: st.top, width: st.size, height: st.size,
              animationDelay: st.delay, animationDuration: st.dur }} />
        ))}
        {meteors.map(m => (
          <span key={m.id} className={`meteor meteor-${m.dir} absolute h-px rounded-full`}
            style={{ top: m.top, left: m.left, width: m.w,
              animationDelay: m.delay, animationDuration: m.dur }} />
        ))}
      </motion.div>

      {/* ── Bright notable stars — fixed, no parallax, diffraction spikes ────── */}
      <div className="absolute inset-0">
        {brightStars.map(st => (
          <span key={st.id}
            className={`star-bright absolute rounded-full bg-white ${st.col}`}
            style={{ left: st.left, top: st.top, width: st.size, height: st.size,
              animationDelay: st.delay, animationDuration: st.dur }} />
        ))}
      </div>

      {/* ── Warp radial flash ─────────────────────────────────────────────────── */}
      <motion.div style={{ opacity: warpOpacity }} className="absolute inset-0 warp-layer" />

      {/* ══════════════════════════════════════════════════════════════════════════
          PLANETS — all centered, scale = depth (z-axis approach)
          ══════════════════════════════════════════════════════════════════════════ */}

      <PlanetAnchor x={earthX} y={earthY} scale={earthSc} opacity={earthOp}
        className="h-[22rem] w-[22rem] md:h-[42rem] md:w-[42rem]">
        <EarthPlanet />
        <div className="planet-glow planet-glow-earth" />
      </PlanetAnchor>

      <PlanetAnchor x={marsX} y={marsY} scale={marsSc} opacity={marsOp}
        className="h-[22rem] w-[22rem] md:h-[40rem] md:w-[40rem]">
        <MarsPlanet />
        <div className="planet-glow planet-glow-mars" />
      </PlanetAnchor>

      <PlanetAnchor x={jupX} y={jupY} scale={jupSc} opacity={jupOp}
        className="h-[22rem] w-[22rem] md:h-[42rem] md:w-[42rem]">
        <JupiterPlanet />
        <div className="planet-glow planet-glow-jupiter" />
      </PlanetAnchor>

      <PlanetAnchor x={satX} y={satY} scale={satSc} opacity={satOp} rotate={satRt}
        className="h-[22rem] w-[22rem] md:h-[42rem] md:w-[42rem]">
        <SaturnPlanet />
        <div className="planet-glow planet-glow-saturn" />
      </PlanetAnchor>

      {/* ── Spacecraft ───────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute"
        style={{ x: rocketX, y: rocketY, rotate: rocketRot, opacity: rocketOp, width: 96, height: 96 }}
      >
        {/*
          Minimal concept spacecraft — needle profile, nose at top.
          rotate≈50° → nose points upper-right, engine points lower-left.
        */}
        <svg viewBox="0 0 96 120" width="96" height="120" style={{ overflow: "visible" }}>
          <defs>
            {/* Dark stealth hull — carbon fibre look */}
            <linearGradient id="v-hull" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#0d1520" stopOpacity="0.95" />
              <stop offset="30%"  stopColor="#1c2d42" stopOpacity="1.0"  />
              <stop offset="50%"  stopColor="#243650" stopOpacity="1.0"  />
              <stop offset="72%"  stopColor="#182535" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#0a1218" stopOpacity="0.92" />
            </linearGradient>

            {/* Edge highlight — cold blue rim light */}
            <linearGradient id="v-edge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#8ab8e0" stopOpacity="0.90" />
              <stop offset="40%"  stopColor="#5090c0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#2060a0" stopOpacity="0.15" />
            </linearGradient>

            {/* Wing surface */}
            <linearGradient id="v-wing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#141e2e" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0a121c" stopOpacity="0.80" />
            </linearGradient>

            {/* Nose heat glow — kinetic heating from speed */}
            <radialGradient id="v-nose" cx="50%" cy="100%" r="60%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.70" />
              <stop offset="35%"  stopColor="#a0d8ff" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#4090ff" stopOpacity="0"    />
            </radialGradient>

            {/* Plasma engine core */}
            <radialGradient id="v-plasma" cx="50%" cy="25%" r="75%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.0"  />
              <stop offset="22%"  stopColor="#b0f0ff" stopOpacity="0.95" />
              <stop offset="50%"  stopColor="#40c8ff" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0060e0" stopOpacity="0"    />
            </radialGradient>

            {/* Engine exhaust — long focused plume */}
            <linearGradient id="v-exhaust" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#c0f0ff" stopOpacity="0.95" />
              <stop offset="15%"  stopColor="#60d0ff" stopOpacity="0.75" />
              <stop offset="45%"  stopColor="#2090e0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0050c0" stopOpacity="0"    />
            </linearGradient>

            <filter id="v-f-plasma" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="v-f-exhaust" x="-80%" y="0%" width="260%" height="120%">
              <feGaussianBlur stdDeviation="3 2" />
            </filter>
            <filter id="v-f-nose" x="-150%" y="-50%" width="400%" height="250%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="v-f-wing-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {/* ── Exhaust plume — painted first (behind hull) ── */}
          <ellipse cx="48" cy="106" rx="5" ry="22"
            fill="url(#v-exhaust)" filter="url(#v-f-exhaust)" />
          {/* tight bright core */}
          <ellipse cx="48" cy="100" rx="2.5" ry="8"
            fill="#c0f0ff" fillOpacity="0.88" />

          {/* ── Wing glow edge (subtle) ── */}
          <path d="M 40,62 L 8,86 L 38,72 Z"
            fill="#1a3050" filter="url(#v-f-wing-glow)" opacity="0.6" />
          <path d="M 56,62 L 88,86 L 58,72 Z"
            fill="#1a3050" filter="url(#v-f-wing-glow)" opacity="0.6" />

          {/* ── Left swept delta wing ── */}
          <path d="M 40,62 L 6,88 L 38,74 Z" fill="url(#v-wing)" />
          {/* wing leading edge highlight */}
          <path d="M 40,62 L 6,88"
            stroke="#3060a0" strokeWidth="0.8" strokeOpacity="0.55" fill="none" />

          {/* ── Right swept delta wing ── */}
          <path d="M 56,62 L 90,88 L 58,74 Z" fill="url(#v-wing)" />
          <path d="M 56,62 L 90,88"
            stroke="#3060a0" strokeWidth="0.8" strokeOpacity="0.55" fill="none" />

          {/* ── Main needle fuselage ── */}
          <path d="
            M 48,4
            C 52,4  56,14  56,34
            C 56,52  54,66  52,78
            L 48,84
            L 44,78
            C 42,66  40,52  40,34
            C 40,14  44,4   48,4 Z
          " fill="url(#v-hull)" />

          {/* ── Left hull edge highlight ── */}
          <path d="M 48,5 C 42,5 40,14 40,34 C 40,52 42,66 44,78"
            stroke="url(#v-edge)" strokeWidth="0.9" fill="none" strokeOpacity="0.7" />

          {/* ── Small canard fins near nose ── */}
          <path d="M 43,32 L 28,38 L 40,36 Z" fill="#1c2c40" fillOpacity="0.90" />
          <path d="M 53,32 L 68,38 L 56,36 Z" fill="#1c2c40" fillOpacity="0.90" />
          {/* canard edge lines */}
          <path d="M 43,32 L 28,38" stroke="#4080b0" strokeWidth="0.6" strokeOpacity="0.50" fill="none" />
          <path d="M 53,32 L 68,38" stroke="#4080b0" strokeWidth="0.6" strokeOpacity="0.50" fill="none" />

          {/* ── Nose heat glow (blurred) ── */}
          <ellipse cx="48" cy="8" rx="10" ry="6"
            fill="url(#v-nose)" filter="url(#v-f-nose)" />

          {/* ── Engine bell ── */}
          <ellipse cx="48" cy="82" rx="7" ry="4" fill="#0a1520" />
          <ellipse cx="48" cy="82" rx="5" ry="2.8" fill="#060e18" />

          {/* ── Plasma engine glow (large blurred halo) ── */}
          <ellipse cx="48" cy="85" rx="14" ry="9"
            fill="url(#v-plasma)" filter="url(#v-f-plasma)" />
          {/* tight inner plasma */}
          <ellipse cx="48" cy="83" rx="5" ry="3.5"
            fill="url(#v-plasma)" opacity="0.95" />
        </svg>
      </motion.div>

      {/* ── Vignette ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,transparent_28%,rgba(3,7,18,.50)_65%,rgba(3,7,18,.88)_100%)]" />
    </div>
  );
}
