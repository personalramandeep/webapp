import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < full ? 'text-amber-400' : i === full && hasHalf ? 'text-amber-400/50' : 'text-white/15'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-[10px] text-white/50 ml-1">{rating}</span>
    </div>
  );
};

const CoachMatchCard = ({ coach, index }) => {
  const isLocked = coach.locked;

  const handleBook = () => {
    toast.success(`Booking request sent to ${coach.name}!`, {
      style: { background: '#2D2926', color: '#fff', border: '1px solid rgba(244,88,49,0.3)' },
      iconTheme: { primary: '#F45831', secondary: '#fff' },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`relative flex-shrink-0 w-[260px] rounded-xl border overflow-hidden ${
        isLocked
          ? 'border-white/5 bg-white/[0.02]'
          : 'border-white/10 bg-gradient-to-br from-white/10 to-white/5'
      }`}
      data-testid={`coach-match-card-${coach.id}`}
    >
      {isLocked && (
        <div className="absolute inset-0 z-10 backdrop-blur-md bg-kreeda-charcoal/60 flex flex-col items-center justify-center gap-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-kreeda-orange/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-white/90">Go Premium</span>
          <span className="text-[10px] text-white/50">Unlock all coach matches</span>
        </div>
      )}

      <div className="p-4">
        {/* Match % badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-kreeda-orange/15 border border-kreeda-orange/30 rounded-full">
            <svg className="w-3 h-3 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] font-bold text-kreeda-orange">{coach.matchPercent}% Match</span>
          </div>
          {coach.isVerified && (
            <div className="flex items-center gap-0.5 text-[10px] text-emerald-400">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </div>
          )}
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={coach.picture}
            alt={coach.name}
            className="w-11 h-11 rounded-full border-2 border-kreeda-orange/30 bg-white/10"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{coach.name}</p>
            <p className="text-[10px] text-white/50">{coach.specialization}</p>
          </div>
        </div>

        <StarRating rating={coach.rating} />
        <p className="text-[10px] text-white/40 mt-0.5">{coach.totalReviews} reviews &middot; {coach.experienceYears}yr exp</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {coach.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60">
              {tag}
            </span>
          ))}
        </div>

        {/* Price + Book */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div>
            <span className="text-base font-bold text-white">&#8377;{coach.hourlyRate}</span>
            <span className="text-[10px] text-white/40">/session</span>
          </div>
          <button
            onClick={handleBook}
            className="px-3 py-1.5 bg-kreeda-orange text-white text-xs font-semibold rounded-lg hover:bg-kreeda-orange/90 transition-all active:scale-95"
            data-testid={`book-coach-${coach.id}`}
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CoachMatchCard;
