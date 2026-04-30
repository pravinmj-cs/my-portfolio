# Praveen M J Portfolio

A cinematic one-page portfolio for `pravinmj.hanmandev.com`, built with Next.js, React, Tailwind CSS, and Framer Motion.

## Experience

The page is a scroll-driven space exploration journey:

- Origin hero for "From Code to Creativity to Systems"
- Mission phases across Niyata, HappyFox, and Packgine
- Colorful Code to Creativity / Design-Deploy-Delight section
- Deep space Packgine product architecture section
- Final portal / beyond call-to-action

## Tech Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Lucide React icons
- Vercel Analytics

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Use the default Next.js build settings:
   - Build command: `npm run build`
   - Output: `.next`
4. Add the custom domain:
   - `pravinmj.hanmandev.com`
5. In your DNS provider, add the CNAME record Vercel provides for the subdomain.

The metadata in `src/app/layout.tsx` already uses `https://pravinmj.hanmandev.com` as the canonical domain.

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    AmbientJourney.tsx
    CinematicPortfolio.tsx
    Section.tsx
  lib/
    content.ts
    utils.ts
```

## Content Notes

The copy is based on Praveen M J's provided "From Code to Creativity" deck and resume/color reference PDF, including HappyFox contribution metrics, performance rewrite outcomes, security work, DevX work, creative storytelling, and Packgine platform positioning.
