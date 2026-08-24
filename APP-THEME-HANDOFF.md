# Making the app look like the product

Written 24 August 2026, after René noticed that `app.mentorandi.com/mentors`
and `mentorandi.com` do not look like the same company.

They don't, and the reason is simple: **the app is still running the
create-next-app scaffold theme.** `app/globals.css` contains

```css
:root { --background: #ffffff; --foreground: #171717; }
body  { font-family: Arial, Helvetica, sans-serif; }
```

Nobody ever set a brand theme, so the mentors page reaches for ad-hoc Tailwind
palette classes instead — `from-stone-50 via-white to-sky-50`, `border-sky-200`,
`bg-sky-50`, `text-sky-950`. Sky blue has nothing to do with the brand.

| | Marketing site | App today |
|---|---|---|
| Background | warm paper `#F4EDE1` | white / stone / sky gradient |
| Headings | Newsreader, serif | Geist sans |
| Body | Hanken Grotesk | Arial |
| Labels | Space Mono, uppercase | Geist, sky blue |
| Accent | terracotta `#BC5B38` | Tailwind sky |
| Mentor identity | each mentor has its own hue | none |

Good news: you are on **Tailwind v4**, so almost all of this is one file.

---

## 1. Replace `app/globals.css`

Ported verbatim from the marketing site — copied values, not approximations.

```css
@import "tailwindcss";

/* Mentor And I — brand theme.
   Ported verbatim from the marketing site at mentorandi.com so the product
   and the site are visibly the same thing. Values are copied, not eyeballed.
   Replaces the create-next-app scaffold, which was still white/Arial/sky-blue. */

:root {
  /* Surfaces — warm paper, not white */
  --paper:        #F4EDE1;
  --band:         #EFE6D4;
  --paper-2:      #E9E0CF;
  --surface:      #FFFFFF;
  --surface-warm: #FBF7EF;
  --deep:         #1E1B16;

  /* Ink and text */
  --ink:          #201F1B;
  --text:         #4A4539;
  --text-dim:     #6A6456;
  --text-faint:   #8A8372;

  /* Hairlines */
  --line:         rgba(32, 31, 27, 0.12);
  --line-strong:  rgba(32, 31, 27, 0.20);

  /* Terracotta accent */
  --accent:       #BC5B38;
  --accent-deep:  #9E4A2C;
  --accent-soft:  rgba(188, 91, 56, 0.08);
  --accent-line:  rgba(188, 91, 56, 0.28);
  --accent-glow:  rgba(188, 91, 56, 0.22);

  /* Per-mentor hues. Order matches the marketing site exactly:
     life, adhd, relationship, parenting, stress-burnout,
     health-fitness, focus, charisma */
  --mentor-life:            #BC5B38;
  --mentor-adhd:            #C68A38;
  --mentor-relationship:    #B0654F;
  --mentor-parenting:       #9A7B3A;
  --mentor-stress-burnout:  #A0637A;
  --mentor-health-fitness:  #B58A2E;
  --mentor-focus:           #C56B47;
  --mentor-charisma:        #8E6E52;

  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

@theme inline {
  --color-background:   var(--paper);
  --color-foreground:   var(--ink);

  --color-paper:        var(--paper);
  --color-band:         var(--band);
  --color-surface:      var(--surface);
  --color-surface-warm: var(--surface-warm);
  --color-deep:         var(--deep);

  --color-ink:          var(--ink);
  --color-body:         var(--text);
  --color-dim:          var(--text-dim);
  --color-faint:        var(--text-faint);

  --color-accent:       var(--accent);
  --color-accent-deep:  var(--accent-deep);

  --color-mentor-life:           var(--mentor-life);
  --color-mentor-adhd:           var(--mentor-adhd);
  --color-mentor-relationship:   var(--mentor-relationship);
  --color-mentor-parenting:      var(--mentor-parenting);
  --color-mentor-stress-burnout: var(--mentor-stress-burnout);
  --color-mentor-health-fitness: var(--mentor-health-fitness);
  --color-mentor-focus:          var(--mentor-focus);
  --color-mentor-charisma:       var(--mentor-charisma);

  --font-sans:    var(--font-hanken), ui-sans-serif, system-ui, sans-serif;
  --font-serif:   var(--font-newsreader), Georgia, "Times New Roman", serif;
  --font-mono:    var(--font-space-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* The marketing site has no dark mode. Until the product has a designed one,
   do not let the OS force an undesigned inversion — that is what produced the
   grey-on-white look the brand does not use. */
body {
  background: var(--paper);
  color: var(--text);
  font-family: var(--font-hanken), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-newsreader), Georgia, serif;
  font-weight: 500;
  color: var(--ink);
  letter-spacing: -0.015em;
}

/* Small uppercase labels — mentor roles, eyebrows, badges.
   On the marketing site these are Space Mono, 0.82rem, weight 700, and
   tinted with the mentor's own hue at 58% mixed into ink. That mix is what
   gives 7.4:1 contrast; a flat accent colour does not reach AA. */
.label-mono {
  font-family: var(--font-space-mono), ui-monospace, monospace;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.2;
  color: color-mix(in srgb, var(--h, var(--accent)) 58%, var(--ink));
}

/* Mentor card, matching .mn-card on the marketing site. Set --h per card. */
.mentor-card {
  background: linear-gradient(168deg,
              color-mix(in srgb, var(--h, var(--accent)) 9%, #fff),
              var(--surface));
  border: 1px solid color-mix(in srgb, var(--h, var(--accent)) 24%, var(--line));
  border-radius: 18px;
  padding: 1.6rem;
  transition: 0.4s var(--ease);
}
.mentor-card:hover {
  border-color: color-mix(in srgb, var(--h, var(--accent)) 45%, var(--line));
  transform: translateY(-3px);
}

@media (prefers-reduced-motion: reduce) {
  .mentor-card { transition: none; }
}
```

## 2. Load the three brand fonts in `app/layout.tsx`

Replace the Geist imports. The CSS variable names must match the theme above.

```ts
import { Hanken_Grotesk, Newsreader, Space_Mono } from "next/font/google";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});
```

Then put `${hanken.variable} ${newsreader.variable} ${spaceMono.variable}` on
the `<html>` element in place of the Geist variables.

## 3. Fix the palette classes on `app/mentors/page.tsx`

| Line | Now | Should be |
|---|---|---|
| 25 | `bg-gradient-to-b from-stone-50 via-white to-sky-50` | `bg-paper` |
| 40 | `border-sky-200 bg-sky-50 text-sky-950` | `border-accent/25 bg-accent/8 text-ink` |

The mentor role label — currently blue — should use the mentor's own hue:

```tsx
<span className="label-mono" style={{ "--h": mentorHue(mentor.slug) }}>
  {mentor.role}
</span>
```

The eight hues are in the theme as `--mentor-life`, `--mentor-adhd` and so on.

**Contrast matters here.** On the marketing site the label is
`color-mix(in srgb, var(--h) 58%, var(--ink))`, not the flat accent. Measured
live, that mix gives **7.44:1** against the card. The flat hue gives about
2.9:1 and fails WCAG AA. The `.label-mono` class in the theme already does the
mix — use the class rather than reimplementing it.

## 4. Mentor cards

`.mentor-card` in the theme reproduces `.mn-card` from the marketing site:
a gradient from 9% of the mentor's hue into white, a border at 24% of that hue,
18px radius, and a 3px lift on hover. Set `--h` per card and the eight cards
differentiate themselves.

Portraits on the marketing site are **60×75, `border-radius: 12px`**, beside the
name rather than above it. The app currently uses large full-width photos, which
is a different rhythm — worth aligning, though it is a layout decision rather
than a token one.

## 5. Two pieces of copy that are now wrong

The page still says **"Alpha preview"** and *"During alpha, selections continue
in the existing conversation system."*

The app is in production and taking subscription payments. Telling a paying
customer they are in an alpha preview is worse than a styling mismatch.

---

## What this is not

This is a theme change, not a redesign. Component structure, layout and copy
stay as they are apart from item 5. The point is only that the product should
look like the thing that sold it.
