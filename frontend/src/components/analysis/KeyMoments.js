import React from 'react';
import { motion } from 'framer-motion';

const KeyMoments = ({ moments }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'strength':
        return 'border-green-500 bg-green-500';
      case 'weakness':
        return 'border-red-500 bg-red-500';
      case 'highlight':
        return 'border-yellow-500 bg-yellow-500';
      default:
        return 'border-kreeda-orange bg-kreeda-orange';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'strength':
        return 'Strength';
      case 'weakness':
        return 'Weakness';
      case 'highlight':
        return 'Highlight';
      default:
        return 'Moment';
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
        <h3 className="text-xl font-bold">Key Moments</h3>
        <span className="text-sm text-gray-400">{moments.length} moments</span>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
          {moments.map((moment, index) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex-shrink-0 w-72 bg-[#2a2a2a] border border-white border-opacity-5 rounded-lg overflow-hidden hover:border-opacity-20 transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gray-900 overflow-hidden">
                <img 
                  src={moment.thumbnail} 
                  alt={moment.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Time Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-black bg-opacity-80 rounded text-xs font-mono">
                  {moment.time}
                </div>
                {/* Category Badge */}
                <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${getCategoryColor(moment.category)}`}></div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{moment.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(moment.category)} bg-opacity-10`}>
                    {getCategoryLabel(moment.category)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{moment.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center gap-2 mt-2">
        {moments.map((_, index) => (
          <div 
            key={index} 
            className="w-2 h-2 rounded-full bg-gray-700"
          ></div>
        ))}
      </div>
    </motion.div>
  );
};

export default KeyMoments;
