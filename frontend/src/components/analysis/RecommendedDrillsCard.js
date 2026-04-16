import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { YOUTUBE_DRILLS } from '../../mocks/youtubeDrills';
import DrillVideoModal from './DrillVideoModal';

// Map skill keys to relevant drill tags
const SKILL_TAG_MAP = {
  footwork: ['footwork', 'movement', 'agility', 'court-coverage', 'speed'],
  netPlay: ['net-shot', 'net', 'control', 'drop-shot', 'soft-game'],
  defense: ['defense', 'reaction', 'smash-defense'],
  smash: ['smash', 'power', 'attack'],
  endurance: ['endurance', 'stamina', 'conditioning', 'fitness', 'intensity'],
};

const SKILL_LABELS = {
  footwork: 'Footwork',
  netPlay: 'Net Play',
  defense: 'Defense',
  smash: 'Smash',
  endurance: 'Endurance',
};

// Extract video ID from YouTube embed URL for thumbnail
const getYtThumbnail = (embedUrl) => {
  const match = embedUrl.match(/\/embed\/([^?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : '';
};

const difficultyFromTags = (tags) => {
  if (tags.some((t) => ['advanced', 'intensity', 'professional'].includes(t))) return 'Hard';
  if (tags.some((t) => ['basics', 'beginner', 'fundamentals'].includes(t))) return 'Easy';
  return 'Medium';
};

const difficultyColor = (d) => {
  switch (d) {
    case 'Easy': return 'text-green-400';
    case 'Hard': return 'text-red-400';
    default: return 'text-yellow-400';
  }
};

const DrillRow = ({ drill, index, onClick }) => {
  const thumbnail = getYtThumbnail(drill.video_url);
  const difficulty = difficultyFromTags(drill.tags);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="bg-white/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
      data-testid={`yt-drill-row-${drill.id}`}
    >
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <div className="relative w-16 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-black/40">
          <img
            src={thumbnail}
            alt={drill.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* YT badge */}
          <div className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[7px] font-bold px-1 py-px rounded flex items-center gap-0.5">
            <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            YT
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-xs leading-snug line-clamp-1 mb-0.5">
            {drill.title}
          </h4>
          <p className="text-white/50 text-[10px] mb-1 line-clamp-2 leading-relaxed">
            {drill.description}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <div className="flex items-center gap-0.5 text-white/40">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ~10 min
            </div>
            <span className={`font-medium ${difficultyColor(difficulty)}`}>{difficulty}</span>
            <span className="text-white/20">&middot;</span>
            <span className="text-white/40 truncate">{drill.section}</span>
          </div>
        </div>

        {/* Arrow */}
        <svg
          className="flex-shrink-0 w-4 h-4 text-white/30 group-hover:text-white/60 mt-1 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
};

const RecommendedDrillsCard = ({ skills = {} }) => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [selectedDrill, setSelectedDrill] = useState(null);

  // Find 2 weakest skills
  const recommendedDrills = useMemo(() => {
    const entries = Object.entries(skills).filter(([, v]) => typeof v === 'number');
    if (entries.length === 0) return YOUTUBE_DRILLS.slice(0, 5);

    const sorted = [...entries].sort((a, b) => a[1] - b[1]);
    const weakest2 = sorted.slice(0, 2).map(([key]) => key);

    // Collect relevant tags for the 2 weakest skills
    const relevantTags = weakest2.flatMap((skill) => SKILL_TAG_MAP[skill] || []);

    // Score each drill by how many of its tags match
    const scored = YOUTUBE_DRILLS.map((drill) => {
      const matchCount = drill.tags.filter((t) => relevantTags.includes(t)).length;
      return { ...drill, matchCount };
    });

    // Sort by match count desc, take top 5
    scored.sort((a, b) => b.matchCount - a.matchCount);
    return scored.filter((d) => d.matchCount > 0).slice(0, 5);
  }, [skills]);

  // Weakest skills for display
  const weakestSkillNames = useMemo(() => {
    const entries = Object.entries(skills).filter(([, v]) => typeof v === 'number');
    if (entries.length === 0) return [];
    const sorted = [...entries].sort((a, b) => a[1] - b[1]);
    return sorted.slice(0, 2).map(([key]) => SKILL_LABELS[key] || key);
  }, [skills]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
        data-testid="recommended-drills-card"
      >
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-3" data-testid="drills-tabs">
          <button
            onClick={() => setActiveTab('recommended')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'recommended'
                ? 'bg-kreeda-orange text-white'
                : 'text-white/50 hover:text-white/80 bg-white/5'
            }`}
            data-testid="drills-tab-recommended"
          >
            Recommended
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'insights'
                ? 'bg-kreeda-orange text-white'
                : 'text-white/50 hover:text-white/80 bg-white/5'
            }`}
            data-testid="drills-tab-insights"
          >
            AI Insights
          </button>
        </div>

        {activeTab === 'recommended' ? (
          <>
            {/* Weakness context */}
            {weakestSkillNames.length > 0 && (
              <p className="text-[10px] text-white/35 mb-2.5">
                Based on your weakest areas: <span className="text-kreeda-orange font-medium">{weakestSkillNames.join(' & ')}</span>
              </p>
            )}

            {/* Drill list */}
            <div className="space-y-2">
              {recommendedDrills.map((drill, i) => (
                <DrillRow
                  key={drill.id}
                  drill={drill}
                  index={i}
                  onClick={() => setSelectedDrill(drill)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-kreeda-orange/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <p className="text-xs text-white/60 mb-1">AI-powered insights coming soon</p>
            <p className="text-[10px] text-white/30">Personalized coaching tips based on your gameplay patterns</p>
          </div>
        )}
      </motion.div>

      <DrillVideoModal
        drill={selectedDrill}
        isOpen={!!selectedDrill}
        onClose={() => setSelectedDrill(null)}
      />
    </>
  );
};

export default RecommendedDrillsCard;
