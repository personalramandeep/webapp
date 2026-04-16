import React, { useState } from 'react';
import Sidebar from './Sidebar';
import LeaderboardStrip from './LeaderboardStrip';
import QuickStats from './QuickStats';
import EmptyState from './EmptyState';
import RecentVideos from './RecentVideos';
import ActionCards from './ActionCards';
import UploadModal from './UploadModal';
import { useIdentity } from '../../contexts/IdentityContext';

const PlayerDashboard = ({ user: userProp, onLogout }) => {
  const { identity } = useIdentity();
  const user = userProp || identity;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const hasVideos = true;

  const userStats = {
    totalVideos: 4,
    aiScore: 72,
    ranking: '#2',
    rankingChange: true,
    streak: '1 days',
    improvement: '+0%',
  };

  const handleVideoUploaded = (videoData) => {
    console.log('Video uploaded:', videoData);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={onLogout}
      />

      <div
        className="transition-all duration-300 pt-16"
        style={{ marginLeft: isSidebarCollapsed ? 72 : 280 }}
      >
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <LeaderboardStrip />

            <div className="mb-6 md:mb-8">
              <h1 className="text-white text-3xl md:text-4xl font-bold mb-2" data-testid="welcome-heading">
                Welcome back, {user?.name?.split(' ')[0] || 'Player'}!
              </h1>
              <p className="text-white/60 text-lg">Your training progress at a glance</p>
            </div>

            <QuickStats stats={userStats} isEmpty={!hasVideos} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 space-y-4">
                {hasVideos ? (
                  <RecentVideos onUploadClick={() => setIsUploadModalOpen(true)} />
                ) : (
                  <EmptyState onUploadClick={() => setIsUploadModalOpen(true)} />
                )}
              </div>
              <div className="lg:col-span-1">
                <ActionCards />
              </div>
            </div>
          </div>
        </main>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleVideoUploaded}
      />
    </div>
  );
};

export default PlayerDashboard;
