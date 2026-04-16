import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import CoachSearchFilters from './CoachSearchFilters';
import AIRecommendationStrip from './AIRecommendationStrip';
import CoachCard from './CoachCard';
import { MOCK_COACHES } from '../../mocks/fixtures';

const ICON_USER_GROUP = 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const CoachMarketplace = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  const toggleQuickFilter = (id) => {
    setActiveQuickFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleFavorite = (coachId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(coachId)) next.delete(coachId);
      else next.add(coachId);
      return next;
    });
  };

  const displayedCoaches = useMemo(() => {
    let list = MOCK_COACHES;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.specialization || '').toLowerCase().includes(q) ||
        (c.location || '').toLowerCase().includes(q)
      );
    }

    if (activeQuickFilters.includes('favourites')) {
      list = list.filter((c) => favorites.has(c.id));
    }
    if (activeQuickFilters.includes('top_rated')) {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (activeQuickFilters.includes('budget_friendly')) {
      list = list.filter((c) => (c.hourlyRate || 0) < 149);
    }

    return list;
  }, [searchQuery, activeQuickFilters, favorites]);

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
        <div className="container mx-auto px-3 py-4 md:px-6 md:py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 md:mb-8"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
            <div className="p-2 md:p-3 bg-kreeda-orange/20 rounded-xl">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_USER_GROUP} />
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-4xl font-bold">Coach Marketplace</h1>
              <p className="text-sm md:text-xl text-white/70 mt-0.5 md:mt-1">
                Connect with professional badminton coaches to accelerate your growth
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CoachSearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            activeQuickFilters={activeQuickFilters}
            toggleQuickFilter={toggleQuickFilter}
          />
        </motion.div>

        {/* AI Recommendation Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <AIRecommendationStrip />
        </motion.div>

        {/* Results count */}
        {displayedCoaches.length > 0 && (
          <p className="text-white/40 text-sm mb-3 md:mb-4">
            Showing 1–{displayedCoaches.length} of {displayedCoaches.length} coaches near Bangalore
          </p>
        )}

        {/* Coach Grid */}
        {displayedCoaches.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_USER_GROUP} />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No coaches found</h3>
            <p className="text-white/60 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6"
          >
            {displayedCoaches.map((coach, index) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                index={index}
                isFavorited={favorites.has(coach.id)}
                onToggleFavorite={toggleFavorite}
                onViewProfile={(coachId) => navigate(`/coach/${coachId}`)}
              />
            ))}
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CoachMarketplace;
