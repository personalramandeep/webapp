import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const StatComparison = ({ label, diff }) => {
  const isPositive = diff > 0;
  const color = isPositive ? 'text-emerald-400' : 'text-red-400';
  const bg = isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';
  return (
    <div className={`flex items-center justify-between px-2 py-1 rounded-md ${bg}`}>
      <span className="text-[10px] text-white/60">{label}</span>
      <span className={`text-[10px] font-bold ${color}`}>
        {isPositive ? '+' : ''}{diff}
      </span>
    </div>
  );
};

const PlayerMatchCard = ({ player, index }) => {
  const isLocked = player.locked;

  const handleChallenge = () => {
    toast.success(`Challenge sent to ${player.name}!`, {
      style: { background: '#2D2926', color: '#fff', border: '1px solid rgba(244,88,49,0.3)' },
      iconTheme: { primary: '#F45831', secondary: '#fff' },
    });
  };

  const scoreColor =
    player.aiMatchScore >= 90 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
    player.aiMatchScore >= 80 ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
    'text-white/70 border-white/10 bg-white/5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`relative flex-shrink-0 w-[260px] rounded-xl border overflow-hidden ${
        isLocked
          ? 'border-white/5 bg-white/[0.02]'
          : 'border-white/10 bg-gradient-to-br from-white/10 to-white/5'
      }`}
      data-testid={`player-match-card-${player.id}`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-10 backdrop-blur-md bg-kreeda-charcoal/60 flex flex-col items-center justify-center gap-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-kreeda-orange/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-white/90">Go Premium</span>
          <span className="text-[10px] text-white/50">Unlock all player matches</span>
        </div>
      )}

      <div className="p-4">
        {/* AI Match Score */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${scoreColor}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-[10px] font-bold">{player.aiMatchScore}% AI Match</span>
          </div>
          <span className="text-[10px] text-white/40 font-mono">{player.eloRating} ELO</span>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={player.picture}
            alt={player.name}
            className="w-11 h-11 rounded-full border-2 border-white/15 bg-white/10"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{player.name}</p>
            <p className="text-[10px] text-white/50">{player.city} &middot; {player.level}</p>
          </div>
        </div>

        {/* Play style */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-kreeda-orange/10 border border-kreeda-orange/20 text-kreeda-orange font-medium">
            {player.playStyle}
          </span>
        </div>

        {/* Stat comparison grid */}
        <div className="grid grid-cols-2 gap-1 mb-2.5">
          <StatComparison label="Smash" diff={player.comparisonStats.smash} />
          <StatComparison label="Footwork" diff={player.comparisonStats.footwork} />
          <StatComparison label="Net Play" diff={player.comparisonStats.netPlay} />
          <StatComparison label="Defense" diff={player.comparisonStats.defense} />
        </div>

        {/* Recent form */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[10px] text-white/40">Form:</span>
          {player.recentForm.split(' ').map((r, i) => (
            <span
              key={i}
              className={`w-4 h-4 flex items-center justify-center rounded text-[8px] font-bold ${
                r === 'W' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {r}
            </span>
          ))}
        </div>

        {/* Challenge button */}
        <button
          onClick={handleChallenge}
          className="w-full py-2 bg-white/5 border border-white/10 text-white text-xs font-semibold rounded-lg hover:bg-kreeda-orange hover:border-kreeda-orange/50 transition-all active:scale-[0.98]"
          data-testid={`challenge-player-${player.id}`}
        >
          Challenge to Match
        </button>
      </div>
    </motion.div>
  );
};

export default PlayerMatchCard;
