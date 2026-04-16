import React, { useEffect, useRef } from 'react';

const LeaderboardStrip = ({ currentUserId }) => {
  const scrollRef = useRef(null);

  // Mock leaderboard data - duplicated for seamless loop
  const leaderboardData = [
    { id: '1', rank: 1, name: 'Kavya Iyer', location: 'Ahmedabad', elo: 2250, avatar: '🥇' },
    { id: '2', rank: 2, name: 'Sumit Singh', location: 'Mumbai', elo: 2178, avatar: '🥈' },
    { id: '3', rank: 3, name: 'Ramandeep S.', location: 'Delhi', elo: 2072, avatar: '🥉' },
    { id: '4', rank: 4, name: 'Aditya Mehta', location: 'Jaipur', elo: 2001, avatar: '⭐' },
    { id: '5', rank: 5, name: 'Ishita Joshi', location: 'Lucknow', elo: 2181, avatar: '🌟' },
    { id: '6', rank: 6, name: 'Arjun Sharma', location: 'Mumbai', elo: 2440, avatar: '🔥' },
    { id: '7', rank: 7, name: 'Priya Patel', location: 'Delhi', elo: 2198, avatar: '✨' },
  ];

  // Duplicate data for seamless infinite scroll
  const duplicatedData = [...leaderboardData, ...leaderboardData, ...leaderboardData];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Adjust speed here (0.5 = medium, 1 = fast, 0.3 = slow)

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      // Reset scroll position when we've scrolled through one set of items
      const cardWidth = 280; // Width of each card + gap
      const resetPoint = leaderboardData.length * cardWidth;
      
      if (scrollPosition >= resetPoint) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [leaderboardData.length]);

  return (
    <div className="relative mb-6" data-testid="leaderboard-strip">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <h3 className="text-white font-semibold text-lg">Live Leaderboard</h3>
          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full animate-pulse font-semibold">LIVE</span>
        </div>
        <button className="text-kreeda-orange hover:text-orange-400 text-sm font-semibold transition-colors">
          View Top 20 →
        </button>
      </div>

      {/* Scrollable Container - Auto-scrolling ticker style */}
      <div className="relative overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden pb-2 scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedData.map((player, index) => {
            const isCurrentUser = player.id === currentUserId && index < leaderboardData.length;
            return (
              <div
                key={`${player.id}-${index}`}
                className={`flex-shrink-0 w-64 p-4 rounded-xl border transition-all ${
                  isCurrentUser
                    ? 'bg-kreeda-orange bg-opacity-20 border-kreeda-orange'
                    : 'bg-[#1A1A1A] border-gray-800'
                }`}
                data-testid={`leaderboard-card-${player.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{player.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 text-sm font-semibold">#{player.rank}</span>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 bg-kreeda-orange text-white text-xs rounded-full font-semibold">You</span>
                      )}
                    </div>
                    <p className="text-white font-semibold truncate">{player.name}</p>
                    <p className="text-gray-400 text-sm">📍 {player.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-kreeda-orange font-bold text-xl">{player.elo}</p>
                    <p className="text-gray-400 text-xs">ELO</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardStrip;
