import {
  BadgeCheck,
  BrainCircuit,
  CloudCog,
  FileSearch,
  GitPullRequest,
  Layers3,
  LockKeyhole,
  Network,
  PencilRuler,
  Rocket,
  ShieldCheck,
  Sparkles,
  Telescope,
  Zap,
} from "lucide-react";

export const navItems = [
  { label: "Origin",     href: "#hero"       },
  { label: "Phases",     href: "#phases"     },
  { label: "HappyFox",   href: "#happyfox"   },
  { label: "Creativity", href: "#creativity", glow: true },
  { label: "Packgine",   href: "#packgine"   },
  { label: "Beyond",     href: "#beyond"     },
];

// ── Journey phases — Resilio Labs → Niyata (HappyFox/Packgine get own sections)
export const journeyPhases = [
  {
    phase: "Phase 1",
    name: "Resilio Labs",
    terrain: "IIT Madras · Launch pad",
    role: "Project Associate — 6 months",
    body:
      "The shift from theory to reality. Working inside an IIT Madras-incubated environment, I touched real systems for the first time — where engineering met expectations, and expectations had consequences.",
    accent: "from-cyan-400/25 via-teal-400/20 to-white/5",
    icon: Telescope,
    subphases: [
      {
        title: "BI tool validation",
        body:
          "Built and submitted a complete test milestone report — functional and automated testing of a BI tool — that impressed clients and extended the contract. Engineering with real stakes.",
      },
      {
        title: "The first realisation",
        body:
          "Operating inside IIT Madras's research environment, briefly pursuing a PhD track before pivoting to industry. This is where I understood: code is not the outcome. Impact is.",
      },
    ],
  },
  {
    phase: "Phase 2",
    name: "Niyata",
    terrain: "Mars · First industry orbit",
    role: "Backend Developer → Technical Lead / DevOps",
    body:
      "A new environment. Real pressure. No abstraction. This is where I stopped learning systems and started building them — 7 sprints, 324 work items, 8 releases in 5 months. Then a shift: engineer → Technical Lead.",
    accent: "from-cyan-400/25 via-kelp/20 to-white/5",
    icon: CloudCog,
    subphases: [
      {
        title: "Backend systems at scale",
        body:
          "Kafka pipelines scaling to 1019 IoT sensors, TimescaleDB migration, Redis cache layer. Response times dropped from 4s to 255ms. 1844 CI jobs, 880 CD jobs. Not just delivery — infrastructure for growth.",
      },
      {
        title: "DevOps culture, from scratch",
        body:
          "Introduced GitLab CI/CD with automated builds, unit tests, static + security analysis, Docker, Ansible, Terraform, and MLOps. Ran hands-on sessions to onboard multiple teams.",
      },
      {
        title: "Centralised monitoring",
        body:
          "Built a monitoring platform collecting and visualising metrics from 16 production servers — Prometheus, Grafana, and Loki. Systems need to be observable to be trustworthy.",
      },
    ],
  },
];

export const happyFoxMetrics = [
  { value: "300+",   label: "Overall PRs",          icon: GitPullRequest },
  { value: "150+",   label: "PRs reviewed",          icon: BadgeCheck     },
  { value: "120+",   label: "Work items owned",      icon: FileSearch     },
  { value: "3 yrs",  label: "Engineer → Tech Lead",  icon: Rocket        },
];

export const contributionMix = [
  { label: "Feature",    value: 28, color: "#00D1FF" },
  { label: "Support",    value: 24, color: "#29D398" },
  { label: "Technical",  value: 17, color: "#8B5CF6" },
  { label: "DevX",       value: 10, color: "#F8E16C" },
  { label: "Design",     value: 10, color: "#FF6B6B" },
  { label: "Security",   value:  7, color: "#C084FC" },
  { label: "Operations", value:  4, color: "#60A5FA" },
];

export const happyFoxMilestones = [
  {
    title: "Started in support — the closest place to failure",
    body:
      "Onboarded into the support track, working directly with customers on real issues. Every bug had a customer behind it. Every issue was a signal about how the system actually behaved. This changed how I build: not for correctness alone — for survival under real conditions. From there, moved to independently owning exports, integrations (Slack, Microsoft, GitLab, Okta, Twilio, JIRA, Azure DevOps), and developer tooling.",
    icon: Zap,
  },
  {
    title: "Security that reached real incidents",
    body:
      "Built in-house SSRF protection tooling (no external dependencies), led HTML injection / Stored XSS prevention patterns, part of the bleach migration team, implemented DMARC/SPF/DKIM for helpdesk customers, and resolved a HackerOne attachment exposure incident where unauthorised users could view ticket attachments. Security is not a checklist. It is trust.",
    icon: LockKeyhole,
  },
  {
    title: "240s → 8s. Not optimisation — architectural correction.",
    body:
      "Reworked ~70% of a critical requester API path. Bulk creates: 240 seconds and timeouts → 8 seconds. Bulk updates → 28 seconds. A 70%+ improvement that directly unlocked enterprise-level data throughput. The problem wasn't slow code. The problem was the wrong architecture — and fixing it required understanding the whole system.",
    icon: Network,
  },
  {
    title: "Identity, access, and ownership decisions",
    body:
      "SAML SSO proof-of-concepts and production fixes, extended to Azure AD. Built JWT multi-brand login in two days with the team. Independently scaled decisions on authentication flows working directly with the CTO and staff engineers. This is where debugging evolved: from fixing issues to understanding entire systems.",
    icon: ShieldCheck,
  },
  {
    title: "Stopped executing tasks. Started owning outcomes.",
    body:
      "Led PyCon event management team and visual design. Worked with CTO on async IO for high-volume customers. 300+ PRs, 150+ reviews, 120+ work items owned, improved APIs by 70%, stronger review culture, better docs — and trust extended to run entire workstreams without supervision. The real promotion was not the title.",
    icon: BadgeCheck,
  },
];

// ── Creativity section —————————————————————————————————————————————————————

export const creativeWorks = [
  {
    id: "pycon",
    era:   "2022 · HappyFox",
    title: "PyCon India",
    sub:   "Sticker design & event identity",
    body:
      "Led the PyCon event management team at HappyFox from scratch. Squeezed every ounce of creative energy into sticker designs, visual identity, and event materials. Pure mouse, pure craft — no AI involved.",
    accent: "from-coral/30 to-sunlit/20",
    placeholder: "pycon-sticker.jpg",
  },
  {
    id: "wedding",
    era:   "Personal · Pre-AI",
    title: "Wedding Invite",
    sub:   "Designed out of love",
    body:
      "Designed the entire wedding invitation from zero — layout, typography, illustration, print-ready assets. This is what happens when work and life mingled in the best way. Love is a very good design brief.",
    accent: "from-aurora/25 to-reef/20",
    placeholder: "wedding-invite.jpg",
  },
  {
    id: "packgine-ui",
    era:   "2024–25 · Packgine",
    title: "Packgine UI",
    sub:   "Full product design from scratch",
    body:
      "Designed the entire Packgine product interface — from data models to dashboards, compliance bundles to portfolio widgets. Stakeholder retros, enterprise demos, every touchpoint was a creative story told visually.",
    accent: "from-violet-500/25 to-reef/20",
    placeholder: "packgine-ui.jpg",
  },
  {
    id: "portfolio",
    era:   "2025 · This page",
    title: "Space Portfolio",
    sub:   "Story-first engineering narrative",
    body:
      "A subtle nod to my love for deep tech and space exploration. Earth → Mars → Jupiter → Saturn. This portfolio is itself a creative output — planets, comet progress, ambient starfield, spacecraft — all code.",
    accent: "from-reef/20 to-violet-500/25",
    placeholder: "portfolio.jpg",
  },
];

export const creativeCards = [
  {
    title: "Design",
    body:  "PyCon event identity, a wedding invitation, a full product UI — not because I had to. Because I couldn't not. Craft without an ask is the purest signal.",
    accent: "from-coral to-sunlit",
  },
  {
    title: "Deploy",
    body:  "Shipping with the operational discipline of a lead: scoped systems, review quality, observability, rollback awareness, and the confidence to own the outcome.",
    accent: "from-reef to-kelp",
  },
  {
    title: "Delight",
    body:  "Most engineers build systems. I want people to feel them. That distinction is everything.",
    accent: "from-aurora to-coral",
  },
];

// ── Packgine ───────────────────────────────────────────────────────────────────

export const packgineCapabilities = [
  { title: "Multi-tenant SaaS architecture",           icon: Layers3      },
  { title: "Packaging system of record",               icon: FileSearch   },
  { title: "LCA and recyclability intelligence",       icon: BrainCircuit },
  { title: "EPR, PPWR, and PPT compliance bundles",    icon: ShieldCheck  },
  { title: "Digital Product Passport",                 icon: BadgeCheck   },
  { title: "Agentic AI workflows",                     icon: Sparkles     },
  { title: "Smart Drafts",                             icon: PencilRuler  },
  { title: "Compliance insights agent",                icon: Telescope    },
  { title: "Impact optimisation and scenario planning",icon: Rocket       },
];

export const packgineMetrics = [
  { value: "390+",   label: "Backend APIs"    },
  { value: "7+",     label: "Agent workflows" },
  { value: "18+",    label: "Portfolio widgets"},
];
