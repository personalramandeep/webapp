import React, { useState } from 'react';
import { MOCK_LEADERBOARD } from '../../mocks/fixtures';

const getMedal = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const PlayerTickerCard = ({ player }) => {
  const medal = getMedal(player.rank);
  const trendUp = player.change > 0;
  const trendDown = player.change < 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 backdrop-blur-sm border rounded-xl w-[280px] flex-shrink-0 hover:border-kreeda-orange/30 transition-all ${
        player.isMe
          ? 'bg-gradient-to-r from-kreeda-orange/20 to-kreeda-orange/5 border-kreeda-orange/50 shadow-[0_0_15px_rgba(244,88,49,0.15)] ring-1 ring-kreeda-orange/20'
          : 'bg-gradient-to-r from-white/10 to-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center gap-2 min-w-[50px]">
        {medal ? (
          <span className="text-2xl">{medal}</span>
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-sm font-bold text-white/80">#{player.rank}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <img src={player.picture} alt={player.name} className="w-8 h-8 rounded-full border border-white/20 object-cover flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{player.name}</p>
          <div className="flex items-center gap-1 text-xs text-white/60">
            <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{player.city}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-white">{player.score.toLocaleString()}</span>
          {trendUp && <span className="text-xs text-green-400">↑</span>}
          {trendDown && <span className="text-xs text-red-400">↓</span>}
        </div>
        <span className="text-[10px] text-white/50">ELO</span>
      </div>
    </div>
  );
};

const LeaderboardStrip = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/95 to-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden mb-6 relative">
      <div className="flex items-center justify-between px-6 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H5zM5 7a1 1 0 011-1h8a1 1 0 011 1v5.586a1 1 0 01-.293.707l-1.121 1.121A3 3 0 0011 16H9a3 3 0 00-2.586-1.586l-1.121-1.121A1 1 0 015 12.586V7z" clipRule="evenodd" />
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

      <div className="relative py-3 overflow-hidden">
        <div
          className="flex gap-4 animate-marquee will-change-transform"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...MOCK_LEADERBOARD, ...MOCK_LEADERBOARD].map((player, idx) => (
            <PlayerTickerCard key={`${player.rank}-${idx}`} player={player} />
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#1A1A1A] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default LeaderboardStrip;
