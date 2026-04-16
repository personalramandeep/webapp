import React from 'react';
import { motion } from 'framer-motion';

const AICoachCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-[#F45831] to-[#d14520] rounded-xl p-6 border border-white border-opacity-10 backdrop-blur-xl cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-2">AI Coach Insights</h3>
          <p className="text-white text-opacity-90 text-sm mb-4">
            Get personalized feedback and improvement tips from KreedAI based on your performance.
          </p>
          <button className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
            <span>Chat with AI Coach</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AICoachCard;
