import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentity } from '../../contexts/IdentityContext';
import NotificationsPanel from './NotificationsPanel';
import { MOCK_NOTIFICATIONS } from '../../mocks/fixtures';

const Header = ({ onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { identity, role, setIdentity } = useIdentity();
  const navigate = useNavigate();

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  const handleRoleChange = (nextRole) => {
    const normalized = nextRole === 'Coach' ? 'coach' : 'player';
    setIdentity(normalized);
    navigate(normalized === 'coach' ? '/coach/dashboard' : '/dashboard');
  };

  const handleLogout = async () => {
    if (onLogout) await onLogout();
    navigate('/', { replace: true });
  };

  const displayRole = role === 'coach' ? 'Coach' : 'Player';

  return (
    <header className="sticky top-0 h-16 bg-kreeda-charcoal flex items-center justify-end px-6 z-30">
      <div className="flex items-center gap-4">
        <div className="flex bg-gray-800 rounded-lg p-1" data-testid="role-toggle">
          <button
            onClick={() => handleRoleChange('Player')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              displayRole === 'Player' ? 'bg-kreeda-orange text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            🏸 Player
          </button>
          <button
            onClick={() => handleRoleChange('Coach')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              displayRole === 'Coach' ? 'bg-kreeda-orange text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            🎓 Coach
          </button>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications((v) => !v); setShowUserMenu(false); }}
            className="relative p-2 text-gray-400 hover:text-white transition-colors"
            data-testid="notifications-button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-kreeda-orange rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationsPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            data-testid="user-menu-button"
          >
            <img
              src={identity.picture || 'https://via.placeholder.com/40'}
              alt={identity.name}
              className="w-10 h-10 rounded-full border-2 border-kreeda-orange"
            />
            <div className="text-left hidden md:block">
              <p className="text-white text-sm font-medium">{identity.name}</p>
              <p className="text-gray-400 text-xs">{displayRole}</p>
            </div>
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2"
              data-testid="user-menu-dropdown"
            >
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-white font-medium">{identity.name}</p>
                <p className="text-gray-400 text-sm">{identity.email}</p>
              </div>
              <div className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => { handleRoleChange('Player'); setShowUserMenu(false); }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
                    displayRole === 'Player' ? 'bg-kreeda-orange text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Player
                </button>
                <button
                  onClick={() => { handleRoleChange('Coach'); setShowUserMenu(false); }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium ${
                    displayRole === 'Coach' ? 'bg-kreeda-orange text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  Coach
                </button>
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
