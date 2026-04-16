import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CommunityCard = ({ iconPath, iconColor, title, description, ctaText, onClick, variant = 'default', hoverBorder }) => {
  const cardBg = variant === 'highlighted'
    ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30'
    : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/10';

  return (
    <div className={`${cardBg} border p-4 md:p-6 rounded-2xl md:rounded-3xl transition-all hover:shadow-xl ${hoverBorder}`}>
      <div className="flex items-start gap-3 mb-3">
        <svg className={`w-6 h-6 ${iconColor} flex-shrink-0 mt-1`} fill="currentColor" viewBox="0 0 20 20">
          {iconPath}
        </svg>
        <div>
          <h3 className="text-base md:text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-white/60 text-xs md:text-sm mb-3 leading-relaxed">{description}</p>
          <button
            onClick={onClick}
            className="text-kreeda-orange hover:opacity-80 text-sm font-semibold flex items-center gap-1 group"
          >
            {ctaText}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ActionCards = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 md:space-y-6"
    >
      <CommunityCard
        variant="highlighted"
        hoverBorder="hover:border-purple-400/40"
        iconColor="text-purple-400"
        iconPath={<path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />}
        title="Train with AI Coach"
        description="Get instant personalized tips, drills, and insights powered by AI. Your 24/7 badminton training assistant."
        ctaText="Chat with AI Coach"
        onClick={() => window.dispatchEvent(new Event('kreeda:open-ai-chat'))}
      />

      <CommunityCard
        hoverBorder="hover:border-blue-400/30"
        iconColor="text-blue-400"
        iconPath={<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />}
        title="Find a Human Coach"
        description="Connect with professional badminton coaches for personalized training sessions and expert guidance."
        ctaText="Browse Coaches"
        onClick={() => {}}
      />

      <CommunityCard
        hoverBorder="hover:border-yellow-400/30"
        iconColor="text-yellow-400"
        iconPath={<path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />}
        title="Clubs on Kreeda"
        description="Why do it alone? Get more out of your Kreeda experience by joining or creating a Club."
        ctaText="Find or Create a Club on Kreeda"
        onClick={() => {}}
      />

      <CommunityCard
        hoverBorder="hover:border-green-400/30"
        iconColor="text-green-400"
        iconPath={<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />}
        title="Your Friends On Kreeda"
        description="Find and invite friends to see their adventures and share some encouragement."
        ctaText="Find and Invite Your Friends"
        onClick={() => {}}
      />

      <CommunityCard
        hoverBorder="hover:border-kreeda-orange/30"
        iconColor="text-kreeda-orange"
        iconPath={<path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H5zM5 7a1 1 0 011-1h8a1 1 0 011 1v5.586a1 1 0 01-.293.707l-1.121 1.121A3 3 0 0011 16H9a3 3 0 00-2.586-1.586l-1.121-1.121A1 1 0 015 12.586V7zm2.707 5.293a1 1 0 011.414 0L10 13.172l.879-.879a1 1 0 111.414 1.414l-1.586 1.586a1 1 0 01-1.414 0l-1.586-1.586a1 1 0 010-1.414zM3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />}
        title="Compete & Climb"
        description="Track your ranking and compete with players worldwide on our live leaderboard."
        ctaText="View Leaderboard"
        onClick={() => {}}
      />
    </motion.div>
  );
};

export default ActionCards;
