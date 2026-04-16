import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'announcementBannerDismissed';

const AnnouncementBanner = () => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="relative w-full bg-gradient-to-r from-[#1B3B36] to-[#0f2420] border-l-4 border-kreeda-orange px-4 py-3 pr-10 sm:px-6 sm:pr-6 mb-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <svg className="w-5 h-5 text-kreeda-orange flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm sm:inline">
                    Welcome to your Kreeda dashboard!
                  </p>
                  <span className="hidden sm:inline text-white/70 text-sm ml-1.5">
                    We're launching with all features on{' '}
                    <span className="text-kreeda-orange font-medium">April 19, 2026</span>.
                    Until then, everything you see here is sample data — feel free to explore!
                  </span>
                  <p className="sm:hidden text-white/70 text-xs mt-0.5">
                    We're launching with all features on{' '}
                    <span className="text-kreeda-orange font-medium">April 19, 2026</span>.
                    Until then, everything you see here is sample data — feel free to explore!
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 sm:static text-white/40 hover:text-white/80 transition-colors p-2 sm:p-1 rounded flex-shrink-0"
                aria-label="Dismiss announcement"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
