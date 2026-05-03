"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Click shockwave — gravitational rings on every click ──────────────────────
// Pure CSS animation triggered by DOM injection. Zero RAF, zero ongoing cost.
export function useClickShockwave() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // 3 rings with staggered delays
      [0, 80, 170].forEach((delay, ringIdx) => {
        setTimeout(() => {
          const ring = document.createElement("div");
          const size = 10;
          ring.style.cssText = `
            position: fixed;
            left: ${e.clientX - size / 2}px;
            top: ${e.clientY - size / 2}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 1px solid rgba(0,209,255,${0.7 - ringIdx * 0.18});
            pointer-events: none;
            z-index: 9998;
            animation: shockwave ${0.55 + ringIdx * 0.1}s cubic-bezier(0.2,0,0.8,1) forwards;
          `;
          document.body.appendChild(ring);
          ring.addEventListener("animationend", () => ring.remove(), { once: true });
        }, delay);
      });
    };

    window.addEventListener("click", onClick, { passive: true });
    return () => window.removeEventListener("click", onClick);
  }, []);
}

// ── Scramble text on hover — runs for ~250ms on enter, then stops fully ───────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ·0123456789";

export function useScramble(original: string): [string, () => void] {
  const [display, setDisplay] = useState(original);
  const rafRef = useRef<number>(0);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setIsPointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const trigger = () => {
    if (!isPointer) return;
    cancelAnimationFrame(rafRef.current);
    let frame = 0;
    const total = 15;
    const tick = () => {
      frame++;
      const p        = frame / total;
      const revealed = Math.floor(p * original.length);
      setDisplay(
        Array.from(original).map((ch, i) => {
          if (ch === " ") return " ";
          if (i < revealed) return ch;
          return CHARS[Math.floor((performance.now() * (i + 1) * 0.07) % CHARS.length)];
        }).join("")
      );
      if (frame < total) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(original);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  return [display, trigger];
}

// ── Magnetic wrap ─────────────────────────────────────────────────────────────
export function Magnetic({
  children,
  strength = 0.38,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 260, damping: 22 });
  const sy  = useSpring(y, { stiffness: 260, damping: 22 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setIsPointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  if (!isPointer) return <>{children}</>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width  / 2)) * strength);
        y.set((e.clientY - (r.top  + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

// ── Tilt card ─────────────────────────────────────────────────────────────────
export function TiltCard({
  children,
  className,
  style,
  maxTilt = 7,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
}) {
  const ref   = useRef<HTMLDivElement>(null);
  const rotX  = useMotionValue(0);
  const rotY  = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 220, damping: 26 });
  const sRotY = useSpring(rotY, { stiffness: 220, damping: 26 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    setIsPointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        rotateX: isPointer ? sRotX : 0,
        rotateY: isPointer ? sRotY : 0,
        transformPerspective: 900,
      }}
      onMouseMove={isPointer ? (e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        rotY.set( ((e.clientX - r.left) / r.width  - 0.5) * maxTilt * 2);
        rotX.set(-((e.clientY - r.top)  / r.height - 0.5) * maxTilt);
      } : undefined}
      onMouseLeave={isPointer ? () => { rotX.set(0); rotY.set(0); } : undefined}
    >
      {children}
    </motion.div>
  );
}
