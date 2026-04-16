import React, { useState, useEffect, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const scrollRef = useRef(null);

  // Simulated loading on tab switch
  useEffect(() => {
    setIsLoading(true);
    setLoadingTextIndex(0);
    const textInterval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 600);
    const timer = setTimeout(() => {
      clearInterval(textInterval);
      setIsLoading(false);
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearInterval(textInterval);
    };
  }, [activeTab]);

  const coaches = MATCHMAKING_COACHES;
  const players = MATCHMAKING_PLAYERS;

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
            onClick={() => setActiveTab('coach')}
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
            onClick={() => setActiveTab('player')}
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
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
            data-testid="matchmaking-loading"
          >
            {/* Spinner */}
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
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Scroll container */}
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
              data-testid="matchmaking-scroll-container"
            >
              {activeTab === 'coach'
                ? coaches.map((coach, i) => (
                    <CoachMatchCard key={coach.id} coach={coach} index={i} />
                  ))
                : players.map((player, i) => (
                    <PlayerMatchCard key={player.id} player={player} index={i} />
                  ))}
            </div>

            {/* Summary footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-white/30">
                Showing {activeTab === 'coach' ? '3' : '3'} of {activeTab === 'coach' ? '6' : '6'} matches &middot; Upgrade to see all
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
