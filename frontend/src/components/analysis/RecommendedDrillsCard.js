import React, { useState } from 'react';
import { motion } from 'framer-motion';

const difficultyColor = (d) => {
  switch ((d || '').toLowerCase()) {
    case 'easy': return 'text-green-400';
    case 'medium': return 'text-yellow-400';
    case 'hard': return 'text-red-400';
    default: return 'text-white/60';
  }
};

const DrillRow = ({ drill, index, isHovered, onHover, onLeave }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.4 + index * 0.1 }}
    whileHover={{ y: -2 }}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    className="bg-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
  >
    <div className="flex items-start gap-3">
      {drill.thumbnail ? (
        <div className="relative w-14 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-black/40">
          <img src={drill.thumbnail} alt={drill.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="text-2xl flex-shrink-0">{drill.icon || '🎯'}</div>
      )}

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-semibold text-sm leading-snug line-clamp-1 mb-0.5">{drill.name}</h4>
        <p className="text-white/60 text-xs mb-1.5 line-clamp-1">{drill.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-white/50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{drill.duration}</span>
          </div>
          <span className={`font-medium ${difficultyColor(drill.difficulty)}`}>{drill.difficulty}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/50 truncate">{drill.focus}</span>
        </div>
      </div>

      <motion.svg
        className="flex-shrink-0 w-4 h-4 text-white/40 group-hover:text-white/60 mt-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ rotate: isHovered ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </motion.svg>
    </div>
  </motion.div>
);

const RecommendedDrillsCard = ({ drills = [] }) => {
  const [hovered, setHovered] = useState(null);

  if (!drills || drills.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
      data-testid="recommended-drills-card"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white">Recommended Drills</h3>
        <button className="text-kreeda-orange text-xs font-medium hover:underline">View All</button>
      </div>

      <div className="space-y-2 mb-3">
        {drills.slice(0, 3).map((drill, i) => (
          <DrillRow
            key={drill.id || i}
            drill={drill}
            index={i}
            isHovered={hovered === (drill.id || i)}
            onHover={() => setHovered(drill.id || i)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      <button
        className="w-full py-2.5 bg-kreeda-orange text-white rounded-lg font-semibold text-sm hover:bg-kreeda-orange/90 transition-colors"
        data-testid="start-practice-button"
      >
        Start Practice Session
      </button>
    </motion.div>
  );
};

export default RecommendedDrillsCard;
