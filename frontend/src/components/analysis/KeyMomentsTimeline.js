// PASTE TO: frontend/src/components/analysis/KeyMomentsTimeline.js (NEW FILE)
// Port of kreeda-webapp/src/components/analysis/KeyMomentsTimeline.jsx.
// Horizontal scrollable carousel of moment cards. Heroicons → inline SVG.

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ICON_PATHS = {
  highlight: 'M12 2l2.5 5 5.5.5-4 3.5 1 5.5L12 13l-5 3 1-5.5L4 7l5.5-.5L12 2z',
  weakness: 'M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.75-2.98L13.73 4.02a2 2 0 00-3.46 0L3.32 16.02A2 2 0 005.07 19z',
  strength: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
};

const COLOR_MAP = {
  highlight: { bg: 'from-yellow-500/20 to-yellow-500/5', border: 'border-yellow-500/30', icon: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
  weakness: { bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500/30', icon: 'text-red-400', badge: 'bg-red-500/20 text-red-300' },
  strength: { bg: 'from-green-500/20 to-green-500/5', border: 'border-green-500/30', icon: 'text-green-400', badge: 'bg-green-500/20 text-green-300' },
};

const DEFAULT_COLORS = { bg: 'from-white/10 to-white/5', border: 'border-white/10', icon: 'text-white/60', badge: 'bg-white/10 text-white/60' };

const formatTimestamp = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const KeyMomentsTimeline = ({ moments }) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    if (timelineRef.current && moments && moments.length > 0) {
      const first = timelineRef.current.querySelector('.moment-card');
      if (first) {
        setTimeout(() => first.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }), 600);
      }
    }
  }, [moments]);

  if (!moments || moments.length === 0) return null;

  const sorted = [...moments].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
      data-testid="key-moments-card"
    >
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-base font-bold text-white">Key Moments</h3>
        <span className="text-white/40 text-xs">{moments.length} moments</span>
      </div>
      <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">
        {moments.length} important {moments.length === 1 ? 'moment' : 'moments'} detected in this video
      </p>

      <div ref={timelineRef} className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 sm:gap-3 min-w-max">
          {sorted.map((moment, index) => {
            const colors = COLOR_MAP[moment.type] || DEFAULT_COLORS;
            const iconPath = ICON_PATHS[moment.type] || ICON_PATHS.strength;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`moment-card bg-gradient-to-br ${colors.bg} backdrop-blur-sm border ${colors.border} rounded-lg sm:rounded-xl overflow-hidden cursor-pointer min-w-[220px] max-w-[220px] sm:min-w-[240px] sm:max-w-[240px] hover:shadow-lg hover:-translate-y-1 transition-all`}
              >
                {moment.thumbnail && (
                  <div className="relative w-full aspect-video">
                    <img src={moment.thumbnail} alt={moment.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {formatTimestamp(moment.timestamp)}
                    </div>
                  </div>
                )}
                <div className="p-2.5 sm:p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={colors.icon}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={iconPath} />
                      </svg>
                    </div>
                    {!moment.thumbnail && (
                      <span className="text-white/60 text-xs font-mono">{formatTimestamp(moment.timestamp)}</span>
                    )}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{moment.title}</h4>
                  <p className="text-white/70 text-xs mb-2 line-clamp-2">{moment.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`${colors.badge} text-xs px-2 py-1 rounded-lg capitalize`}>{moment.type}</span>
                    <span className="text-white/50 text-xs">Score: {moment.score}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default KeyMomentsTimeline;
