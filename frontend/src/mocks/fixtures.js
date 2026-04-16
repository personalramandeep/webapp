export const MOCK_PLAYER = {
  id: 'p1',
  name: 'Ramandeep Singh',
  username: 'ramansingh',
  email: 'info@mindfieldsglobal.com',
  city: 'Delhi',
  picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ramansingh',
  role: 'player',
};

export const MOCK_COACH_IDENTITY = {
  id: 'c1',
  name: 'Prabhsharan Kour',
  username: 'prabsharank',
  email: 'prabsharan@kreeda.tech',
  picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prabsharan',
  role: 'coach',
  rating: 3.0,
  specialization: 'Defence & Footwork',
  totalSessions: 0,
  pendingReviews: 0,
  inReviewCount: 5,
};

export const MOCK_DASHBOARD_STATS = {
  totalVideos: 4,
  aiScore: 72,
  ranking: 2,
  streak: 1,
  improvement: 0,
};

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sumit Singh', city: 'Mumbai', score: 78, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sumit' },
  { rank: 2, name: 'Ramandeep Singh', city: 'Delhi', score: 72, picture: MOCK_PLAYER.picture },
];

const COURT_THUMBS = [
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400',
  'https://images.unsplash.com/photo-1599586120429-48719d1a20f6?w=400',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&sat=-100',
  'https://images.unsplash.com/photo-1599586120429-48719d1a20f6?w=400&blur=10',
];

export const MOCK_VIDEOS = COURT_THUMBS.map((thumbnail, i) => ({
  id: `v-seed-${i + 1}`,
  title: `Match ${i + 1}`,
  thumbnail,
  videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  uploadedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  duration: 42,
  aiScore: 72,
  grade: 'B',
  status: 'analyzed',
}));

export const MOCK_COACHES = [
  {
    id: 'coach-prab',
    name: 'Prabhsharan Kour',
    specialization: 'Defence & Footwork',
    rating: 3.0,
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=prabsharan',
  },
  {
    id: 'coach-sumit',
    name: 'Sumit Singh',
    specialization: 'Footwork',
    rating: 3.5,
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sumit',
  },
];

// Prefilled so seed videos show review activity like Image 4
export const SEED_COACH_REQUESTS = [
  { id: 'req-seed-1', videoId: 'v-seed-1', coachId: 'coach-prab', status: 'in_review', note: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'req-seed-2', videoId: 'v-seed-1', coachId: 'coach-sumit', status: 'in_review', note: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const SUGGESTED_AI_PROMPTS = [
  { emoji: '🦶', label: 'Analyze Footwork', prompt: 'How can I improve my footwork in this match?' },
  { emoji: '🏸', label: 'Suggest Drills', prompt: 'Which drills should I focus on given my weakest skill?' },
  { emoji: '📈', label: 'Show Progress', prompt: 'How does this score compare to my previous matches?' },
  { emoji: '🥅', label: 'Net Play Tips', prompt: 'Give me 3 actionable tips for better net play.' },
];

export const MOCK_AI_CHAT_HISTORY = [
  { id: 'h1', title: 'Footwork review — today', updatedAt: new Date().toISOString() },
  { id: 'h2', title: 'Smash angle advice', updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'h3', title: 'Recovery positioning', updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'h4', title: 'Defensive lift drills', updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'h5', title: 'Pre-match warm-up', updatedAt: new Date(Date.now() - 4 * 86400000).toISOString() },
];

export const COACH_FEEDBACK_TAGS = ['General', 'Footwork', 'Defense', 'Smash', 'Serve'];
export const ANNOTATION_COLORS = ['#F45831', '#FFFFFF', '#FBBF24', '#10B981', '#EF4444'];

// Pre-seeded coach feedback + drill suggestions for the Performance Review page
// (shown when a player opens a video that a coach has already reviewed)
export const SEED_COACH_FEEDBACK = {
  'v-seed-1': [
    { id: 'f1', timestamp: 12, text: 'Good split step here, but recover faster to base.', tags: ['Footwork'] },
    { id: 'f2', timestamp: 24, text: 'Racket too low — lift earlier for a cleaner clear.', tags: ['Defense'] },
    { id: 'f3', timestamp: 31, text: 'Excellent body rotation on that smash!', tags: ['Smash'] },
    { id: 'f4', timestamp: 38, text: 'Net kill opportunity missed — you were flat-footed.', tags: ['Footwork', 'Smash'] },
  ],
};

export const SEED_SUGGESTED_DRILLS = {
  'v-seed-1': [
    { id: 'd1', title: 'Split-step ladder', duration: '10 min', difficulty: 'Medium', category: 'Footwork', thumbnail: COURT_THUMBS[0] },
    { id: 'd2', title: 'Shadow defensive clears', duration: '12 min', difficulty: 'Easy', category: 'Defense', thumbnail: COURT_THUMBS[1] },
    { id: 'd3', title: 'Jump smash progression', duration: '15 min', difficulty: 'Hard', category: 'Smash', thumbnail: COURT_THUMBS[2] },
    { id: 'd4', title: 'Net kill reaction drill', duration: '8 min', difficulty: 'Medium', category: 'Net Play', thumbnail: COURT_THUMBS[3] },
  ],
};
