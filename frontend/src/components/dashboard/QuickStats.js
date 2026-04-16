import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ iconBg, iconColor, iconPath, label, value, valueColor = 'text-white', hoverBorder }) => (
  <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-3 md:p-4 rounded-2xl md:rounded-3xl ${hoverBorder} transition-all hover:shadow-xl group`}>
    <div className="flex items-start gap-2 md:gap-3">
      <div className={`w-9 h-9 md:w-10 md:h-10 ${iconBg} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
        <svg className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
          {iconPath}
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-white/60 text-[10px] md:text-xs font-medium truncate">{label}</p>
        <p className={`text-lg md:text-xl font-bold ${valueColor}`}>{value}</p>
      </div>
    </div>
  </div>
);

const QuickStats = ({ stats, isEmpty }) => {
  const safeStats = stats || { totalVideos: 0, aiScore: 0, ranking: '#-', rankingChange: false, streak: '0 days', improvement: '+0%' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8"
    >
      <StatCard
        iconBg="bg-gradient-to-br from-blue-500/30 to-blue-500/10"
        iconColor="text-blue-400"
        hoverBorder="hover:border-blue-400/30"
        label="Total Videos"
        value={safeStats.totalVideos}
        iconPath={<path fillRule="evenodd" d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553-1.276A1 1 0 0118 5.618v8.764a1 1 0 01-1.447.894L14 13.768V6.232l2.553-1.508z" clipRule="evenodd" />}
      />

      <StatCard
        iconBg="bg-gradient-to-br from-kreeda-orange/30 to-kreeda-orange/10"
        iconColor="text-kreeda-orange"
        hoverBorder="hover:border-kreeda-orange/30"
        label="AI Score"
        value={safeStats.aiScore}
        valueColor="text-kreeda-orange"
        iconPath={<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />}
      />

      <StatCard
        iconBg="bg-gradient-to-br from-yellow-500/30 to-yellow-500/10"
        iconColor="text-yellow-400"
        hoverBorder="hover:border-yellow-400/30"
        label="Ranking"
        value={
          <span className="inline-flex items-center gap-1">
            {safeStats.ranking}
            {safeStats.rankingChange && <span className="text-green-400 text-sm">↑</span>}
          </span>
        }
        iconPath={<path fillRule="evenodd" d="M10 2L3 7v6c0 3.866 3.134 7 7 7s7-3.134 7-7V7l-7-5zM9 12a1 1 0 102 0V9a1 1 0 10-2 0v3z" clipRule="evenodd" />}
      />

      <StatCard
        iconBg="bg-gradient-to-br from-green-500/30 to-green-500/10"
        iconColor="text-green-400"
        hoverBorder="hover:border-green-400/30"
        label="Streak"
        value={safeStats.streak}
        iconPath={<path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03z" clipRule="evenodd" />}
      />

      <StatCard
        iconBg="bg-gradient-to-br from-purple-500/30 to-purple-500/10"
        iconColor="text-purple-400"
        hoverBorder="hover:border-purple-400/30"
        label="Improvement"
        value={safeStats.improvement}
        iconPath={<path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />}
      />
    </motion.div>
  );
};

export default QuickStats;
