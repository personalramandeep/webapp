import React from 'react';

const ICON = {
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  rupee: 'M6 8h12M6 12h12m-6 4h6M8 20l5-12',
  mapPin: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  academic: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  bolt: 'M13 10V3L4 14h7v7l9-11h-7z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  heart: 'M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z',
  adjust: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
  close: 'M6 18L18 6M6 6l12 12',
};

const QUICK_FILTERS = [
  { id: 'top_rated', iconPath: ICON.star, label: 'Top Rated' },
  { id: 'budget_friendly', iconPath: ICON.rupee, label: 'Budget Friendly' },
  { id: 'near_me', iconPath: ICON.mapPin, label: 'Near Me' },
  { id: 'beginner_friendly', iconPath: ICON.academic, label: 'Beginner Friendly' },
  { id: 'advanced', iconPath: ICON.bolt, label: 'Advanced Coaching' },
  { id: 'available_today', iconPath: ICON.calendar, label: 'Available Today' },
  { id: 'favourites', iconPath: ICON.heart, label: 'Favourites' },
];

const CoachSearchFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  activeQuickFilters,
  toggleQuickFilter,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-3 md:p-5 mb-4 md:mb-6 space-y-3">
      {/* Row 1: Search + Sort */}
      <div className="flex gap-2 md:gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/40 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.search} />
          </svg>
          <input
            type="text"
            placeholder="Search by coach, academy, location, or skill (e.g. footwork, smash)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 md:pl-11 pr-3 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-kreeda-orange/50 focus:outline-none text-sm transition-colors"
          />
        </div>

        <div className="relative flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none h-full pl-3 pr-7 py-2 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs md:text-sm focus:border-kreeda-orange/50 focus:outline-none cursor-pointer transition-colors hover:bg-white/10"
            style={{ minWidth: '130px' }}
          >
            <option value="recommended" className="bg-[#2D2926]">Recommended</option>
            <option value="price_low" className="bg-[#2D2926]">Price: Low to High</option>
            <option value="rating" className="bg-[#2D2926]">Rating</option>
            <option value="experience" className="bg-[#2D2926]">Experience</option>
            <option value="distance" className="bg-[#2D2926]">Distance</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
            <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 2: Quick Filters + Filters button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 md:gap-2 pb-0.5">
            {QUICK_FILTERS.map(({ id, iconPath, label }) => {
              const isActive = activeQuickFilters.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggleQuickFilter(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-kreeda-orange/20 border-kreeda-orange/50 text-kreeda-orange'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                  </svg>
                  {label}
                  {isActive && (
                    <svg className="w-3 h-3 ml-0.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.close} />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="relative flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/15 rounded-full text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.adjust} />
          </svg>
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>
    </div>
  );
};

export default CoachSearchFilters;
