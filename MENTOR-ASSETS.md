# Mentor assets — handoff

Reference for anyone building the Mentor And I product (app, chat UI, onboarding).
Everything below is live on `https://mentorandi.com` and version-controlled in this repo.

Last verified: 10 August 2026. All 8 mentors × 3 image variants confirmed present locally,
in git, and on the server.

---

## 1. The eight mentors

`slug` is the canonical identifier. Use it as the key everywhere — it matches the image
filenames, the profile page and the accent colour.

| # | Persona name | Role (public name) | slug | Accent | Profile page |
|---|---|---|---|---|---|
| 1 | Marcus | Life Mentor | `marcus-life-mentor` | `#BC5B38` | `/life.html` |
| 2 | Adrian | ADHD Mentor | `adrian-adhd-mentor` | `#C68A38` | `/adhd.html` |
| 3 | Celine | Relationship Mentor | `celine-relationship-mentor` | `#B0654F` | `/relationship.html` |
| 4 | Victor | Stress & Burnout Mentor | `victor-stress-burnout-mentor` | `#A0637A` | `/stress-burnout.html` |
| 5 | Suzan | Parenting Mentor | `suzan-parenting-mentor` | `#9A7B3A` | `/parenting.html` |
| 6 | Leo | Health & Fitness Mentor | `leo-health-fitness-mentor` | `#8E6E52` | `/health-fitness.html` |
| 7 | Elias | Focus Mentor | `elias-focus-mentor` | `#C56B47` | `/focus.html` |
| 8 | Joyce | **Charisma** Mentor | `joyce-confidence-mentor` | `#B58A2E` | `/confidence.html` |

### Two naming traps — read before coding

**Mentor 8 was renamed.** The role was *Confidence Mentor*; it is now **Charisma Mentor**,
and its purpose changed with it — it teaches presence, voice, body language, listening and
storytelling as trainable skills, rather than offering encouragement.

The **slug, filenames and URL still say `confidence`**. That is deliberate: renaming files
would break existing links and indexing. Do not "fix" it. Map it explicitly:

```
slug: joyce-confidence-mentor   →   display name: "Charisma Mentor"
url:  /confidence.html          →   display name: "Charisma Mentor"
```

**Persona names are never bylines.** Marcus, Adrian, Celine, Victor, Suzan, Leo, Elias and
Joyce are synthetic personas. They appear on profile pages and in the chat UI, but published
content is always attributed to the *role* — "From Life Mentor", never "By Marcus". The
personas must never be presented as real authors, experts or practitioners.

---

## 2. Where the images are

```
images/
├── MentorAndIlogo.png                     1106 × 220   logo, transparent PNG
├── mentors/
│   ├── source/    <slug>.png              1122 × 1402  ~2 MB   master files
│   ├── profiles/  <slug>.webp             1000 × 1249  ~90 KB  large portrait
│   └── cards/     <slug>.webp              400 × 499   ~16 KB  small portrait
└── og/            <name>.jpg              1200 × 630   ~90 KB  social share cards
```

All three mentor variants are the **same portrait at different sizes**, 4:5 aspect ratio,
uncropped. Filenames are identical across the three folders — only the folder and extension
change.

**Public URLs** follow the folder structure exactly:

```
https://mentorandi.com/images/mentors/profiles/marcus-life-mentor.webp
https://mentorandi.com/images/mentors/cards/marcus-life-mentor.webp
https://mentorandi.com/images/mentors/source/marcus-life-mentor.png
https://mentorandi.com/images/og/mentor-life.jpg
```

### Which variant to use

| Use | Variant | Why |
|---|---|---|
| Chat avatar, mentor picker, lists | `cards/` | 400 × 499, ~16 KB — small enough to load many at once |
| Mentor profile, onboarding, hero | `profiles/` | 1000 × 1249, retina-sharp up to ~500 px displayed |
| New crops, print, re-processing | `source/` | 1122 × 1402 PNG masters — never ship these to a browser |
| Link previews / social | `og/` | 1200 × 630 JPEG, see §4 |

Round avatars crop from the top: the face sits in the upper portion of the frame. Use
`object-fit: cover; object-position: 50% 22%` as a starting point — that is what the site's
own social cards use.

---

## 3. Complete file list

### `images/mentors/source/` — PNG masters, 1122 × 1402

```
marcus-life-mentor.png            2.1 MB
adrian-adhd-mentor.png            1.9 MB
celine-relationship-mentor.png    1.9 MB
victor-stress-burnout-mentor.png  2.2 MB
suzan-parenting-mentor.png        2.1 MB
leo-health-fitness-mentor.png     2.0 MB
elias-focus-mentor.png            2.0 MB
joyce-confidence-mentor.png       2.0 MB
```

### `images/mentors/profiles/` — WebP, 1000 × 1249

```
marcus-life-mentor.webp           108 KB
adrian-adhd-mentor.webp            72 KB
celine-relationship-mentor.webp    76 KB
victor-stress-burnout-mentor.webp 116 KB
suzan-parenting-mentor.webp        96 KB
leo-health-fitness-mentor.webp     96 KB
elias-focus-mentor.webp            88 KB
joyce-confidence-mentor.webp       88 KB
```

### `images/mentors/cards/` — WebP, 400 × 499

```
marcus-life-mentor.webp            20 KB
adrian-adhd-mentor.webp            12 KB
celine-relationship-mentor.webp    16 KB
victor-stress-burnout-mentor.webp  16 KB
suzan-parenting-mentor.webp        16 KB
leo-health-fitness-mentor.webp     20 KB
elias-focus-mentor.webp            16 KB
joyce-confidence-mentor.webp       16 KB
```

---

## 4. Social cards (`images/og/`)

1200 × 630 JPEG, generated from an HTML template. Used as `og:image` when a link is shared.
Not shown anywhere on the site itself. **Do not use these as avatars** — they are landscape
compositions with text baked in.

Eight mentor cards, named by **page slug**, not by persona:

```
mentor-life.jpg            mentor-parenting.jpg
mentor-adhd.jpg            mentor-health-fitness.jpg
mentor-relationship.jpg    mentor-focus.jpg
mentor-stress-burnout.jpg  mentor-confidence.jpg   ← Charisma Mentor
```

Plus one per article (31 files), named after the article slug.

---

## 5. Machine-readable mapping

```json
[
  { "slug": "marcus-life-mentor",           "persona": "Marcus", "role": "Life Mentor",              "page": "/life.html",           "accent": "#BC5B38", "og": "mentor-life" },
  { "slug": "adrian-adhd-mentor",           "persona": "Adrian", "role": "ADHD Mentor",              "page": "/adhd.html",           "accent": "#C68A38", "og": "mentor-adhd" },
  { "slug": "celine-relationship-mentor",   "persona": "Celine", "role": "Relationship Mentor",      "page": "/relationship.html",   "accent": "#B0654F", "og": "mentor-relationship" },
  { "slug": "victor-stress-burnout-mentor", "persona": "Victor", "role": "Stress & Burnout Mentor",  "page": "/stress-burnout.html", "accent": "#A0637A", "og": "mentor-stress-burnout" },
  { "slug": "suzan-parenting-mentor",       "persona": "Suzan",  "role": "Parenting Mentor",         "page": "/parenting.html",      "accent": "#9A7B3A", "og": "mentor-parenting" },
  { "slug": "leo-health-fitness-mentor",    "persona": "Leo",    "role": "Health & Fitness Mentor",  "page": "/health-fitness.html", "accent": "#8E6E52", "og": "mentor-health-fitness" },
  { "slug": "elias-focus-mentor",           "persona": "Elias",  "role": "Focus Mentor",             "page": "/focus.html",          "accent": "#C56B47", "og": "mentor-focus" },
  { "slug": "joyce-confidence-mentor",      "persona": "Joyce",  "role": "Charisma Mentor",          "page": "/confidence.html",     "accent": "#B58A2E", "og": "mentor-confidence" }
]
```

Image path from a slug:

```
source:  images/mentors/source/{slug}.png
profile: images/mentors/profiles/{slug}.webp
card:    images/mentors/cards/{slug}.webp
og:      images/og/{og}.jpg
```

---

## 6. Brand tokens

Shared by all mentors; the accent (`--h`) changes per mentor.

| Token | Value |
|---|---|
| paper (background) | `#F4EDE1` |
| band (alt background) | `#EFE6D4` |
| surface | `#FFFFFF` |
| ink (headings) | `#201F1B` |
| text | `#4A4539` |
| text-dim | `#6A6456` |
| terracotta (primary CTA) | `#BC5B38` |
| terracotta hover | `#9E4A2C` |

Fonts: **Newsreader** (serif headings), **Hanken Grotesk** (body), **Space Mono**
(labels, eyebrows, monospace detail).

---

## 7. Notes for whoever maintains this

**The masters are large.** The eight source PNGs are ~16 MB together. They are in git, which
is not ideal but is deliberate — they are the only copies of the originals.

**iCloud has offloaded these files once already.** On 9 August, macOS replaced three source
PNGs with `.icloud` placeholder stubs and a `git add -A` committed the deletion. They were
recovered from history on 10 August, and `*.icloud` is now in `.gitignore`. If you work on
this repo from a Mac with iCloud Drive enabled, check that `images/mentors/source/` still
contains eight real PNGs before committing.

**Do not rename any existing file.** URLs are indexed and linked. The `confidence` → Charisma
mismatch is intentional; handle it in a mapping layer, not by renaming.
