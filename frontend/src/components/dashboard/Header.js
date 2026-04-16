import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [role, setRole] = useState('Player'); // Player or Coach
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    navigate('/', { replace: true });
  };

  return (
    <header className="sticky top-0 h-16 bg-kreeda-charcoal border-b border-gray-800 flex items-center justify-between px-6 z-30">
      {/* Left side - could add breadcrumbs or search */}
      <div className="flex items-center gap-4">
        <h2 className="text-white font-semibold text-lg" data-testid="header-title">Dashboard</h2>
      </div>

      {/* Right side - Role toggle, Notifications, User menu */}
      <div className="flex items-center gap-4">
        {/* Role Toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1" data-testid="role-toggle">
          <button
            onClick={() => setRole('Player')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              role === 'Player' 
                ? 'bg-kreeda-orange text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🏸 Player
          </button>
          <button
            onClick={() => setRole('Coach')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              role === 'Coach' 
                ? 'bg-kreeda-orange text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎓 Coach
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors" data-testid="notifications-button">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-kreeda-orange rounded-full"></span>
        </button>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            data-testid="user-menu-button"
          >
            <img 
              src={user?.picture || 'https://via.placeholder.com/40'} 
              alt={user?.name}
              className="w-10 h-10 rounded-full border-2 border-kreeda-orange"
            />
            <div className="text-left hidden md:block">
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-gray-400 text-xs">{role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2" data-testid="user-menu-dropdown">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors">
                ⚙️ Account Settings
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors">
                🌐 Language: English
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors">
                🎁 Invite & Earn
              </button>
              <div className="border-t border-gray-700 mt-2 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors"
                  data-testid="logout-button"
                >
                  🚪 Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;