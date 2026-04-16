import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_COACHES } from '../../mocks/fixtures';
import { addCoachRequest, useReviewStore, getCoachRequestsFor } from '../../mocks/reviewStore';

const STATUS_LABEL = {
  pending: { label: 'Pending', classes: 'bg-yellow-500/10 text-yellow-400' },
  in_review: { label: 'In Review', classes: 'bg-blue-500/10 text-blue-400' },
  completed: { label: 'Completed', classes: 'bg-green-500/10 text-green-400' },
};

const formatRelative = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  return `${days}d ago`;
};

const CoachReviews = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const effectiveVideoId = videoId || 'v-seed-1';
  const [store] = useReviewStore();
  const requests = getCoachRequestsFor(effectiveVideoId);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  // Track which requests have started their timer
  const [completedIds, setCompletedIds] = useState(new Set());
  const startedTimersRef = useRef(new Set());

  const requestedIds = new Set(requests.map((r) => r.coachId));
  const availableCoaches = MOCK_COACHES.filter((c) => !requestedIds.has(c.id));

  const enrichedRequests = requests
    .map((r) => ({ ...r, coach: MOCK_COACHES.find((c) => c.id === r.coachId) }))
    .filter((r) => r.coach);

  // Start 5s timer for each in_review request to simulate completion
  useEffect(() => {
    enrichedRequests.forEach((r) => {
      if (r.status === 'in_review' && !completedIds.has(r.id) && !startedTimersRef.current.has(r.id)) {
        startedTimersRef.current.add(r.id);
        setTimeout(() => {
          setCompletedIds((prev) => new Set([...prev, r.id]));
        }, 5000);
      }
    });
  });

  const handleSend = () => {
    if (!selectedCoachId) return;
    addCoachRequest({ videoId: effectiveVideoId, coachId: selectedCoachId });
    setSelectedCoachId('');
    setShowRequestForm(false);
  };

  const getDisplayStatus = (r) => {
    if (completedIds.has(r.id)) return 'completed';
    return r.status;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#2a2a2a] border border-white border-opacity-5 rounded-xl p-5"
      data-testid="coach-reviews-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-bold">Coach Reviews</h3>
          <span className="text-xs text-gray-500">
            {enrichedRequests.length}/{MOCK_COACHES.length}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {enrichedRequests.map((r) => {
          const isExpanded = expandedId === r.id;
          const displayStatus = getDisplayStatus(r);
          const status = STATUS_LABEL[displayStatus] || STATUS_LABEL.in_review;
          const isCompleted = displayStatus === 'completed';
          return (
            <div key={r.id} className="bg-[#1f1f1f] border border-white/5 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
                data-testid={`coach-request-${r.coachId}`}
              >
                <img src={r.coach.picture} alt={r.coach.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 text-left">
                  <p className="text-white text-sm font-medium">{r.coach.name}</p>
                  <p className="text-gray-500 text-xs">{r.coach.specialization}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.classes}`}>
                  {status.label}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 text-xs text-gray-400"
                  >
                    {isCompleted ? (
                      <button
                        onClick={() => navigate(`/review/${effectiveVideoId}`)}
                        className="text-kreeda-orange hover:underline font-medium"
                        data-testid={`view-review-link-${r.coachId}`}
                      >
                        View Review
                      </button>
                    ) : (
                      <p>Sent {formatRelative(r.createdAt)}. Coach will respond within 24-48 hours.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {availableCoaches.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-2">All coaches have been requested.</p>
      ) : !showRequestForm ? (
        <button
          onClick={() => setShowRequestForm(true)}
          className="w-full text-center py-2 text-sm text-kreeda-orange hover:bg-white/5 rounded-lg transition-colors"
          data-testid="request-coach-review-button"
        >
          + Request a Coach Review
        </button>
      ) : (
        <div className="bg-[#1f1f1f] border border-white/5 rounded-lg p-3 space-y-2">
          <label className="text-xs text-gray-400">Request a Coach Review</label>
          <select
            value={selectedCoachId}
            onChange={(e) => setSelectedCoachId(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-kreeda-orange/50"
            data-testid="coach-select"
          >
            <option value="">Select a coach</option>
            {availableCoaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.specialization}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={!selectedCoachId}
              className="flex-1 bg-kreeda-orange hover:bg-opacity-90 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              data-testid="send-for-review-button"
            >
              Send for Review
            </button>
            <button
              onClick={() => { setShowRequestForm(false); setSelectedCoachId(''); }}
              className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] border border-white/5 text-sm text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CoachReviews;
