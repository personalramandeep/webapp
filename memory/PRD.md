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
- **Features**: Toggle tabs (Find a Coach / Find a Player), idle state with "Start Matching" CTA button, 2.5s simulated loading with rotating text, horizontal scrollable cards, premium gating (3 unlocked + 3 locked per category), booking/challenge toast notifications
- **Flow**: Idle (button) → Loading (spinner + rotating text) → Results (scrollable cards). Tab switch resets to idle.
- **Avatars**: Real badminton player photos stored in `/assets/match-player-{1-4}.png`
- **Data**: Mock arrays `MATCHMAKING_COACHES` and `MATCHMAKING_PLAYERS` in `fixtures.js`
- **Testing**: 100% pass rate (iterations 1 & 2)

## Recommended Drills - YouTube Integration (Completed Feb 2026)
- **Location**: Video Analysis Page, right column (replaced old static drills)
- **Components**: Rewritten `RecommendedDrillsCard.js`, new `DrillVideoModal.js`
- **Data**: 50 YouTube drill videos in `src/mocks/youtubeDrills.js` across 10 sections
- **Features**: 
  - "Recommended" / "AI Insights" toggle tabs
  - Shows 5 drills based on player's 2 weakest skills (skill→tag mapping)
  - YT thumbnails, red YT badge, title, description, duration, difficulty, section
  - Click drill → popup modal with embedded YT video (autoplay), title, description, tags
  - Close via X button or overlay click
- **Testing**: 100% pass rate (iteration 3)

## Performance Review Page (Redesigned Feb 2026)
- **Location**: `/review/:videoId`
- **Layout**: Two-column (2/3 video + feedback, 1/3 coach info + drills + review form)
- **Features**:
  - Video player with colored timeline markers (Coach=red, AI=blue, Highlight=green)
  - Filter tabs: Coach Annotations, AI Insights, Key Moments
  - Timeline Feedback cards with timestamps (click to seek video)
  - Coach info card (Arjun Mehta, 4.8 rating)
  - Suggested Drills (3 YouTube drills with modal playback via DrillVideoModal)
  - Review your coach form (star rating, topic tags, textarea, submit with toast)
  - Back to My Sessions link
- **Testing**: 100% pass rate (32/32 test IDs verified, iteration 4)

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
