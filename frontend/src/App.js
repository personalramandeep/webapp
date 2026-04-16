import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PlayerDashboard from './components/dashboard/PlayerDashboard';
import VideoAnalysis from './components/VideoAnalysis';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/analysis/:videoId" element={<VideoAnalysis />} />
      {/* Demo route for testing/preview (no auth required) */}
      <Route path="/demo" element={
        <PlayerDashboard 
          user={{
            name: 'Demo User',
            email: 'demo@kreeda.tech',
            picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
          }}
          onLogout={() => window.location.href = '/'}
        />
      } />
    </Routes>
  );
}

export default App;