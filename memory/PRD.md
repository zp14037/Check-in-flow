# Della Resorts · Experience Management System — PRD

## Original Problem Statement
Build a luxury hotel check-in management system for "Della Resorts, Lonavala" — a world-class premium resort brand. Frontend-only demo with session memory (React Context + localStorage) and dummy data. Stack: React + Tailwind + Framer Motion + Lucide + Recharts + React Router DOM + qrcode.react. Six stakeholder dashboards + a guest WhatsApp → check-in flow.

## User Personas
1. **Receptionist / Front Desk** — manages today's arrivals, verifies IDs.
2. **Reservation Team** — parses incoming booking emails, reconciles channels.
3. **Sales Team** — corporate lead pipeline (CRM kanban).
4. **Group Coordinator** — event/wedding check-in tracker.
5. **General Manager** — executive overview across all modules.
6. **Guest** — pre-arrival WhatsApp → multi-step check-in form.

## Core Requirements (Static)
- Global luxury design system: gold #C9A84C / onyx #0D0D0D / ivory #F5F0E8 / forest #0D1F0F palette, Cormorant Garamond + Montserrat + Inter.
- Official Della logo PNG used as the primary brand mark across landing, dashboard shell, and guest flow.
- Shared luxury components: `SourceChannelPill` (7 distinct sources), `StatusPill`, `GoldButton`, `GoldParticles`, `DashboardShell`, `PhoneFrame`, `StatusBar`, `ProgressDots`, `DetailChip`, `LuxField` (Field + SelectField), `IDUploadCard`, `DellaLogo`.
- React Context (`AppContext`) + localStorage (key `della_resorts_state_v1`) for cross-screen session memory.
- React Router DOM routes for all 7 screens.

## Animation Policy (Locked by user)
- Guest flow → full luxury animations (delivery sequence, slide transitions, preloader, checkmark draw, glow pulse).
- Group QR screen → fancy animated QR (Phase 2).
- Landing → 20 gold particles (subtle).
- Staff dashboards → zero decorative animation.

## Phase 1 — DONE (Feb 2026)
- [x] Design system, Tailwind tokens, Google Fonts.
- [x] `AppContext` with 7 seeded reservations + RES-2401 enriched (primary guest, co-guests, child guest).
- [x] Landing screen with Della logo + 20 gold particles + 3x2 role cards.
- [x] 6 placeholder dashboards (Receptionist, Reservation, Sales, Group, GM, Guest stub).

## Phase 2 — DONE (Feb 2026)
- [x] Full `/guest` rebuild with 8-stage state machine:
  - G1 WhatsApp dark-mode chat preview with sequential bubble delivery + double-tick + "Opened" indicator
  - G1.5 Preloader (D monogram, 8 radiating dots, 200px progress bar, 2.3s)
  - G2 Welcome hero with staggered chip reveal + progress dots
  - Step 1 Personal Details (pre-filled + DOB + ID type + mock ID upload)
  - Step 2 Co-guests (1 adult card + collapsible child section + legal notice)
  - Step 3 Occasion grid + reveal + shimmer incentive banner + special requests + dietary scroll + arrival time
  - Step 4 Signature canvas + consent gating + Submit button
  - G5 Confirmation with SVG checkmark draw + glow pulse + glass summary + gold-framed QR code (qrcode.react)
- [x] Session memory ripple verified: submit → `/receptionist` shows "Submitted ✓" + Form Submitted pill, `/gm` activity log gets entry, persists across page reload.
- [x] Testing agent end-to-end 100% pass (iteration_1.json).

## Backlog (P0/P1/P2)
### P0 — Next phase
- Receptionist drawer: ID upload review + signature display + complete check-in.
- Reservation email parser UI.
- GM Recharts dashboards (occupancy, revenue, channel mix).

### P1
- Sales CRM kanban (drag-and-drop deals).
- Group Coordinator QR scan + animated gold burst.
- Multi-guest support on Step 2 (swipe through N companions).

### P2
- Multi-language (EN/HI).
- Mock real-time push (faux WebSocket).
- Demo "tour mode" walkthrough overlay.
- Evergreen arrival dates (relative to today).
- Strip signature dataURL from localStorage payload (size optimisation).

## File Map
- `/app/frontend/src/App.js` — router root
- `/app/frontend/src/context/AppContext.jsx`
- `/app/frontend/src/components/della/*` — shared luxury components
- `/app/frontend/src/pages/Landing.jsx`
- `/app/frontend/src/pages/placeholders/*.jsx` — 5 dashboards + (deprecated) old GuestView
- `/app/frontend/src/pages/guest/GuestFlow.jsx` — guest experience orchestrator
- `/app/frontend/src/pages/guest/{WhatsappPreview,Preloader,WelcomeHero,Step1Personal,Step2CoGuests,Step3Preferences,Step4Signature,Confirmation,StepShell}.jsx`
- `/app/frontend/public/della-logo.png`
