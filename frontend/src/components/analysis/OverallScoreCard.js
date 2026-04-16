import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const useCountUp = (target, duration = 1500, delay = 300) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now() + delay;
    let raf;
    const tick = () => {
      const now = Date.now();
      if (now < start) { raf = requestAnimationFrame(tick); return; }
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return val;
};

const OverallScoreCard = ({ analysis }) => {
  const [showInfo, setShowInfo] = useState(false);
  const score = analysis?.overallScore || 0;
  const grade = analysis?.performanceGrade || 'N/A';
  const vsAverage = analysis?.comparison?.vsAverage?.overall || 0;
  const activity = analysis?.activity || {};
  const predictedKcal = activity.predictedSetKcal ?? 96;
  const predictedSteps = activity.predictedSetSteps ?? 1920;
  const playerLevel = activity.playerLevel ?? 'Intermediate';

  const animatedScore = useCountUp(score, 1500, 300);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const scoreColor = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gradient-to-br from-kreeda-orange/20 to-kreeda-orange/5 backdrop-blur-sm border border-kreeda-orange/30 rounded-xl sm:rounded-2xl p-3"
      data-testid="overall-score-card"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-kreeda-orange" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="text-sm font-bold text-white">AI Performance Score</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Score information"
          >
            <svg className="w-4 h-4 text-white/60 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-9 right-0 w-52 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg p-2.5 shadow-xl z-50"
            >
              <p className="text-white/80 text-[11px] leading-relaxed">
                Score is based on 5 skills: Footwork, Net Play, Defense, Smashes, and Endurance — equally weighted, averaged out of 100.
              </p>
              <div className="absolute -top-1.5 right-3 w-3 h-3 bg-black/95 border-l border-t border-white/20 transform rotate-45" />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center mb-1">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r={radius} stroke="rgba(255, 255, 255, 0.1)" strokeWidth="6" fill="none" />
            <motion.circle
              cx="40"
              cy="40"
              r={radius}
              stroke={scoreColor}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progress }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-2xl font-bold tabular-nums"
              style={{ color: scoreColor }}
            >
              {animatedScore}
            </motion.div>
            <div className="text-white/60 text-[10px] mt-0.5">/ 100</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-1.5">
        <div className="text-base font-bold text-white/90">Grade: {grade}</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-0">
        <div className="col-span-1 bg-white/5 rounded-lg p-2 border border-white/10">
          <div className="text-white/50 text-[10px] font-medium mb-1">vs. Your Average</div>
          <div className="flex items-center gap-1">
            {vsAverage >= 0 ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-green-400 font-bold text-sm">+{vsAverage}</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-red-400 font-bold text-sm">{vsAverage}</span>
              </>
            )}
          </div>
        </div>

        <div className="col-span-2 bg-white/5 rounded-lg p-2 border border-white/10">
          <div className="flex items-center gap-1 mb-1">
            <svg className="w-3 h-3 text-kreeda-orange shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
            </svg>
            <span className="text-white/50 text-[10px] font-medium">Predicted Calorie Burn</span>
          </div>
          <div className="text-white font-bold text-sm">~{predictedKcal} kcal</div>
          <div className="text-white/40 text-[10px] mt-0.5 leading-tight">
            ~{predictedSteps.toLocaleString()} steps · Per set ({playerLevel})
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default OverallScoreCard;
