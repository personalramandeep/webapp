import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Sidebar from '../dashboard/Sidebar';
import { useIdentity } from '../../contexts/IdentityContext';
import { getVideo } from '../../mocks/reviewStore';
import { MOCK_COACHES } from '../../mocks/fixtures';
import { YOUTUBE_DRILLS } from '../../mocks/youtubeDrills';
import DrillVideoModal from '../analysis/DrillVideoModal';

// ── Mock review data ──
const REVIEW_COACH = {
  name: 'Coach Priya',
  initials: 'CP',
  specialization: 'Defence & Footwork',
  rating: 4.8,
};

const TIMELINE_FEEDBACK = [
  { id: 'tf1', timestamp: 3, title: 'Weak footwork recovery', description: "You're too upright here — lower your stance and bend your knees on recovery.", tags: ['Footwork'], type: 'coach', isCoachPick: true },
  { id: 'tf2', timestamp: 8, title: 'Good smash', description: 'Great power, but the follow-through is missing. Extend your arm fully after contact.', tags: ['Smash'], type: 'ai', isCoachPick: false },
  { id: 'tf3', timestamp: 11, title: 'Positioning issue', description: "You're standing too far forward near the net — move back to the mid-court position.", tags: ['Defense', 'Positioning'], type: 'coach', isCoachPick: true },
  { id: 'tf4', timestamp: 18, title: 'Excellent defensive lift', description: 'Great reaction time and height on that lift. Your body positioning was ideal.', tags: ['Defense'], type: 'highlight', isCoachPick: false },
  { id: 'tf5', timestamp: 25, title: 'Net play timing', description: 'You rushed the net shot — wait for the shuttle to drop lower before playing the stroke.', tags: ['Net Play'], type: 'coach', isCoachPick: false },
];

const SUGGESTED_DRILL_IDS = ['yt_001', 'yt_047', 'yt_009'];
const SUGGESTED_DRILLS_DATA = SUGGESTED_DRILL_IDS.map((id) => YOUTUBE_DRILLS.find((d) => d.id === id)).filter(Boolean);

const REVIEW_TOPICS = ['Footwork', 'Technique', 'Defense', 'Smash', 'Serve', 'Strategy', 'Fitness', 'Mental Game'];

const TYPE_COLORS = {
  coach: { dot: 'bg-red-500', border: 'border-l-red-500', badge: 'bg-red-500/20 text-red-400' },
  ai: { dot: 'bg-blue-500', border: 'border-l-blue-500', badge: 'bg-blue-500/20 text-blue-400' },
  highlight: { dot: 'bg-green-500', border: 'border-l-green-500', badge: 'bg-green-500/20 text-green-400' },
};

const TAG_COLORS = {
  Footwork: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  Smash: 'bg-red-500/15 text-red-300 border-red-500/20',
  Defense: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  Positioning: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  'Net Play': 'bg-purple-500/15 text-purple-300 border-purple-500/20',
};

const formatTs = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

const PerformanceReview = ({ onLogout }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const videoRef = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [duration, setDuration] = useState(35);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFilter, setActiveFilter] = useState('coach');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedDrill, setSelectedDrill] = useState(null);

  const video = getVideo(videoId) || { id: videoId, title: 'Match', thumbnail: '/assets/thumbnail1.webp', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };

  const filteredFeedback = TIMELINE_FEEDBACK.filter((f) => {
    if (activeFilter === 'all') return true;
    return f.type === activeFilter;
  });

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onMeta = () => { if (el.duration && !isNaN(el.duration)) setDuration(el.duration); };
    const onTime = () => setCurrentTime(el.currentTime);
    const onEnd = () => setIsPlaying(false);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    return () => { el.removeEventListener('loadedmetadata', onMeta); el.removeEventListener('timeupdate', onTime); el.removeEventListener('ended', onEnd); };
  }, []);

  const seekTo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      // Scroll video player into view
      const playerEl = document.querySelector('[data-testid="review-video-player"]');
      if (playerEl) playerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekTo(pct * duration);
  };

  const toggleTopic = (t) => {
    setSelectedTopics((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const submitReview = () => {
    if (rating === 0) return;
    setHasSubmitted(true);
    toast.success('Review submitted! Thank you for your feedback.', {
      style: { background: '#2D2926', color: '#fff', border: '1px solid rgba(244,88,49,0.3)' },
      iconTheme: { primary: '#F45831', secondary: '#fff' },
    });
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-kreeda-charcoal">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} onLogout={onLogout} />

      <div className="transition-all duration-300" style={{ marginLeft: isSidebarCollapsed ? 72 : 280 }}>
        <main className="p-4 md:p-6 pt-20 max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-4" data-testid="review-breadcrumb">
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">My Sessions</button>
            <span className="text-white/30">›</span>
            <button onClick={() => navigate(`/analysis/${videoId}`)} className="hover:text-white transition-colors">Video Review</button>
            <span className="text-white/30">›</span>
            <span className="text-kreeda-orange font-medium">Performance Review</span>
          </nav>

          {/* Title */}
          <h1 className="text-white text-xl md:text-2xl font-bold mb-0.5" data-testid="review-title">
            Performance Review — {REVIEW_COACH.name}
          </h1>
          <p className="text-white/40 text-xs mb-5">1 March 2026</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {/* ═══ LEFT COLUMN ═══ */}
            <div className="lg:col-span-2 space-y-4">
              {/* Video Player */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl overflow-hidden" data-testid="review-video-player">
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    src={video.videoUrl}
                    poster={video.thumbnail}
                    className="w-full h-full object-contain"
                    playsInline
                  />
                  {!isPlaying && (
                    <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center" data-testid="review-play-btn">
                      <div className="w-16 h-16 bg-kreeda-orange rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>

                {/* Custom timeline */}
                <div className="px-4 pt-3 pb-2">
                  <div className="relative h-1.5 bg-white/10 rounded-full cursor-pointer mb-2.5" onClick={handleTimelineClick} data-testid="review-timeline">
                    <div className="absolute inset-y-0 left-0 bg-red-500 rounded-full" style={{ width: `${progressPct}%` }} />
                    {TIMELINE_FEEDBACK.map((f) => {
                      const pct = duration > 0 ? (f.timestamp / duration) * 100 : 0;
                      const colors = TYPE_COLORS[f.type] || TYPE_COLORS.coach;
                      return (
                        <button
                          key={f.id}
                          onClick={(e) => { e.stopPropagation(); seekTo(f.timestamp); }}
                          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 ${colors.dot} rounded-full border border-black/40 hover:scale-150 transition-transform z-10`}
                          style={{ left: `${pct}%` }}
                          title={`${f.title} (${formatTs(f.timestamp)})`}
                        />
                      );
                    })}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="text-white hover:text-kreeda-orange transition-colors" data-testid="review-playpause">
                      {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75V3.75A.75.75 0 008.25 3h-2.5zm6 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-2.5z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                      )}
                    </button>
                    <span className="text-white text-xs font-mono">{formatTs(currentTime)} / {formatTs(duration)}</span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/30 rounded-full border border-white/5">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-white/60 text-[10px] font-medium">{TIMELINE_FEEDBACK.length} markers</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full" /><span className="text-white/40 text-[10px]">Coach</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-blue-500 rounded-full" /><span className="text-white/40 text-[10px]">AI</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full" /><span className="text-white/40 text-[10px]">Highlight</span></div>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-2" data-testid="review-filter-tabs">
                {[
                  { key: 'coach', label: 'Coach Annotations', dot: 'bg-red-500', active: 'bg-red-500/15 border-red-500/30 text-red-300' },
                  { key: 'ai', label: 'AI Insights', dot: 'bg-blue-500', active: 'bg-blue-500/15 border-blue-500/30 text-blue-300' },
                  { key: 'highlight', label: 'Key Moments', dot: 'bg-green-500', active: 'bg-green-500/15 border-green-500/30 text-green-300' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(activeFilter === tab.key ? 'all' : tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      activeFilter === tab.key ? tab.active : 'bg-[#1f1f1f] border-white/5 text-white/40 hover:text-white/60'
                    }`}
                    data-testid={`filter-${tab.key}`}
                  >
                    <span className={`w-1.5 h-1.5 ${tab.dot} rounded-full`} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Timeline Feedback */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-4 md:p-5" data-testid="timeline-feedback-section">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">Timeline Feedback</h3>
                  <span className="text-white/30 text-xs">{filteredFeedback.length} insights</span>
                </div>

                {filteredFeedback.length === 0 ? (
                  <p className="text-white/30 text-xs py-6 text-center">No feedback for this filter.</p>
                ) : (
                  <div className="space-y-3">
                    {filteredFeedback.map((f) => {
                      const colors = TYPE_COLORS[f.type] || TYPE_COLORS.coach;
                      return (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`bg-[#2a2a2a] border border-white/5 ${colors.border} border-l-2 rounded-lg p-3.5 cursor-pointer hover:bg-[#333] transition-colors`}
                          onClick={() => seekTo(f.timestamp)}
                          data-testid={`feedback-${f.id}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${colors.badge}`}>
                              {formatTs(f.timestamp)}
                            </span>
                            <div className="flex items-center gap-2">
                              {f.isCoachPick && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-kreeda-orange/15 text-kreeda-orange border border-kreeda-orange/20 font-medium">Coach Pick</span>
                              )}
                              {f.type === 'ai' && (
                                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <h4 className="text-white text-sm font-semibold mb-1">{f.title}</h4>
                          <p className="text-white/50 text-xs leading-relaxed mb-2">{f.description}</p>
                          <div className="flex gap-1.5">
                            {f.tags.map((t) => (
                              <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded border ${TAG_COLORS[t] || 'bg-white/5 text-white/40 border-white/10'}`}>{t}</span>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ═══ RIGHT COLUMN ═══ */}
            <div className="lg:col-span-1 space-y-4">
              {/* Coach Info */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-4" data-testid="coach-info-card">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-kreeda-orange/20 flex items-center justify-center text-kreeda-orange font-bold text-sm flex-shrink-0">
                    {REVIEW_COACH.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{REVIEW_COACH.name}</p>
                    <p className="text-white/40 text-xs">{REVIEW_COACH.specialization}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className={`w-3 h-3 ${i <= Math.round(REVIEW_COACH.rating) ? 'text-amber-400' : 'text-white/15'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-white/40 text-[10px] ml-0.5">{REVIEW_COACH.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Drills */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-4" data-testid="suggested-drills-section">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-white font-bold text-sm">Suggested Drills</h3>
                  <span className="text-white/30 text-xs">{SUGGESTED_DRILLS_DATA.length} drills</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_DRILLS_DATA.map((drill) => {
                    const difficulty = drill.tags.some((t) => ['advanced', 'professional'].includes(t)) ? 'Advanced'
                      : drill.tags.some((t) => ['basics', 'beginner'].includes(t)) ? 'Beginner' : 'Intermediate';
                    const diffColor = difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' : difficulty === 'Advanced' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400';
                    const mainTag = drill.tags[0] || 'Training';
                    const ytId = drill.video_url.match(/\/embed\/([^?]+)/)?.[1] || '';
                    const thumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : '';
                    return (
                      <div
                        key={drill.id}
                        className="bg-[#2a2a2a] border border-white/5 rounded-lg overflow-hidden cursor-pointer hover:border-white/15 transition-colors"
                        onClick={() => setSelectedDrill(drill)}
                        data-testid={`suggested-drill-${drill.id}`}
                      >
                        <div className="relative">
                          <img src={thumbnail} alt={drill.title} className="w-full h-20 object-cover" />
                          <span className={`absolute top-1.5 left-1.5 text-[8px] px-1.5 py-0.5 rounded font-medium ${diffColor}`}>{difficulty}</span>
                          <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[6px] font-bold px-1 py-px rounded flex items-center gap-0.5">
                            <svg className="w-1.5 h-1.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                            YT
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-white/30 text-[9px]">Recommended for: <span className="text-white/60">{drill.section.split('&')[0].trim()}</span></p>
                          <p className="text-white text-[11px] font-semibold mt-0.5 line-clamp-2 leading-snug">{drill.title}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/40">{mainTag}</span>
                            <span
                              className="text-[8px] px-1.5 py-0.5 rounded bg-kreeda-orange/15 border border-kreeda-orange/20 text-kreeda-orange font-medium"
                              data-testid={`start-drill-${drill.id}`}
                            >
                              + Start Drill
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Coach */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-4" data-testid="review-coach-section">
                <h3 className="text-white font-bold text-sm mb-0.5">Review your coach</h3>
                <p className="text-white/40 text-xs mb-3">How helpful was {REVIEW_COACH.name}'s feedback?</p>

                {!hasSubmitted ? (
                  <>
                    {/* Star rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() => setRating(i)}
                          onMouseEnter={() => setHoverRating(i)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="text-xl transition-transform hover:scale-110"
                          data-testid={`star-${i}`}
                        >
                          <svg className={`w-6 h-6 ${i <= (hoverRating || rating) ? 'text-amber-400' : 'text-white/15'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                      <span className="text-white/20 ml-1">—</span>
                    </div>

                    {/* Topics */}
                    <p className="text-white/40 text-[10px] mb-2">Topics <span className="text-white/20">(optional)</span></p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {REVIEW_TOPICS.map((t) => (
                        <button
                          key={t}
                          onClick={() => toggleTopic(t)}
                          className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${
                            selectedTopics.includes(t)
                              ? 'bg-kreeda-orange/15 border-kreeda-orange/30 text-kreeda-orange'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                          }`}
                          data-testid={`topic-${t}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Text area */}
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share what worked or what could be better (optional)"
                      rows={3}
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-kreeda-orange/30 resize-none mb-3"
                      data-testid="review-textarea"
                    />

                    <button
                      onClick={submitReview}
                      disabled={rating === 0}
                      className="w-full bg-[#2a2a2a] border border-white/10 hover:border-white/20 disabled:opacity-30 text-white/60 text-xs font-medium py-2.5 rounded-lg transition-colors"
                      data-testid="submit-review-btn"
                    >
                      Submit Review
                    </button>
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-green-400 text-xs font-medium">Thanks for your feedback!</p>
                  </div>
                )}
              </div>

              {/* Back link */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-white/30 text-xs hover:text-white/50 transition-colors mx-auto"
                data-testid="back-to-sessions"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back to My Sessions
              </button>
            </div>
          </div>
        </main>
      </div>

      <DrillVideoModal drill={selectedDrill} isOpen={!!selectedDrill} onClose={() => setSelectedDrill(null)} />
    </div>
  );
};

export default PerformanceReview;
