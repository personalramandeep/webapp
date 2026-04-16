import React from 'react';
import { motion } from 'framer-motion';

const ICON = {
  heart: 'M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z',
  heartSolid: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
  star: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.176 0l-3.366 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.287-3.957z',
  mapPin: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  rupee: 'M6 8h12M6 12h12m-6 4h6M8 20l5-12',
  checkBadge: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
};

const AVATAR_GRADIENTS = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
  'from-indigo-500 to-blue-500',
];

const getInitials = (name) => {
  if (!name) return 'C';
  const parts = name.split(' ');
  return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2);
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const CoachCard = ({ coach, index = 0, isFavorited, onToggleFavorite, onViewProfile }) => {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const initials = getInitials(coach.name);

  const handleFav = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(coach.id);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-white/30 rounded-2xl p-3 md:p-6 transition-all duration-300 cursor-pointer group"
      data-testid="coach-card"
    >
      <button
        onClick={handleFav}
        className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors z-10"
        aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isFavorited ? (
          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path d={ICON.heartSolid} />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.heart} />
          </svg>
        )}
      </button>

      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        {coach.picture ? (
          <img
            src={coach.picture}
            alt={coach.name}
            className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            <span className="text-sm md:text-2xl font-bold text-white drop-shadow-md">{initials}</span>
          </div>
        )}
        <div className="flex-1 pt-0.5 md:pt-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-kreeda-orange transition-colors truncate">
              {coach.name}
            </h3>
            {coach.isVerified && (
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {coach.handle && (
            <p className="text-xs text-kreeda-orange/70 truncate">@{coach.handle}</p>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {coach.rating > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d={ICON.star} />
                </svg>
                <span className="text-xs text-white/70 font-medium">{Number(coach.rating).toFixed(1)}</span>
                {coach.totalRatings > 0 && (
                  <span className="text-xs text-white/40">({coach.totalRatings})</span>
                )}
              </div>
            )}
            {coach.rating > 0 && <span className="text-white/20 text-xs">·</span>}
            <span className="text-xs text-white/50">{coach.totalSessions || 0} sessions analyzed</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 md:space-y-2.5 mb-3 md:mb-5">
        {coach.location && (
          <div className="flex items-center gap-2 md:gap-2.5 text-xs md:text-sm text-white/70">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.mapPin} />
            </svg>
            <span>{coach.location}, India</span>
          </div>
        )}
        {coach.experienceYears && (
          <div className="flex items-center gap-2 md:gap-2.5 text-xs md:text-sm text-white/70">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.clock} />
            </svg>
            <span>{coach.experienceYears}+ years experience</span>
          </div>
        )}
        <div className="flex items-center gap-2 md:gap-2.5 text-xs md:text-sm text-white/70">
          <svg className="w-3 h-3 md:w-4 md:h-4 text-white/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.rupee} />
          </svg>
          {coach.hourlyRate >= 149 ? (
            <>
              <span className="font-medium text-white">₹149/video</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300">
                Pro Coach
              </span>
            </>
          ) : (
            <span className="font-medium text-white">₹99/video</span>
          )}
        </div>
      </div>

      {coach.certifications?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 md:mb-5">
          {coach.certifications.slice(0, 2).map((cert, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/60"
            >
              <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.checkBadge} />
              </svg>
              {cert}
            </span>
          ))}
          {coach.certifications.length > 2 && (
            <span className="text-xs text-white/40 px-1">+{coach.certifications.length - 2} more</span>
          )}
        </div>
      )}

      <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onViewProfile?.(coach.id)}
          className="w-full px-4 py-1.5 md:py-2.5 bg-kreeda-orange hover:bg-kreeda-orange/90 text-white rounded-xl font-medium shadow-lg shadow-kreeda-orange/20 text-xs md:text-sm transition-colors"
          data-testid="view-coach-profile-button"
        >
          View Profile
        </button>
      </div>
    </motion.div>
  );
};

export default CoachCard;
