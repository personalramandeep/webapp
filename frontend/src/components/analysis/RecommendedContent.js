import React from 'react';
import { motion } from 'framer-motion';

const RecommendedContent = () => {
  const drills = [
    { 
      id: 1, 
      title: 'Perfect Doubles Net Shot', 
      duration: '~10 min',
      difficulty: 'Hard',
      category: 'Net Play & Control',
      thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=100&h=80&fit=crop'
    },
    { 
      id: 2, 
      title: 'Smash Defense Training', 
      duration: '~12 min',
      difficulty: 'Medium',
      category: 'Defense & Recovery',
      thumbnail: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=100&h=80&fit=crop'
    },
    { 
      id: 3, 
      title: 'Footwork Fundamentals', 
      duration: '~8 min',
      difficulty: 'Easy',
      category: 'Movement',
      thumbnail: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=100&h=80&fit=crop'
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-[#1a1a1a] border border-white border-opacity-5 rounded-xl p-6 backdrop-blur-xl"
      style={{
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Recommended Drills</h3>
        <button className="text-kreeda-orange text-sm font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {drills.map((drill, index) => (
          <motion.div
            key={drill.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex gap-3 p-3 bg-[#2a2a2a] border border-white border-opacity-5 rounded-lg hover:border-opacity-10 transition-all cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
              <img 
                src={drill.thumbnail} 
                alt={drill.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-kreeda-orange transition-colors">
                {drill.title}
              </h4>
              <p className="text-xs text-gray-500 mb-2">{drill.category}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-400">{drill.duration}</span>
                <span className="text-gray-600">•</span>
                <span className={getDifficultyColor(drill.difficulty)}>{drill.difficulty}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 bg-kreeda-orange bg-opacity-10 border border-kreeda-orange border-opacity-20 rounded-lg hover:bg-opacity-20 transition-all text-sm text-kreeda-orange font-semibold">
        Start Practice Session
      </button>
    </motion.div>
  );
};

export default RecommendedContent;
