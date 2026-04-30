"use client";

import { AnimatePresence, motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight, Github, GraduationCap, Linkedin, Mail, Menu, MoveDown, Sparkles, Telescope, X } from "lucide-react";
import {
  contributionMix,
  creativeCards,
  creativeWorks,
  happyFoxMetrics,
  happyFoxMilestones,
  journeyPhases,
  navItems,
  packgineCapabilities,
  packgineMetrics,
} from "@/lib/content";
import { AmbientJourney } from "./AmbientJourney";
import { Section } from "./Section";
import { cn } from "@/lib/utils";

// ─── Top navigation ───────────────────────────────────────────────────────────
function NavLink({ item, onClick }: { item: typeof navItems[number]; onClick?: () => void }) {
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
      className="rounded-full px-3 py-2 text-xs font-medium text-starlight/70 transition hover:bg-white/10 hover:text-white"
    >
      {item.label}
    </a>
  );
}

function TopNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 md:px-8">
      {/* ── Main bar ── */}
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3">
        <a href="#hero" onClick={close} className="font-display text-sm font-semibold text-white">
          Praveen M J
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => <NavLink key={item.href} item={item} />)}
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
        <motion.div
          initial={{ y: 18 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
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
          <h1 className="mt-7 max-w-5xl font-display text-4xl font-semibold leading-[0.92] text-white sm:text-5xl md:text-7xl lg:text-8xl">
            From Code to Creativity to Systems.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-starlight/78 sm:text-xl md:text-2xl">
            Backend Engineer <span className="text-reef">→</span> Technical Lead{" "}
            <span className="text-reef">→</span> Founding Technical / Product Architect.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-starlight/58 sm:text-base sm:leading-7">
            I don't just write code. I turn complexity into systems people can depend on.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-xs text-starlight/68 sm:text-sm" style={{ width: "fit-content" }}>
            <GraduationCap size={15} className="text-sunlit shrink-0" />
            <span>M.E. Computer Science</span>
            <span className="text-white/30 hidden xs:inline">·</span>
            <span className="hidden xs:inline">IIT Madras origin</span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Chennai</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
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
          </div>
        </motion.div>

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
                { dot: "bg-orange-400", label: "Mars",    desc: "Resilio Labs · Niyata · First orbit" },
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

// ─── Journey phases (Resilio Labs + Niyata) ───────────────────────────────────
function MetricCard({ value, label, icon: Icon }: (typeof happyFoxMetrics)[number]) {
  return (
    <div className="glass rounded-2xl p-5">
      <Icon className="text-reef" size={22} />
      <p className="mt-5 font-display text-4xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-starlight/65">{label}</p>
    </div>
  );
}

function JourneyPhases() {
  return (
    <Section
      id="phases"
      eyebrow="Early Trajectory"
      title="Before HappyFox — the launch sequence."
      copy="Each phase didn't just add experience. It changed how I think about systems. Resilio Labs set the standard. Niyata put it under pressure: 7 sprints, 1844 CI jobs, 16 monitored servers, and a first promotion."
    >
      <div className="relative">
        <div className="absolute bottom-0 left-5 top-4 hidden w-px bg-gradient-to-b from-cyan-400 via-reef to-kelp/40 md:block" />
        <div className="grid gap-5">
          {journeyPhases.map((phase, index) => (
            <motion.article
              key={phase.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="glass relative overflow-hidden rounded-3xl p-5 md:ml-12 md:p-6"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", phase.accent)} />
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <span className="absolute -left-[3.25rem] top-6 hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-abyss text-reef shadow-glow md:flex">
                <phase.icon size={18} />
              </span>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-reef">
                    {phase.phase}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-starlight/52">
                    {phase.terrain}
                  </span>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <h3 className="font-display text-4xl font-semibold leading-none text-white md:text-5xl">
                      {phase.name}
                    </h3>
                    <p className="mt-3 text-base font-semibold text-sunlit">{phase.role}</p>
                    <p className="mt-4 text-sm leading-6 text-starlight/70">{phase.body}</p>
                  </div>
                  <div className="grid gap-3">
                    {phase.subphases.map((subphase) => (
                      <div
                        key={subphase.title}
                        className="rounded-2xl border border-white/12 bg-abyss/32 p-4 backdrop-blur"
                      >
                        <p className="font-display text-lg font-semibold text-white">{subphase.title}</p>
                        <p className="mt-2 text-sm leading-6 text-starlight/66">{subphase.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── HappyFox ─────────────────────────────────────────────────────────────────
function HappyFox() {
  return (
    <Section
      id="happyfox"
      eyebrow="Jupiter · Orbital pressure"
      title="HappyFox: where depth became identity."
      copy="The largest planet. The strongest gravity. The biggest transformation. I entered as a Backend Engineer. Two years later: Technical Lead. But the real shift wasn't the title — it was what I became capable of seeing."
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

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-reef/8 to-transparent p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-reef">With gratitude</p>
        <p className="mt-3 text-lg font-semibold text-white">
          The best QA team. The best fellow dev team. My own Ops track crew. The best Engineering Manager. And a CTO who mentored me into excellence.
        </p>
        <p className="mt-3 text-sm leading-6 text-starlight/68">
          Special credit to <span className="text-white font-medium">Pradeep (CTO)</span> and{" "}
          <span className="text-white font-medium">Suresh (Engineering Manager)</span> for trusting me to
          explore beyond the expected. And to the operations track —{" "}
          <span className="text-starlight/80">Muthuvel, Sanjeev, Guru, Rajalakshmi, Sai Prakash, Kavya, Mukilan</span>{" "}
          — the team that made the work feel like something worth doing.
        </p>
      </motion.div>
    </Section>
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
                  At HappyFox, I was given a small opportunity to explore design through the PyCon event team.
                  I didn't treat it as a side task. I treated it as a new dimension — and squeezed every ounce
                  of creative energy out of it. This wasn't a blog post about it.{" "}
                  <span className="text-white font-medium">It was an identity unlock.</span>
                </p>
                <p className="text-sm leading-6 text-starlight/65">
                  That thirst led further: I designed my entire{" "}
                  <span className="text-white font-medium">wedding invitation</span> out of love for my wife.
                  Then the <span className="text-white font-medium">entire Packgine product UI</span> from scratch.
                  Then this portfolio — a space journey told entirely in code.
                </p>
                <p className="text-sm leading-6 text-starlight/65">
                  All credit to{" "}
                  <span className="text-reef font-medium">Pradeep (CTO)</span> and{" "}
                  <span className="text-reef font-medium">Suresh (Engineering Manager)</span> for trusting me
                  to independently run the PyCon event team and explore my design skills on my own terms.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Creative works grid — magnify on hover ── */}
        <div
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          style={{ cursor: TELESCOPE_CURSOR }}
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
                style={{ position: "relative", zIndex: isHovered ? 20 : 1 }}
              >
                {/* Hover-scale article — overflow visible so it scales outward */}
                <motion.article
                  onHoverStart={() => setHoveredId(work.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  animate={{
                    scale:   isHovered ? (isMobile ? 1.06 : 1.30) : isDimmed ? 0.94 : 1,
                    opacity: isDimmed ? 0.40 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  style={{
                    overflow: "visible",
                    position: "relative",
                    // glow ring appears on hovered card
                    filter: isHovered
                      ? "drop-shadow(0 0 18px rgba(0,209,255,0.40)) drop-shadow(0 0 40px rgba(139,92,246,0.22))"
                      : "none",
                  }}
                >
                  {/* Inner clipping div — clips content to rounded rect */}
                  <div
                    className={cn(
                      "overflow-hidden rounded-3xl border transition-colors duration-300",
                      isHovered ? "border-white/30" : "border-white/12"
                    )}
                    style={{ background: "rgba(3,7,18,0.72)" }}
                  >
                    {/* Accent gradient */}
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", work.accent)} />

                    {/* Image area — inner image zooms independently */}
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
                      <motion.div
                        className="absolute inset-0"
                        animate={{ scale: isHovered ? 1.10 : 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 26 }}
                      >
                        <DummyImage id={work.id} />
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
          {creativeCards.map((card) => (
            <motion.article
              key={card.title}
              whileHover={{ y: -8, rotate: card.title === "Deploy" ? 0 : -1.5 }}
              className="relative min-h-64 overflow-hidden rounded-3xl border border-white/16 bg-white/10 p-5"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-70", card.accent)} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,.5),transparent_26%),linear-gradient(180deg,transparent,rgba(3,7,18,.72))]" />
              <div className="relative flex h-full flex-col justify-between">
                <Sparkles className="text-white" />
                <div>
                  <h3 className="font-display text-4xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/78">{card.body}</p>
                </div>
              </div>
            </motion.article>
          ))}
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
            <p className="font-display text-4xl font-semibold text-white">{metric.value}</p>
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
          products that scale. That's what every phase of this journey was building toward.
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
      <JourneyPhases />
      <HappyFox />
      <Creativity />
      <Packgine />
      <Beyond />
      <div className="noise" />
    </main>
  );
}
