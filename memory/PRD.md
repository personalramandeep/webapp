# Kreeda — AI-Powered Badminton Coaching Platform

## Product Overview
Kreeda analyzes badminton videos to deliver data-driven coaching insights. Currently operates as a frontend MVP/mockup with hardcoded data. Authentication and real backend storage intentionally removed.

## Core Requirements
- Split-screen login page with role selection (Player / Coach)
- Player Dashboard with video uploads, AI scores, leaderboard, notifications
- Video Analysis Page with skill breakdown, court heatmap, key moments, drills, AI coach chat
- Coach Marketplace and Coach Profile pages
- Consistent dark charcoal theme (`bg-kreeda-charcoal: #2D2926`)

## Tech Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: FastAPI (SSE streaming for AI chat only)
- **Data**: All mocked via `src/mocks/fixtures.js` — no MongoDB interaction
- **AI Chat**: `emergentintegrations` with Emergent LLM Key

## What's Implemented
- Login page, Player Dashboard, Video Analysis Page, Coach Dashboard, Coach Marketplace, Coach Profile
- AI Coach Chat Panel (SSE streaming)
- Smart Matchmaking UI component (Feb 2026)

## Smart Matchmaking (Completed Feb 2026)
- **Location**: Video Analysis Page, between Court Coverage and Key Moments
- **Components**: `SmartMatchmaking.js`, `CoachMatchCard.js`, `PlayerMatchCard.js`
- **Features**: Toggle tabs (Find a Coach / Find a Player), 2.5s simulated loading with rotating text, horizontal scrollable cards, premium gating (3 unlocked + 3 locked per category), booking/challenge toast notifications
- **Data**: Mock arrays `MATCHMAKING_COACHES` and `MATCHMAKING_PLAYERS` in `fixtures.js`
- **Testing**: 100% pass rate (24/24 test IDs verified)

## Backlog
- **P1**: Cleanup unused Auth components (`AuthCallback.js`) and backend auth endpoints
- **P2**: Implement real backend endpoints and MongoDB storage
- **P2**: Integrate actual video processing/MediaPipe for real analysis

## Architecture
```
/app/frontend/src/
├── components/
│   ├── analysis/          # Modular analysis cards
│   │   ├── SmartMatchmaking.js
│   │   ├── CoachMatchCard.js
│   │   ├── PlayerMatchCard.js
│   │   └── ... (12 other analysis components)
│   ├── coach/             # Coach marketplace & dashboard
│   ├── dashboard/         # Sidebar, header, stats
│   └── VideoAnalysisPage.js
├── mocks/fixtures.js      # All mock data
├── pages/CoachProfile.js
└── App.js
/app/backend/
├── server.py
└── routes/ai_coach.py     # SSE streaming endpoint
```
