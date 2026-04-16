import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import { useIdentity } from '../../contexts/IdentityContext';
import { getVideo, getCoachFeedbackFor, reviewStore } from '../../mocks/reviewStore';
import { MOCK_COACHES, SEED_SUGGESTED_DRILLS } from '../../mocks/fixtures';

const TAG_COLOR = {
  General: 'bg-gray-500/20 text-gray-300',
  Footwork: 'bg-blue-500/20 text-blue-300',
  Defense: 'bg-emerald-500/20 text-emerald-300',
  Smash: 'bg-red-500/20 text-red-300',
  Serve: 'bg-purple-500/20 text-purple-300',
};

const formatTs = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

const PerformanceReview = ({ onLogout }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const videoRef = useRef(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [duration, setDuration] = useState(60);
  const [rating, setRating] = useState(0);
  const [ratingNote, setRatingNote] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [filter, setFilter] = useState({ coach: true, ai: false, highlights: false });

  const video = getVideo(videoId) || { id: videoId, title: 'Match', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' };
  const feedback = getCoachFeedbackFor(videoId);

  // Find the latest request for this video to identify the reviewing coach
  const store = reviewStore.get();
  const latestRequest = [...store.coachRequests]
    .filter((r) => r.videoId === videoId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const coach = MOCK_COACHES.find((c) => c.id === latestRequest?.coachId) || MOCK_COACHES[0];
  const drills = SEED_SUGGESTED_DRILLS[videoId] || SEED_SUGGESTED_DRILLS['v-seed-1'];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onMeta = () => setDuration(el.duration || 60);
    el.addEventListener('loadedmetadata', onMeta);
    return () => el.removeEventListener('loadedmetadata', onMeta);
  }, []);

  const seekTo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(() => {});
    }
  };

  const submitRating = () => {
    if (rating === 0) return;
    setHasRated(true);
  };

  return (
    <div className="min-h-screen bg-kreeda-charcoal">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header user={identity} onLogout={onLogout} />
        <main className="p-6 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">Dashboard</button>
            <span>›</span>
            <button onClick={() => navigate(`/analysis/${videoId}`)} className="hover:text-white transition-colors">{video.title}</button>
            <span>›</span>
            <span className="text-kreeda-orange">Coach Review</span>
          </div>

          <h1 className="text-white text-2xl font-bold mb-1">Performance Review</h1>
          <p className="text-gray-400 mb-6">{coach.name} reviewed your match on {new Date(latestRequest?.createdAt || Date.now()).toLocaleDateString()}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Video with markers */}
              <div className="bg-[#2a2a2a] border border-white/5 rounded-xl overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <video ref={videoRef} src={video.videoUrl} className="w-full h-full object-contain" controls />
                </div>
                <div className="p-4">
                  <div className="relative h-2 bg-white/5 rounded-full">
                    {feedback.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => seekTo(f.timestamp)}
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-kreeda-orange rounded-full hover:scale-125 transition-transform"
                        style={{ left: `${(f.timestamp / duration) * 100}%` }}
                        title={f.text}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter({ ...filter, coach: !filter.coach })}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    filter.coach ? 'bg-kreeda-orange/10 border-kreeda-orange/40 text-kreeda-orange' : 'bg-[#2a2a2a] border-white/5 text-gray-400'
                  }`}
                >
                  🧑‍🏫 Coach Feedback
                </button>
                <button
                  onClick={() => setFilter({ ...filter, ai: !filter.ai })}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    filter.ai ? 'bg-blue-500/10 border-blue-500/40 text-blue-300' : 'bg-[#2a2a2a] border-white/5 text-gray-400'
                  }`}
                >
                  🤖 AI Insights
                </button>
                <button
                  onClick={() => setFilter({ ...filter, highlights: !filter.highlights })}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    filter.highlights ? 'bg-green-500/10 border-green-500/40 text-green-300' : 'bg-[#2a2a2a] border-white/5 text-gray-400'
                  }`}
                >
                  ✨ Highlights
                </button>
              </div>

              {/* Feedback timeline list */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3">Feedback Timeline</h3>
                {feedback.length === 0 ? (
                  <p className="text-gray-500 text-sm py-6 text-center">No feedback yet — the coach is still reviewing.</p>
                ) : (
                  <div className="space-y-2">
                    {filter.coach && feedback.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => seekTo(f.timestamp)}
                        className="w-full flex items-start gap-3 p-3 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-left transition-colors"
                      >
                        <span className="text-xs text-kreeda-orange font-mono flex-shrink-0">{formatTs(f.timestamp)}</span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-200">{f.text}</p>
                          <div className="flex gap-1 mt-1">
                            {f.tags?.map((t) => (
                              <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full ${TAG_COLOR[t] || TAG_COLOR.General}`}>{t}</span>
                            ))}
                          </div>
                        </div>
                        {f.annotationDataUrl && (
                          <img src={f.annotationDataUrl} alt="annotation" className="w-16 h-10 object-cover rounded border border-white/10" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Suggested drills */}
              <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5">
                <h3 className="text-white font-bold mb-3">Coach's Suggested Drills</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {drills.map((d) => (
                    <div key={d.id} className="bg-[#2a2a2a] border border-white/5 rounded-lg overflow-hidden hover:border-kreeda-orange/30 transition-colors cursor-pointer">
                      <img src={d.thumbnail} alt={d.title} className="w-full h-20 object-cover" />
                      <div className="p-2">
                        <p className="text-white text-xs font-medium line-clamp-2">{d.title}</p>
                        <p className="text-gray-500 text-[10px] mt-1">{d.duration} · {d.difficulty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rate the coach */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5 sticky top-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={coach.picture} alt={coach.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="text-white font-semibold">{coach.name}</p>
                    <p className="text-gray-500 text-xs">{coach.specialization}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-3">Rate your experience with this coach</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      onClick={() => !hasRated && setRating(i)}
                      disabled={hasRated}
                      className="text-2xl transition-transform hover:scale-110 disabled:cursor-default"
                    >
                      <span className={i <= rating ? 'text-yellow-400' : 'text-gray-700'}>★</span>
                    </button>
                  ))}
                </div>
                {!hasRated ? (
                  <>
                    <textarea
                      value={ratingNote}
                      onChange={(e) => setRatingNote(e.target.value)}
                      placeholder="Share your feedback (optional)..."
                      rows={3}
                      className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-kreeda-orange/50 resize-none"
                    />
                    <button
                      onClick={submitRating}
                      disabled={rating === 0}
                      className="mt-3 w-full bg-kreeda-orange hover:bg-opacity-90 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Submit Rating
                    </button>
                  </>
                ) : (
                  <p className="text-green-400 text-sm">✓ Thanks for your feedback!</p>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PerformanceReview;
