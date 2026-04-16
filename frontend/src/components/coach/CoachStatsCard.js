import React from 'react';

const ICON = {
  video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  clipboard: 'M9 12l2 2 4-4m0-6H9a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V8l-4-4z',
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
};

const CoachStatsCard = ({ stats }) => {
  const items = [
    {
      iconPath: ICON.video,
      label: 'Total Videos',
      value: stats?.totalVideos ?? 0,
      gradient: 'from-blue-500/30 to-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      iconPath: ICON.clipboard,
      label: 'Sessions Analyzed',
      value: stats?.sessionsAnalyzed ?? 0,
      gradient: 'from-emerald-500/30 to-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      iconPath: ICON.chart,
      label: 'Avg Score',
      value: stats?.avgScore ?? 0,
      gradient: 'from-kreeda-orange/30 to-kreeda-orange/10',
      iconColor: 'text-kreeda-orange',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6 rounded-3xl hover:border-kreeda-orange/30 transition-all duration-300 h-full">
      <h3 className="text-base md:text-xl font-semibold text-white mb-3 md:mb-4">Coach Stats</h3>
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {items.map((item) => (
          <div key={item.label} className="bg-white/5 rounded-xl p-3 md:p-4">
            <div className={`w-8 h-8 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center mb-2`}>
              <svg className={`w-4 h-4 ${item.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
              </svg>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-white/60">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachStatsCard;
