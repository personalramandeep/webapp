// PASTE TO: frontend/src/components/VideoAnalysisPage.js (REPLACES file 14)
// If Emergent's route wires /analysis/:id to `./components/VideoAnalysis` instead of
// `./components/VideoAnalysisPage`, either rename this file to VideoAnalysis.js or update
// the import in App.js. File 11 currently imports ./components/VideoAnalysis.
//
// Changes vs. file 14:
//   - Left column now matches donor layout: VideoPlayerSection → (SkillBreakdown + CourtHeatmap) → KeyMomentsTimeline
//   - Right column: OverallScoreCard → AICoachInsightsCard → CoachReviews → RecommendedDrillsCard
//   - Pulls analysis via getAnalysisFor(videoId, baseScore) — real shape (skills/keyMoments/heatmap/drills)
//   - Kept: breadcrumb, Share + Back buttons, hasCoachReview "View Coach Review" gate,
//           ShareAnalyticsModal + AICoachChatPanel wiring, pencil edit icon next to title

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './dashboard/Sidebar';
import VideoPlayerSection from './analysis/VideoPlayerSection';
import SkillBreakdownCard from './analysis/SkillBreakdownCard';
import BadmintonCourtHeatmap from './analysis/BadmintonCourtHeatmap';
import KeyMomentsTimeline from './analysis/KeyMomentsTimeline';
import OverallScoreCard from './analysis/OverallScoreCard';
import AICoachInsightsCard from './analysis/AICoachInsightsCard';
import CoachReviews from './analysis/CoachReviews';
import RecommendedDrillsCard from './analysis/RecommendedDrillsCard';
import SmartMatchmaking from './analysis/SmartMatchmaking';
import AICoachChatPanel from './analysis/AICoachChatPanel';
import ShareAnalyticsModal from './share/ShareAnalyticsModal';
import { useIdentity } from '../contexts/IdentityContext';
import { getVideo, getCoachFeedbackFor, useReviewStore } from '../mocks/reviewStore';
import { getAnalysisFor } from '../mocks/mockAnalysis';

const VideoAnalysisPage = ({ onLogout }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { identity } = useIdentity();
  const [store] = useReviewStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const storedVideo = getVideo(videoId);
  const coachFeedback = getCoachFeedbackFor(videoId);
  const hasCoachReview = coachFeedback.length > 0;

  const videoTitle = storedVideo?.title || 'Singles Match - Court 2';
  const videoThumbnail = storedVideo?.thumbnail || 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&h=675&fit=crop';
  const videoUrl = storedVideo?.videoUrl || null;
  const videoDuration = storedVideo?.duration || 1112; // 18:32 fallback
  const aiScore = storedVideo?.aiScore ?? 72;
  const analysis = getAnalysisFor(videoId || 'v-default', aiScore);

  const analysisForChat = {
    playerName: identity.name,
    title: videoTitle,
    score: aiScore,
    grade: analysis.performanceGrade,
    skills: analysis.skills,
    analysis: {
      calories: 630,
      vsAverage: -6,
      distance: '8.51m',
      steps: 18,
      duration: '0 min',
      smashCount: 2,
      defenseCount: 4,
      serveCount: 0,
      totalShots: 6,
    },
  };

  const analysisForShare = {
    score: aiScore,
    grade: analysis.performanceGrade,
    playerName: identity.name,
    videoTitle: videoTitle,
  };

  useEffect(() => {
    const open = () => setChatOpen(true);
    window.addEventListener('kreeda:open-ai-chat', open);
    return () => window.removeEventListener('kreeda:open-ai-chat', open);
  }, []);

  return (
    <div className="min-h-screen bg-kreeda-charcoal">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={onLogout}
      />

      <div
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: isSidebarCollapsed ? 72 : 280 }}
      >
        <div className="sticky top-16 z-40 bg-kreeda-charcoal border-b border-white/5 px-4 md:px-6 py-3">
          <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between gap-4 mb-2">
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm min-w-0 overflow-hidden">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white/60 hover:text-white transition-colors whitespace-nowrap"
              >
                Dashboard
              </button>
              <span className="text-white/30">›</span>
              <button className="text-white/60 hover:text-white transition-colors whitespace-nowrap">
                My Videos
              </button>
              <span className="text-white/30">›</span>
              <span className="text-kreeda-orange font-medium truncate">{videoTitle}</span>
            </nav>

            <div className="flex items-center gap-2 flex-shrink-0">
              {hasCoachReview && (
                <button
                  onClick={() => navigate(`/review/${videoId}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-kreeda-orange text-white rounded-lg hover:bg-opacity-90 transition-all text-xs font-medium"
                  data-testid="view-coach-review-button"
                >
                  View Coach Review
                </button>
              )}
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs text-white"
                data-testid="share-button"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-xs text-white"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white">{videoTitle}</h1>
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" aria-label="Edit title">
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-3 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-3 md:gap-4">
            <VideoPlayerSection
              videoUrl={videoUrl}
              thumbnail={videoThumbnail}
              duration={videoDuration}
              keyMoments={analysis.keyMoments}
              title={videoTitle}
              aiScore={aiScore}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <SkillBreakdownCard skills={analysis.skills} />
              <BadmintonCourtHeatmap heatmapData={analysis.heatmapData} />
            </div>

            <SmartMatchmaking />
            <KeyMomentsTimeline moments={analysis.keyMoments} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1 flex flex-col gap-3 md:gap-4">
            <div className="lg:sticky lg:top-24 flex flex-col gap-3 md:gap-4">
              <OverallScoreCard analysis={analysis} />
              <AICoachInsightsCard onClick={() => setChatOpen(true)} />
              <CoachReviews />
              <RecommendedDrillsCard skills={analysis.skills} />
            </div>
          </div>
        </div>
      </div>
      </div>

      <AICoachChatPanel
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        videoContext={analysisForChat}
      />
      <ShareAnalyticsModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        analysis={analysisForShare}
      />
    </div>
  );
};

export default VideoAnalysisPage;
