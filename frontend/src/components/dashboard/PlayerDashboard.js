import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LeaderboardStrip from './LeaderboardStrip';
import QuickStats from './QuickStats';
import EmptyState from './EmptyState';
import RecentVideos from './RecentVideos';
import ActionCards from './ActionCards';
import UploadModal from './UploadModal';

const PlayerDashboard = ({ user, onLogout }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed (icon-only)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Determine if user is new (no videos) - can be based on real data
  const hasVideos = true; // Change to false to see empty state
  
  // Mock stats data
  const userStats = {
    totalVideos: 4,
    aiScore: 72,
    ranking: '#2',
    rankingChange: true,
    streak: '4 days',
    improvement: '+0%'
  };

  const handleVideoUploaded = (videoData) => {
    console.log('Video uploaded:', videoData);
    // In production, this would update the dashboard data
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />

      {/* Main Content Area */}
      <div 
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Header */}
        <Header user={user} onLogout={onLogout} />

        {/* Main Content */}
        <main className="p-6">
          {/* Live Leaderboard Strip */}
          <LeaderboardStrip currentUserId="2" />

          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-white text-4xl font-bold mb-2" data-testid="welcome-heading">
              Welcome back, {user?.name?.split(' ')[0] || 'Player'}!
            </h1>
            <p className="text-gray-400 text-lg">Your training progress at a glance</p>
          </div>

          {/* Quick Stats */}
          <QuickStats stats={userStats} isEmpty={!hasVideos} />

          {/* Main Grid - 2:1 Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2/3) - Upload & Videos */}
            <div className="lg:col-span-2 space-y-6">
              {hasVideos ? (
                <RecentVideos onUploadClick={() => setIsUploadModalOpen(true)} />
              ) : (
                <EmptyState onUploadClick={() => setIsUploadModalOpen(true)} />
              )}
            </div>

            {/* Right Column (1/3) - Action Cards */}
            <div className="lg:col-span-1">
              <ActionCards />
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleVideoUploaded}
      />
    </div>
  );
};

export default PlayerDashboard;
