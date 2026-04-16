import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoachMatchCard from './CoachMatchCard';
import PlayerMatchCard from './PlayerMatchCard';
import { MATCHMAKING_COACHES, MATCHMAKING_PLAYERS } from '../../mocks/fixtures';

const LOADING_TEXTS = [
  'Analyzing your play style...',
  'Scanning coach specializations...',
  'Comparing skill profiles...',
  'Calculating compatibility scores...',
  'Finding your best matches...',
];

const SmartMatchmaking = () => {
  const [activeTab, setActiveTab] = useState('coach');
  const [matchState, setMatchState] = useState('idle'); // idle | loading | done
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const scrollRef = useRef(null);

  const startMatching = useCallback(() => {
    setMatchState('loading');
    setLoadingTextIndex(0);
  }, []);

  // Loading timer
  useEffect(() => {
    if (matchState !== 'loading') return;
    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 600);
    const timer = setTimeout(() => {
      clearInterval(textInterval);
      setMatchState('done');
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, [matchState]);

  // Reset to idle when switching tabs
  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setMatchState('idle');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5"
      data-testid="smart-matchmaking-section"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-kreeda-orange/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Smart Matchmaking</h3>
            <p className="text-[10px] text-white/40">AI-powered recommendations based on your analysis</p>
          </div>
        </div>

        {/* Toggle tabs */}
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5" data-testid="matchmaking-tabs">
          <button
            onClick={() => handleTabSwitch('coach')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'coach'
                ? 'bg-kreeda-orange text-white shadow-sm'
                : 'text-white/50 hover:text-white/80'
            }`}
            data-testid="tab-find-coach"
          >
            Find a Coach
          </button>
          <button
            onClick={() => handleTabSwitch('player')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'player'
                ? 'bg-kreeda-orange text-white shadow-sm'
                : 'text-white/50 hover:text-white/80'
            }`}
            data-testid="tab-find-player"
          >
            Find a Player
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {matchState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 gap-4"
            data-testid="matchmaking-idle"
          >
            <div className="w-16 h-16 rounded-full bg-kreeda-orange/10 border border-kreeda-orange/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {activeTab === 'coach' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                )}
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/70 mb-1">
                {activeTab === 'coach'
                  ? 'Find coaches tailored to your weaknesses'
                  : 'Discover players that match your skill level'}
              </p>
              <p className="text-[10px] text-white/35">
                Our AI analyzes your video performance to find the best matches
              </p>
            </div>
            <button
              onClick={startMatching}
              className="mt-1 px-5 py-2.5 bg-kreeda-orange text-white text-xs font-semibold rounded-lg hover:bg-kreeda-orange/90 transition-all active:scale-95 flex items-center gap-2"
              data-testid="start-matching-btn"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {activeTab === 'coach' ? 'Find My Ideal Coach' : 'Find Matching Players'}
            </button>
          </motion.div>
        )}

        {matchState === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
            data-testid="matchmaking-loading"
          >
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-kreeda-orange animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-kreeda-orange/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingTextIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-xs text-white/50"
              >
                {LOADING_TEXTS[loadingTextIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {matchState === 'done' && (
          <motion.div
            key={`results-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
              data-testid="matchmaking-scroll-container"
            >
              {activeTab === 'coach'
                ? MATCHMAKING_COACHES.map((coach, i) => (
                    <CoachMatchCard key={coach.id} coach={coach} index={i} />
                  ))
                : MATCHMAKING_PLAYERS.map((player, i) => (
                    <PlayerMatchCard key={player.id} player={player} index={i} />
                  ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-white/30">
                Showing 3 of 6 matches &middot; Upgrade to see all
              </p>
              <button
                className="flex items-center gap-1 text-[10px] text-kreeda-orange hover:text-kreeda-orange/80 transition-colors font-medium"
                data-testid="matchmaking-view-all"
              >
                View All Matches
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SmartMatchmaking;
