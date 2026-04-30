"use client";

/**
 * Photorealistic CSS planets — layered gradients, strong directional lighting,
 * atmospheric rims, and detailed surface features.
 * Sun is always upper-left. Shadow falls to lower-right.
 */

// ─── Shared shadow depths ─────────────────────────────────────────────────────
const SHADOW_DEEP = `
  inset -88px -38px 130px rgba(0,0,12,0.97),
  inset -40px -18px 60px  rgba(0,0,30,0.72),
  inset -130px -55px 65px rgba(0,0,20,0.35)
`;

// ─── Earth ────────────────────────────────────────────────────────────────────
export function EarthPlanet({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%" }}>
      {/* Planet body */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        background: `
          radial-gradient(circle at 23% 26%, rgba(255,255,255,0.78) 0%, transparent 6%),
          radial-gradient(ellipse at 17% 32%, rgba(22,85,18,0.92)  0%, transparent 16%),
          radial-gradient(ellipse at 27% 60%, rgba(18,80,14,0.85)  0%, transparent 13%),
          radial-gradient(ellipse at 52% 20%, rgba(36,95,24,0.78)  0%, transparent 9%),
          radial-gradient(ellipse at 57% 42%, rgba(28,88,18,0.90)  0%, transparent 20%),
          radial-gradient(ellipse at 73% 28%, rgba(32,90,20,0.80)  0%, transparent 21%),
          radial-gradient(ellipse at 78% 62%, rgba(80,58,22,0.62)  0%, transparent 9%),
          radial-gradient(ellipse at 48% 90%, rgba(205,220,235,0.75) 0%, transparent 11%),
          radial-gradient(ellipse at 40%  3%, rgba(220,232,248,0.60) 0%, transparent 8%),
          radial-gradient(ellipse at 35% 50%, rgba(0,28,110,0.48)  0%, transparent 18%),
          radial-gradient(ellipse at 62% 68%, rgba(0,22,95,0.40)   0%, transparent 16%),
          radial-gradient(ellipse at 24% 44%,
            #c2dcf8 0%, #1848c0 20%, #082488 52%, #040c4c 78%, #010828 100%)
        `,
        boxShadow: `
          ${SHADOW_DEEP},
          inset 24px 14px 52px rgba(80,160,255,0.07),
          0 0 120px rgba(20,70,240,0.10)
        `,
      }} />

      {/* Cloud layer */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `
          radial-gradient(ellipse at 32% 22%, rgba(255,255,255,0.42) 0%, transparent 18%),
          radial-gradient(ellipse at 64% 44%, rgba(255,255,255,0.32) 0%, transparent 14%),
          radial-gradient(ellipse at 20% 62%, rgba(255,255,255,0.34) 0%, transparent 16%),
          radial-gradient(ellipse at 78% 30%, rgba(255,255,255,0.26) 0%, transparent 12%),
          radial-gradient(ellipse at 50% 78%, rgba(255,255,255,0.22) 0%, transparent 11%)
        `,
      }} />

      {/* Atmospheric rim — blue halo at edge */}
      <div style={{
        position: "absolute", inset: "-3%", borderRadius: "50%", pointerEvents: "none",
        boxShadow: `
          inset 0 0 0 5px  rgba(100,180,255,0.14),
          inset 0 0 0 12px rgba(60,130,255,0.06),
          0 0 28px 8px rgba(60,130,255,0.18)
        `,
      }} />
    </div>
  );
}

// ─── Mars ─────────────────────────────────────────────────────────────────────
export function MarsPlanet({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        background: `
          radial-gradient(circle at 26% 28%, rgba(255,210,165,0.78) 0%, transparent 9%),
          radial-gradient(ellipse at 48% 14%, rgba(205,215,228,0.68) 0%, transparent 8%),
          radial-gradient(ellipse at 30% 52%, rgba(95,28,8,0.72)   0%, transparent 20%),
          radial-gradient(ellipse at 62% 64%, rgba(115,38,14,0.60)  0%, transparent 19%),
          radial-gradient(ellipse at 70% 36%, rgba(130,48,18,0.52)  0%, transparent 16%),
          radial-gradient(ellipse at 20% 70%, rgba(105,32,10,0.48)  0%, transparent 13%),
          radial-gradient(ellipse at 82% 20%, rgba(155,72,28,0.38)  0%, transparent 12%),
          radial-gradient(ellipse at 55% 80%, rgba(80,22,8,0.45)   0%, transparent 12%),
          radial-gradient(ellipse at 40% 38%, rgba(180,100,42,0.28) 0%, transparent 18%),
          radial-gradient(ellipse at 25% 46%,
            #f0c498 0%, #c45820 26%, #883012 52%, #501808 76%, #280c04 100%)
        `,
        boxShadow: `
          ${SHADOW_DEEP},
          inset 16px 10px 40px rgba(255,140,60,0.05),
          0 0 100px rgba(180,60,20,0.08)
        `,
      }} />

      {/* Surface texture overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `
          radial-gradient(ellipse at 36% 26%, rgba(255,205,165,0.22) 0%, transparent 22%),
          radial-gradient(ellipse at 66% 50%, rgba(145,58,20,0.30)   0%, transparent 18%),
          radial-gradient(ellipse at 24% 62%, rgba(125,42,14,0.25)   0%, transparent 15%),
          radial-gradient(ellipse at 72% 74%, rgba(100,35,12,0.28)   0%, transparent 14%)
        `,
      }} />

      {/* North polar cap */}
      <div style={{
        position: "absolute", width: "24%", height: "16%", top: "2%", left: "38%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(225,235,245,0.88) 0%, rgba(200,215,228,0.50) 55%, transparent 100%)",
      }} />

      {/* Thin atmospheric rim — dusty orange */}
      <div style={{
        position: "absolute", inset: "-2%", borderRadius: "50%", pointerEvents: "none",
        boxShadow: "0 0 22px 6px rgba(200,90,30,0.14)",
      }} />
    </div>
  );
}

// ─── Jupiter ──────────────────────────────────────────────────────────────────
export function JupiterPlanet({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%" }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
        background: `
          radial-gradient(circle at 26% 34%, rgba(255,248,220,0.72) 0%, transparent 12%),
          radial-gradient(ellipse at 24% 48%,
            #f8e8c0 0%, #c08850 20%, #885028 46%, #5a2e18 68%, #2c1408 100%)
        `,
        boxShadow: `
          inset -90px -40px 130px rgba(8,3,0,0.96),
          inset -38px -18px 62px  rgba(28,10,4,0.65),
          inset -140px -60px 70px rgba(15,6,2,0.32),
          inset 22px 14px 48px rgba(255,195,100,0.06),
          0 0 110px rgba(200,130,50,0.09)
        `,
      }} />

      {/* Bands — many layers for realism */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `
          repeating-linear-gradient(
            180deg,
            transparent                     0%,
            rgba(168,88,38,0.42)            3.8%,
            rgba(215,158,78,0.30)           7.6%,
            transparent                     11.4%,
            rgba(140,68,30,0.38)            16.2%,
            rgba(205,142,68,0.26)           20.0%,
            transparent                     23.8%,
            rgba(155,78,36,0.36)            28.8%,
            rgba(210,148,72,0.24)           32.6%,
            transparent                     36.4%,
            rgba(130,62,28,0.40)            41.4%,
            rgba(195,132,62,0.28)           45.2%,
            transparent                     49.0%,
            rgba(148,72,34,0.34)            54.0%,
            rgba(206,142,68,0.22)           57.8%,
            transparent                     61.6%,
            rgba(138,66,30,0.36)            66.4%,
            rgba(188,122,58,0.24)           70.2%,
            transparent                     74.0%,
            rgba(128,58,26,0.38)            79.0%,
            rgba(182,118,56,0.20)           82.8%,
            transparent                     86.6%
          )
        `,
      }} />

      {/* Great Red Spot */}
      <div style={{
        position: "absolute", width: "20%", height: "14%", left: "44%", top: "56%",
        borderRadius: "50%", transform: "rotate(-8deg)",
        background: "radial-gradient(ellipse at 36% 38%, rgba(218,90,58,0.95) 0%, rgba(178,58,32,0.78) 50%, transparent 100%)",
      }} />

      {/* Polar darkening */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `
          radial-gradient(ellipse at 50% 0%,  rgba(8,3,0,0.55) 0%, transparent 35%),
          radial-gradient(ellipse at 50% 100%, rgba(8,3,0,0.55) 0%, transparent 35%)
        `,
      }} />
    </div>
  );
}

// ─── Saturn ───────────────────────────────────────────────────────────────────
//
// Z-STACK STRATEGY (avoids clip-path stacking context bugs):
//   z=0  — back ring: FULL ring SVG, no clip-path. Planet body (z=1) naturally
//           occludes it where they overlap.
//   z=1  — planet body: 52%×52% square centered at 50%/50%.
//   z=2  — front arc: SAME ring SVG, clipped to lower arc (y=48%→71%).
//
// Ring SVG: viewBox="0 0 200 60", center (100,30). CSS-positioned at
// width=188%, height=56%, left=-44%, top=22% → rings extend ±61% from
// container center (realistic). ry/rx ≈ 0.31 → ~18° inclination.

export function SaturnPlanet({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>

      {/* ── z=0 : Back ring (full, no clip — planet body occludes it naturally) ── */}
      <SaturnRingSVG id="back" zIndex={0} />

      {/* ── z=1 : Planet body ───────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        width: "52%", height: "52%",  // SQUARE → perfect sphere
        left: "24%",  top: "24%",     // center = 24+26 = 50% both axes ✓
        borderRadius: "50%",
        overflow: "hidden",
        zIndex: 1,
        background: `
          radial-gradient(circle at 27% 29%, rgba(255,248,215,0.78) 0%, transparent 9%),
          radial-gradient(ellipse at 24% 46%,
            #faeac8 0%, #cca870 18%, #987040 44%, #624628 68%, #2e1c0c 100%
          )
        `,
        boxShadow: `
          inset -56px -24px 92px  rgba(6,3,0,0.97),
          inset -22px -10px 42px  rgba(20,9,3,0.64),
          inset  16px  10px 36px  rgba(255,215,128,0.06),
          0 0 80px rgba(192,145,58,0.09)
        `,
      }}>
        {/* Subtle atmospheric bands */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `
            repeating-linear-gradient(180deg,
              transparent          0%,
              rgba(168,122,58,0.18) 9%, transparent 18%,
              rgba(148,104,50,0.14) 27%, transparent 36%,
              rgba(160,114,54,0.16) 45%, transparent 54%
            )
          `,
        }} />
        {/* Ring shadow band across equator */}
        <div style={{
          position: "absolute", left: 0, right: 0, top: "42%", height: "14%",
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.30) 35%, rgba(0,0,0,0.22) 65%, transparent)",
        }} />
      </div>

      {/* ── z=2 : Front arc — lower arc only, clips y=48%→71% ──────────────── */}
      <SaturnRingSVG id="front" zIndex={2}
        clipPath="polygon(0% 48%, 100% 48%, 100% 71%, 0% 71%)" />
    </div>
  );
}

function SaturnRingSVG({
  id, zIndex, clipPath,
}: {
  id: string;
  zIndex: number;
  clipPath?: string;
}) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex,
      ...(clipPath ? { clipPath } : {}),
      overflow: "visible",
    }}>
      {/*
        viewBox "0 0 200 60" — wider than tall, matches actual ring proportions.
        Center at (100, 30). The SVG is NOT square, but the container IS square,
        so we let CSS position it centered with explicit pixel-relative sizing.

        We use a fixed-size SVG (wider than container) centered over the planet.
        Ring bands = stroke-only ellipses (no fill). No radialGradient fill = no dark blob.
        Lighting: left strokes slightly brighter, right side slightly darker via opacity.
      */}
      <svg
        viewBox="0 0 200 60"
        style={{
          position: "absolute",
          // Center SVG over the container. Container is square (100%).
          // SVG is wider than container to let rings extend left/right.
          width: "188%",
          height: "56%",
          left: "-44%",
          top: "22%",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Left-lit stroke gradients — applied per ring via a mask trick:
              use a wide linearGradient to tint each ring's stroke lighter on left, darker on right */}
          <linearGradient id={`${id}-lit`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(255,238,180,1)" />
            <stop offset="28%"  stopColor="rgba(225,195,120,1)" />
            <stop offset="55%"  stopColor="rgba(195,165,88,1)"  />
            <stop offset="78%"  stopColor="rgba(130,108,52,1)"  />
            <stop offset="100%" stopColor="rgba(80,65,28,1)"    />
          </linearGradient>
          <linearGradient id={`${id}-dark`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(230,198,130,1)" />
            <stop offset="35%"  stopColor="rgba(195,162,84,1)"  />
            <stop offset="65%"  stopColor="rgba(148,120,58,1)"  />
            <stop offset="100%" stopColor="rgba(65,50,20,1)"    />
          </linearGradient>
          <linearGradient id={`${id}-cas`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(8,6,2,1)"  />
            <stop offset="100%" stopColor="rgba(4,3,1,1)"  />
          </linearGradient>
        </defs>

        {/* ── D ring (innermost, very faint) ── */}
        <ellipse cx="100" cy="30" rx="32"  ry="10"
          fill="none" stroke={`url(#${id}-dark)`} strokeWidth="2.4" strokeOpacity="0.30" />

        {/* ── C ring ── */}
        <ellipse cx="100" cy="30" rx="37"  ry="11.6"
          fill="none" stroke={`url(#${id}-dark)`} strokeWidth="4.8" strokeOpacity="0.58" />

        {/* ── B ring inner band ── */}
        <ellipse cx="100" cy="30" rx="44"  ry="13.8"
          fill="none" stroke={`url(#${id}-lit)`}  strokeWidth="4.5" strokeOpacity="0.78" />

        {/* ── B ring — main bright ring ── */}
        <ellipse cx="100" cy="30" rx="54"  ry="16.9"
          fill="none" stroke={`url(#${id}-lit)`}  strokeWidth="8.5" strokeOpacity="0.94" />

        {/* ── Cassini Division — dark gap, painted on top of B/A ── */}
        <ellipse cx="100" cy="30" rx="58"  ry="18.2"
          fill="none" stroke={`url(#${id}-cas)`}  strokeWidth="2.8" strokeOpacity="0.92" />

        {/* ── A ring ── */}
        <ellipse cx="100" cy="30" rx="63"  ry="19.7"
          fill="none" stroke={`url(#${id}-dark)`} strokeWidth="7.0" strokeOpacity="0.84" />

        {/* ── F ring (thin outer) ── */}
        <ellipse cx="100" cy="30" rx="66"  ry="20.7"
          fill="none" stroke={`url(#${id}-dark)`} strokeWidth="1.6" strokeOpacity="0.40" />
      </svg>
    </div>
  );
}
