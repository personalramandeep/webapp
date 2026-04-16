import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DrillVideoModal = ({ drill, isOpen, onClose }) => {
  if (!isOpen || !drill) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="drill-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="drill-video-modal-overlay"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-kreeda-charcoal border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          data-testid="drill-video-modal"
        >
          {/* Video embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`${drill.video_url}&autoplay=1`}
              title={drill.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              data-testid="drill-video-iframe"
            />
          </div>

          {/* Info section */}
          <div className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-1.5" data-testid="drill-modal-title">
                  {drill.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed mb-3">
                  {drill.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                data-testid="drill-modal-close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {drill.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/50"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-kreeda-orange/10 border border-kreeda-orange/20 text-kreeda-orange font-medium">
                {drill.section}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DrillVideoModal;
