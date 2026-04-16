import React from 'react';

const ActionCards = () => {
  const cards = [
    {
      icon: '🤖',
      title: 'Train with AI Coach',
      description: 'Get instant personalized tips, drills, and insights powered by AI. Your 24/7 badminton training assistant.',
      cta: 'Chat with AI Coach',
      gradient: 'from-purple-900 to-indigo-900',
      ctaColor: 'text-purple-400 hover:text-purple-300',
    },
    {
      icon: '👥',
      title: 'Find a Human Coach',
      description: 'Connect with professional badminton coaches for personalized training sessions and expert guidance.',
      cta: 'Browse Coaches',
      gradient: 'from-teal-900 to-green-900',
      ctaColor: 'text-teal-400 hover:text-teal-300',
    },
    {
      icon: '🏛️',
      title: 'Clubs on Kreeda',
      description: 'Why do it alone? Get more out of your Kreeda experience by joining or creating a Club.',
      cta: 'Find or Create a Club on Kreeda',
      gradient: 'from-orange-900 to-red-900',
      ctaColor: 'text-orange-400 hover:text-orange-300',
      disabled: false,
    },
    {
      icon: '👋',
      title: 'Your Friends On Kreeda',
      description: 'Find and invite friends to see their adventures and share some encouragement.',
      cta: 'Find and Invite Your Friends',
      gradient: 'from-green-900 to-emerald-900',
      ctaColor: 'text-green-400 hover:text-green-300',
      disabled: false,
    },
    {
      icon: '🏆',
      title: 'Compete & Climb',
      description: 'Track your ranking and compete with players worldwide on our live leaderboard.',
      cta: 'View Leaderboard',
      gradient: 'from-red-900 to-pink-900',
      ctaColor: 'text-red-400 hover:text-red-300',
    },
  ];

  return (
    <div className="space-y-4" data-testid="action-cards">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.gradient} bg-opacity-50 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all ${
            card.disabled ? 'opacity-75' : 'hover:transform hover:scale-105'
          }`}
          data-testid={`action-card-${index}`}
        >
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">{card.icon}</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{card.description}</p>
              <button
                className={`${card.ctaColor} font-semibold text-sm flex items-center gap-2 transition-colors ${
                  card.disabled ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={card.disabled}
              >
                {card.cta}
                {!card.disabled && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionCards;