# Mentor And I — compliance work that belongs in the app, not the website

Raised by the U.S. AI / mental-health legal hardening review, 13 August 2026.

The website side of that review is done and deployed. The items below **cannot** be
solved by website copy. They are product and engineering tasks for whoever is building
the mentor application. Each one is written so it can be handed over on its own.

The governing rule for all of them: **the public legal pages must describe what the
product actually does.** `/ai-safety.html` currently states in plain terms which
safeguards do not exist yet. When one of them ships, that page has to be updated in the
same change — and not before it ships.

---

## 1. In-app AI identity disclosure — required

A footer disclosure on the marketing site is not sufficient. Several jurisdictions
expect the disclosure where the conversation happens.

At the start of every mentor interaction, display:

> *Marcus is an AI mentor, not a human or licensed therapist. Mentor And I provides
> mentoring and self-help support, not therapy, diagnosis or emergency care.*

Substitute the active mentor's name. For long continuing sessions, support a periodic
reminder for jurisdictions that require repeated disclosure:

> *Reminder: you're talking with an AI mentor, not a human. Consider taking a break if
> you've been chatting for a while.*

It must be clear and conspicuous, but it should not be visually aggressive. This is a
product-design problem as much as a legal one.

## 2. Suicide and self-harm safeguards — partially built

**What exists today:** a central system instruction telling mentors not to present
themselves as a substitute for medical or emergency professionals, and, where there are
signs of immediate danger or self-harm, to encourage contacting local emergency services
or qualified human support.

**What does not exist:** runtime detection of suicidal or self-harm language, risk
classification, a deterministic crisis override that interrupts the normal mentoring
flow, and a dedicated crisis-handling path.

Until those are built and tested, `/ai-safety.html` must keep saying so. Do not publish
claims about detection technology, clinical validation or evidence-based screening
instruments unless the safety team has verified that the product actually uses them.

## 3. Illinois — needs a product decision, not copy

The Illinois Wellness and Oversight for Psychological Resources Act needs review by U.S.
counsel against Mentor And I specifically. Until that review has happened:

- do not market Mentor And I as therapy in Illinois;
- do not claim therapeutic or mental-health treatment outcomes;
- do not let mentor copy imply diagnosis or treatment;
- treat geofencing or restricted functionality in Illinois as an open product decision.

Deliberately **not** on the public website: speculative claims about what a particular
state's law requires are worse than silence.

## 4. Advertising and tracking — hard prohibition

Do not deploy advertising pixels, retargeting pixels or behavioural advertising trackers
on any of:

signup and onboarding · authenticated mentor pages · conversations · goals · memories ·
feedback · account and settings · health-related mentor selection events

Never send to an advertising platform: conversation content, mentor selection that
indicates a health condition, health inferences, or email addresses associated with
health interactions.

Analytics in these areas needs separate privacy and legal review before it is
introduced. The website currently loads zero third-party scripts and sets no cookies;
`/cookies.html` says so, and that has to stay true.

## 5. Age confirmation at signup

The 18+ requirement is in the Terms, but hiding it there is not enough. Signup should
require an affirmative confirmation:

> ☐ I confirm that I am 18 years of age or older.

Do not launch anything aimed at minors without separate legal, safety, privacy and
product review.

## 6. Persona and relationship safety

Neither the website nor the app should ever suggest that a mentor is alive, has human
feelings, loves or needs the user, depends on the user emotionally, should replace human
relationships, should be kept secret from family or professionals, is the user's
therapist, or has a clinical relationship with the user.

The requirement is **not** to make the mentors cold. Warmth, continuity and memory are
the product. The line to hold is:

> a consistent AI mentor that knows your context — **not** a synthetic human being.

## 7. Consumer health data — verify before the app ships

`/consumer-health-data-privacy.html` describes categories, purposes, sharing and
retention. Before real users exist, confirm each one matches the implementation:

- the categories of consumer health data actually stored;
- whether health data is ever used for anything beyond providing the requested service;
- actual retention periods per category;
- what deletion actually removes, and what survives it;
- the real list of subprocessors behind the published categories.

The published processor categories are: hosting and infrastructure; authentication;
databases and storage; AI model processing; email delivery; payment processing; security
and monitoring; customer support. If the real list differs, the page is wrong.

## 8. Never publish without verification

Do not add any of these claims anywhere unless it has been separately verified and
approved: *HIPAA compliant · clinically validated · FDA approved · medical grade ·
therapist-level · evidence-based suicide detection.*
