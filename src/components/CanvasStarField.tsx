"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

// ── Star colors — mostly white, only subtle tints. Vivid colors look like
//    particles on canvas. Real stars are near-white; tint is barely perceptible.
function pickColor(): string {
  const r = Math.random();
  if (r < 0.55) return "#ffffff";   // pure white         — majority
  if (r < 0.72) return "#f0f4ff";   // very faint blue    — blue-white
  if (r < 0.84) return "#fff9f0";   // very faint warm    — yellow-white
  if (r < 0.92) return "#e8f0ff";   // pale blue          — hot star
  if (r < 0.97) return "#fff4e8";   // pale amber         — cool star
  return "#ffe8e0";                  // barely-pink-white  — red giant (rare)
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  phase: number;        // twinkle phase offset (0–2π)
  twinkleSpeed: number; // how fast it pulses
}

const NUM_STARS   = 1400; // dense enough to feel like deep space
const PERSPECTIVE = 480;   // focal length — higher = less fisheye
const MAX_Z       = 1000;  // depth of the star field
const SPEED       = 1400;  // z-units covered in a full scroll

export function CanvasStarField({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);
  const starsRef  = useRef<Star[]>([]);
  const rafRef    = useRef<number>(0);

  // Subscribe to smoothed scroll spring — zero React re-renders
  useEffect(() => {
    return scrollProgress.on("change", (v) => {
      scrollRef.current = v;
    });
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Seed the star field ───────────────────────────────────────────────────
    starsRef.current = Array.from({ length: NUM_STARS }, () => ({
      x:            (Math.random() - 0.5) * MAX_Z * 3.2,
      y:            (Math.random() - 0.5) * MAX_Z * 3.2,
      z:            Math.random() * MAX_Z,
      size:         Math.random() * 0.9 + 0.18,
      color:        pickColor(),
      phase:        Math.random() * Math.PI * 2,
      twinkleSpeed: 0.0004 + Math.random() * 0.0008, // gentle, not jittery
    }));

    // ── Resize handler ────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────────────
    const render = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      // Vanishing point — fixed screen center (matches PlanetAnchor's top-[44%])
      const cx = w * 0.50;
      const cy = h * 0.44;

      ctx.clearRect(0, 0, w, h);

      const zOffset = scrollRef.current * SPEED;

      for (const star of starsRef.current) {
        // Effective depth — wrapped so the field is infinite
        let z = ((star.z - zOffset) % MAX_Z + MAX_Z) % MAX_Z;
        if (z < 1) z = 1;

        // 3D → 2D projection from vanishing point
        const proj = PERSPECTIVE / z;
        const sx   = star.x * proj + cx;
        const sy   = star.y * proj + cy;

        // Cull stars outside viewport
        if (sx < -30 || sx > w + 30 || sy < -30 || sy > h + 30) continue;

        const size = Math.min(star.size * proj, 3.2);
        // Twinkle: gentle sine pulse, stronger for far/small stars
        const twinkleMag = z > 400 ? 0.28 : z > 150 ? 0.14 : 0.04;
        const twinkle    = 1 - twinkleMag + twinkleMag * Math.sin(performance.now() * star.twinkleSpeed + star.phase);
        const opacity    = Math.min(1, (1 - z / MAX_Z) * 1.5 + 0.04) * twinkle;
        const alpha   = Math.floor(opacity * 255).toString(16).padStart(2, "0");


        // ── Star dot ──────────────────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${alpha}`;
        ctx.fill();

        // Very faint glow — only for closest brightest stars
        if (size > 1.8 && opacity > 0.75) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}0e`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
    />
  );
}
