import React from 'react';

const ICON = {
  sparkles: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  trendUp: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  trophy: 'M5 3v4M3 5h4m6 0a6 6 0 11-12 0 6 6 0 0112 0zM9 17a2 2 0 11-4 0 2 2 0 014 0z',
};

const RECOMMENDATIONS = [
  {
    id: 'footwork',
    iconPath: ICON.trendUp,
    iconColor: 'text-orange-400',
    gradient: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-500/20',
    title: 'Improve your footwork',
    subtitle: 'Coaches specializing in movement',
  },
  {
    id: 'last_match',
    iconPath: ICON.video,
    iconColor: 'text-blue-400',
    gradient: 'from-blue-500/20 to-purple-500/10',
    border: 'border-blue-500/20',
    title: 'Based on your last match',
    subtitle: 'Work on your weak zones',
  },
  {
    id: 'players_like_you',
    iconPath: ICON.users,
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    title: 'Players like you booked',
    subtitle: '12 similar players this week',
  },
  {
    id: 'top_week',
    iconPath: ICON.trophy,
    iconColor: 'text-pink-400',
    gradient: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-500/20',
    title: 'Top coach this week',
    subtitle: 'Highest rated in Bangalore',
  },
];

const AIRecommendationStrip = () => {
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-kreeda-orange flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.sparkles} />
        </svg>
        <span className="text-white font-semibold text-sm md:text-base">Recommended for you</span>
        <span className="px-2 py-0.5 bg-kreeda-orange/10 border border-kreeda-orange/30 rounded-full text-kreeda-orange text-[10px] font-medium">
          Powered by AI
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2.5 pb-1">
          {RECOMMENDATIONS.map(({ id, iconPath, iconColor, gradient, border, title, subtitle }) => (
            <button
              key={id}
              className={`min-w-[160px] md:min-w-[190px] bg-gradient-to-br ${gradient} border ${border} rounded-xl px-3 py-2 cursor-pointer hover:border-white/20 hover:scale-[1.02] transition-all duration-200 text-left flex-shrink-0 flex items-center gap-2.5`}
            >
              <div className={`w-6 h-6 flex-shrink-0 ${iconColor}`}>
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold leading-snug truncate">{title}</p>
                <p className="text-white/40 text-[10px] leading-snug truncate">{subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationStrip;
