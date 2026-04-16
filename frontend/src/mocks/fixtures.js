export const MOCK_PLAYER = {
  id: 'p1',
  name: 'Ramandeep Singh',
  username: 'ramansingh',
  email: 'info@mindfieldsglobal.com',
  city: 'Delhi',
  picture: '/assets/raman-avatar.png',
  role: 'player',
};

export const MOCK_COACH_IDENTITY = {
  id: 'c1',
  name: 'Coach Priya',
  username: 'coachpriya',
  email: 'priya@kreeda.tech',
  picture: '/assets/coach-priya-avatar.png',
  role: 'coach',
  rating: 4.8,
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

// 10 mock leaderboard entries — fuels the scrolling ticker
export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Sumit Singh', city: 'Mumbai', score: 2180, change: +15, picture: '/assets/sumit-avatar.png' },
  { rank: 2, name: 'Ramandeep Singh', city: 'Delhi', score: 2045, change: +8, picture: MOCK_PLAYER.picture, isMe: true },
  { rank: 3, name: 'Arjun Menon', city: 'Bangalore', score: 1987, change: -3, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun' },
  { rank: 4, name: 'Priya Nair', city: 'Chennai', score: 1912, change: +22, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' },
  { rank: 5, name: 'Vikram Rao', city: 'Hyderabad', score: 1876, change: +4, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram' },
  { rank: 6, name: 'Aisha Khan', city: 'Pune', score: 1821, change: -7, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha' },
  { rank: 7, name: 'Rohan Das', city: 'Kolkata', score: 1798, change: +11, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan' },
  { rank: 8, name: 'Nisha Patel', city: 'Ahmedabad', score: 1754, change: 0, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nisha' },
  { rank: 9, name: 'Karan Malhotra', city: 'Chandigarh', score: 1702, change: +6, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karan' },
  { rank: 10, name: 'Divya Reddy', city: 'Jaipur', score: 1689, change: -2, picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=divya' },
];

// 3 curated high-quality badminton thumbnails — reused across the 4 seed videos
const THUMB_SMASH = '/assets/thumbnail1.webp';
const THUMB_RALLY = '/assets/thumbnail2.webp';
const THUMB_NET = '/assets/thumbnail3.webp';
const THUMB_MATCH = '/assets/thumbnail4.webp';

export const VIDEO_THUMBNAILS = { smash: THUMB_SMASH, rally: THUMB_RALLY, net: THUMB_NET, match: THUMB_MATCH };

export const MOCK_VIDEOS = [
  { id: 'v-seed-1', title: 'Singles Match - Court 2', thumbnail: THUMB_SMASH, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', uploadedAt: new Date(Date.now() - 1 * 86400000).toISOString(), duration: 42, aiScore: 72, grade: 'B', status: 'analyzed' },
  { id: 'v-seed-2', title: 'Rally Practice', thumbnail: THUMB_RALLY, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', uploadedAt: new Date(Date.now() - 2 * 86400000).toISOString(), duration: 38, aiScore: 68, grade: 'B', status: 'analyzed' },
  { id: 'v-seed-3', title: 'Net Drills', thumbnail: THUMB_NET, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', uploadedAt: new Date(Date.now() - 3 * 86400000).toISOString(), duration: 44, aiScore: 75, grade: 'B+', status: 'analyzed' },
  { id: 'v-seed-4', title: 'Match Highlights', thumbnail: THUMB_MATCH, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', uploadedAt: new Date(Date.now() - 4 * 86400000).toISOString(), duration: 40, aiScore: 70, grade: 'B', status: 'analyzed' },
];

export const MOCK_COACHES = [
  {
    id: 'coach-prab',
    name: 'Coach Priya',
    handle: 'coachpriya',
    specialization: 'Defence & Footwork',
    rating: 3.0,
    totalRatings: 1,
    totalSessions: 0,
    totalVideos: 0,
    sessionsAnalyzed: 0,
    avgScore: 0,
    picture: '/assets/coach-priya-avatar.png',
    location: 'Bengaluru',
    experienceYears: 3,
    hourlyRate: 149,
    tier: 'pro',
    isVerified: true,
    certifications: [],
    bio: 'Here to help you excel.',
  },
  {
    id: 'coach-sumit',
    name: 'Sumit Singh',
    handle: 'itssumitsin0190',
    specialization: 'Footwork',
    rating: 3.5,
    totalRatings: 0,
    totalSessions: 0,
    totalVideos: 0,
    sessionsAnalyzed: 0,
    avgScore: 0,
    picture: '/assets/sumit-avatar.png',
    location: 'Bangalore',
    experienceYears: 2,
    hourlyRate: 99,
    tier: 'standard',
    isVerified: false,
    certifications: [],
    bio: 'Grinding the footwork basics with players across Bangalore.',
  },
];


export const SEED_COACH_REQUESTS = [
  { id: 'req-seed-1', videoId: 'v-seed-1', coachId: 'coach-priya', status: 'in_review', note: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
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
    { id: 'd1', title: 'Split-step ladder', duration: '10 min', difficulty: 'Medium', category: 'Footwork', thumbnail: THUMB_RALLY },
    { id: 'd2', title: 'Shadow defensive clears', duration: '12 min', difficulty: 'Easy', category: 'Defense', thumbnail: THUMB_NET },
    { id: 'd3', title: 'Jump smash progression', duration: '15 min', difficulty: 'Hard', category: 'Smash', thumbnail: THUMB_SMASH },
    { id: 'd4', title: 'Net kill reaction drill', duration: '8 min', difficulty: 'Medium', category: 'Net Play', thumbnail: THUMB_NET },
  ],
};

// Bell-icon notifications shown on the dashboard
export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'coach_review', title: 'Coach Priya finished your review', body: 'Your "Singles Match - Court 2" has 4 new coach comments and a drill plan.', timeAgo: '2h ago', unread: true, icon: 'review' },
  { id: 'n2', type: 'ai_insight', title: 'KreedAI spotted a trend', body: 'Your footwork improved 12% across your last 3 matches. Keep it up!', timeAgo: '5h ago', unread: true, icon: 'sparkles' },
  { id: 'n3', type: 'leaderboard', title: 'You moved up to #2 in Delhi', body: 'You passed Arjun Menon. Sumit Singh is 135 ELO ahead.', timeAgo: '1d ago', unread: true, icon: 'trophy' },
  { id: 'n4', type: 'challenge', title: '7-day streak unlocked', body: 'Train again today to keep your streak alive.', timeAgo: '1d ago', unread: false, icon: 'fire' },
  { id: 'n5', type: 'friend', title: 'Sumit Singh shared an analysis', body: '"That jump smash was filthy 🔥 — check my latest match."', timeAgo: '2d ago', unread: false, icon: 'user' },
];

export const MOCK_COACH_REVIEWS = {
  'coach-prab': [
    {
      id: 'r1',
      reviewerName: 'Sumit Singh',
      reviewerHandle: 'itssumitsin0190',
      reviewerPicture: '/assets/sumit-avatar.png',
      rating: 3,
      tags: ['Technique', 'Fitness'],
      body: 'nice',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ],
  'coach-sumit': [],
};
