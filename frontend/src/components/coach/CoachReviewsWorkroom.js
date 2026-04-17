import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import { useIdentity } from '../../contexts/IdentityContext';
import {
  reviewStore,
  addCoachFeedback,
  getCoachFeedbackFor,
  completeCoachRequest,
  getVideo,
  getPendingRequestsForCoach,
} from '../../mocks/reviewStore';
import { COACH_FEEDBACK_TAGS, ANNOTATION_COLORS } from '../../mocks/fixtures';
import { YOUTUBE_DRILLS } from '../../mocks/youtubeDrills';


// ── Helpers ───────────────────────────────────────────────────────────────────
const TAG_COLOR = {
  General:  'bg-gray-500/20 text-gray-300 border-gray-500/20',
  Footwork: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  Defense:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  Smash:    'bg-red-500/20 text-red-300 border-red-500/20',
  Serve:    'bg-purple-500/20 text-purple-300 border-purple-500/20',
};

const FALLBACK_VIDEO_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const DRILL_SECTIONS = ['All', 'Footwork', 'Smash', 'Serve', 'Net Play', 'Defense', 'Fitness'];

const formatTs = (seconds) => {
  if (seconds == null) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const getYtThumb = (url) => {
  const id = url.split('/embed/')[1]?.split('?')[0];
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : '';
};

// ── Inline DrillPickerPanel ───────────────────────────────────────────────────
const DrillPickerPanel = ({ selectedDrills, onDone, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('All');
  const [picked, setPicked] = useState(() => new Set(selectedDrills.map((d) => d.id)));
  const [pickedMap, setPickedMap] = useState(() =>
    Object.fromEntries(selectedDrills.map((d) => [d.id, d]))
  );

  const filtered = useMemo(() => {
    let list = activeSection === 'All'
      ? YOUTUBE_DRILLS
      : YOUTUBE_DRILLS.filter((d) => d.section === activeSection);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(q) || d.section.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeSection]);

  const toggle = (drill) => {
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(drill.id) ? next.delete(drill.id) : next.add(drill.id);
      return next;
    });
    setPickedMap((prev) => {
      if (prev[drill.id]) { const n = { ...prev }; delete n[drill.id]; return n; }
      return { ...prev, [drill.id]: drill };
    });
  };

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden mt-3">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-white/10">
        <span className="text-xs font-medium text-white/60">
          Select drills
          {picked.size > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-kreeda-orange/20 text-kreeda-orange rounded-full text-[10px]">
              {picked.size} selected
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          {picked.size > 0 && (
            <button
              onClick={() => onDone(Object.values(pickedMap))}
              className="px-3 py-1 bg-kreeda-orange hover:bg-kreeda-orange/90 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Done
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-2">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drills..."
            className="w-full bg-white/10 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-kreeda-orange/50"
          />
        </div>
      </div>

      {/* Section chips */}
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2">
        {DRILL_SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              activeSection === s
                ? 'bg-kreeda-orange text-white'
                : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Thumbnail grid */}
      <div className="overflow-y-auto h-[240px] px-3 pb-3">
        {filtered.length === 0 ? (
          <p className="text-center text-white/30 text-xs py-6">No drills found</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {filtered.map((drill) => {
              const isSelected = picked.has(drill.id);
              return (
                <button
                  key={drill.id}
                  onClick={() => toggle(drill)}
                  className={`text-left border rounded-lg overflow-hidden transition-all group relative ${
                    isSelected
                      ? 'bg-kreeda-orange/10 border-kreeda-orange/60'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-kreeda-orange/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-kreeda-orange rounded-full flex items-center justify-center shadow">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                  <div className="aspect-video bg-black/30 overflow-hidden">
                    <img
                      src={getYtThumb(drill.video_url)}
                      alt={drill.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-1.5">
                    <p className={`text-[10px] font-medium leading-snug line-clamp-2 ${isSelected ? 'text-kreeda-orange' : 'text-white/80'}`}>
                      {drill.title}
                    </p>
                    <span className="text-white/30 text-[9px] mt-0.5 block truncate">{drill.section}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
const CoachReviewsWorkroom = ({ onLogout }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // All pending requests for tab strip
  const allRequests = getPendingRequestsForCoach('coach-prab');
  const [activeRequestId, setActiveRequestId] = useState(requestId || allRequests[0]?.id);

  const store = reviewStore.get();
  const request = store.coachRequests.find((r) => r.id === activeRequestId);
  const video = request ? getVideo(request.videoId) : null;
  const videoUrl = video?.videoUrl || FALLBACK_VIDEO_URL;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTags, setActiveTags] = useState(['General']);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState(ANNOTATION_COLORS[0]);
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [selectedDrills, setSelectedDrills] = useState([]);
  const [localFeedback, setLocalFeedback] = useState([]);

  useEffect(() => {
    if (video) setLocalFeedback(getCoachFeedbackFor(video.id));
  }, [video]);

  // Sync video time
    useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onPause = () => setCurrentTime(el.currentTime);
    const onTime = () => { if (!el.paused) return; setCurrentTime(el.currentTime); };
    el.addEventListener('pause', onPause);
    el.addEventListener('seeked', onPause);
    return () => {
      el.removeEventListener('pause', onPause);
      el.removeEventListener('seeked', onPause);
    };
  }, []);


  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let last = null;
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches?.[0];
      return {
        x: ((t?.clientX ?? e.clientX) - rect.left) * (canvas.width / rect.width),
        y: ((t?.clientY ?? e.clientY) - rect.top) * (canvas.height / rect.height),
      };
    };
    const start = (e) => { if (!isDrawing) return; drawing = true; last = getPos(e); };
    const move = (e) => {
      if (!drawing || !isDrawing) return;
      const p = getPos(e);
      ctx.strokeStyle = drawColor; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p;
    };
    const stop = () => { drawing = false; };
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop); canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start); canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', stop);
    return () => {
      canvas.removeEventListener('mousedown', start); canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', stop); canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start); canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', stop);
    };
  }, [isDrawing, drawColor]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleTag = (tag) => {
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const addNote = () => {
    if (!feedbackText.trim() || !video) return;
    const annotationDataUrl = isDrawing && canvasRef.current ? canvasRef.current.toDataURL('image/png') : null;
    addCoachFeedback({
      videoId: video.id,
      timestamp: currentTime,
      text: feedbackText.trim(),
      tags: activeTags,
      drills: selectedDrills,
      annotationDataUrl,
    });
    setLocalFeedback(getCoachFeedbackFor(video.id));
    setFeedbackText('');
    setSelectedDrills([]);
    setActiveTags(['General']);
    setIsDrawing(false);
    clearCanvas();
  };

  const deleteFeedbackItem = (feedbackId) => {
    // Remove from localStorage store
    const s = reviewStore.get();
    const updated = { ...s, coachFeedback: { ...s.coachFeedback } };
    if (updated.coachFeedback[video.id]) {
      updated.coachFeedback[video.id] = updated.coachFeedback[video.id].filter((f) => f.id !== feedbackId);
    }
    reviewStore.set(updated);
    setLocalFeedback(getCoachFeedbackFor(video.id));
  };

  const finishReview = () => {
    navigate('/coach/dashboard');
  };

  if (!request || !video) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <Header user={identity} onLogout={onLogout} />
          <main className="p-6 max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-white text-2xl font-bold">Review Requests</h1>
                <p className="text-white/50 text-sm">Review player videos and provide feedback</p>
              </div>
            </div>
            {allRequests.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-3">
                {allRequests.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRequestId(r.id)}
                    className="flex-shrink-0 px-3 py-2 rounded-lg border bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10 text-sm text-left transition-colors"
                  >
                    <p className="font-medium">{r.playerName || 'Player'}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Video Review</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/50 text-sm">No pending review requests.</p>
                <button onClick={() => navigate('/coach/dashboard')} className="text-kreeda-orange text-xs mt-3 hover:underline">
                  ← Back to Dashboard
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header user={identity} onLogout={onLogout} />
        <main className="p-6 max-w-[1400px] mx-auto">

          {/* Page header */}
          {/* Page header */}
          <div className="mb-4">
            <h1 className="text-white text-2xl font-bold">Review Requests</h1>
            <p className="text-white/50 text-sm">Review player videos and provide feedback</p>
          </div>

          {/* Request tab strip */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            {allRequests.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setActiveRequestId(r.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
                  r.id === activeRequestId
                    ? 'bg-kreeda-orange/10 border-kreeda-orange/40 text-white'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                <p className="font-medium">{r.playerName || 'Ramandeep Singh'}</p>
                <p className="text-[10px] text-white/30 mt-0.5">Video Review</p>
              </button>
            ))}
          </div>

          {/* Main card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-2xl mb-4">
            {/* Request header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white text-lg font-bold">{request.playerName || 'Ramandeep Singh'}</h2>
                <p className="text-white/40 text-sm">Video Review{request.note ? ` — "${request.note}"` : ''}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full font-medium border border-green-500/20">
                accepted
              </span>
            </div>

            {/* Video + canvas */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                controls
                crossOrigin="anonymous"
              />
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className={`absolute inset-0 w-full h-full ${isDrawing ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
                style={{ display: isDrawing ? 'block' : 'none' }}
              />
            </div>

            {/* Composer */}
            <div className="mt-4 space-y-3">
              <p className="text-white/40 text-xs">Pause video to set timestamp</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNote()}
                  placeholder="Write feedback about this moment..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-kreeda-orange/50"
                />
                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-xs text-white/50 font-mono whitespace-nowrap">
                  @{formatTs(currentTime)}
                </div>
                <button
                  onClick={addNote}
                  disabled={!feedbackText.trim()}
                  className="px-4 py-2 bg-kreeda-orange hover:bg-kreeda-orange/90 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  + Add
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-white/40">Tags:</span>
                {COACH_FEEDBACK_TAGS.map((tag) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                        isActive ? TAG_COLOR[tag] : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowDrillPicker(!showDrillPicker)}
                  className="text-xs text-white/50 hover:text-white transition-colors"
                >
                  + Suggest Drill
                </button>
                <button
                  onClick={() => setIsDrawing(!isDrawing)}
                  className={`text-xs transition-colors ${isDrawing ? 'text-kreeda-orange font-medium' : 'text-white/50 hover:text-white'}`}
                >
                  {isDrawing ? '✓ Drawing on Frame' : 'Draw on Frame'}
                </button>
                {isDrawing && (
                  <>
                    <div className="flex gap-1">
                      {ANNOTATION_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setDrawColor(c)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${drawColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button onClick={clearCanvas} className="text-[10px] text-white/30 hover:text-white/70 transition-colors">
                      clear
                    </button>
                  </>
                )}
              </div>

              {/* Selected drills chips */}
              {selectedDrills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedDrills.map((d) => (
                    <div key={d.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-kreeda-orange/10 border border-kreeda-orange/30 rounded-full text-[11px] text-kreeda-orange">
                      <span className="truncate max-w-[200px]">{d.title}</span>
                      <button
                        onClick={() => setSelectedDrills((prev) => prev.filter((x) => x.id !== d.id))}
                        className="text-kreeda-orange/60 hover:text-kreeda-orange"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* DrillPickerPanel */}
              {showDrillPicker && (
                <DrillPickerPanel
                  selectedDrills={selectedDrills}
                  onDone={(drills) => { setSelectedDrills(drills); setShowDrillPicker(false); }}
                  onClose={() => setShowDrillPicker(false)}
                />
              )}
            </div>
          </div>

          {/* Feedback list */}
          {localFeedback.length > 0 && (
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-2xl">
              <h3 className="text-white font-bold mb-3">Feedback you've added ({localFeedback.length})</h3>
              <div className="space-y-2">
                {localFeedback.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-xs text-kreeda-orange font-mono mt-0.5 flex-shrink-0">{formatTs(f.timestamp)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80">{f.text}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {(f.tags || []).map((t) => (
                          <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full border ${TAG_COLOR[t] || TAG_COLOR.General}`}>
                            {t}
                          </span>
                        ))}
                        {f.drills?.length > 0 && f.drills.map((d) => (
                          <span key={d.id || d.title} className="text-[10px] px-1.5 py-0.5 rounded-full bg-kreeda-orange/10 border border-kreeda-orange/20 text-kreeda-orange truncate max-w-[180px]">
                            🎯 {d.title}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFeedbackItem(f.id)}
                      className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                      title="Delete feedback"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CoachReviewsWorkroom;
