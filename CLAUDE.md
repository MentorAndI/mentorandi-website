# PROJEKT: mentorandi.com — SEO-artikler + internal linking

Dette er et statisk HTML-marketing-site.

## Deploy-flow

GitHub → GreenGeeks via cPanel Git Version Control. René trykker "Update" i cPanel efter push.

- Hold `index.html` i roden, `images/` ved siden af.
- Omdøb aldrig eksisterende filer.
- Bekræft `git config user.email` = mrlauritsen@hotmail.com før push.

## Opgave

Engelsksprogede SEO-artikler i hub-and-spoke-struktur.

- Hver mentor-profil = hub (pillar).
- 2–4 artikler pr. mentor = spokes, der linker op til hub'en og til hinanden.
- "Related reading"-felt nederst på hver mentor-profil.
- "Insights"-sektion på forsiden.
- Artikler som individuelle HTML-filer i `/articles/`.

## Byline-format

"From ADHD Mentor", "From Life Mentor" osv. — mentornavnet.

**ALDRIG persona-navne** (Adrian, Celine, Marcus osv.). Personaerne er syntetiske og må aldrig
fremstilles som rigtige forfattere/eksperter.

## De otte mentorer

Life, ADHD, Relationship, Stress & Burnout, Parenting, Health & Fitness, Focus, Confidence.

## Positioneringsregler

- Navngiv efter jobbet, ikke tilstanden. Intet klinisk sprog.
- ADHD-mentor KUN eksekutiv funktion (struktur, task initiation, tidsblindhed, accountability)
  — aldrig diagnose, medicin, behandling.
- Medical/therapy-disclaimer på artikler under ADHD, Stress & Burnout, Relationship, Parenting.
- Ingen opdigtede tal. Hver myte-debunk skal have en rigtig, verificerbar kilde.
  Undgå/nuancér de omstridte (power posing, growth-mindset-effektstørrelser, ego-depletion).

## Artikel-emneliste

**Myter:** 21-dages-vanen (Life), vent på motivation (Life), sunde par skændes ikke
(Relationship), modsætninger tiltrækker (Relationship), burnout = ferie (Stress & Burnout),
multitasking (Focus), spot-reduce fat (Health & Fitness), forkæle spædbarn (Parenting), rose børn
for at være kloge (Parenting), ADHD = viljeproblem (ADHD).

**Teknikker:** habit stacking (Life), two-minute rule (Life/ADHD), forbered svær samtale
(Relationship), the repair attempt (Relationship), worry-time (Stress & Burnout), boundaries vs.
barriers (Stress & Burnout), externalising structure (ADHD), progressive overload uden gym
(Health & Fitness), energy-window scheduling (Focus).

**Hvorfor mentor:** mentor vs. coach vs. terapeut (Life), hvorfor vi venter for længe med at bede
om hjælp (Life), hvad persistens betyder i en AI-relation (Life/platform), mentor vs. Google
(Life), når en mentor ikke er nok (alle).

**Indsigt:** parenting guilt / "good enough" (Parenting), hvad voksne med ADHD ville ønske de
vidste (ADHD), den rigtige grund til du stopper med at løbe (Health & Fitness), quiet quitting som
symptom (Stress & Burnout), self-sabotage decoded (Confidence/Life), skam vs. skyld
(Relationship/Confidence).

## Brand-tokens

| Token | Værdi |
|---|---|
| paper | `#F4EDE1` |
| band | `#EFE6D4` |
| ink | `#201F1B` |
| terracotta | `#BC5B38` |
| terracotta hover | `#9E4A2C` |

**Fonte:** Newsreader (serif-overskrifter), Hanken Grotesk (brødtekst), Space Mono
(labels/eyebrows).

## Skrivestil

Naturlig, menneskelig British English. Undgå AI-agtig tone, undgå overdreven brug af bullets og
bold.

## Workflow-regel

Foreslå altid en klynge (titler + søgeord + kilde pr. artikel) og vent på go før der skrives hele
artikler. Commit og push selv, men fortæl hvad der er gjort.
