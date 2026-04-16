import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
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
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onLogout={onLogout} />

        <main className="p-6">
          <LeaderboardStrip currentUserId="2" />

          <div className="mb-6">
            <h1 className="text-white text-4xl font-bold mb-2" data-testid="welcome-heading">
              Welcome back, {user?.name?.split(' ')[0] || 'Player'}!
            </h1>
            <p className="text-gray-400 text-lg">Your training progress at a glance</p>
          </div>

          <QuickStats stats={userStats} isEmpty={!hasVideos} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
