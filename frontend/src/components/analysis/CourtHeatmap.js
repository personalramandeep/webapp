import React from 'react';
import { motion } from 'framer-motion';

const CourtHeatmap = ({ heatmapData }) => {
  const getHeatmapColor = (intensity) => {
    if (intensity > 0.8) return '#EF4444'; // Red - High activity
    if (intensity > 0.6) return '#F59E0B'; // Orange
    if (intensity > 0.4) return '#FBBF24'; // Yellow
    return '#10B981'; // Green - Low activity
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#1a1a1a] border border-white border-opacity-5 rounded-xl p-6 backdrop-blur-xl"
      style={{
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <h3 className="text-xl font-bold mb-6">Court Coverage</h3>
      
      <div className="relative aspect-[1/1.5] bg-[#2a2a2a] rounded-lg border-2 border-white border-opacity-10">
        {/* Badminton Court Layout */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 150" preserveAspectRatio="none">
          {/* Court Lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="0" y1="150" x2="100" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="0" y1="0" x2="0" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="100" y1="0" x2="100" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          
          {/* Center Line */}
          <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Service Lines */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          
          {/* Side Lines */}
          <line x1="20" y1="0" x2="20" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="80" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        </svg>

        {/* Heatmap Points */}
        {heatmapData.map((point, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            className="absolute rounded-full"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: '40px',
              height: '40px',
              background: `radial-gradient(circle, ${getHeatmapColor(point.intensity)} 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-400">Very High</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CourtHeatmap;
