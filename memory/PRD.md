# Della Resorts · Experience Management System — PRD

## Original Problem Statement
Build a luxury hotel check-in management system for "Della Resorts, Lonavala" — a world-class premium resort brand. Frontend-only demo with session memory (React Context + localStorage) and dummy data. Stack: React + Tailwind + Framer Motion + Lucide + Recharts + React Router DOM. Six stakeholder dashboards + a guest WhatsApp-style flow.

## User Personas
1. **Receptionist / Front Desk** — manages today's arrivals, verifies IDs.
2. **Reservation Team** — parses incoming booking emails, reconciles channels.
3. **Sales Team** — corporate lead pipeline (CRM kanban).
4. **Group Coordinator** — event/wedding check-in tracker.
5. **General Manager** — executive overview across all modules.
6. **Guest** — pre-arrival WhatsApp → check-in form experience.

## Core Requirements (Static)
- Global luxury design system: gold/onyx/ivory/forest palette, Cormorant Garamond + Montserrat + Inter.
- Shared `SourceChannelPill` with 7 distinct colorful sources (Direct/Booking/MMT/Sales/WhatsApp/Walk-in/Group).
- Shared `StatusPill`, `GoldButton`, `DashboardShell`, `GoldParticles`.
- React Context (`AppContext`) + localStorage for cross-screen session memory.
- React Router DOM routes for all 7 screens.

## Animation Policy (Locked by user)
- Guest flow → full luxury animations.
- Group QR screen → fancy animated QR.
- Landing → 20 gold particles (subtle).
- Staff dashboards → zero decorative animation; only functional micro-interactions.

## Phase 1 — DONE (Feb 2026)
- [x] Tailwind config + index.css with Della color tokens & font variables.
- [x] Google Fonts loaded (Cormorant Garamond, Montserrat, Inter).
- [x] `AppContext` with 7 seeded reservations + `markFormSubmitted` / `markIdVerified` / activity log / resetDemo.
- [x] Shared components: `SourceChannelPill`, `StatusPill`, `GoldButton`, `GoldParticles`, `DashboardShell`.
- [x] Landing page (`/`) — animated gold particles, 3x2 role grid, Della wordmark.
- [x] Placeholder dashboards for all 6 roles wired via React Router.
- [x] Functional end-to-end demo flow: Guest submits form → Receptionist sees "Submitted ✓" → Receptionist verifies ID → state persists in localStorage and reflects in GM dashboard.

## Backlog (P0/P1/P2)
### P0 — Next phase
- Full guest WhatsApp-style multi-step check-in form with luxury transitions.
- Receptionist drawer: ID upload mock + signature + arrival timeline.
- Reservation email parser UI (paste raw email → extracted fields).

### P1
- Sales CRM kanban (drag-and-drop deals across 5 stages).
- Group Coordinator QR scan screen + animated gold burst on success.
- GM Recharts dashboards (occupancy, revenue, channel mix bar/donut).

### P2
- Multi-language toggle (EN/HI).
- Mock real-time push (faux WebSocket via setInterval).
- Demo "tour mode" walkthrough overlay.

## File Map
- `/app/frontend/src/App.js` — router root
- `/app/frontend/src/context/AppContext.jsx` — session memory
- `/app/frontend/src/components/della/*` — shared luxury components
- `/app/frontend/src/pages/Landing.jsx` — landing/role selector
- `/app/frontend/src/pages/placeholders/*.jsx` — 6 dashboard placeholders
