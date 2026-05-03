"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DURATION_MS = 2000;
const EXIT_MS     = 550;

export function LaunchPreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting,  setExiting]  = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION_MS, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, EXIT_MS);
        }, 150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: "#030712" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: EXIT_MS / 1000, ease: "easeInOut" }}
    >
      {/* Ambient glow behind name */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "50vw",
          height: "30vh",
          background: "radial-gradient(ellipse at center, rgba(0,209,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 select-none">
        {/* Name */}
        <motion.h1
          className="font-display font-semibold text-white"
          style={{ fontSize: "clamp(2.4rem, 7vw, 3.8rem)", letterSpacing: "-0.01em", lineHeight: 1 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Praveen M J
        </motion.h1>

        {/* Identity line */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
          style={{
            fontFamily: "Orbitron, monospace",
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: "rgba(0,209,255,0.55)",
            fontWeight: 700,
          }}
        >
          7 YEARS IN ORBIT
        </motion.p>

        {/* Progress line */}
        <motion.div
          className="relative overflow-visible rounded-full"
          style={{ width: "clamp(180px, 28vw, 280px)", height: 1.5, background: "rgba(255,255,255,0.07)", marginTop: 8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {/* Tail */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.08, ease: "linear" }}
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0,209,255,0.4) 55%, rgba(0,209,255,0.95) 100%)",
            }}
          />
          {/* Comet head */}
          <motion.div
            animate={{ left: `${progress * 100}%` }}
            transition={{ duration: 0.08, ease: "linear" }}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#ffffff",
              boxShadow: "0 0 6px 2px rgba(0,209,255,0.9), 0 0 18px 5px rgba(0,209,255,0.35)",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
