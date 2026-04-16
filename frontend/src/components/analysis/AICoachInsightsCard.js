import React from 'react';
import { motion } from 'framer-motion';

const AICoachInsightsCard = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
    else window.dispatchEvent(new CustomEvent('kreeda:open-ai-chat'));
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      onClick={handleClick}
      className="w-full text-left bg-gradient-to-br from-kreeda-orange to-[#D94A25] rounded-xl sm:rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
      data-testid="ai-coach-insights-card"
    >
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight">AI Coach Insights</h3>
        </div>
      </div>

      <p className="text-white/90 text-sm mb-3 leading-snug">
        Get personalised feedback and improvement tips from KreedAI based on your performance.
      </p>

      <div className="flex items-center gap-1.5 text-white font-semibold text-sm">
        <span>Chat with AI Coach</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
};

export default AICoachInsightsCard;
