# Mentor And I — compliance work that belongs in the app, not the website

Raised by the U.S. AI / mental-health legal hardening review, 13 August 2026.

The website side of that review is done and deployed. The items below cannot be solved by website copy. They are product and engineering tasks for the mentor application.

The governing rule: public legal pages must describe what the product actually does. The AI Safety page must be updated only when corresponding runtime safeguards have shipped and been verified.

This file is the website-to-app bridge. The canonical implementation backlog should live in the Mentor And I application repository.

## 1. In-app AI identity disclosure
Add clear in-product AI identity disclosure and periodic reminders where applicable.

## 2. Safety safeguards — partially built
The central prompt currently contains a basic emergency-safety instruction. This is a prompt safeguard only and must not be described as an independent runtime detection system. A dedicated runtime safety layer, classification, deterministic override and dedicated handling path remain to be built and tested.

## 3. Illinois — product decision required
Review the applicable Illinois requirements with U.S. counsel before broader launch. Do not market the product as therapy or imply diagnosis/treatment. Geofencing or restricted functionality remains an open product decision.

## 4. Advertising and tracking
Do not deploy advertising or retargeting trackers in authenticated or health-related product flows without separate privacy/legal review.

## 5. Age confirmation
Require affirmative 18+ confirmation at signup before broader external alpha or production launch.

## 6. Persona and relationship safety
Keep mentors clearly identified as AI. Warmth, continuity and memory are core product features, but the product must not imply a human or clinical relationship.

## 7. Consumer health data verification
Before broader external alpha or production launch, verify stored data categories, purposes, retention, deletion behavior and processor/subprocessor categories against the published privacy pages.

## 8. Unverified claims
Do not publish regulated or clinical compliance claims unless separately verified and approved.
