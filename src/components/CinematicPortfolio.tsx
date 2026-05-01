"use client";

import { AnimatePresence, motion, useInView, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, GraduationCap, Heart, Linkedin, Mail, Menu, MoveDown, Paintbrush, Rocket, Sparkles, Telescope, X } from "lucide-react";
import {
  contributionMix,
  creativeCards,
  creativeWorks,
  happyFoxMetrics,
  happyFoxMilestones,
  niyataData,
  niyataMetrics,
  resilioData,
  navItems,
  packgineCapabilities,
  packgineMetrics,
} from "@/lib/content";
import { AmbientJourney } from "./AmbientJourney";
import { Section } from "./Section";
import { cn } from "@/lib/utils";

// ─── CountUp — animates a numeric string when it enters the viewport ──────────
function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    // Match leading number: "300+" → [300, "+"], "3 yrs" → [3, " yrs"]
    const m = value.match(/^(\d+)(.*)/);
    if (!m) return; // e.g. "4s → 255ms" — just show as-is
    const target = parseInt(m[1]);
    const suffix = m[2];
    const duration = 1100;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(`${Math.round(eased * target)}${suffix}`);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref} className={className}>{display}</span>;
}

// ─── WordReveal — Apple-style word-by-word stagger on scroll ─────────────────
function WordReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.055, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block"
          style={{ marginRight: "0.26em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Top navigation ───────────────────────────────────────────────────────────
function NavLink({ item, active, onClick }: { item: typeof navItems[number]; active?: boolean; onClick?: () => void }) {
  if (item.glow) {
    return (
      <a
        href={item.href}
        onClick={onClick}
        className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition"
        style={{
          background: "linear-gradient(90deg, rgba(0,209,255,0.15), rgba(255,107,107,0.15))",
          border: "1px solid rgba(0,209,255,0.30)",
          color: "#c0f8f0",
          boxShadow: "0 0 12px rgba(0,209,255,0.18), 0 0 24px rgba(0,209,255,0.08)",
        }}
      >
        <Sparkles size={12} style={{ color: "#00D1FF" }} />
        {item.label}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(0,209,255,0.08), rgba(255,107,107,0.08))",
            animation: "creativity-pulse 3s ease-in-out infinite",
          }}
        />
      </a>
    );
  }
  return (
    <a
      href={item.href}
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-2 text-xs font-medium transition",
        active
          ? "bg-white/12 text-white"
          : "text-starlight/70 hover:bg-white/10 hover:text-white"
      )}
    >
      {item.label}
    </a>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");
  const close = () => setOpen(false);

  useEffect(() => {
    const ids = navItems.map(item => item.href.slice(1));
    const observers: IntersectionObserver[] = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHref(`#${id}`); },
        { threshold: 0.25, rootMargin: "-10% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-8">
      {/* ── Main bar ── */}
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3">
        <a href="#hero" onClick={close} className="font-display text-sm font-semibold text-white">
          Praveen M J
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => <NavLink key={item.href} item={item} active={activeHref === item.href} />)}
        </div>

        {/* Right group: email + hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="mailto:pravinmj.cs@gmail.com"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-abyss transition hover:scale-105"
            aria-label="Email Praveen"
          >
            <Mail size={16} />
          </a>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:bg-white/14 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl px-4 py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} onClick={close} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Comet progress ───────────────────────────────────────────────────────────
function CometProgress() {
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 130, damping: 32 });
  const pct = useTransform(spring, [0, 1], [0, 100]);
  const headLeft = useMotionTemplate`${pct}%`;

  return (
    <div
      className="fixed left-0 top-0 z-[70] w-full pointer-events-none"
      style={{ height: "16px", overflow: "hidden" }}
    >
      <motion.div style={{ left: headLeft, width: 0 }} className="absolute top-0">
        <svg
          style={{ position: "absolute", right: 0, top: 0, display: "block", overflow: "visible" }}
          width={420} height={16}
          viewBox="0 0 420 16"
        >
          <defs>
            <linearGradient id="cp-mask-g" gradientUnits="userSpaceOnUse"
              x1="414" y1="0" x2="0" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="1" />
              <stop offset="55%"  stopColor="white" stopOpacity="0.55" />
              <stop offset="82%"  stopColor="white" stopOpacity="0.08" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="cp-tail-mask">
              <rect x="0" y="0" width="420" height="16" fill="url(#cp-mask-g)" />
            </mask>
            <linearGradient id="cp-dust" gradientUnits="userSpaceOnUse" x1="414" y1="8" x2="0" y2="8">
              <stop offset="0%"   stopColor="#c8f8e8" stopOpacity="0.90" />
              <stop offset="12%"  stopColor="#a0edd8" stopOpacity="0.65" />
              <stop offset="40%"  stopColor="#60d0b8" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#30b0a0" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="cp-ion" gradientUnits="userSpaceOnUse" x1="414" y1="8" x2="0" y2="8">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.0" />
              <stop offset="7%"   stopColor="#c8fff8" stopOpacity="0.92" />
              <stop offset="22%"  stopColor="#80eeff" stopOpacity="0.68" />
              <stop offset="55%"  stopColor="#38ccff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0090ff" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="cp-spine" gradientUnits="userSpaceOnUse" x1="410" y1="0" x2="200" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0.80" />
              <stop offset="40%"  stopColor="white" stopOpacity="0.35" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="cp-coma" cx="55%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="1.0" />
              <stop offset="22%"  stopColor="#80ffd0" stopOpacity="1.0" />
              <stop offset="48%"  stopColor="#00e070" stopOpacity="0.80" />
              <stop offset="72%"  stopColor="#00a850" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#006030" stopOpacity="0" />
            </radialGradient>
            <filter id="cp-f-dust" x="-2%" y="-60%" width="104%" height="220%">
              <feGaussianBlur stdDeviation="2.5 2" />
            </filter>
            <filter id="cp-f-ion" x="-1%" y="-40%" width="102%" height="180%">
              <feGaussianBlur stdDeviation="1 0.8" />
            </filter>
            <filter id="cp-f-coma" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <g mask="url(#cp-tail-mask)">
            <path d="M 0,8  L 414,0  L 414,16  Z" fill="url(#cp-dust)" filter="url(#cp-f-dust)" />
            <path d="M 0,8  L 414,4  L 414,12  Z" fill="url(#cp-ion)"  filter="url(#cp-f-ion)"  />
            <line x1="410" y1="8" x2="200" y2="8" stroke="url(#cp-spine)" strokeWidth="0.8" strokeLinecap="round" />
          </g>
          <ellipse cx="404" cy="8" rx="30" ry="8"  fill="url(#cp-coma)" filter="url(#cp-f-coma)" />
          <ellipse cx="410" cy="8" rx="12" ry="7"  fill="url(#cp-coma)" opacity="0.95" />
          <circle  cx="416" cy="8" r="4" fill="white" />
          <circle  cx="416" cy="8" r="2" fill="#c0ffe8" />
        </svg>
      </motion.div>
    </div>
  );
}

// ─── Hero / Origin ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative z-10 flex min-h-svh items-center px-5 pb-16 pt-28 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
          <div
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm text-starlight/85 backdrop-blur-md"
            style={{
              border: "1px solid rgba(255,255,255,0.18)",
              background: "linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.09) 100%)",
              boxShadow: "0 1px 0 0 rgba(255,255,255,0.18) inset, 0 -1px 0 0 rgba(0,0,0,0.25) inset, 0 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            {/* gloss sheen — top highlight */}
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-[45%] rounded-t-full"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 100%)",
              }}
            />
            {/* full-pill shine sweep — left → right like a gleam */}
            <span
              className="glass-sweep pointer-events-none absolute inset-y-0 left-0"
              style={{
                width: "45%",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.18) 70%, transparent 100%)",
                filter: "blur(2px)",
              }}
            />
            <Telescope size={16} className="relative text-reef" />
            <span className="relative">Building beyond the known orbit</span>
          </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-7 max-w-5xl font-display text-4xl font-semibold leading-[0.92] text-white sm:text-5xl md:text-7xl lg:text-8xl"
          >
            From Code to Creativity to Systems.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.48, ease: "easeOut" }}
          >
            <p className="mt-6 max-w-2xl text-lg leading-8 text-starlight/78 sm:text-xl md:text-2xl">
              Backend Engineer <span className="text-reef">→</span> Technical Lead{" "}
              <span className="text-reef">→</span> Founding Technical / Product Architect.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-starlight/58 sm:text-base sm:leading-7">
              I don&apos;t just write code. I turn complexity into systems people can depend on.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.64, ease: "easeOut" }}
            className="orbit-chip mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-xs text-starlight/68 sm:text-sm"
            style={{ width: "fit-content" }}
          >
            <GraduationCap size={15} className="text-sunlit shrink-0" />
            <span>M.E. Computer Science · Sai Ram Engineering College</span>
            <span className="text-white/30 hidden xs:inline">·</span>
            <span className="hidden xs:inline">IIT Madras origin</span>
            <span className="text-white/30">·</span>
            <span className="text-reef">7+ years in orbit</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.78, ease: "easeOut" }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <a
              href="#packgine"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-abyss transition hover:scale-[1.02]"
            >
              Explore the journey <MoveDown size={16} />
            </a>
            <a
              href="https://github.com/pravinmj-cs/"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              <Github size={16} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/pravin-mj-6314ab197/"
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              <Linkedin size={16} /> LinkedIn
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="glass relative overflow-hidden rounded-[2rem] p-5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(248,225,108,.22),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(0,209,255,.22),transparent_25%)]" />
          <div className="relative min-h-[22rem] rounded-[1.5rem] border border-white/10 bg-abyss/40 p-6">
            <p className="font-display text-sm uppercase tracking-[0.3em] text-sunlit">Origin signal</p>
            <div className="mt-8 space-y-3 border-l border-white/10 pl-5">
              {[
                { dot: "bg-cyan-400",   label: "Earth",   desc: "Masters · Computer Science"         },
                { dot: "bg-orange-400", label: "Mars",    desc: "Resileo Labs · Niyata · First orbit" },
                { dot: "bg-amber-300",  label: "Jupiter", desc: "HappyFox · Biggest mark"            },
                { dot: "bg-yellow-200", label: "Saturn",  desc: "Packgine · Deep-space mission"       },
              ].map(({ dot, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} />
                  <span className="font-display text-sm font-semibold text-white">{label}</span>
                  <span className="text-xs text-starlight/55">{desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 space-y-4">
              <p className="text-xl font-semibold leading-tight text-white">
                Backend craft, product imagination, and operational systems in one orbit.
              </p>
              <p className="text-sm leading-6 text-starlight/68">
                This portfolio is a story told across planets — each one a chapter of altitude gain,
                from launch to deep-space product architecture.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Journey phases (Resileo Labs + Niyata) ───────────────────────────────────
function MetricCard({ value, label, icon: Icon }: (typeof happyFoxMetrics)[number]) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="text-reef" size={22} />
      <CountUp value={value} className="mt-5 font-display text-4xl font-semibold text-white" />
      <p className="mt-1 text-sm text-starlight/65">{label}</p>
    </div>
  );
}

// ─── Resileo Labs ──────────────────────────────────────────────────────────────
function Resileo() {
  const d = resilioData;
  return (
    <Section
      id="resilio"
      eyebrow={d.eyebrow}
      title={d.title}
      copy={d.copy}
      className="!min-h-0"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55 }}
        className="glass relative overflow-hidden rounded-3xl p-5 md:p-7"
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-75", d.accent)} />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/8 blur-3xl" />
        <div className="relative">
          {/* Role badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-reef">
              <d.icon size={12} />
              Phase 1
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-starlight/50">
              {d.role}
            </span>
          </div>
          {/* Subphase cards */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {d.subphases.map((sub, i) => (
              <motion.div
                key={sub.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.10 }}
                className="rounded-2xl border border-white/10 bg-abyss/30 p-4 backdrop-blur"
              >
                <p className="font-display text-base font-semibold text-white">{sub.title}</p>
                <p className="mt-2 text-sm leading-6 text-starlight/65">{sub.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

// ─── Niyata ────────────────────────────────────────────────────────────────────
function Niyata() {
  const d = niyataData;
  return (
    <Section
      id="niyata"
      eyebrow={d.eyebrow}
      title={d.title}
      copy={d.copy}
    >
      <div className="grid gap-4">
        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {niyataMetrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <CountUp value={m.value} className="font-display text-2xl font-semibold text-white" />
              <p className="mt-1 text-xs text-starlight/60">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Subphase cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.10 }}
          className="glass relative overflow-hidden rounded-3xl p-5 md:p-7"
        >
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-75", d.accent)} />
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/8 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
                <d.icon size={12} />
                Phase 2
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-starlight/50">
                {d.role}
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {d.subphases.map((sub, i) => (
                <motion.div
                  key={sub.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-abyss/30 p-4 backdrop-blur"
                >
                  <p className="font-display text-base font-semibold text-white">{sub.title}</p>
                  <p className="mt-2 text-sm leading-6 text-starlight/65">{sub.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── HappyFox ─────────────────────────────────────────────────────────────────
function HappyFox() {
  const gratitude = (
    <div className="mt-10 border-t border-white/8 pt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-starlight/35">
        With gratitude
      </p>
      <p className="mt-3 text-xs leading-6 text-starlight/50">
        I genuinely had the best — the kind you don&apos;t fully appreciate until
        you&apos;ve seen the alternative.{" "}
        <span className="text-starlight/72">Pradeep (CTO)</span> and{" "}
        <span className="text-starlight/72">Suresh (EM)</span> trusted me with
        decisions before I had the title to justify them. The fellow dev team and
        the operations crew made the work feel like something worth doing. The list
        of names is long. That&apos;s the point.
      </p>
    </div>
  );

  return (
    <Section
      id="happyfox"
      eyebrow="Jupiter · Orbital pressure"
      title="HappyFox: where depth became identity."
      copy="The largest planet. The strongest gravity. The biggest transformation. I entered as a Backend Engineer. Two years later: Technical Lead. But the real shift wasn't the title — it was what I became capable of seeing."
      leftSlot={gratitude}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {happyFoxMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-5 glass rounded-2xl p-5">
        <h3 className="font-display text-xl font-semibold text-white">Contribution mix</h3>
        <div className="mt-5 grid gap-3">
          {contributionMix.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-starlight/78">{item.label}</span>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {happyFoxMilestones.map((item) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            className="glass rounded-2xl p-5"
          >
            <item.icon className="text-sunlit" size={22} />
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-starlight/68">{item.body}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

// ─── Wedding invite — elevated 3D presentation ───────────────────────────────
function WeddingInvite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerW = useContainerWidth(containerRef);

  // Bokeh sampled from invite palette: deep navy, warm gold, soft pink
  const bokeh = [
    { left: "10%", top: "15%", size: 48, color: "rgba(255,200,100,0.18)" },  // gold
    { left: "82%", top: "10%", size: 32, color: "rgba(255,140,170,0.16)" },  // pink
    { left: "90%", top: "72%", size: 40, color: "rgba(255,200,100,0.14)" },  // gold
    { left: "14%", top: "80%", size: 28, color: "rgba(255,150,180,0.14)" },  // pink
    { left: "50%", top: "5%",  size: 22, color: "rgba(200,220,255,0.14)" },  // cool white
    { left: "65%", top: "85%", size: 34, color: "rgba(255,200,100,0.12)" },  // gold
  ];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        perspective: "900px",
        perspectiveOrigin: "50% 45%",
        transform: "translateZ(0)",
        background: "radial-gradient(ellipse 100% 90% at 50% 55%, #0c1236 0%, #080d24 50%, #050810 100%)",
        overflow: "hidden",
      }}
    >
      {/* ── Debris particles drifting across the navy background ── */}
      <DebrisLayer containerW={containerW} />

      {/* Bokeh — gold + pink, matching the invite palette */}
      {bokeh.map((b, i) => (
        <div key={i} className="pointer-events-none absolute rounded-full" style={{
          left: b.left, top: b.top,
          width: b.size, height: b.size,
          background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
          filter: "blur(14px)",
          transform: "translate(-50%, -50%)",
        }} />
      ))}

      {/* Warm gold ambient — upper left, as if lit from above */}
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          "radial-gradient(ellipse 50% 55% at 22% 30%, rgba(200,160,60,0.10) 0%, transparent 60%)," +
          "radial-gradient(ellipse 44% 50% at 78% 38%, rgba(220,100,140,0.10) 0%, transparent 60%)",
      }} />

      {/* Floor reflection glow */}
      <div className="pointer-events-none absolute" style={{
        bottom: 0, left: "5%", right: "5%", height: "18%",
        background: "radial-gradient(ellipse 85% 100% at 50% 100%, rgba(160,120,60,0.14) 0%, transparent 70%)",
        filter: "blur(14px)",
      }} />

      {/* ── Portrait card — back-left ── */}
      {/* Outer div: 3D rotation fixed. Inner div: Y float only */}
      <div className="absolute" style={{
        width: "42%", left: "4%", top: "50%",
        transform: "translateY(-52%) rotateY(-26deg) rotateX(5deg) rotateZ(-1.5deg) translateZ(-20px)",
        transformStyle: "preserve-3d",
        filter: "brightness(0.86) saturate(0.88)",
      }}>
        <div style={{ animation: "wedding-bob-back 9s ease-in-out infinite" }}>
          <div style={{
            borderRadius: "10px", overflow: "hidden", position: "relative",
            boxShadow:
              "0 2px 5px rgba(0,0,0,0.45)," +
              "0 10px 24px rgba(0,0,0,0.62)," +
              "0 28px 56px rgba(0,0,0,0.68)," +
              "0 40px 72px rgba(160,120,40,0.18)",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/creative/wedding-portrait.jpg" alt="Wedding invite" style={{ width: "100%", display: "block" }} />
            <div style={{ position:"absolute", inset:0, pointerEvents:"none",
              background:"linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 45%, transparent 65%)" }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"1.5px", pointerEvents:"none",
              background:"linear-gradient(90deg, transparent, rgba(255,220,140,0.55) 35%, rgba(255,255,220,0.75) 55%, rgba(255,220,140,0.40) 80%, transparent)" }} />
          </div>
        </div>
      </div>

      {/* ── Landscape card — front-right ── */}
      <div className="absolute" style={{
        width: "56%", right: "2%", top: "50%",
        transform: "translateY(-48%) rotateY(17deg) rotateX(-4deg) rotateZ(1deg) translateZ(28px)",
        transformStyle: "preserve-3d",
      }}>
        <div style={{ animation: "wedding-bob-front 9s ease-in-out infinite 1.1s" }}>
          <div style={{
            borderRadius: "10px", overflow: "hidden", position: "relative",
            boxShadow:
              "0 2px 5px rgba(0,0,0,0.40)," +
              "0 12px 28px rgba(0,0,0,0.58)," +
              "0 32px 64px rgba(0,0,0,0.65)," +
              "0 46px 80px rgba(200,100,120,0.16)",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/creative/wedding-landscape.png" alt="Wedding reception card" style={{ width: "100%", display: "block" }} />
            <div style={{ position:"absolute", inset:0, pointerEvents:"none",
              background:"linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 38%, transparent 58%)" }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"1.5px", pointerEvents:"none",
              background:"linear-gradient(90deg, transparent, rgba(255,220,140,0.45) 28%, rgba(255,255,220,0.72) 52%, rgba(255,220,140,0.35) 78%, transparent)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PyCon — asteroid belt ────────────────────────────────────────────────────
const STICKER_COUNT = 11;

function sr(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

// Belt lanes: far (top) → near (bottom). Near = bigger, faster (Kepler's law)
type BeltItem = {
  id: number; src: string;
  beltY: number;       // vertical position in belt 0–100%
  size: number;        // px
  speed: number;       // seconds to cross full width
  startFrac: number;   // 0–1 initial x offset (so they're spread on load)
  rotDir: number;      // +1 / -1
  rotPeriod: number;   // seconds per full tumble
  wobbleAmp: number;   // vertical wobble px
  wobblePeriod: number;
};

const beltItems: BeltItem[] = Array.from({ length: STICKER_COUNT }, (_, i) => {
  const r = sr(i * 53 + 17);
  // Spread stickers across the FULL Y range so every one gets its own lane.
  // Use a jittered grid: divide 0-100% into 11 equal slots, then nudge randomly.
  const slotH = 88 / STICKER_COUNT; // 88% total span, leaving 6% margin top/bottom
  const beltY = 6 + i * slotH + r() * slotH * 0.7; // jitter within slot

  // Depth derived from Y — lower on screen = closer = bigger, faster, brighter
  const depth = beltY / 94; // 0 (top/far) → 1 (bottom/near)

  const size  = 42 + depth * 92 + r() * 18;        // 42px far → ~140px near
  const speed = 32 - depth * 22 + r() * 8;         // 32s far  →  10s near
  const startFrac = i / STICKER_COUNT;              // evenly spaced so all 11 visible at once

  return {
    id: i,
    src: `/stickers/${i + 1}.png`,
    beltY,
    size,
    speed,
    startFrac,
    rotDir:       r() > 0.5 ? 1 : -1,
    rotPeriod:    28 - depth * 16 + r() * 8,        // far tumbles slow, near fast
    wobbleAmp:    2  + depth * 8  + r() * 4,
    wobblePeriod: 3  + r() * 5,
  };
});

// Debris — tiny rock dust particles, reflected sunlight style (bright specks not dark shapes)
const debrisRocks = Array.from({ length: 200 }, (_, i) => {
  const r = sr(i * 23 + 5);
  const tier = r() < 0.40 ? "far" : r() < 0.75 ? "mid" : "near";
  // Very small — debris should read as texture, not individual objects
  const w = tier === "far" ? 0.8 + r() * 1.4   // 0.8–2.2px
          : tier === "mid" ? 1.6 + r() * 2.4   // 1.6–4px
          :                  2.5 + r() * 3.5;   // 2.5–6px
  // Slightly elongated horizontally — travel motion feel
  const h = w * (0.4 + r() * 0.45);
  // Rock reflects sunlight — off-white, warm light grey, pale stone
  const color = r() < 0.30 ? "#c8c0b0"   // warm off-white
              : r() < 0.55 ? "#b0a898"   // stone grey
              : r() < 0.75 ? "#d4cec4"   // pale chalk
              : r() < 0.90 ? "#9c9488"   // mid warm grey
              :               "#e2ddd8";  // almost white
  return {
    id: i,
    beltY: tier === "far" ? 14 + r() * 22 : tier === "mid" ? 36 + r() * 22 : 58 + r() * 24,
    w, h, color,
    speed: tier === "far" ? 34 + r() * 20 : tier === "mid" ? 20 + r() * 12 : 9 + r() * 8,
    startFrac: r(),
    opacity: tier === "far" ? 0.18 + r() * 0.18 : tier === "mid" ? 0.28 + r() * 0.22 : 0.40 + r() * 0.30,
  };
});

function BeltSticker({ item, containerW }: { item: BeltItem; containerW: number }) {
  if (containerW === 0) return null;
  const enter = Math.round(containerW * 0.62);
  const exit  = -enter;
  const kfName = `sticker-drift-${enter}`;
  const depth   = item.beltY / 94;
  const opacity = 0.38 + depth * 0.58;

  return (
    <>
      <style>{`
        @keyframes ${kfName} {
          from { transform: translateY(-50%) translateX(${enter}px); }
          to   { transform: translateY(-50%) translateX(${exit}px); }
        }
      `}</style>
      {/* Horizontal travel — CSS animation on compositor thread */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: `${item.beltY}%`, left: "50%",
          opacity,
          zIndex: Math.round(2 + depth * 3),
          animationName: kfName,
          animationDuration: `${item.speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDelay: `${-(item.startFrac * item.speed).toFixed(2)}s`,
        }}
      >
        {/* Tumble + wobble — Framer Motion, no containerW dependency */}
        <motion.div
          style={{ translateX: "-50%", translateY: "-50%" }}
          animate={{
            rotate: [0, item.rotDir * 360],
            y: [0, item.wobbleAmp, -item.wobbleAmp, 0],
          }}
          transition={{
            rotate: { duration: item.rotPeriod, repeat: Infinity, ease: "linear" },
            y:      { duration: item.wobblePeriod, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.src} alt="" style={{ width: item.size, height: item.size, objectFit: "contain", display: "block" }} />
        </motion.div>
      </div>
    </>
  );
}

// Shared hook — measures container width.
// useLayoutEffect for the initial read (avoids 0→real flash before first paint),
// then ResizeObserver for resize-only updates. setW is guarded so it only fires
// when the value actually changes, preventing spurious re-renders.
function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    // Initial synchronous measurement
    const initial = el.getBoundingClientRect().width;
    setW(Math.round(initial));
    // ResizeObserver for subsequent changes only
    const ro = new ResizeObserver(entries => {
      const newW = Math.round(entries[0].contentRect.width);
      setW(prev => prev === newW ? prev : newW);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

// CSS keyframe name injected once — debris runs on compositor thread, zero JS per frame
const DEBRIS_KF = "debris-drift";

function DebrisLayer({ containerW }: { containerW: number }) {
  // Don't render until we have a real measurement
  if (containerW === 0) return null;
  const enter =  Math.round(containerW * 0.62);
  const exit  = -Math.round(containerW * 0.62);
  return (
    <>
      {/* Inject keyframe scoped to measured width */}
      <style>{`
        @keyframes ${DEBRIS_KF}-${enter} {
          from { transform: translateY(-50%) translateX(${enter}px); }
          to   { transform: translateY(-50%) translateX(${exit}px);  }
        }
      `}</style>
      {debrisRocks.map(rock => (
        <div key={rock.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            top: `${rock.beltY}%`, left: "50%",
            width: rock.w, height: rock.h,
            background: rock.color,
            opacity: rock.opacity,
            animationName: `${DEBRIS_KF}-${enter}`,
            animationDuration: `${rock.speed}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDelay: `${-(rock.startFrac * rock.speed).toFixed(2)}s`,
          }}
        />
      ))}
    </>
  );
}

function StickerAquarium() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerW = useContainerWidth(containerRef);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ overflow: "hidden", transform: "translateZ(0)" }}>

      {/* ── Deep space fill — matches card bg so no hard edge ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "rgba(3,7,18,0.88)",
      }} />

      {/* ── Cold deep-space — faint blue-white nebula hints only ── */}
      <div className="pointer-events-none absolute" style={{
        top: "-20%", left: "-20%", width: "60%", height: "60%",
        background: "radial-gradient(circle, rgba(160,190,255,0.06) 0%, transparent 65%)",
        filter: "blur(30px)",
      }} />

      {/* ── Background stars — faint deep-field ── */}
      {Array.from({ length: 55 }, (_, i) => {
        const r = sr(i * 41 + 99);
        const bright = r() > 0.88;
        return <div key={i} className="pointer-events-none absolute rounded-full" style={{
          left: `${r() * 100}%`, top: `${r() * 100}%`,
          width:  bright ? r() * 2.0 + 1.2 : r() * 1.2 + 0.4,
          height: bright ? r() * 2.0 + 1.2 : r() * 1.2 + 0.4,
          background: "#fff",
          opacity: bright ? 0.55 + r() * 0.35 : 0.06 + r() * 0.18,
          boxShadow: bright ? `0 0 4px 1px rgba(220,235,255,0.50)` : "none",
        }} />;
      })}

      {/* ── Micro-dust — almost invisible cool haze, no colour cast ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 100% 40% at 50% 52%, rgba(180,185,200,0.025) 0%, transparent 100%)",
      }} />

      {/* ── Debris particles ── */}
      <DebrisLayer containerW={containerW} />

      {/* ── Sticker asteroids — near ones big & fast, far ones tiny & slow ── */}
      {beltItems.map(item => <BeltSticker key={item.id} item={item} containerW={containerW} />)}

      {/* ── Edge vignette — soft frame, top/bottom heavy to draw eye to belt ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          "linear-gradient(180deg, rgba(3,7,18,0.82) 0%, transparent 22%, transparent 78%, rgba(3,7,18,0.82) 100%)," +
          "linear-gradient(90deg,  rgba(3,7,18,0.55) 0%, transparent 16%, transparent 84%, rgba(3,7,18,0.55) 100%)",
      }} />
    </div>
  );
}

// ─── Packgine UI — 3D cylindrical carousel ───────────────────────────────────
const PACKGINE_SCREENS = [
  "/creative/packgine-1.png",
  "/creative/packgine-2.png",
  "/creative/packgine-3.png",
  "/creative/packgine-4.png",
  "/creative/packgine-5.png",
  "/creative/packgine-6.png",
];
const N = PACKGINE_SCREENS.length;
const STEP = 360 / N; // 60deg per frame

function PackgineCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerW = useContainerWidth(containerRef);

  // Wait for real measurement before rendering to avoid animation restart flash
  const cardW  = containerW === 0 ? 0 : Math.round(containerW * 0.38);
  const cardH  = Math.round(cardW * 0.625);
  const radius = Math.round(cardW * 1.45);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ overflow: "hidden", transform: "translateZ(0)" }}>

      {/* ── Space background ── */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 110% 110% at 48% 52%, #09091f 0%, #050510 55%, #030308 100%)",
      }} />
      {/* Cool blue-purple nebula wisp */}
      <div className="pointer-events-none absolute" style={{
        top: "-10%", right: "-10%", width: "55%", height: "55%",
        background: "radial-gradient(circle, rgba(120,90,255,0.09) 0%, transparent 65%)",
        filter: "blur(22px)",
      }} />
      <div className="pointer-events-none absolute" style={{
        bottom: "-10%", left: "-5%", width: "45%", height: "45%",
        background: "radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 65%)",
        filter: "blur(20px)",
      }} />

      {/* Background stars */}
      {Array.from({ length: 48 }, (_, i) => {
        const r = sr(i * 37 + 77);
        const bright = r() > 0.90;
        return <div key={i} className="pointer-events-none absolute rounded-full" style={{
          left: `${r() * 100}%`, top: `${r() * 100}%`,
          width: bright ? r() * 1.8 + 1.0 : r() * 1.0 + 0.4,
          height: bright ? r() * 1.8 + 1.0 : r() * 1.0 + 0.4,
          background: "#fff",
          opacity: bright ? 0.60 + r() * 0.30 : 0.06 + r() * 0.16,
          boxShadow: bright ? "0 0 3px 1px rgba(200,220,255,0.45)" : "none",
        }} />;
      })}

      {/* ── Debris drift ── */}
      <DebrisLayer containerW={containerW} />

      {/* ── 3D cylindrical carousel — only render once width is known ── */}
      {containerW > 0 && <div style={{
        position: "absolute", inset: 0,
        perspective: `${Math.round(containerW * 3.2)}px`,
        perspectiveOrigin: "50% 48%",
      }}>
        <motion.div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 0, height: 0,
            transformStyle: "preserve-3d",
            // slight tilt so it reads as a globe/drum
            rotateX: -8,
          }}
          animate={{ rotateY: [0, -360] }}
          transition={{ duration: 31, repeat: Infinity, ease: "linear" }}
        >
          {PACKGINE_SCREENS.map((src, i) => {
            const angle = i * STEP;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.55)," +
                    "0 12px 32px rgba(0,0,0,0.65)," +
                    "inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {/* Screen glare */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 45%)",
                }} />
              </div>
            );
          })}
        </motion.div>
      </div>}

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          "linear-gradient(180deg, rgba(3,5,16,0.75) 0%, transparent 18%, transparent 82%, rgba(3,5,16,0.75) 100%)," +
          "linear-gradient(90deg,  rgba(3,5,16,0.65) 0%, transparent 14%, transparent 86%, rgba(3,5,16,0.65) 100%)",
      }} />
    </div>
  );
}

// ─── Space Portfolio — telescope targeting scene ─────────────────────────────
function PortfolioSelf() {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerW = useContainerWidth(containerRef);

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ overflow: "hidden", transform: "translateZ(0)" }}>

      {/* Deep space base */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse 120% 120% at 50% 48%, #07091a 0%, #040610 55%, #020308 100%)",
      }} />
      {/* Faint teal nebula upper-right */}
      <div className="pointer-events-none absolute" style={{
        top: "-15%", right: "-10%", width: "55%", height: "55%",
        background: "radial-gradient(circle, rgba(0,209,255,0.07) 0%, transparent 65%)",
        filter: "blur(22px)",
      }} />
      {/* Faint violet lower-left */}
      <div className="pointer-events-none absolute" style={{
        bottom: "-10%", left: "-8%", width: "45%", height: "45%",
        background: "radial-gradient(circle, rgba(120,80,255,0.06) 0%, transparent 65%)",
        filter: "blur(20px)",
      }} />

      {/* Stars */}
      {Array.from({ length: 52 }, (_, i) => {
        const r = sr(i * 61 + 33);
        const bright = r() > 0.88;
        return <div key={i} className="pointer-events-none absolute rounded-full" style={{
          left: `${r() * 100}%`, top: `${r() * 100}%`,
          width:  bright ? r() * 2 + 1.2 : r() * 1 + 0.4,
          height: bright ? r() * 2 + 1.2 : r() * 1 + 0.4,
          background: bright ? "#c8e0ff" : "#fff",
          opacity: bright ? 0.65 + r() * 0.30 : 0.05 + r() * 0.14,
          boxShadow: bright ? "0 0 4px 1px rgba(180,220,255,0.50)" : "none",
        }} />;
      })}

      {/* Debris */}
      <DebrisLayer containerW={containerW} />

      {/* ── Telescope targeting UI ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Scope ring — outer */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: containerW * 0.62, height: containerW * 0.62,
            border: "1px solid rgba(0,209,255,0.18)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        {/* Scope ring — inner, counter-rotate */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: containerW * 0.42, height: containerW * 0.42,
            border: "1px solid rgba(0,209,255,0.28)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />

        {/* Corner tick marks on outer ring — top/right/bottom/left */}
        {[0, 90, 180, 270].map(deg => (
          <motion.div
            key={deg}
            className="absolute"
            style={{
              width: containerW * 0.62, height: containerW * 0.62,
              rotate: deg,
            }}
            animate={{ rotate: [deg, deg + 360] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div style={{
              position: "absolute", top: 0, left: "50%",
              transform: "translateX(-50%)",
              width: 1, height: 8,
              background: "rgba(0,209,255,0.70)",
            }} />
          </motion.div>
        ))}

        {/* Crosshair lines */}
        <div className="absolute" style={{ width: containerW * 0.50, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,209,255,0.30) 30%, rgba(0,209,255,0.55) 50%, rgba(0,209,255,0.30) 70%, transparent)" }} />
        <div className="absolute" style={{ height: containerW * 0.50, width: 1, background: "linear-gradient(180deg, transparent, rgba(0,209,255,0.30) 30%, rgba(0,209,255,0.55) 50%, rgba(0,209,255,0.30) 70%, transparent)" }} />

        {/* Centre target — pulsing locked dot */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 6, height: 6, background: "#00D1FF" }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Outer pulse ring */}
        <motion.div
          className="absolute rounded-full"
          style={{ width: 22, height: 22, border: "1px solid rgba(0,209,255,0.55)" }}
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.8, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />

        {/* SIGNAL LOCKED label */}
        <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <motion.p
            style={{
              marginTop: containerW * 0.25,
              fontFamily: "monospace", fontSize: 9,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "rgba(255,70,70,0.90)",
              textAlign: "center", whiteSpace: "nowrap",
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            ◆ SIGNAL LOCKED
          </motion.p>
        </div>

        {/* Coordinate readouts — corners */}
        {[
          { style: { top: "14%", left: "10%" }, lines: ["RA  07h 45m", "DEC +28° 01′"] },
          { style: { top: "14%", right: "10%", textAlign: "right" as const }, lines: ["ALT  42.3°", "AZM 118.7°"] },
          { style: { bottom: "14%", left: "10%" }, lines: ["OBJ  packgine.com", "DST  0.0 AU"] },
          { style: { bottom: "14%", right: "10%", textAlign: "right" as const }, lines: ["SIG  —▓▓▓▓▓", "SNR  98.4 dB"] },
        ].map((item, i) => (
          <div key={i} className="absolute pointer-events-none" style={{ ...item.style }}>
            {item.lines.map((line, j) => (
              <p key={j} style={{
                margin: 0, fontFamily: "monospace", fontSize: 8,
                letterSpacing: "0.14em", color: "rgba(0,209,255,0.45)",
                textAlign: item.style.textAlign ?? "left",
                lineHeight: 1.7,
              }}>{line}</p>
            ))}
          </div>
        ))}
      </div>

      {/* Edge vignette */}
      <div className="pointer-events-none absolute inset-0" style={{
        background:
          "linear-gradient(180deg, rgba(2,3,8,0.80) 0%, transparent 20%, transparent 80%, rgba(2,3,8,0.80) 100%)," +
          "linear-gradient(90deg,  rgba(2,3,8,0.65) 0%, transparent 14%, transparent 86%, rgba(2,3,8,0.65) 100%)",
      }} />
    </div>
  );
}

// ─── Creative work dummy artwork ─────────────────────────────────────────────
function DummyImage({ id }: { id: string }) {
  if (id === "pycon") return (
    <svg viewBox="0 0 280 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="py-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#0e2240" />
          <stop offset="100%" stopColor="#060d1a" />
        </radialGradient>
      </defs>
      <rect width="280" height="200" fill="url(#py-bg)" />
      {/* Python snake curve */}
      <path d="M 30 120 Q 80 40 140 100 Q 200 160 250 80" fill="none" stroke="#FFE566" strokeWidth="5" strokeLinecap="round" opacity="0.75" />
      {/* Sticker circles */}
      <circle cx="68" cy="68" r="28" fill="#FF6B6B" opacity="0.82" />
      <circle cx="68" cy="68" r="18" fill="#FF9999" opacity="0.6" />
      <circle cx="200" cy="130" r="22" fill="#00D1FF" opacity="0.72" />
      <circle cx="200" cy="130" r="14" fill="#80e8ff" opacity="0.55" />
      <circle cx="148" cy="44" r="16" fill="#8B5CF6" opacity="0.78" />
      {/* Confetti dots */}
      {[[50,155,4,"#FFE566"],[110,170,3,"#FF6B6B"],[170,165,4,"#00D1FF"],[230,155,3,"#8B5CF6"],[260,110,5,"#FFE566"],[20,80,3,"#00D1FF"]].map(([x,y,r,c],i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={c as string} opacity="0.65" />
      ))}
      {/* "PyCon" text hint */}
      <rect x="20" y="175" width="55" height="8" rx="4" fill="rgba(255,229,102,0.35)" />
      <rect x="82" y="175" width="30" height="8" rx="4" fill="rgba(0,209,255,0.25)" />
    </svg>
  );

  if (id === "wedding") return (
    <svg viewBox="0 0 280 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="wed-bg" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#2a1018" />
          <stop offset="100%" stopColor="#0f0608" />
        </radialGradient>
        <radialGradient id="wed-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ff9a7a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="280" height="200" fill="url(#wed-bg)" />
      <ellipse cx="140" cy="100" rx="120" ry="80" fill="url(#wed-glow)" />
      {/* Ornamental frame lines */}
      <rect x="30" y="22" width="220" height="156" rx="4" fill="none" stroke="rgba(255,192,130,0.30)" strokeWidth="1.5" />
      <rect x="38" y="30" width="204" height="140" rx="2" fill="none" stroke="rgba(255,192,130,0.18)" strokeWidth="1" />
      {/* Corner ornaments */}
      {[[38,30],[242,30],[38,170],[242,170]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="rgba(255,192,130,0.50)" />
      ))}
      {/* Floral curves */}
      <path d="M 80 100 Q 100 68 120 100 Q 140 132 160 100 Q 180 68 200 100" fill="none" stroke="rgba(255,160,110,0.55)" strokeWidth="2.5" />
      <path d="M 80 100 Q 100 132 120 100 Q 140 68 160 100 Q 180 132 200 100" fill="none" stroke="rgba(255,200,160,0.35)" strokeWidth="1.5" />
      {/* Heart centre */}
      <path d="M 140 90 C 140 84 132 78 128 84 C 124 90 128 98 140 108 C 152 98 156 90 152 84 C 148 78 140 84 140 90 Z" fill="rgba(255,130,110,0.65)" />
      {/* Calligraphy text hint */}
      <rect x="95" y="150" width="90" height="6" rx="3" fill="rgba(255,192,130,0.28)" />
      <rect x="110" y="160" width="60" height="5" rx="2.5" fill="rgba(255,192,130,0.18)" />
    </svg>
  );

  if (id === "packgine-ui") return (
    <svg viewBox="0 0 280 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pk-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#08091e" />
          <stop offset="100%" stopColor="#0c0820" />
        </linearGradient>
      </defs>
      <rect width="280" height="200" fill="url(#pk-bg)" />
      {/* Sidebar */}
      <rect x="0" y="0" width="52" height="200" fill="rgba(139,92,246,0.10)" />
      <rect x="10" y="18" width="32" height="5" rx="2.5" fill="rgba(139,92,246,0.55)" />
      {[40,56,72,88,104,120].map((y,i) => (
        <rect key={i} x="10" y={y} width={i===1?32:24} height="4" rx="2" fill={i===1?"rgba(0,209,255,0.55)":"rgba(255,255,255,0.18)"} />
      ))}
      {/* Main content area */}
      {/* Top stat cards */}
      {[62,120,178,236].map((x,i) => (
        <g key={i}>
          <rect x={x} y="12" width="50" height="32" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          <rect x={x+6} y="20" width="20" height="3" rx="1.5" fill={["rgba(0,209,255,0.6)","rgba(139,92,246,0.6)","rgba(255,107,107,0.6)","rgba(255,229,102,0.6)"][i]} />
          <rect x={x+6} y="28" width="30" height="8" rx="2" fill="rgba(255,255,255,0.25)" />
        </g>
      ))}
      {/* Chart area */}
      <rect x="62" y="54" width="120" height="80" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {[0,20,40,60,80,100].map((x,i) => {
        const h = [28,44,36,52,40,32][i];
        return <rect key={i} x={72+x} y={54+80-h} width="14" height={h} rx="3" fill={`rgba(${i%2===0?"0,209,255":"139,92,246"},${0.4+i*0.05})`} />;
      })}
      {/* Right panel */}
      <rect x="192" y="54" width="78" height="80" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {[64,76,88,108,120].map((y,i) => (
        <rect key={i} x="200" y={y} width={[52,38,46,52,28][i]} height="5" rx="2.5" fill={i===0?"rgba(0,209,255,0.45)":"rgba(255,255,255,0.15)"} />
      ))}
      {/* Bottom row */}
      {[62,120,178,236].map((x,i) => (
        <rect key={i} x={x} y="144" width="50" height="44" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
      ))}
    </svg>
  );

  // portfolio
  return (
    <svg viewBox="0 0 280 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sp-bg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#05091f" />
          <stop offset="100%" stopColor="#020408" />
        </radialGradient>
        <radialGradient id="sp-glow" cx="38%" cy="32%" r="35%">
          <stop offset="0%" stopColor="rgba(0,209,255,0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="280" height="200" fill="url(#sp-bg)" />
      <rect width="280" height="200" fill="url(#sp-glow)" />
      {/* Stars */}
      {[[22,18],[55,8],[88,24],[130,12],[178,6],[220,20],[258,14],[12,55],[46,70],[95,45],[152,60],[200,48],[245,62],[268,38],[30,100],[72,115],[118,95],[165,108],[210,90],[252,102],[20,148],[64,158],[110,142],[155,162],[200,138],[245,152],[275,168]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i%5===0?1.5:i%3===0?1:0.7} fill="white" opacity={0.2+Math.sin(i)*0.3} />
      ))}
      {/* Saturn */}
      <ellipse cx="210" cy="65" rx="28" ry="28" fill="none" stroke="rgba(255,229,102,0.0)" />
      <circle cx="210" cy="65" r="22" fill="#c8943c" opacity="0.85" />
      <ellipse cx="210" cy="65" rx="42" ry="10" fill="none" stroke="rgba(255,220,100,0.65)" strokeWidth="5" />
      <ellipse cx="210" cy="65" rx="50" ry="12" fill="none" stroke="rgba(200,165,72,0.40)" strokeWidth="3" />
      {/* Comet streak */}
      <path d="M 20 130 L 120 95" stroke="rgba(0,209,255,0.55)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="120" cy="95" r="3.5" fill="white" opacity="0.9" />
      {/* Nebula blob */}
      <ellipse cx="70" cy="150" rx="55" ry="28" fill="rgba(139,92,246,0.12)" filter="url(#sp-blur)" />
    </svg>
  );
}

// Telescope cursor SVG as data URL (44×44, hotspot at 18,18 = lens centre)
const TELESCOPE_CURSOR =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Ccircle cx='18' cy='18' r='12' fill='rgba(0%2C209%2C255%2C0.13)' stroke='%2300D1FF' stroke-width='2.2'/%3E%3Ccircle cx='18' cy='18' r='5' fill='rgba(0%2C209%2C255%2C0.22)'/%3E%3Cline x1='14' y1='18' x2='22' y2='18' stroke='rgba(0%2C209%2C255%2C0.55)' stroke-width='1'/%3E%3Cline x1='18' y1='14' x2='18' y2='22' stroke='rgba(0%2C209%2C255%2C0.55)' stroke-width='1'/%3E%3Cline x1='26.5' y1='26.5' x2='37' y2='37' stroke='%2300D1FF' stroke-width='2.8' stroke-linecap='round'/%3E%3C/svg%3E") 18 18, zoom-in`;

// ─── Creativity — glowing lane ────────────────────────────────────────────────
function Creativity() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile]   = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="creativity" className="section-shell relative z-10 px-5 md:px-8">

      {/* ── Glowing lane header ── */}
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl p-px"
          style={{
            background: "linear-gradient(90deg, rgba(0,209,255,0.55), rgba(255,107,107,0.55), rgba(139,92,246,0.55), rgba(0,209,255,0.55))",
            backgroundSize: "300% 100%",
            animation: "creativity-gradient 6s linear infinite",
          }}
        >
          <div
            className="relative rounded-3xl px-6 py-10 md:px-10 md:py-12"
            style={{
              background: "linear-gradient(135deg, rgba(0,209,255,0.08) 0%, rgba(139,92,246,0.12) 50%, rgba(255,107,107,0.08) 100%), rgba(3,7,18,0.88)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full blur-3xl" style={{ background: "rgba(0,209,255,0.12)" }} />
              <div className="absolute -right-10 top-6 h-40 w-40 rounded-full blur-3xl" style={{ background: "rgba(255,107,107,0.10)" }} />
              <div className="absolute bottom-0 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full blur-3xl" style={{ background: "rgba(139,92,246,0.10)" }} />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ borderColor: "rgba(0,209,255,0.35)", color: "#00D1FF", background: "rgba(0,209,255,0.08)" }}>
                  <Sparkles size={12} />
                  Creative Signal
                </div>
                <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.95] text-white md:text-5xl lg:text-6xl">
                  Code to<br />
                  <span style={{
                    background: "linear-gradient(90deg, #00D1FF, #FF6B6B, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    Canvas.
                  </span>
                </h2>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold text-white/70">
                  ✦ Pre-AI &nbsp;·&nbsp; Pure craft &nbsp;·&nbsp; Manual &nbsp;·&nbsp; Mind it.
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-base leading-7 text-starlight/80">
                  While engineering sharpened my systems thinking,{" "}
                  <span className="text-white font-medium">creativity unlocked how I express them.</span>
                </p>
                <p className="text-sm leading-6 text-starlight/65">
                  At <span style={{ color: "#FF6600" }}>HappyFox</span>, I was given a small opportunity to explore design through the PyCon event team.
                  I didn&apos;t treat it as a side task. I treated it as a new dimension — and squeezed every ounce
                  of creative energy out of it. This wasn&apos;t a blog post about it.{" "}
                  <span className="text-white font-medium">It was an identity unlock.</span>
                </p>
                <p className="text-sm leading-6 text-starlight/65">
                  That thirst led further: I designed my entire{" "}
                  <span className="text-white font-medium">wedding invitation</span> out of love for my wife.
                  Then the <span className="text-white font-medium">entire Packgine product UI</span> from scratch.
                  Then this portfolio — a space journey told entirely in code.
                </p>
                <p className="text-sm leading-6 text-starlight/65">
                  <span className="text-reef font-medium">Pradeep (CTO)</span> and{" "}
                  <span className="text-reef font-medium">Suresh (EM)</span> gave me the room.
                  The culture and team gave me the fuel to run with it.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Creative works grid — magnify on hover ── */}
        <div
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ cursor: TELESCOPE_CURSOR, overflow: "visible" }}
        >
          {creativeWorks.map((work, i) => {
            const isHovered    = hoveredId === work.id;
            const isDimmed     = hoveredId !== null && !isHovered;

            return (
              /* Scroll-reveal wrapper — keeps scroll animation separate from hover */
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                style={{ position: "relative", zIndex: isHovered ? 20 : 1, overflow: "visible" }}
              >
                {/* Hover-scale article — overflow visible so it scales outward */}
                <motion.article
                  onHoverStart={() => setHoveredId(work.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  animate={{
                    scale:   isHovered ? 1.04 : isDimmed ? 0.97 : 1,
                    y:       isHovered ? -6 : 0,
                    opacity: isDimmed ? 0.45 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  style={{
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  {/* Inner clipping div — glow + border-radius clip lives here.
                      translateZ(0) + isolation:isolate forces a compositing layer so
                      overflow:hidden correctly clips transformed children (Safari fix). */}
                  <div
                    className="overflow-hidden rounded-3xl transition-shadow transition-colors duration-300"
                    style={{
                      background: "rgba(3,7,18,0.72)",
                      border: isHovered
                        ? "1px solid rgba(255,255,255,0.14)"
                        : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: isHovered
                        ? "0 20px 48px rgba(0,0,0,0.55), 0 0 18px 2px rgba(0,209,255,0.22), 0 0 40px 8px rgba(139,92,246,0.12)"
                        : "none",
                      transform: "translateZ(0)",
                      isolation: "isolate",
                    }}
                  >
                    {/* Accent gradient */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", work.accent)} />

                    {/* Image area — contain:paint isolates repaints without breaking layout */}
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-white/[0.06]" style={{ contain: "paint" }}>
                      <motion.div
                        className="absolute inset-0"
                        animate={{ scale: isHovered ? 1.10 : 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 26 }}
                      >
                        {work.id === "pycon" ? (
                          <StickerAquarium />
                        ) : work.id === "wedding" ? (
                          <WeddingInvite3D />
                        ) : work.id === "packgine-ui" ? (
                          <PackgineCarousel />
                        ) : work.id === "portfolio" ? (
                          <PortfolioSelf />
                        ) : work.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={work.image}
                            alt={work.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <DummyImage id={work.id} />
                        )}
                      </motion.div>
                    </div>

                    {/* Card text */}
                    <div className="relative p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-starlight/45">
                        {work.era}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-semibold text-white">{work.title}</h3>
                      <p className="mt-0.5 text-xs font-medium text-reef/80">{work.sub}</p>
                      <p className="mt-3 text-xs leading-5 text-starlight/62">{work.body}</p>
                    </div>
                  </div>
                </motion.article>
              </motion.div>
            );
          })}
        </div>

        {/* ── Design / Deploy / Delight cards ── */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {creativeCards.map((card) => {
            const Icon = card.title === "Design"  ? Paintbrush
                       : card.title === "Deploy"  ? Rocket
                       : Heart;
            return (
            <motion.article
              key={card.title}
              whileHover={{ y: -8, rotate: card.title === "Deploy" ? 0 : -1.5 }}
              className="relative min-h-64 overflow-hidden rounded-3xl border border-white/[0.06] bg-white/10 p-5"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", card.accent)} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,.5),transparent_26%),linear-gradient(180deg,transparent,rgba(3,7,18,.72))]" />
              <div className="relative flex h-full flex-col justify-between">
                <Icon size={22} className="text-white/80" />
                <div>
                  <h3 className="font-display text-4xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/78">{card.body}</p>
                </div>
              </div>
            </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Packgine ─────────────────────────────────────────────────────────────────
function Packgine() {
  return (
    <Section
      id="packgine"
      eyebrow="Saturn · Deep-space mission"
      title="Packgine: the system I was always building towards."
      copy="Everything before this was training. This is where it compounds. Not a dashboard. Not a tool. A system of record for packaging — turning fragmented, manual, reactive workflows into structured, decision-ready outputs."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {packgineMetrics.map((metric) => (
          <div key={metric.label} className="glass rounded-2xl p-5">
            <CountUp value={metric.value} className="font-display text-4xl font-semibold text-white" />
            <p className="mt-2 text-sm text-starlight/68">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {packgineCapabilities.map((item) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass flex items-center gap-3 rounded-2xl p-4"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-reef">
              <item.icon size={18} />
            </span>
            <p className="text-sm font-medium leading-5 text-white/86">{item.title}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-5 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-reef/6 to-transparent p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-400">The shift</p>
        <p className="mt-3 text-lg font-semibold text-white">
          I stopped solving problems. I started designing ecosystems.
        </p>
        <p className="mt-3 text-sm leading-6 text-starlight/68">
          Packgine is where product and engineering compound into one thing. Leading architecture, data models,
          AI-driven automation pipelines, and compliance-ready infrastructure (SOC2 / GDPR).
          Multi-tenant SaaS, 390+ backend APIs, 7+ agent workflows, EPR · PPWR · PPT compliance,
          Digital Product Passport, and scenario planning. Mission: make sustainability measurable,
          actionable, and system-driven — not manual and reactive.
        </p>
      </motion.div>
    </Section>
  );
}

// ─── Beyond ───────────────────────────────────────────────────────────────────
function Beyond() {
  return (
    <section id="beyond" className="section-shell relative z-10 flex items-center px-5 md:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.32em] text-sunlit">
          Portal · Beyond
        </p>
        <h2 className="mt-5 font-display text-5xl font-semibold leading-[0.94] text-white md:text-7xl">
          Not optimising for roles.<br className="hidden md:block" /> Optimising for leverage.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-starlight/74">
          The ability to take complexity, ambiguity, and messy real-world systems — and turn them into
          products that scale. That&apos;s what every phase of this journey was building toward.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-starlight/52">
          From Earth → Mars → Jupiter → Saturn. This was never about changing jobs.
          It was about increasing depth, clarity, and leverage.
        </p>
        <p className="mt-6 text-sm font-medium text-starlight/42 tracking-wide">
          The spacecraft is moving. The map is still being drawn.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:pravinmj.cs@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-abyss"
          >
            Start a conversation <ArrowUpRight size={16} />
          </a>
          <a
            href="https://linkedin.com/in/pravin-mj-6314ab197/"
            className="glass inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function CinematicPortfolio() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss">
      <CometProgress />
      <AmbientJourney />
      <TopNav />
      <Hero />
      <Resileo />
      <Niyata />
      <HappyFox />
      <Creativity />
      <Packgine />
      <Beyond />
      <div className="noise" />
    </main>
  );
}
