# Stripe billing — what the website emits, and what the app must serve

Written 23 August 2026, in response to the live Stripe billing handoff.

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
| 5 — `single` → `/signup?plan=single` | **Done.** |
| 6 — `plus` → `/signup?plan=plus` | **Done.** |
| 7 — `premium` → `/signup?plan=premium` | **Done.** |
| 13 — displayed prices | **Done.** $19 / $39 / $69 / $125 exactly as specified. |
| 15 — no sandbox IDs mixed in | **Done.** There are none of either kind. |

## The URLs the website emits

These are the only billing entry points on the site. They are plain links in static
HTML; nothing else happens client-side.

```
/signup?plan=free        Free Trial      $0    no Stripe subscription
/signup?plan=single      Single Mentor   $19/month
/signup?plan=plus        Mentor Plus     $39/month
/signup?plan=premium     Premium         $69/month
```

**All four currently return 404.** The app does not serve `/signup` yet. Until it does,
every pricing button on the live site is a dead end for a real visitor. This is the most
urgent item, ahead of anything to do with webhooks.

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

### Credit top-up packs stay published

Handoff item 14 says credit top-up prices are not approved. The site nevertheless
advertises three of them:

```
$10 · 500 credits      $25 · 1,500 credits      $50 · 3,500 credits
```

plus the line *"Need more? Buy extra Mentor Credits at any time."*

René has confirmed these prices are correct and simply not yet created in Stripe, and
asked for them to stay. Recording it here because the site is currently advertising a
purchase that cannot be completed, and whoever builds the top-up flow should use exactly
these three prices.

The monthly credit allowances shown on each plan (800 / 2,000 / 5,000) are part of the
subscriptions and are unaffected.

---

## What the app still owes

Everything below is outside this repository.

1. **Serve `/signup`** and accept the four plan keys above. Nothing else on the site works
   until this exists.
2. Server-side Checkout endpoint, `subscription` mode, Price IDs from production
   environment variables only.
3. Free Trial must not create a Stripe subscription or a Checkout Session.
4. Production webhook endpoint, separate from staging, subscribed to
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_succeeded`, `invoice.payment_failed`.
5. Verify webhook signatures. Make handling idempotent — Stripe retries.
6. Map verified subscription state to internal entitlements.
7. Lift the live-key restriction in **production configuration only**; staging stays in
   test mode.
8. Account, settings and billing-portal flows showing the same four plans.

## Launch gate

Before the pricing buttons are opened to the public, run one controlled real payment on
production and confirm the whole chain:

> checkout → payment → signed webhook → subscription record → correct entitlement →
> customer portal → cancellation

Until that passes, the buttons should not be advertised as working. They currently 404,
which is at least an honest failure rather than a broken payment.
