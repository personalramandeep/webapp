import React from 'react';
import { MOCK_LEADERBOARD } from '../../mocks/fixtures';

const LeaderboardPlayerPill = ({ player }) => (
  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full flex-shrink-0 hover:border-kreeda-orange/30 transition-colors">
    <span className={`text-xs font-bold ${player.rank === 1 ? 'text-yellow-400' : player.rank === 2 ? 'text-gray-300' : 'text-orange-400'}`}>
      #{player.rank}
    </span>
    <img
      src={player.picture}
      alt={player.name}
      className="w-7 h-7 rounded-full border border-white/20"
    />
    <div className="flex flex-col leading-tight">
      <span className="text-white text-xs font-semibold whitespace-nowrap">{player.name}</span>
      <span className="text-white/50 text-[10px]">{player.city}</span>
    </div>
    <div className="flex items-center gap-1 px-2 py-0.5 bg-kreeda-orange/10 rounded-full">
      <svg className="w-3 h-3 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
      <span className="text-kreeda-orange text-xs font-bold">{player.score}</span>
    </div>
  </div>
);

const LeaderboardStrip = ({ currentUserId }) => {
  return (
    <div className="w-full bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/95 to-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden mb-6">
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-semibold text-white">Live Leaderboard</span>
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full animate-pulse">
            LIVE
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs text-white/70 hover:text-kreeda-orange transition-colors group">
          <span>View Full Leaderboard</span>
          <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="relative py-3 px-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {MOCK_LEADERBOARD.map((player) => (
            <LeaderboardPlayerPill key={player.rank} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardStrip;
