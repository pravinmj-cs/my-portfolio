# Pravin M J — Portfolio

> **From Code to Creativity to Systems.**  
> A cinematic, scroll-driven space journey through a decade of engineering.

Live at **[hanmandev.com](https://hanmandev.com)**

---

## What this is

A single-page portfolio built as a story — not a resume. The narrative arc follows a real career trajectory mapped onto a space exploration theme: Earth → Mars → Jupiter → Saturn → Beyond.

Each section is a chapter:

| Section | Story |
|---|---|
| **Origin** | M.E. Computer Science, IIT Madras · where it started |
| **Phases** | Resilio Labs → Niyata · first real systems, first leadership |
| **HappyFox** | 3 years · 300+ PRs · security, performance, identity, ops |
| **Creativity** | PyCon · wedding invite · Packgine UI · this portfolio |
| **Packgine** | Founding Technical / Product Architect · SaaS from scratch |
| **Beyond** | What comes next |

---

## Tech stack

- **Next.js 15** — App Router, Turbopack dev
- **React 19**
- **Tailwind CSS 3**
- **Framer Motion 12** — scroll-driven animations, spring physics, hover magnify
- **Lucide React** — icons
- **Vercel Analytics** — zero-config page insights

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Production build

```bash
npm run build
npm run start
```

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com) — auto-detects Next.js
3. Build command: `npm run build` · Output: `.next`
4. Add custom domain in **Settings → Domains**
5. In Cloudflare DNS, add the CNAME Vercel provides

---

## Project structure

```
src/
  app/
    globals.css          # animations, star layers, planet glows, glass sweep
    layout.tsx           # metadata, fonts
    page.tsx             # root entry
  components/
    CinematicPortfolio.tsx  # all sections, nav, creative works, hover effects
    AmbientJourney.tsx      # starfield — 5 depth layers, Milky Way band
    CSSPlanets.tsx          # Saturn ring system, planet visuals
  lib/
    content.ts           # all copy, metrics, phase data — edit here
```

---

## Notable details

- **Saturn rings** — stroke-only SVG ellipses with `linearGradient` stroke paint; no fill overlays (avoids dark blob artifact); front arc clipped via `polygon()` for correct z-depth
- **Star field** — 5 layers: galaxy dust (static), far/mid/near twinkling, bright stars with diffraction spikes via CSS `::before`/`::after`; LCG deterministic random for SSR safety
- **Glass glint** — animated shine sweep on the hero pill; full left→right diagonal sweep, fires every 7s
- **Creativity magnify** — telescope cursor, spring-physics hover scale (1.30× desktop / 1.06× mobile), siblings dim to 40%
- **Mobile nav** — hamburger with `AnimatePresence` slide-down glass dropdown, auto-closes on link tap
- **Content** — all copy lives in `src/lib/content.ts`, nothing hardcoded in components
