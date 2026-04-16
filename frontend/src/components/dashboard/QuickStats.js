import React from 'react';

const QuickStats = ({ stats, isEmpty }) => {
  const statsData = [
    { 
      icon: '🎥', 
      label: 'Total Videos', 
      value: isEmpty ? '0' : stats?.totalVideos || '4',
      bgColor: 'bg-blue-500',
      bgOpacity: 'bg-blue-500 bg-opacity-10'
    },
    { 
      icon: '📊', 
      label: 'AI Score', 
      value: isEmpty ? '--' : stats?.aiScore || '72',
      bgColor: 'bg-orange-500',
      bgOpacity: 'bg-orange-500 bg-opacity-10'
    },
    { 
      icon: '🏆', 
      label: 'Ranking', 
      value: isEmpty ? '--' : stats?.ranking || '#2',
      bgColor: 'bg-yellow-500',
      bgOpacity: 'bg-yellow-500 bg-opacity-10',
      badge: !isEmpty && stats?.rankingChange ? '↑' : null
    },
    { 
      icon: '🔥', 
      label: 'Streak', 
      value: isEmpty ? '0 days' : stats?.streak || '4 days',
      bgColor: 'bg-green-500',
      bgOpacity: 'bg-green-500 bg-opacity-10'
    },
    { 
      icon: '📈', 
      label: 'Improvement', 
      value: isEmpty ? '--' : stats?.improvement || '+0%',
      bgColor: 'bg-purple-500',
      bgOpacity: 'bg-purple-500 bg-opacity-10'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8" data-testid="quick-stats">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-[#1A1A1A] rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-all hover:transform hover:scale-105"
          data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-full ${stat.bgOpacity} flex items-center justify-center`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            {stat.badge && (
              <span className="text-green-500 text-lg font-bold">{stat.badge}</span>
            )}
          </div>
          <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
          <p className="text-white text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;