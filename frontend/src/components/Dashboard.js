import React from 'react';
import PlayerDashboard from './dashboard/PlayerDashboard';

const Dashboard = () => {
  // Mock user data - no authentication required
  const mockUser = {
    name: 'Kreeda Athlete',
    email: 'player@kreeda.tech',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kreeda'
  };

  const handleLogout = () => {
    // Just redirect to home
    window.location.href = '/';
  };

  return <PlayerDashboard user={mockUser} onLogout={handleLogout} />;
};

export default Dashboard;