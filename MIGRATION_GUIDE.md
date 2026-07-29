# The Glow-Cut — React Migration Guide

This package contains the full migration of the Stitch AI HTML prototype into a modular,
production-ready React application using your exact tech stack: **React (Vite) + React
Router v6 + Axios + React Icons + React Hot Toast + Framer Motion + Tailwind CSS**.

All 24 screens from the prototype were converted with working interactivity — state, form
validation, simulated loading delays, countdowns, modals, and tab switching — not just static
markup.

---

## 1. What's inside

```
glowcut/
├── src/
│   ├── assets/logos/glowcut-logo.svg
│   ├── components/
│   │   ├── layout/      Header (+ AdminHeader), Footer, Sidebar, MobileBottomNav
│   │   ├── ui/           Button, Input, Card, Modal, Loader, Badge, Avatar
│   │   ├── salon/        SalonCard, ServiceCard, BarberCard, ReviewCard
│   │   ├── booking/      BookingCard, BookingTimeline, BookingStatus
│   │   └── rewards/      RewardCard, RewardHistory
│   ├── layouts/          UserLayout.jsx, AdminLayout.jsx, AuthLayout.jsx
│   ├── pages/            all 24 screens, grouped by domain (auth, home, salons, booking, ai,
│   │                     rewards, support, profile, admin) + NotFound
│   ├── routes/AppRoutes.jsx
│   ├── context/          AuthContext, BookingContext, UserContext
│   ├── services/         apiClient, authService, bookingService, salonService, rewardService
│   ├── hooks/             useAuth, useBooking, useSalon
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── index.html
└── package.json
```

Every component, layout, page, and barrel `index.js` file has been verified: all imports
resolve, all named/default exports match, and the entire app bundles cleanly end-to-end with
zero errors (verified using esbuild, the same bundler engine Vite runs on).

---

## 2. Layout architecture

- **`UserLayout`** — wraps every standard client page with the global `Header` (fixed top
  nav), `Footer`, and `MobileBottomNav` (mobile only). Used for Home, Salons, Booking, AI
  Style Consultant, Rewards, Support, and Profile pages.
- **`AdminLayout`** — wraps the two dashboards with a fixed `Sidebar` (nav set changes based on
  whether the route is `/admin/shop/*` or `/admin/global/*`) and a localized sticky
  `AdminHeader`.
- **`AuthLayout`** — clean, distraction-free container for Signup, with its own full-bleed
  background and minimal header/footer (no global nav).
- **`ARVirtualMirror`** deliberately renders **outside** all three layouts — it's a full-screen
  immersive AR experience with its own custom nav bar in the prototype, so nesting it inside
  `UserLayout` would have duplicated the navigation chrome.

## 3. Design system normalization

Two intentional adjustments were made versus the raw Stitch export, per your request to keep
the *intended* cohesive design rather than each file's accidental drift:

1. The **Shopkeeper Dashboard** screen used a one-off cyan/white palette
   (`#00fbfb`/`primary-fixed`) instead of the orange/emerald "Cyber-Chic" system used
   everywhere else. This was normalized to the standard `primary-container` (orange) /
   `secondary` (emerald) tokens so the admin experience matches the rest of the app.
2. The **Gold Subscription** page's gold accent (`#f2ca50`) was *kept* — that's a deliberate
   premium-tier visual differentiator, not a mistake, so it's preserved as-is layered on top of
   the base system.

All images use the original `lh3.googleusercontent.com` placeholder URLs from the Stitch
export, exactly as requested — swap these for your own CDN/asset URLs whenever you're ready.

## 4. State & interactivity that was added

The prototype was static HTML with no inline JS, so all of this is new:

- **Booking flow** — `BookingContext` carries the selected salon → services → stylist →
  time slot → totals across `SalonDetail` → `ConfirmBooking` → `BookingSummary` →
  `WaitingLounge` → `LiveTracking` → `PaymentSuccess`, with live countdown timers on the
  Waiting Lounge and Live Tracking screens that auto-advance to the next step at zero.
- **Forms** — Signup (validation + simulated submit delay), Feedback (star rating + tag
  multi-select), Help & Support (live search filtering + accordion).
- **Admin** — Shopkeeper schedule items can be checked-in / marked done; both dashboards use
  real component state for their bento metrics.
- **AI pages** — Style Consultant simulates a 2.8s scan before revealing biometric data and
  recommendations; AR Mirror has a working hairstyle carousel, length slider, and before/after
  toggle.

## 5. Local setup

```bash
# 1. Unzip and enter the project
cd glowcut

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

> **Note on `node_modules`:** this package does not include `node_modules` — running `npm
> install` in your own environment (with internet access) will fetch React, Vite, Tailwind,
> and the other dependencies listed in `package.json`. This sandbox has no network access, so
> the project was verified with a direct esbuild bundle pass instead of a live `npm run dev`.

## 6. Production build

```bash
npm run build      # outputs to /dist
npm run preview     # serve the production build locally to sanity-check it
```

## 7. Where to plug in your real backend

Every service file (`src/services/*.js`) currently runs in **mock mode** — simulated network
delay + hardcoded data, exactly matching what's in the prototype (salon names, time slots,
reward catalogue, etc.). Each file already calls through a shared `apiClient.js` (Axios
instance), so switching to your real API is a matter of:

1. Set `VITE_API_BASE_URL` in a `.env` file at the project root.
2. In each service file, replace the mock branch with the real `apiClient.get/post(...)` call
   (the real-call scaffolding is already there, just commented/branched out).

## 8. Known follow-ups

- `RewardHistory`/quests are modeled with local UI state on `GlowRewards`, since the prototype's
  "Daily Quests" concept doesn't have a backing service endpoint yet — only the gift-shop
  catalogue (`getAvailableRewards`) and `getReferralStats` exist in `rewardService.js`. Wire up
  a real quests endpoint when one exists.
- `react-hot-toast` notifications are styled inline in `App.jsx`; move to a theme file if you
  want to share that styling elsewhere.
