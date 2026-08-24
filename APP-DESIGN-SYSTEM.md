# app.mentorandi.com — design system

Same brand as mentorandi.com, application expression. Hanken Grotesk is the UI
typeface. Newsreader is reserved for a few editorial display moments — the
mentor greeting, empty-state headlines. Space Mono is meta only: labels,
timestamps, eyebrows. Never long body or chat text in the serif, never in mono.

Supersedes `APP-THEME-HANDOFF.md`, which only ported the marketing tokens.

---

## Read this before implementing

Every colour was measured against every surface it can sit on. **Six values in
the original specification do not meet WCAG AA** and are corrected below. The
dark theme was better tuned than the light one; most failures were in light.

| Token | Given | Claimed | Measured | Corrected to | Now |
|---|---|---|---|---|---|
| `--ink-faint` | `#837B6D` | ~4.6:1 | **3.60:1** | `#6E675C` | 4.80:1 |
| `--warning` | `#B8842A` | — | **2.83:1** | `#87611F` | 4.80:1 |
| `--success` | `#4E7A5A` | — | **4.24:1** | `#487153` | 4.80:1 |
| `--line-strong` | `#D6C9B2` | — | **1.53:1** | `#8F887A` | 3.29:1 |
| `--on-terra` on `--terra` | — | — | **4.08:1** | use `--terra-fill` | 5.51:1 |
| `--danger` (dark) | `#C9564A` | — | **4.03:1** | `#D97267` | 5.31:1 |

Four notes on why:

**`--ink-faint` is labelled "body-min" but is not.** 3.60:1 fails AA for body
text, and placeholder text counts as body text. Measured against `--band` it was
3.38:1, worse still — faint text on an inset area is the realistic worst case.

**`--warning` at 2.83:1 fails even the 3:1 large-text floor.** It could not
legally be used for any text at all.

**`--line-strong` is assigned to input borders.** `--surface-raised` sits at
1.14:1 against `--app-bg`, so the border is the only thing defining the control.
That makes it a meaningful UI boundary needing 3:1, not decoration. The original
value is kept as `--line-soft` for genuinely decorative rules.

**The primary button fails.** `--on-terra` on a `--terra` fill measures 4.08:1.
Button labels are normal text, so 4.5 is required. Rather than change the brand
colour, text-bearing fills use `--terra-fill` — which is the existing
`--terra-hover` value, `#9E4A2C`, at 5.51:1. `--terra` stays the brand colour for
large accents, icons and rules, where no text sits on it.

**One line in the spec was corrupted in transit:**
`--terra-press: #B85старо)`. Implemented as `#B85A38`, which the comment
alongside it indicated.

## What passes as given

`--ink` 14.17:1 · `--ink-muted` 6.17:1 · `--terra-text` 6.06:1 (better than the
~5:1 claimed) · `--ring` 5.20:1 · `--danger` light 6.06:1 · `--info` 4.91:1 ·
dark `--ink` 14.40:1, `--ink-muted` 7.84:1, `--terra-text` 6.68:1,
`--warning` 6.85:1.

## Mentor hues

The eight per-mentor colours carry over from the marketing site. The role label
mixes the hue into ink at 58% rather than using it flat — the flat hue measures
about 2.9:1 and fails. Verified across all eight in both themes: worst case
5.58:1 light, 5.93:1 dark.

---

## The file

Drop in as `app/globals.css`. Tailwind v4, so the `@theme inline` block exposes
everything as utilities — `bg-surface`, `text-ink-muted`, `border-line-strong`.

```css
@import "tailwindcss";

/* ============================================================
   app.mentorandi.com — design system
   Same brand as mentorandi.com, application expression.

   Every colour below was measured, not assumed. Six values from the
   original spec did not meet WCAG AA and were corrected; each is marked
   CORRECTED with the measured before/after. Ratios in comments are real
   measurements against the stated surface.
   ============================================================ */

:root {
  /* ---- Surfaces: warm, layered for hierarchy ---- */
  --app-bg:         #F4EDE1;  /* base canvas */
  --band:           #EFE6D4;  /* secondary surface, inset areas */
  --surface:        #FBF7EF;  /* cards, mentor chat bubbles */
  --surface-raised: #FEFCF8;  /* composer, menus, modals */
  --line:           #E3D9C6;  /* decorative hairlines */

  /* CORRECTED  #D6C9B2 → #8F887A
     Was 1.53:1 on --surface. The spec assigns this to input borders, and
     --surface-raised sits at 1.14:1 against --app-bg, so the border is the
     only thing defining the control. That makes it a meaningful UI boundary
     requiring 3:1, not decoration. Now 3.29:1. */
  --line-strong:    #8F887A;

  /* Keep the old value where it genuinely is decorative — table rules,
     card edges, anything with a filled surface behind it. */
  --line-soft:      #D6C9B2;

  /* ---- Text, verified against --app-bg AND --band (the darker one wins) ---- */
  --ink:            #201F1B;  /* 14.17:1 on bg · 13.30:1 on band */
  --ink-muted:      #5C574D;  /*  6.17:1 on bg ·  5.79:1 on band */

  /* CORRECTED  #837B6D → #6E675C
     Was 3.60:1 on bg and 3.38:1 on band. The spec labels it "body-min", but
     3.60 fails AA for body text, and placeholder text counts as body text.
     Now 4.80:1 on bg, 4.51:1 on band. */
  --ink-faint:      #6E675C;

  /* ---- Brand action ---- */
  --terra:          #BC5B38;  /* large accents, icons, rules — NO text on top */
  --terra-hover:    #9E4A2C;
  --terra-press:    #863E24;  /* spec had a paste corruption here */
  --terra-text:     #8F4227;  /* 6.06:1 on bg — links and text */
  --on-terra:       #FBF3EC;  /* text/icons on a terracotta fill */

  /* CORRECTED behaviour, not value.
     --on-terra on --terra measures 4.08:1, which fails AA for normal text.
     Button labels are normal text. So text-bearing fills use --terra-fill,
     which is the existing --terra-hover value and measures 5.51:1.
     --terra stays the brand colour for large areas where no text sits. */
  --terra-fill:       #9E4A2C;  /* 5.51:1 with --on-terra */
  --terra-fill-hover: #863E24;  /* 7.01:1 */
  --terra-fill-press: #6E3220;

  --ring:           #9E4A2C;  /* 5.20:1 on bg */

  /* ---- Semantic, warm-tuned, kept distinct from the brand ---- */
  /* CORRECTED  #4E7A5A → #487153   (was 4.24:1, now 4.80:1) */
  --success:        #487153;
  /* CORRECTED  #B8842A → #87611F   (was 2.83:1 — failed even large text) */
  --warning:        #87611F;
  --danger:         #A32E28;  /* 6.06:1 — deeper and cooler than terra */
  --info:           #3E6B8A;  /* 4.91:1 */

  /* ---- Radius ---- */
  --r-sm: 6px; --r-md: 10px; --r-lg: 14px; --r-xl: 20px; --r-pill: 999px;

  /* ---- Shadows, warm-tinted ---- */
  --shadow-sm: 0 1px 2px rgba(32,31,27,.06);
  --shadow-md: 0 2px 8px rgba(32,31,27,.08);
  --shadow-lg: 0 8px 24px rgba(32,31,27,.12);

  /* ---- Motion ---- */
  --dur-fast: 120ms; --dur: 180ms; --dur-slow: 240ms;
  --ease: cubic-bezier(.2,.6,.2,1);

  /* ---- Type ---- */
  --font-sans:  var(--font-hanken), "Hanken Grotesk", system-ui, sans-serif;
  --font-serif: var(--font-newsreader), "Newsreader", Georgia, serif;
  --font-mono:  var(--font-space-mono), "Space Mono", ui-monospace, monospace;

  /* ---- Per-mentor hues, carried over from mentorandi.com ---- */
  --mentor-life: #BC5B38;           --mentor-adhd: #C68A38;
  --mentor-relationship: #B0654F;   --mentor-parenting: #9A7B3A;
  --mentor-stress-burnout: #A0637A; --mentor-health-fitness: #B58A2E;
  --mentor-focus: #C56B47;          --mentor-charisma: #8E6E52;
}

:root[data-theme="dark"] {
  --app-bg:         #1C1B18;  /* warm near-black, never pure #000 */
  --band:           #24221E;
  --surface:        #2A2824;
  --surface-raised: #322F2A;
  --line:           #3A362F;
  --line-soft:      #3A362F;
  --line-strong:    #6A6355;  /* lifted so it still reads on --surface */

  --ink:            #F1EADD;  /* 14.40:1 on bg · 12.30:1 on surface */
  --ink-muted:      #B7AE9D;  /*  7.84:1 on bg ·  6.69:1 on surface */

  /* CORRECTED  #8A8271 → #9A927F
     Given value measured 4.52:1 on --app-bg but only 3.86:1 on --surface,
     and most faint text in an app sits on cards, not on the canvas. */
  --ink-faint:      #9A927F;

  --terra:          #D06A44;
  --terra-hover:    #E07C55;
  --terra-press:    #B85A38;  /* the corrupted line in the spec */
  --terra-text:     #E58A63;  /* 6.68:1 on bg */
  --on-terra:       #1C1B18;  /* 4.78:1 on --terra — passes */
  --terra-fill:       #D06A44;
  --terra-fill-hover: #E07C55;
  --terra-fill-press: #B85A38;

  --ring:           #E07C55;  /* 5.89:1 on bg */

  --success: #5E8E68;  /* 4.55:1 */
  --warning: #CF9A42;  /* 6.85:1 */
  /* CORRECTED  #C9564A → #D97267   (was 4.03:1, fails body text) */
  --danger:  #D97267;
  --info:    #5E8AAE;  /* 4.69:1 */

  --shadow-sm: 0 1px 2px rgba(0,0,0,.35);
  --shadow-md: 0 2px 8px rgba(0,0,0,.42);
  --shadow-lg: 0 8px 24px rgba(0,0,0,.50);
}

@theme inline {
  --color-app-bg:         var(--app-bg);
  --color-band:           var(--band);
  --color-surface:        var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-line:           var(--line);
  --color-line-soft:      var(--line-soft);
  --color-line-strong:    var(--line-strong);

  --color-ink:            var(--ink);
  --color-ink-muted:      var(--ink-muted);
  --color-ink-faint:      var(--ink-faint);

  --color-terra:          var(--terra);
  --color-terra-fill:     var(--terra-fill);
  --color-terra-text:     var(--terra-text);
  --color-on-terra:       var(--on-terra);

  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger:  var(--danger);
  --color-info:    var(--info);

  --radius-sm: var(--r-sm); --radius-md: var(--r-md);
  --radius-lg: var(--r-lg); --radius-xl: var(--r-xl);

  --font-sans:  var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono:  var(--font-mono);
}

/* ============================================================
   Base
   ============================================================ */

body {
  background: var(--app-bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Newsreader is reserved for editorial display moments only:
   the mentor greeting and empty-state headlines. Never long body,
   never chat text. Apply deliberately with .display. */
.display {
  font-family: var(--font-serif);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.15;
  color: var(--ink);
}

/* Space Mono is meta only: labels, timestamps, eyebrows. */
.meta {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* Focus is always visible, never removed. */
:where(a, button, input, textarea, select, [tabindex]):focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  border-radius: var(--r-sm);
}

/* ============================================================
   Components
   ============================================================ */

.btn {
  display: inline-flex; align-items: center; gap: .5rem;
  font: inherit; font-weight: 600; font-size: .95rem;
  padding: .65rem 1.25rem; border-radius: var(--r-pill);
  border: 1px solid transparent; cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
}
.btn-primary { background: var(--terra-fill); color: var(--on-terra); }
.btn-primary:hover { background: var(--terra-fill-hover); }
.btn-primary:active { background: var(--terra-fill-press); }

.btn-secondary {
  background: var(--surface-raised); color: var(--ink);
  border-color: var(--line-strong);
}
.btn-secondary:hover { border-color: var(--terra); color: var(--terra-text); }

.btn-quiet { background: transparent; color: var(--terra-text); padding-inline: .5rem; }
.btn-quiet:hover { background: color-mix(in srgb, var(--terra) 8%, transparent); }

.field {
  width: 100%; font: inherit; font-size: 1rem;
  background: var(--surface-raised); color: var(--ink);
  border: 1px solid var(--line-strong); border-radius: var(--r-md);
  padding: .7rem .9rem;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
.field::placeholder { color: var(--ink-faint); }
.field:focus {
  outline: none; border-color: var(--ring);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ring) 18%, transparent);
}

.card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg); padding: 1.25rem; box-shadow: var(--shadow-sm);
}

/* Mentor card. Set --h to the mentor's hue. The role label mixes the hue
   into ink at 58% — the flat hue measures ~2.9:1 and fails AA. */
.mentor-card {
  background: linear-gradient(168deg, color-mix(in srgb, var(--h, var(--terra)) 7%, var(--surface)), var(--surface));
  border: 1px solid color-mix(in srgb, var(--h, var(--terra)) 22%, var(--line));
  border-radius: var(--r-xl); padding: 1.4rem;
  transition: transform var(--dur-slow) var(--ease), border-color var(--dur-slow) var(--ease);
}
.mentor-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--h, var(--terra)) 42%, var(--line));
}
.mentor-role {
  font-family: var(--font-mono); font-size: .8rem; font-weight: 700;
  letter-spacing: .05em; text-transform: uppercase; line-height: 1.2;
  color: color-mix(in srgb, var(--h, var(--terra)) 58%, var(--ink));
}

/* Chat. The mentor speaks from a card; the person speaks from a filled
   bubble. Long sessions, so the reading column is capped. */
.bubble-mentor {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--r-lg) var(--r-lg) var(--r-lg) var(--r-sm);
  padding: .9rem 1.1rem; max-width: 62ch; color: var(--ink);
}
.bubble-me {
  background: var(--band); border: 1px solid var(--line-soft);
  border-radius: var(--r-lg) var(--r-lg) var(--r-sm) var(--r-lg);
  padding: .9rem 1.1rem; max-width: 62ch; margin-left: auto; color: var(--ink);
}
.timestamp { font-family: var(--font-mono); font-size: .68rem; color: var(--ink-faint); }

.composer {
  background: var(--surface-raised); border: 1px solid var(--line-strong);
  border-radius: var(--r-xl); padding: .75rem;
  box-shadow: var(--shadow-md);
}

.badge {
  display: inline-flex; align-items: center; gap: .35rem;
  font-family: var(--font-mono); font-size: .68rem; letter-spacing: .1em;
  text-transform: uppercase; padding: .25rem .6rem; border-radius: var(--r-pill);
  border: 1px solid var(--line-strong); color: var(--ink-muted);
  background: var(--surface);
}
.badge-credits { color: var(--terra-text); border-color: color-mix(in srgb, var(--terra) 32%, transparent); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .001ms !important;
    transition-duration: .001ms !important;
  }
}
```

## Fonts in `app/layout.tsx`

```ts
import { Hanken_Grotesk, Newsreader, Space_Mono } from "next/font/google";

const hanken     = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken",
                                    weight: ["400","500","600","700"] });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader",
                                weight: ["400","500"] });
const spaceMono  = Space_Mono({ subsets: ["latin"], variable: "--font-space-mono",
                                weight: ["400","700"] });
```

Put the three `.variable` classes on `<html>` in place of the Geist ones.

## Dark theme

Switched by `data-theme="dark"` on the root element, as specified. Note it is
**not** wired to `prefers-color-scheme`. The current `globals.css` has a
`@media (prefers-color-scheme: dark)` block that inverts an undesigned palette —
remove it. An OS setting should not silently produce a theme nobody drew.

## Still to decide

The mentors page uses large full-width portraits; the marketing site uses 60×75
thumbnails beside the name. That is a layout decision rather than a token one,
so it is left open.

And the page still says **"Alpha preview"** while the app takes live
subscription payments. That is not a styling problem.
