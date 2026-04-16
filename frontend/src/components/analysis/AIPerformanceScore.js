import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AIPerformanceScore = ({ score, grade }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // Green
    if (score >= 70) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const circumference = 2 * Math.PI * 70; // radius = 70
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#1a1a1a] border border-white border-opacity-5 rounded-xl p-6 backdrop-blur-xl"
      style={{
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">AI Performance Score</h3>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-4 bg-[#2a2a2a] rounded-lg text-sm text-gray-300"
        >
          Score is based on 5 skills: Footwork, Net Play, Defense, Smashes, and Endurance — equally weighted, averaged out of 100.
        </motion.div>
      )}

      {/* Score Ring */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke={getScoreColor(score)}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: 'stroke-dashoffset 1.5s ease-out'
              }}
            />
          </svg>
          {/* Score Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span 
              className="text-5xl font-bold"
              style={{ color: getScoreColor(score) }}
            >
              {animatedScore}
            </span>
            <span className="text-gray-400 text-sm">/ 100</span>
          </div>
        </div>
        <div className="text-center mt-4">
          <span className="text-gray-400 text-sm">Grade: </span>
          <span className="text-white text-2xl font-bold">{grade}</span>
        </div>
      </div>

      {/* Side Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#2a2a2a] rounded-lg p-4 border border-white border-opacity-5">
          <div className="flex items-center gap-2 text-green-400 mb-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">+5</span>
          </div>
          <p className="text-xs text-gray-400">vs. Your Average</p>
        </div>
        <div className="bg-[#2a2a2a] rounded-lg p-4 border border-white border-opacity-5">
          <p className="text-white font-semibold mb-1">~96 kcal</p>
          <p className="text-xs text-gray-400">~1,920 steps</p>
          <p className="text-xs text-gray-500 mt-1">Per set (Intermediate)</p>
        </div>
      </div>

      <button className="w-full mt-4 py-3 bg-[#2a2a2a] border border-white border-opacity-5 rounded-lg hover:border-opacity-10 transition-all text-sm text-gray-300 hover:text-white">
        View Overall Performance →
      </button>
    </motion.div>
  );
};

export default AIPerformanceScore;
