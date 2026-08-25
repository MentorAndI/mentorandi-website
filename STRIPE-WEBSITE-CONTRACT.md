# Stripe billing — what the website emits, and what the app must serve

Written 23 August 2026, in response to the live Stripe billing handoff. Updated
24 August 2026 after the production app signup routes became available, and
25 August 2026 with the authoritative credit top-up packages.

`mentorandi.com` is a **static HTML site on shared hosting**. It has no server, no
database, no sessions and no secrets. Almost every item in the billing handoff is
therefore application work. This file records the boundary: what the marketing site
guarantees, and what it needs back from the app.

---

## Already satisfied by the website

| Handoff item | Status |
|---|---|
| 2 — no Stripe config in frontend or Git | **Done.** No key, Price ID or `stripe` string exists anywhere in the site or in git history. Verified 23 Aug 2026. |
| 3 — no hard-coded Stripe Checkout URLs | **Done.** Buttons point at the app's own signup route. |
| 5 — `single` → `https://app.mentorandi.com/signup?plan=single` | **Done.** |
| 6 — `plus` → `https://app.mentorandi.com/signup?plan=plus` | **Done.** |
| 7 — `premium` → `https://app.mentorandi.com/signup?plan=premium` | **Done.** |
| 13 — displayed prices | **Done.** $19 / $39 / $69 / $125 exactly as specified. |
| 15 — no sandbox IDs mixed in | **Done.** There are none of either kind. |

## The URLs the website emits

These are the only billing entry points on the site. They are plain links in static
HTML; nothing else happens client-side.

```
https://app.mentorandi.com/signup?plan=free        Free Trial      $0    no Stripe subscription
https://app.mentorandi.com/signup?plan=single      Single Mentor   $19/month
https://app.mentorandi.com/signup?plan=plus        Mentor Plus     $39/month
https://app.mentorandi.com/signup?plan=premium     Premium         $69/month
https://app.mentorandi.com/credits                 Credit top-ups        authenticated
```

The credits link carries no plan, price or quantity. It is a plain link to the
authenticated purchase flow; the app decides what is on offer and at what price.

The production marketing links intentionally use absolute URLs on
`app.mentorandi.com`. The marketing site and app are hosted separately, so relative
`/signup` links would incorrectly resolve on `mentorandi.com`. The production app serves
all four signup routes and uses the plan key to preselect the corresponding plan.

### `?plan=` is a hint, not an authorisation

The query parameter exists so the signup screen can preselect the right plan. It is
supplied by the browser and can be edited by anyone. Per handoff item 12, the server must
resolve the price from its own configuration keyed on the plan name, and must derive
entitlements from verified Stripe subscription state — never from this parameter.

---

## Two deliberate deviations, decided by René on 23 August 2026

### Company Stress Mentor stays hidden

A live Stripe price exists for `company_stress` at $125/user/month, but the block is
**hidden on the website** (`.not-yet` wrapper, `display:none`) because it is not being
sold yet. The markup is intact in the DOM and can be restored by removing the wrapper and
the CSS rule.

Its button currently points at `/company-stress-mentor`, which does not exist. Before the
block is ever unhidden, that link needs a destination — and per handoff item 8 it should
be a company onboarding or sales flow with seat quantity, not consumer self-serve
checkout.

### Credit top-up packs — live and purchasable

**Superseded 25 August 2026.** Handoff item 14 said top-up prices were not approved, and
an earlier version of this file recorded them as 500 / 1,500 / 3,500 credits. Both are out
of date. The authoritative packages are:

```
$10 · 1,000 credits      $25 · 2,500 credits      $50 · 5,000 credits
```

**These products already exist in live Stripe.** The $10 / 1,000-credit package has been
tested end to end in production. Do **not** create replacement Stripe products — reuse the
existing ones.

The site links these three packages to the authenticated purchase flow at
`https://app.mentorandi.com/credits`. That route is behind authentication and redirects
signed-out visitors to `/login?next=%2Fcredits`, which returns them to the purchase page
after sign-in.

**Top-ups require an active subscription.** A Free Trial user cannot buy them. The site
said *"Need more? Buy extra Mentor Credits at any time"* — an unconditional promise the
app does not honour — and the FAQ repeated it one sentence after inviting the reader to
start free. Both were corrected on 25 August 2026 to *"Active subscribers can buy extra
Mentor Credits whenever needed"* and *"subscribers can buy more whenever they need to"*.

Anyone changing this copy must keep the subscriber qualifier. The packages remain visible
to signed-out and Free Trial visitors, which is intended — they show what a subscription
leads to. The eligibility rule itself is enforced by the app, not the website.

The monthly credit allowances shown on each plan are part of the subscriptions and are
unaffected.

---

## What the app still owes

Everything below is outside this repository.

1. Server-side Checkout endpoint, `subscription` mode, Price IDs from production
   environment variables only.
2. Free Trial must not create a Stripe subscription or a Checkout Session.
3. Production webhook endpoint, separate from staging, subscribed to
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_succeeded`, `invoice.payment_failed`.
4. Verify webhook signatures. Make handling idempotent — Stripe retries.
5. Map verified subscription state to internal entitlements.
6. Lift the live-key restriction in **production configuration only**; staging stays in
   test mode.
7. Account, settings and billing-portal flows showing the same four plans.

## Launch gate

The website-to-app handoff can be verified without entering checkout: each marketing CTA
must load its matching production app signup page with the correct plan preselected.

End-to-end billing validation remains an app and operations responsibility. When it is
authorised separately, run one controlled real payment on production and confirm the
whole chain:

> checkout → payment → signed webhook → subscription record → correct entitlement →
> customer portal → cancellation

That payment test is outside this static website's deployment and must not be performed
as part of a marketing-link verification.
