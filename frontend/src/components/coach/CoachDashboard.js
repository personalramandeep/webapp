import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import { useIdentity } from '../../contexts/IdentityContext';
import { useReviewStore, getPendingRequestsForCoach } from '../../mocks/reviewStore';
import { MOCK_COACHES } from '../../mocks/fixtures';

const StarRow = ({ value = 0 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i <= Math.round(value) ? 'text-yellow-400' : 'text-gray-700'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.587 13.347a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 7.82c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const StatCard = ({ label, value, icon, bg }) => (
  <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>{icon}</div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
    </div>
    <p className="text-white text-3xl font-bold">{value}</p>
  </div>
);

const CoachDashboard = ({ onLogout }) => {
  const { identity } = useIdentity();
  const navigate = useNavigate();
  const [store] = useReviewStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true);

  // Pending requests for this coach across ALL videos (demo uses just coach-prab)
  const pending = getPendingRequestsForCoach('coach-prab');
  const totalSessions = 0;
  const inReview = pending.length;
  const rating = identity.rating ?? 3.0;

  return (
    <div className="min-h-screen bg-kreeda-charcoal">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header user={identity} onLogout={onLogout} />
        <main className="p-6 max-w-[1600px] mx-auto">
          {/* Announcement banner (matches image 3/7 top banner) */}
          <div className="bg-green-900/30 border border-green-800/50 rounded-lg px-4 py-2.5 mb-5 flex items-center gap-2 text-xs">
            <span className="text-green-400">🎉 Welcome to your Kreeda dashboard!</span>
            <span className="text-gray-300">We're launching all features on <span className="text-kreeda-orange font-medium">April 16, 2026</span>. Until then, everything you see is sample data — feel free to explore!</span>
          </div>

          {/* Welcome + rating */}
          <div className="mb-2">
            <StarRow value={rating} />
            <p className="text-gray-400 text-xs mt-1">{rating.toFixed(1)}</p>
          </div>
          <h1 className="text-white text-3xl font-bold mb-1" data-testid="coach-welcome">
            Welcome back, Coach {identity.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-400 mb-6">Here's what's happening with your coaching today</p>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Pending Reviews"
              value={inReview}
              bg="bg-kreeda-orange/10"
              icon={<span className="text-kreeda-orange text-lg">📋</span>}
            />
            <StatCard
              label="Total Sessions"
              value={totalSessions}
              bg="bg-blue-500/10"
              icon={<span className="text-blue-400 text-lg">📅</span>}
            />
            <StatCard
              label="Rating"
              value={rating.toFixed(1)}
              bg="bg-yellow-500/10"
              icon={<span className="text-yellow-400 text-lg">⭐</span>}
            />
            <StatCard
              label="In Review"
              value={inReview}
              bg="bg-purple-500/10"
              icon={<span className="text-purple-400 text-lg">🎥</span>}
            />
          </div>

          {/* New Coaching Requests */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">New Coaching Requests</h3>
              <span className="text-[10px] px-2 py-0.5 bg-kreeda-orange/20 text-kreeda-orange rounded-full font-medium">Everyday</span>
            </div>
            {pending.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-14 h-14 mx-auto mb-3 bg-[#2a2a2a] rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No pending coaching requests</p>
                <p className="text-gray-600 text-xs mt-1">Publish your profile on the marketplace to start receiving requests</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pending.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => navigate(`/coach/reviews/${r.id}`)}
                    className="w-full flex items-center gap-3 px-3 py-3 bg-[#2a2a2a] hover:bg-[#333] border border-white/5 rounded-lg transition-colors text-left"
                    data-testid={`pending-request-${r.id}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-kreeda-orange/20 flex items-center justify-center">
                      <span className="text-kreeda-orange text-lg">🎥</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Ramandeep Singh</p>
                      <p className="text-gray-500 text-xs">Video Review · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full font-medium">In Review</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Player Feedback */}
          <div className="bg-[#1f1f1f] border border-white/5 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Recent Player Feedback</h3>
              <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full font-medium">1 review</span>
            </div>
            <div className="flex items-center gap-3 py-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=sumit" alt="Sumit" className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Sumit Singh</p>
                <p className="text-gray-500 text-xs">@Mohamedali4595 · nice</p>
              </div>
              <StarRow value={3} />
            </div>
            <div className="text-right mt-3">
              <button className="text-kreeda-orange text-xs hover:underline">View all feedback →</button>
            </div>
          </div>

          {/* Workroom tiles */}
          <h3 className="text-white font-bold mb-3">Workroom</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl p-5 text-left transition-colors">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-blue-400 text-xl">📅</span>
              </div>
              <p className="text-white font-semibold">My Calendar</p>
            </button>
            <button className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl p-5 text-left transition-colors">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-green-400 text-xl">💰</span>
              </div>
              <p className="text-white font-semibold">My Earnings</p>
            </button>
            <button className="bg-kreeda-orange/10 hover:bg-kreeda-orange/20 border border-kreeda-orange/20 rounded-xl p-5 text-left transition-colors">
              <div className="w-10 h-10 bg-kreeda-orange/20 rounded-lg flex items-center justify-center mb-3">
                <span className="text-kreeda-orange text-xl">🛒</span>
              </div>
              <p className="text-white font-semibold">Coach Marketplace</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoachDashboard;
