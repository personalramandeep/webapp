import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import CoachStatsCard from '../components/coach/CoachStatsCard';
import CoachingReviewsCard from '../components/coach/CoachingReviewsCard';
import { getCoachById, getCoachReviewsFor } from '../mocks/reviewStore';

const ICON = {
  heart: 'M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z',
  heartSolid: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z',
  star: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.363 1.118l1.286 3.957c.3.922-.755 1.688-1.54 1.118l-3.366-2.447a1 1 0 00-1.176 0l-3.366 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.287-3.957z',
  mapPin: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  rupee: 'M6 8h12M6 12h12m-6 4h6M8 20l5-12',
  academic: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
  checkBadge: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  checkCircle: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  plus: 'M12 4v16m8-8H4',
  arrowLeft: 'M15 19l-7-7 7-7',
};

const getInitials = (name) => {
  if (!name) return 'C';
  const parts = name.split(' ');
  return parts.map((p) => p[0]).join('').toUpperCase().slice(0, 2);
};

const CoachProfile = ({ onLogout }) => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const coach = getCoachById(coachId);
  const reviews = getCoachReviewsFor(coachId);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!coach) {
    return (
      <div className="min-h-screen bg-[#0F0F0F]">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed}
          onLogout={onLogout}
        />
        <Header onLogout={onLogout} />
        
        <div
          className="transition-all duration-300 pt-16"
          style={{ marginLeft: isSidebarCollapsed ? 72 : 280 }}
        >
          <div className="min-h-screen bg-kreeda-gray text-white flex items-center justify-center p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Coach not found</h2>
              <p className="text-white/60 text-sm mb-4">We couldn't find a coach with that id.</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-4 py-2 bg-kreeda-orange hover:bg-kreeda-orange/90 text-white rounded-xl text-sm font-medium"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPro = coach.tier === 'pro' || (coach.hourlyRate || 0) >= 149;

  const stats = {
    totalVideos: coach.totalVideos ?? 0,
    sessionsAnalyzed: coach.sessionsAnalyzed ?? coach.totalSessions ?? 0,
    avgScore: coach.avgScore ?? 0,
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={onLogout}
      />
      <Header onLogout={onLogout} />

      <div
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: isSidebarCollapsed ? 72 : 280 }}
      >
        <div className="min-h-screen bg-kreeda-gray text-white">
          <div className="container mx-auto px-3 py-4 md:px-6 md:py-8 max-w-7xl">
        {/* Back link */}
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.arrowLeft} />
          </svg>
          Back to Marketplace
        </button>

        <div className="space-y-4 md:space-y-5">
          {/* ── TOP HEADER ROW ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
              {/* Left: Avatar + Name + verified + rating, then handle + location */}
              <div className="flex items-center gap-4">
                {coach.picture ? (
                  <img
                    src={coach.picture}
                    alt={coach.name}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-kreeda-orange flex items-center justify-center flex-shrink-0 text-white text-lg md:text-xl font-bold">
                    {getInitials(coach.name)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{coach.name}</h2>
                    {coach.isVerified && (
                      <div className="relative group flex-shrink-0">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center cursor-default">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm leading-none">★</span>
                      <span className="text-white/80 text-sm font-semibold">
                        {coach.rating > 0 ? Number(coach.rating).toFixed(1) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {coach.handle && (
                      <span className="text-kreeda-orange text-sm font-medium">@{coach.handle}</span>
                    )}
                    {coach.location && (
                      <div className="flex items-center gap-1 text-white/40 text-sm">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.mapPin} />
                        </svg>
                        <span>{coach.location}, India</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: favorite heart + Add Coach CTA + microcopy */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setIsFavorited((p) => !p)}
                    title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    className="p-2.5 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-200"
                  >
                    {isFavorited ? (
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d={ICON.heartSolid} />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white/50 hover:text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.heart} />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => setIsSubscribed((p) => !p)}
                    className={`inline-flex items-center gap-2 rounded-xl font-semibold h-11 px-5 transition-all duration-300 ${
                      isSubscribed
                        ? 'bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300'
                        : 'bg-kreeda-orange hover:bg-kreeda-orange/90 text-white shadow-lg shadow-kreeda-orange/20'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.checkCircle} />
                        </svg>
                        Added to your coaches
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.plus} />
                        </svg>
                        Add Coach for Free
                      </>
                    )}
                  </button>
                </div>
                <AnimatePresence mode="wait">
                  {isSubscribed ? (
                    <motion.p
                      key="subscribed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-green-400/70 text-xs mt-1.5"
                    >
                      Coach added to your video analysis reviews
                    </motion.p>
                  ) : (
                    <motion.p
                      key="unsubscribed"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-white/35 text-xs mt-1.5"
                    >
                      Get feedback from this coach in your analysis
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── ROW: Coach Stats (1/3) + About (2/3) ──────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
            {/* LEFT 1/3: Coach Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="lg:col-span-1"
            >
              <CoachStatsCard stats={stats} />
            </motion.div>

            {/* RIGHT 2/3: About */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2 min-w-0"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-4 md:p-6 rounded-3xl hover:border-kreeda-orange/20 transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-kreeda-orange/30 to-kreeda-orange/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.academic} />
                    </svg>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white">About</h3>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <p className="text-white/70 text-sm leading-relaxed">
                    {coach.bio || 'No bio provided.'}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-3">
                    <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.clock} />
                    </svg>
                    <div>
                      <p className="text-white/40 text-[11px]">Experience</p>
                      <p className="text-white text-sm font-semibold">
                        {coach.experienceYears ? `${coach.experienceYears}+ years` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white/5 rounded-xl p-3">
                    <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.rupee} />
                    </svg>
                    <div>
                      <p className="text-white/40 text-[11px]">Per review</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white text-sm font-semibold">
                          {isPro ? '₹149/video' : '₹99/video'}
                        </p>
                        {isPro && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300">
                            Pro Coach
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                {coach.certifications?.length > 0 && (
                  <div>
                    <p className="text-white/40 text-xs mb-1.5">Certifications</p>
                    <div className="flex flex-wrap gap-1.5">
                      {coach.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-full text-xs text-white/70"
                        >
                          <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON.checkBadge} />
                          </svg>
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── COACHING REVIEWS (full width) ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CoachingReviewsCard reviews={reviews} />
          </motion.div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;
