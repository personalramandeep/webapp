import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import { useIdentity } from '../../contexts/IdentityContext';
import { useReviewStore, getPendingRequestsForCoach } from '../../mocks/reviewStore';
import { MOCK_COACH_DASHBOARD_FEEDBACK } from '../../mocks/fixtures';

// ── Inline SVG icon paths (Heroicons 24 outline) ──────────────────────────────
const ICON_CLIPBOARD = 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4';
const ICON_USERS     = 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';
const ICON_STAR      = 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z';
const ICON_CLOCK     = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
const ICON_CALENDAR  = 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
const ICON_BANKNOTES = 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z';
const ICON_STOREFRONT= 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z';
const ICON_CHECK     = 'M4.5 12.75l6 6 9-13.5';
const ICON_XMARK     = 'M6 18L18 6M6 6l12 12';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const StarRow = ({ value = 0, size = 'sm' }) => {
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const full = Math.floor(value);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`${cls} ${i <= full ? 'text-yellow-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={ICON_STAR} />
        </svg>
      ))}
    </div>
  );
};

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const StatCard = ({ label, value, iconPath, iconBg, iconColor, onClick }) => (
  <button onClick={onClick} className="text-left w-full" disabled={!onClick}>
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 rounded-2xl hover:border-white/20 transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon path={iconPath} className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-white/50 text-xs">{label}</p>
          <p className="text-white text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  </button>
);

const CoachDashboard = ({ onLogout }) => {
  const { identity } = useIdentity();
  const navigate = useNavigate();
  const [store] = useReviewStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true);

  const allPending = getPendingRequestsForCoach('coach-prab');
  const [dismissedIds, setDismissedIds] = useState([]);
  const pending = allPending.filter((r) => !dismissedIds.includes(r.id));

  const totalSessions = 0;
  const inReview = allPending.length;
  const rating = identity.rating ?? 3.0;

  const recentFeedback = (MOCK_COACH_DASHBOARD_FEEDBACK || []).slice(0, 3);

  const handleAccept = (requestId) => {
    navigate(`/coach/reviews/${requestId}`);
  };

  const handleDecline = (requestId) => {
    setDismissedIds((prev) => [...prev, requestId]);
  };

  const workroomItems = [
    { iconPath: ICON_CALENDAR,   label: 'My Calendar',       path: '/coach/calendar',  bg: 'from-blue-500/20 to-blue-500/5',         iconBg: 'bg-blue-500/20',         iconColor: 'text-blue-400' },
    { iconPath: ICON_BANKNOTES,  label: 'My Earnings',       path: '/coach/earnings',  bg: 'from-emerald-500/20 to-emerald-500/5',   iconBg: 'bg-emerald-500/20',      iconColor: 'text-emerald-400' },
    { iconPath: ICON_STOREFRONT, label: 'Coach Marketplace', path: '/marketplace',     bg: 'from-kreeda-orange/20 to-kreeda-orange/5', iconBg: 'bg-kreeda-orange/20',  iconColor: 'text-kreeda-orange' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header user={identity} onLogout={onLogout} />
        <main className="p-6 max-w-[1600px] mx-auto relative">
          {/* Background blur orbs */}
          <div className="absolute top-20 -left-20 w-72 h-72 bg-kreeda-orange/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-40 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Announcement banner
          <div className="bg-green-900/30 border border-green-800/50 rounded-lg px-4 py-2.5 mb-5 flex items-center gap-2 text-xs">
            <span className="text-green-400">🎉 Welcome to your Kreeda dashboard!</span>
            <span className="text-gray-300">We're launching all features on <span className="text-kreeda-orange font-medium">April 16, 2026</span>. Until then, everything you see is sample data — feel free to explore!</span>
          </div> */}

          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Welcome + rating */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <StarRow value={rating} />
                {rating > 0 && <span className="text-white/50 text-sm">{rating.toFixed(1)}</span>}
              </div>
              <h1 className="text-white text-2xl md:text-4xl font-bold mb-1" data-testid="coach-welcome">
                Welcome back, Coach {identity.name.split(' ')[0]}!
              </h1>
              <p className="text-white/60 text-sm md:text-base">Here's what's happening with your coaching today</p>
            </motion.div>

            {/* Stat cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              <StatCard
                label="Pending Reviews"
                value={pending.length}
                iconPath={ICON_CLIPBOARD}
                iconBg="bg-kreeda-orange/20"
                iconColor="text-kreeda-orange"
                onClick={() => navigate('/coach/reviews')}
              />
              <StatCard
                label="Total Sessions"
                value={totalSessions}
                iconPath={ICON_USERS}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
              <StatCard
                label="Rating"
                value={rating > 0 ? rating.toFixed(1) : '--'}
                iconPath={ICON_STAR}
                iconBg="bg-emerald-500/20"
                iconColor="text-emerald-400"
              />
              <StatCard
                label="In Review"
                value={inReview}
                iconPath={ICON_CLOCK}
                iconBg="bg-purple-500/20"
                iconColor="text-purple-400"
              />
            </motion.div>

            {/* New Coaching Requests */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-white">New Coaching Requests</h2>
                  <span className="text-xs text-kreeda-orange font-medium px-2 py-1 bg-kreeda-orange/20 rounded-full">
                    {pending.length} pending
                  </span>
                </div>
                {pending.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Icon path={ICON_CLIPBOARD} className="w-12 h-12 text-white/20" />
                    </div>
                    <p className="text-white/50 text-sm">No pending coaching requests</p>
                    <p className="text-white/30 text-xs mt-1">Publish your profile on the marketplace to start receiving requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pending.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-kreeda-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-kreeda-orange font-semibold text-sm">
                              {(r.playerName || '?')[0]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{r.playerName || 'Unknown Player'}</p>
                            <p className="text-white/40 text-xs">Video Review · {new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <button
                            onClick={() => handleAccept(r.id)}
                            className="w-8 h-8 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg flex items-center justify-center transition-colors"
                            title="Accept and open review"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d={ICON_CHECK} />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDecline(r.id)}
                            className="w-8 h-8 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors"
                            title="Decline request"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d={ICON_XMARK} />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Player Feedback */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 md:p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-white">Recent Player Feedback</h2>
                  {recentFeedback.length > 0 && (
                    <span className="text-xs text-yellow-400 font-medium px-2 py-1 bg-yellow-400/10 rounded-full">
                      {recentFeedback.length} review{recentFeedback.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {recentFeedback.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon path={ICON_STAR} className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">No player feedback yet</p>
                    <p className="text-white/30 text-xs mt-1">Reviews from your players will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentFeedback.map((fb) => (
                      <div key={fb.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-10 h-10 bg-kreeda-orange/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {fb.playerProfilePicUrl ? (
                            <img src={fb.playerProfilePicUrl} alt={fb.playerName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-kreeda-orange font-semibold text-sm">{(fb.playerName || '?')[0]}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="min-w-0">
                              <p className="text-white text-sm font-medium truncate">{fb.playerName}</p>
                              {fb.playerUsername && (
                                <p className="text-white/40 text-xs truncate">@{fb.playerUsername}</p>
                              )}
                            </div>
                            <StarRow value={fb.rating} size="sm" />
                          </div>
                          <p className="text-white/70 text-xs leading-relaxed">{fb.reviewText}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/coach/feedback')}
                    className="text-xs text-kreeda-orange hover:text-kreeda-orange/80 font-medium transition-colors"
                  >
                    View all feedback →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Workroom */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Workroom</h2>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {workroomItems.map((item) => (
                  <button key={item.label} onClick={() => navigate(item.path)} className="group text-left">
                    <div className={`bg-gradient-to-br ${item.bg} border border-white/10 p-4 md:p-6 rounded-2xl hover:border-white/20 transition-all duration-300 hover:scale-[1.02]`}>
                      <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${item.iconBg} rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-colors`}>
                          <Icon path={item.iconPath} className={`w-6 h-6 md:w-7 md:h-7 ${item.iconColor}`} />
                        </div>
                        <span className="text-white text-xs md:text-sm font-medium">{item.label}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CoachDashboard;
