import { useEffect, useState, useCallback } from 'react';
import {
  MOCK_PLAYER,
  MOCK_COACH_IDENTITY,
  MOCK_VIDEOS,
  MOCK_COACHES,
  MOCK_COACH_REVIEWS,
  SEED_COACH_REQUESTS,
  SEED_COACH_FEEDBACK,
  SEED_SUGGESTED_DRILLS,
} from './fixtures';


const KEY = 'kreeda_demo_v1';
const EVT = 'kreeda-demo-update';

const DEFAULT_STATE = {
  activeIdentity: 'player',
  uploadedVideos: MOCK_VIDEOS,
  coachRequests: SEED_COACH_REQUESTS,
  coachFeedback: SEED_COACH_FEEDBACK,
  suggestedDrills: SEED_SUGGESTED_DRILLS,
  aiChatByVideo: {},
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function write(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVT));
}

export const reviewStore = {
  get: read,
  set: write,
  patch(updater) {
    const next = typeof updater === 'function' ? updater(read()) : { ...read(), ...updater };
    write(next);
    return next;
  },
  reset() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(EVT));
  },
};

export function useReviewStore() {
  const [state, setState] = useState(read);
  useEffect(() => {
    const refresh = () => setState(read());
    window.addEventListener('storage', refresh);
    window.addEventListener(EVT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(EVT, refresh);
    };
  }, []);
  const patch = useCallback((updater) => reviewStore.patch(updater), []);
  return [state, patch];
}

export function useActiveIdentity() {
  const [state, patch] = useReviewStore();
  const identity = state.activeIdentity === 'coach' ? MOCK_COACH_IDENTITY : MOCK_PLAYER;
  const setIdentity = useCallback(
    (role) => patch((s) => ({ ...s, activeIdentity: role === 'coach' ? 'coach' : 'player' })),
    [patch]
  );
  return { identity, role: state.activeIdentity, setIdentity };
}

// Helpers consumed by the UI
export function addCoachRequest({ videoId, coachId, note = '' }) {
  reviewStore.patch((s) => ({
    ...s,
    coachRequests: [
      ...s.coachRequests,
      {
        id: `req-${Date.now()}`,
        videoId,
        coachId,
        note,
        status: 'in_review',
        createdAt: new Date().toISOString(),
      },
    ],
  }));
}

export function getCoachRequestsFor(videoId) {
  return reviewStore.get().coachRequests.filter((r) => r.videoId === videoId);
}

export function getPendingRequestsForCoach(coachId) {
  return reviewStore.get().coachRequests.filter((r) => r.coachId === coachId && r.status === 'in_review');
}

export function completeCoachRequest(requestId) {
  reviewStore.patch((s) => ({
    ...s,
    coachRequests: s.coachRequests.map((r) => (r.id === requestId ? { ...r, status: 'completed' } : r)),
  }));
}

export function addCoachFeedback({ videoId, timestamp, text, tags, drillId, annotationDataUrl }) {
  reviewStore.patch((s) => {
    const existing = s.coachFeedback[videoId] || [];
    return {
      ...s,
      coachFeedback: {
        ...s.coachFeedback,
        [videoId]: [...existing, { id: `f-${Date.now()}`, timestamp, text, tags, drillId, annotationDataUrl }],
      },
    };
  });
}

export function getCoachFeedbackFor(videoId) {
  return reviewStore.get().coachFeedback[videoId] || [];
}

export function addUploadedVideo(video) {
  reviewStore.patch((s) => ({ ...s, uploadedVideos: [video, ...s.uploadedVideos] }));
}

export function getVideo(videoId) {
  return reviewStore.get().uploadedVideos.find((v) => v.id === videoId);
}

export function getCoachById(coachId) {
  return MOCK_COACHES.find((c) => c.id === coachId);
}

export function getCoachReviewsFor(coachId) {
  return MOCK_COACH_REVIEWS[coachId] || [];
}
