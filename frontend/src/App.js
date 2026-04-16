import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PlayerDashboard from './components/dashboard/PlayerDashboard';
import VideoAnalysis from './components/VideoAnalysis';
import CoachDashboard from './components/coach/CoachDashboard';
import CoachReviewsWorkroom from './components/coach/CoachReviewsWorkroom';
import CoachMarketplace from './components/coach/CoachMarketplace';
import CoachProfile from './pages/CoachProfile';
import PerformanceReview from './components/review/PerformanceReview';
import { IdentityProvider, useIdentity } from './contexts/IdentityContext';
import './App.css';

function RoleBasedDashboard() {
  const { identity } = useIdentity();
  const handleLogout = () => { window.location.href = '/'; };
  if (identity.role === 'coach') {
    return <CoachDashboard onLogout={handleLogout} />;
  }
  return <PlayerDashboard user={identity} onLogout={handleLogout} />;
}

function App() {
  const handleLogout = () => { window.location.href = '/'; };
  
  return (
    <IdentityProvider>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/dashboard" element={<RoleBasedDashboard />} />
    <Route path="/analysis/:videoId" element={<VideoAnalysis onLogout={handleLogout} />} />
    <Route path="/marketplace" element={<CoachMarketplace />} />
    <Route path="/coach/dashboard" element={<RoleBasedDashboard />} />
    <Route path="/coach/reviews/:requestId" element={<CoachReviewsWorkroomRoute />} />
    <Route path="/coach/:coachId" element={<CoachProfile />} />
    <Route path="/review/:videoId" element={<PerformanceReviewRoute />} />
    <Route path="/demo" element={<RoleBasedDashboard />} />
  </Routes>
</IdentityProvider>

  );
}

function CoachReviewsWorkroomRoute() {
  const handleLogout = () => { window.location.href = '/'; };
  return <CoachReviewsWorkroom onLogout={handleLogout} />;
}

function PerformanceReviewRoute() {
  const handleLogout = () => { window.location.href = '/'; };
  return <PerformanceReview onLogout={handleLogout} />;
}

export default App;
