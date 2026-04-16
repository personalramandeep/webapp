import React from 'react';
import { motion } from 'framer-motion';
import SkillRadarChart from './SkillRadarChart';

const SkillBreakdownCard = ({ skills }) => {
  if (!skills) return null;

  const allSkills = [
    { label: 'Footwork', key: 'footwork' },
    { label: 'Net Play', key: 'netPlay' },
    { label: 'Defense', key: 'defense' },
    { label: 'Smash', key: 'smash' },
    { label: 'Endurance', key: 'endurance' },
  ];

  const arr = allSkills
    .filter((s) => skills[s.key] !== undefined && skills[s.key] !== null)
    .map((s) => ({ skill: s.label, score: skills[s.key] }));

  const sorted = [...arr].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const weak = sorted[sorted.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
      data-testid="skill-breakdown-card"
    >
      <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3">Skill Breakdown</h3>

      <div className="mb-2 sm:mb-4">
        <SkillRadarChart skills={skills} size={220} showTitle={false} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-1.5 sm:p-2 flex items-center gap-1.5">
          <svg className="w-3 h-3 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[10px] sm:text-xs text-white/90">
            <span className="text-green-300 font-semibold">Strongest:</span>{' '}
            <span className="font-bold">{top.skill}</span> {top.score}/100
          </span>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-1.5 sm:p-2 flex items-center gap-1.5">
          <svg className="w-3 h-3 flex-shrink-0 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-[10px] sm:text-xs text-white/90">
            <span className="text-orange-300 font-semibold">Focus:</span>{' '}
            <span className="font-bold">{weak.skill}</span> {weak.score}/100
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillBreakdownCard;
