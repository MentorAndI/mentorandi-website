# Answers for Codex — where the mentor portraits are

Direct answers to the six questions, then a script that fetches the files.
Verified 10 August 2026 against the live repository.

---

## 1. Repository name

```
MentorAndI/mentorandi-website
```

Full URL: `https://github.com/MentorAndI/mentorandi-website`
**Visibility: public** — no token needed to fetch raw files.

## 2. Branch name

```
main
```

(Default branch. Verified commit at time of writing: `5d8c7d6`.)

## 3. Exact folder paths

Paths are relative to the repository root. There is no `public/` folder in this repo — it is
a plain static site, not a Next.js app.

```
images/mentors/cards/      400 × 499   WebP   ~16 KB each
images/mentors/profiles/  1000 × 1249  WebP   ~90 KB each
images/mentors/source/    1122 × 1402  PNG    ~2 MB each   (masters — do not ship to browser)
```

## 4. Are the files committed?

**Yes.** All 16 WebP files (8 cards + 8 profiles) are committed on `main` and pushed.
All 16 return HTTP 200 from raw.githubusercontent.com — verified individually.

## 5. Should they be copied into the app's public folder?

**Yes — copy them, keeping both folders and the exact filenames:**

```
public/images/mentors/cards/<slug>.webp
public/images/mentors/profiles/<slug>.webp
```

Do not rename to `marcus.png` etc. The full slug is the identifier used across the website,
the social cards and the asset documentation, and short names will drift out of sync.

The eight `marcus.png`-style files currently in the app repo are **not** the approved
portraits. Replace them.

Skip `source/` — those are 2 MB PNG masters for re-processing, never for serving.

## 6. Joyce — confirmed

```
file slug:     joyce-confidence-mentor      ← keep, do not rename
display role:  Charisma Mentor              ← use in all UI
persona name:  Joyce
page:          /confidence.html
accent:        #B58A2E
```

The mentor was renamed from *Confidence Mentor* to *Charisma Mentor*. Files and URLs keep
`confidence` deliberately, so existing links and search indexing do not break. Handle the
difference in a mapping layer.

---

## Fetch script

Run from the root of the Next.js app repo. Downloads all 16 files into the right places.

Slugs are listed inline rather than held in a variable, so this behaves identically in bash
and zsh — zsh does not word-split unquoted variables, and a `for s in $SLUGS` loop silently
fails there.

```bash
RAW="https://raw.githubusercontent.com/MentorAndI/mentorandi-website/main/images/mentors"

mkdir -p public/images/mentors/cards public/images/mentors/profiles

for v in cards profiles; do
  for s in marcus-life-mentor adrian-adhd-mentor celine-relationship-mentor \
           victor-stress-burnout-mentor suzan-parenting-mentor \
           leo-health-fitness-mentor elias-focus-mentor joyce-confidence-mentor; do
    curl -fsSL "$RAW/$v/$s.webp" -o "public/images/mentors/$v/$s.webp" \
      && echo "ok   $v/$s.webp" \
      || echo "FAIL $v/$s.webp"
  done
done
```

Verify afterwards — expect 8 and 8:

```bash
ls public/images/mentors/cards/*.webp | wc -l
ls public/images/mentors/profiles/*.webp | wc -l
```

---

## The eight files, exactly

### `cards/` — 400 × 499, use for avatars, mentor picker, lists

```
marcus-life-mentor.webp
adrian-adhd-mentor.webp
celine-relationship-mentor.webp
victor-stress-burnout-mentor.webp
suzan-parenting-mentor.webp
leo-health-fitness-mentor.webp
elias-focus-mentor.webp
joyce-confidence-mentor.webp
```

### `profiles/` — 1000 × 1249, use for mentor detail, onboarding, hero

Same eight filenames.

### Raw URL pattern

```
https://raw.githubusercontent.com/MentorAndI/mentorandi-website/main/images/mentors/cards/{slug}.webp
https://raw.githubusercontent.com/MentorAndI/mentorandi-website/main/images/mentors/profiles/{slug}.webp
```

Also served from the live site, if you prefer to hotlink during development:

```
https://mentorandi.com/images/mentors/cards/{slug}.webp
https://mentorandi.com/images/mentors/profiles/{slug}.webp
```

---

## Mentor mapping

```json
[
  { "slug": "marcus-life-mentor",           "persona": "Marcus", "role": "Life Mentor",             "accent": "#BC5B38" },
  { "slug": "adrian-adhd-mentor",           "persona": "Adrian", "role": "ADHD Mentor",             "accent": "#C68A38" },
  { "slug": "celine-relationship-mentor",   "persona": "Celine", "role": "Relationship Mentor",     "accent": "#B0654F" },
  { "slug": "victor-stress-burnout-mentor", "persona": "Victor", "role": "Stress & Burnout Mentor", "accent": "#A0637A" },
  { "slug": "suzan-parenting-mentor",       "persona": "Suzan",  "role": "Parenting Mentor",        "accent": "#9A7B3A" },
  { "slug": "leo-health-fitness-mentor",    "persona": "Leo",    "role": "Health & Fitness Mentor", "accent": "#8E6E52" },
  { "slug": "elias-focus-mentor",           "persona": "Elias",  "role": "Focus Mentor",            "accent": "#C56B47" },
  { "slug": "joyce-confidence-mentor",      "persona": "Joyce",  "role": "Charisma Mentor",         "accent": "#B58A2E" }
]
```

---

## Two rules that are not negotiable

**Never rename the files.** URLs are indexed and referenced across the website, the social
cards and this documentation. The `confidence` / Charisma mismatch is intentional.

**Persona names are never used as bylines.** Marcus, Adrian, Celine, Victor, Suzan, Leo,
Elias and Joyce are synthetic personas. They can appear in the chat UI and on profile pages,
but authored content is always attributed to the role — "From Life Mentor", never
"By Marcus" — and the personas must not be presented as real people or credentialled experts.

## Portrait framing

All three variants are the same 4:5 portrait, uncropped, face in the upper part of the frame.
For circular avatars, crop from the top:

```css
object-fit: cover;
object-position: 50% 22%;
```
