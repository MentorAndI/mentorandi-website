# Mentor And I — Investor Film

A code-driven investor overview built in React + Remotion. First render target: investor-film v1.

## Composition

- 1920 × 1080
- 30 fps
- 2,340 frames
- 78 seconds
- H.264 MP4
- Uses the existing Mentor And I logo, brand palette and mentor portraits
- No generated replacement branding

## Story

1. **The problem** — AI is strong at answers, but change needs continuity.
2. **The product** — Mentor And I is a persistent mentoring relationship.
3. **Eight specialists** — Life, ADHD, Relationship, Stress & Burnout, Parenting, Health & Fitness, Focus and Charisma.
4. **Product demonstration** — context persists and can be useful when the user moves from Marcus to a specialist.
5. **Compounding context** — goals, patterns, preferences and progress carry forward.
6. **Investor thesis** — free entry, specialist expansion, persistent context and content distribution.
7. **Category** — persistent AI mentorship.

## Run locally

```bash
cd investor-video
npm install
npm run studio
```

Render:

```bash
npm run render
npm run poster
```

The GitHub workflow can also render the MP4 and poster and commit them under `investor-video/out/`.

## Brand sources

The composition references the live, version-controlled Mentor And I assets:

- `https://mentorandi.com/images/MentorAndIlogo.png`
- `https://mentorandi.com/images/mentors/profiles/*.webp`

Brand colors and typography are based on `APP-DESIGN-SYSTEM.md`.

## Next pass

After visual review:

- add professional voice-over;
- add subtle licensed/original music if wanted;
- replace the simulated product view with selected real app captures where useful;
- add sourced market-size figures only after investor-data verification;
- create a 30-second cutdown and a vertical social cut.
