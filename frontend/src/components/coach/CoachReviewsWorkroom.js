import React, { useEffect, useRef, useState } from 'react';
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
} from '../../mocks/reviewStore';
import { COACH_FEEDBACK_TAGS, ANNOTATION_COLORS, MOCK_COACHES } from '../../mocks/fixtures';

const TAG_COLOR = {
  General: 'bg-gray-500/20 text-gray-300',
  Footwork: 'bg-blue-500/20 text-blue-300',
  Defense: 'bg-emerald-500/20 text-emerald-300',
  Smash: 'bg-red-500/20 text-red-300',
  Serve: 'bg-purple-500/20 text-purple-300',
};

const FALLBACK_VIDEO_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const formatTs = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const CoachReviewsWorkroom = ({ onLogout }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const store = reviewStore.get();
  const request = store.coachRequests.find((r) => r.id === requestId);
  const video = request ? getVideo(request.videoId) : null;
  const videoUrl = video?.videoUrl || FALLBACK_VIDEO_URL;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [activeTag, setActiveTag] = useState('General');
  const [activeTags, setActiveTags] = useState(['General']);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState(ANNOTATION_COLORS[0]);
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [selectedDrillId, setSelectedDrillId] = useState(null);

  const [localFeedback, setLocalFeedback] = useState([]);
  useEffect(() => {
    if (video) setLocalFeedback(getCoachFeedbackFor(video.id));
  }, [video]);

  // Wire the video's ontimeupdate to keep React state in sync
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
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

    const start = (e) => {
      if (!isDrawing) return;
      drawing = true;
      last = getPos(e);
    };
    const move = (e) => {
      if (!drawing || !isDrawing) return;
      const p = getPos(e);
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    };
    const stop = () => { drawing = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', stop);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', stop);
    };
  }, [isDrawing, drawColor]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  const toggleTag = (tag) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const addNote = () => {
    if (!feedbackText.trim() || !video) return;
    const annotationDataUrl = canvasRef.current && isDrawing ? canvasRef.current.toDataURL('image/png') : null;
    addCoachFeedback({
      videoId: video.id,
      timestamp: currentTime,
      text: feedbackText.trim(),
      tags: activeTags,
      drillId: selectedDrillId,
      annotationDataUrl,
    });
    setLocalFeedback(getCoachFeedbackFor(video.id));
    setFeedbackText('');
    setSelectedDrillId(null);
    setIsDrawing(false);
    clearCanvas();
  };

  const finishReview = () => {
    if (request) completeCoachRequest(request.id);
    navigate('/coach/dashboard');
  };

  if (!request || !video) {
    return (
      <div className="min-h-screen bg-kreeda-charcoal flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-3">Review not found.</p>
          <button onClick={() => navigate('/coach/dashboard')} className="text-kreeda-orange hover:underline">
            ← Back to Coach Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kreeda-charcoal">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header user={identity} onLogout={onLogout} />
        <main className="p-6 max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white text-2xl font-bold">Review Requests</h1>
              <p className="text-gray-500 text-sm">Review player videos and provide feedback</p>
            </div>
            <button
              onClick={finishReview}
              className="px-4 py-2 bg-kreeda-orange text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              data-testid="finish-review-button"
            >
              ✓ Finish & Send
            </button>
          </div>

          {/* Request chips (just this one in demo; the row shows placeholder chips too) */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm ${
                  i === 0
                    ? 'bg-kreeda-orange/10 border-kreeda-orange/30 text-white'
                    : 'bg-[#1f1f1f] border-white/5 text-gray-400'
                }`}
              >
                <p className="font-medium">Ramandeep Singh</p>
                <p className="text-[10px] text-gray-500">Video Review</p>
              </div>
            ))}
          </div>

          {/* Selected request header */}
          <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white text-lg font-bold">Ramandeep Singh</h2>
                <p className="text-gray-500 text-sm">Video Review — "fix my footwork"</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full font-medium">accepted</span>
            </div>

            {/* Video + canvas overlay */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                controls
                crossOrigin="anonymous"
                data-testid="review-video"
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
              <p className="text-gray-400 text-xs">Pause video to set timestamp</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write feedback about this moment..."
                  className="flex-1 bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-kreeda-orange/50"
                  data-testid="feedback-input"
                />
                <div className="bg-[#2a2a2a] px-3 py-2 rounded-lg text-xs text-gray-400 font-mono">
                  @{formatTs(currentTime)}
                </div>
                <button
                  onClick={addNote}
                  disabled={!feedbackText.trim()}
                  className="px-4 py-2 bg-kreeda-orange hover:bg-opacity-90 disabled:opacity-50 text-white text-sm font-medium rounded-lg"
                  data-testid="add-feedback-button"
                >
                  + Add
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500">Tags:</span>
                {COACH_FEEDBACK_TAGS.map((tag) => {
                  const isActive = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        isActive ? TAG_COLOR[tag] : 'bg-[#2a2a2a] text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDrillPicker(!showDrillPicker)}
                  className="text-xs text-gray-300 hover:text-white transition-colors"
                >
                  + Suggest Drill
                </button>
                <button
                  onClick={() => setIsDrawing(!isDrawing)}
                  className={`text-xs transition-colors ${isDrawing ? 'text-kreeda-orange' : 'text-gray-300 hover:text-white'}`}
                  data-testid="draw-on-frame-button"
                >
                  {isDrawing ? '✓ Drawing' : 'Draw on Frame'}
                </button>
                {isDrawing && (
                  <>
                    <div className="flex gap-1">
                      {ANNOTATION_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setDrawColor(c)}
                          className={`w-5 h-5 rounded-full border-2 ${drawColor === c ? 'border-white' : 'border-transparent'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button onClick={clearCanvas} className="text-[10px] text-gray-400 hover:text-white">
                      clear
                    </button>
                  </>
                )}
              </div>

              {/* Drill picker (mini) */}
              {showDrillPicker && (
                <div className="bg-[#2a2a2a] border border-white/5 rounded-lg p-3 space-y-1">
                  {['Split-step ladder', 'Shadow defensive clears', 'Jump smash progression', 'Net kill reaction'].map((name, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedDrillId(`d${i + 1}`); setShowDrillPicker(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-white/5 rounded"
                    >
                      🎯 {name}
                    </button>
                  ))}
                </div>
              )}

              {selectedDrillId && (
                <p className="text-[10px] text-kreeda-orange">Drill attached: {selectedDrillId}</p>
              )}
            </div>
          </div>

          {/* Existing feedback on this video */}
          {localFeedback.length > 0 && (
            <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5">
              <h3 className="text-white font-bold mb-3">Feedback you've added ({localFeedback.length})</h3>
              <div className="space-y-2">
                {localFeedback.map((f) => (
                  <div key={f.id} className="flex items-start gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                    <span className="text-xs text-kreeda-orange font-mono">{formatTs(f.timestamp)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200">{f.text}</p>
                      <div className="flex gap-1 mt-1">
                        {f.tags.map((t) => (
                          <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full ${TAG_COLOR[t] || TAG_COLOR.General}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
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
