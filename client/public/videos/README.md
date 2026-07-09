# TechnoAI Character Clips — Google Veo (Flow) Generation Guide

The scroll experience on the Home page expects these 5 clips (+ poster JPGs).
Drop them in this folder with these exact names — no code changes needed.
Config lives in `client/src/components/scroll/scenes.ts`.

> ⚠️ `/videos/*` is cached immutable on Vercel. If you regenerate a clip later,
> rename it (e.g. `orb-hero-v2.mp4`) and update `scenes.ts`.

## Settings in Flow (labs.google/flow)

- Model: Veo 3 Fast (or Quality if credits allow) · Text-to-Video · 16:9 · download 1080p
- Generate, pick the best take, download, rename to the filename below.

## Shared style block — append to EVERY prompt

> made of luminous electric-blue (#2962FF) and teal (#00C8B3) plasma energy
> with fine particle wisps, on a pure black background, cinematic macro shot,
> centered composition, slow graceful motion, seamless loop, volumetric glow,
> ultra high detail, no text, no watermark

## Shot list

| File | Scene(s) | Prompt core (prepend to style block) |
|------|----------|--------------------------------------|
| `orb-hero.mp4` | Hero, About | A living sphere of swirling plasma energy breathing slowly, tendrils of light orbiting it, |
| `orb-brain.mp4` | Services | An energy orb morphing into a glowing neural-network brain, synapses firing in teal light, |
| `orb-circuit.mp4` | Metrics, Portfolio | Streams of light energy flowing through futuristic circuit pathways, data pulses traveling along glowing traces, |
| `orb-chart.mp4` | AI eCommerce | Particles of light rising upward and forming ascending luminous chart lines and bars, |
| `orb-disperse.mp4` | Contact | An energy orb gently dissolving into thousands of drifting glowing particles, |

## Why a black background matters

The page renders these with `mix-blend-mode: screen` over a dark navy
gradient — pure black disappears entirely, so only the glowing orb is
visible, blended seamlessly into the page. Avoid gray haze or lit floors.

## Posters (required for mobile / reduced-motion fallbacks)

Extract frame 0 of each clip as `orb-<name>.jpg` (same basename):

```
ffmpeg -i orb-hero.mp4 -frames:v 1 -q:v 3 orb-hero.jpg
```

## Optional web optimization (target ≤ 6 MB per clip)

```
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -an -movflags +faststart orb-hero.mp4
```
