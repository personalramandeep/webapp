import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CourtLines = () => (
  <g className="court-lines">
    <defs>
      <linearGradient id="courtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e5245" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#0d2d24" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="570" height="840" fill="url(#courtGradient)" stroke="white" strokeWidth="5" opacity="0.8" />
    <line x1="20" x2="590" y1="440" y2="440" stroke="#fbbf24" strokeWidth="4" strokeDasharray="12,6" opacity="0.9" />
    <line x1="20" x2="590" y1="312" y2="312" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
    <line x1="20" x2="590" y1="568" y2="568" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
    <line x1="20" x2="590" y1="70" y2="70" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
    <line x1="20" x2="590" y1="810" y2="810" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
    <line x1="90" y1="20" x2="90" y2="860" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
    <line x1="520" y1="20" x2="520" y2="860" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.5" />
    <line x1="305" x2="305" y1="20" y2="860" stroke="white" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
  </g>
);

const ShotPositionsLayer = ({ shots, hoveredShot, onShotHover }) => (
  <g className="shot-positions">
    {shots.map((shot, index) => {
      const isHovered = hoveredShot?.id === shot.id;
      return (
        <motion.g
          key={shot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <circle
            cx={shot.x}
            cy={shot.y}
            r={isHovered ? 28 : 20}
            fill="white"
            className="cursor-pointer"
            onMouseEnter={(e) => onShotHover(shot, e)}
            onMouseLeave={() => onShotHover(null, null)}
            onMouseMove={(e) => isHovered && onShotHover(shot, e)}
          />
          <circle
            cx={shot.x}
            cy={shot.y}
            r={isHovered ? 22 : 16}
            fill={shot.color}
            opacity={shot.outcome === 'success' ? 0.9 : 0.6}
            className="cursor-pointer transition-all pointer-events-none"
          />
          {shot.outcome === 'success' && (
            <circle cx={shot.x} cy={shot.y} r={7} fill="white" className="pointer-events-none" />
          )}
        </motion.g>
      );
    })}
  </g>
);

const ShotTooltip = ({ shot, position, containerRef }) => {
  const formatShotType = (type) =>
    type.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();

  const tw = 140;
  const cw = containerRef?.current?.offsetWidth || 300;
  const x = Math.min(Math.max(8, position.x - tw / 2), cw - tw - 8);
  const y = Math.max(8, position.y - 60);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute bg-black/95 backdrop-blur-md text-white p-2 rounded-lg shadow-xl border border-white/10 pointer-events-none z-50"
      style={{ width: `${tw}px`, left: `${x}px`, top: `${y}px` }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: shot.color }} />
        <span className="font-semibold text-xs truncate">{formatShotType(shot.type)}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-white/80">
        <span>Accuracy</span>
        <span className="font-semibold text-right">{shot.accuracy}%</span>
        <span>Power</span>
        <span className="font-semibold text-right">{shot.power}%</span>
        <span>Result</span>
        <span className={`text-right font-semibold ${shot.outcome === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {shot.outcome === 'success' ? 'Hit' : 'Miss'}
        </span>
      </div>
    </motion.div>
  );
};

const HeatmapLegend = () => {
  const items = [
    { type: 'Smash', color: '#ef4444' },
    { type: 'Clear', color: '#3b82f6' },
    { type: 'Drop', color: '#f59e0b' },
    { type: 'Net Kill', color: '#10b981' },
    { type: 'Drive', color: '#8b5cf6' },
  ];
  return (
    <div className="mt-2 pt-2 border-t border-white/10">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-white/70 text-xs">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BadmintonCourtHeatmap = ({ heatmapData, heatmapUrl, onShotHover }) => {
  const [hoveredShot, setHoveredShot] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  if (!heatmapData && !heatmapUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
      data-testid="court-heatmap-card"
    >
      <div className="mb-2">
        <h3 className="text-sm sm:text-base font-bold text-white">Court Coverage</h3>
        <p className="text-white/60 text-xs">Shot position analysis</p>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-gradient-to-b from-kreeda-green/30 to-kreeda-green/10 rounded-lg sm:rounded-xl overflow-hidden"
        style={{ aspectRatio: '9/13', maxHeight: '380px' }}
      >
        {heatmapUrl ? (
          <img src={heatmapUrl} alt="Court Heatmap" className="w-full h-full object-contain" style={{ mixBlendMode: 'screen' }} />
        ) : (
          <svg viewBox="0 0 610 880" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <CourtLines />
            <ShotPositionsLayer
              shots={heatmapData?.shotPositions || []}
              hoveredShot={hoveredShot}
              onShotHover={(shot, event) => {
                setHoveredShot(shot);
                if (shot && event) {
                  const svg = event.target.ownerSVGElement;
                  const rect = svg.getBoundingClientRect();
                  setTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                }
                if (onShotHover) onShotHover(shot);
              }}
            />
          </svg>
        )}
      </div>

      {!heatmapUrl && hoveredShot && <ShotTooltip shot={hoveredShot} position={tooltipPosition} containerRef={containerRef} />}
      {!heatmapUrl && <HeatmapLegend />}
    </motion.div>
  );
};

export default BadmintonCourtHeatmap;
