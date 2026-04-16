import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIdentity } from '../../contexts/IdentityContext';
import NotificationsPanel from './NotificationsPanel';
import { MOCK_NOTIFICATIONS } from '../../mocks/fixtures';

// Inline icon components (outline/solid variants) — avoids heroicons dep
const Icon = ({ path, solid = false, className = 'w-5 h-5' }) => (
  <svg className={className} fill={solid ? 'currentColor' : 'none'} stroke={solid ? 'none' : 'currentColor'} viewBox="0 0 24 24" strokeWidth={solid ? 0 : 2}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const icons = {
  home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  academic: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  coaching: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  sparkles: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  clipboard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m6-16l2.5 5 5.5.5-4 3.5 1 5.5L12 13l-5 3 1-5.5L4 7l5.5-.5L12 1z',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  banknotes: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  id: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  cog: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  help: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  chevronRight: 'M9 5l7 7-7 7',
  chevronLeft: 'M15 19l-7-7 7-7',
  chevronDown: 'M19 9l-7 7-7-7',
};

const Sidebar = ({ isCollapsed, setIsCollapsed, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, role, setIdentity } = useIdentity();
  
  const [expandedMenus, setExpandedMenus] = useState({ coaching: true });
  const [hoveredParent, setHoveredParent] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const toggleMenu = (key) => setExpandedMenus((p) => ({ ...p, [key]: !p[key] }));

  const playerMenu = [
    { icon: icons.home, label: 'Dashboard', path: '/dashboard' },
    { icon: icons.video, label: 'My Videos', path: '/videos' },
    { icon: icons.chart, label: 'Performance', path: '/performance' },
    { icon: icons.academic, label: 'Training', path: '/training' },
    {
      icon: icons.coaching,
      label: 'Coaching',
      isParent: true,
      key: 'coaching',
      children: [
        { icon: icons.sparkles, label: 'AI Coach', path: '/ai-coach' },
        { icon: icons.users, label: 'Find a Coach', path: '/marketplace' },
        { icon: icons.clipboard, label: 'My Sessions', path: '/my-sessions' },
      ],
    },
    { icon: icons.trophy, label: 'Challenges', path: '/challenges' },
  ];

  const coachMenu = [
    { icon: icons.home, label: 'Coach Home', path: '/coach/dashboard' },
    { icon: icons.clipboard, label: 'Review Requests', path: '/coach/reviews' },
    { icon: icons.chat, label: 'Player Feedback', path: '/coach/feedback' },
    { icon: icons.calendar, label: 'My Calendar', path: '/coach/calendar' },
    { icon: icons.banknotes, label: 'My Earnings', path: '/coach/earnings' },
    { icon: icons.id, label: 'My Coach Profile', path: '/coach-profile' },
    { icon: icons.users, label: 'Coach Marketplace', path: '/marketplace' },
  ];

  const menuItems = role === 'coach' ? coachMenu : playerMenu;

  const bottomMenu = [
    { icon: icons.user, label: 'My Profile', path: '/profile' },
    { icon: icons.cog, label: 'Settings', path: '/settings' },
    { icon: icons.help, label: 'Help & Resources', path: '/help' },
  ];

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) => item.children?.some((c) => isActive(c.path));

  const handleNavClick = (path) => navigate(path);

  return (
    <>
      {/* Fixed top bar with logo and controls */}
      <div className="fixed left-0 top-0 h-16 w-full bg-kreeda-charcoal border-b border-white/10 flex items-center justify-between px-6 z-50">
        {/* Logo */}
        <button onClick={() => handleNavClick('/dashboard')} className="flex items-center">
          <img 
            src="/assets/kreeda-logo.png" 
            alt="Kreeda" 
            className="h-16 w-auto"
          />
        </button>

        {/* Controls on the right */}
        <div className="flex items-center gap-4">
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

          {/* User Menu */}
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
                className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
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
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 280 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-kreeda-charcoal border-r border-white/10 flex flex-col z-40 overflow-x-hidden"
      >
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            if (item.isParent) {
              const parentActive = isParentActive(item);
              const expanded = expandedMenus[item.key];

              return (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setHoveredParent(item.key)}
                  onMouseLeave={() => isCollapsed && setHoveredParent(null)}
                >
                  <button
                    onClick={() => !isCollapsed && toggleMenu(item.key)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-3'} px-3 py-2.5 rounded-lg transition-all ${
                      parentActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <Icon path={item.icon} solid={parentActive} className={`w-5 h-5 flex-shrink-0 ${parentActive ? 'text-kreeda-orange' : 'text-white/60'}`} />
                    {!isCollapsed && (
                      <>
                        <span className={`font-medium text-sm whitespace-nowrap flex-1 text-left ${parentActive ? 'text-white' : 'text-white/70'}`}>
                          {item.label}
                        </span>
                        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                          <Icon path={icons.chevronDown} className="w-4 h-4 text-white/60" />
                        </motion.div>
                      </>
                    )}
                  </button>

                  {/* Hover flyout when collapsed */}
                  <AnimatePresence>
                    {isCollapsed && hoveredParent === item.key && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-full top-0 ml-2 min-w-[200px] bg-kreeda-charcoal border border-white/20 rounded-lg shadow-2xl py-2 px-2 z-50"
                      >
                        <div className="text-xs font-semibold text-white/50 px-3 py-1 mb-1">{item.label}</div>
                        {item.children.map((child) => {
                          const childActive = isActive(child.path);
                          return (
                            <button
                              key={child.path}
                              onClick={() => handleNavClick(child.path)}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                childActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                              }`}
                            >
                              <Icon path={child.icon} solid={childActive} className={`w-4 h-4 flex-shrink-0 ${childActive ? 'text-kreeda-orange' : 'text-white/60'}`} />
                              <span className="font-medium text-sm">{child.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Inline children when expanded */}
                  {!isCollapsed && (
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-9 space-y-1 mt-1">
                            {item.children.map((child) => {
                              const childActive = isActive(child.path);
                              return (
                                <button
                                  key={child.path}
                                  onClick={() => handleNavClick(child.path)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                    childActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                                  }`}
                                >
                                  <Icon path={child.icon} solid={childActive} className={`w-4 h-4 flex-shrink-0 ${childActive ? 'text-kreeda-orange' : 'text-white/60'}`} />
                                  <span className={`font-medium text-sm whitespace-nowrap ${childActive ? 'text-white' : 'text-white/70'}`}>
                                    {child.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            }

            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                title={item.label}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-all ${
                  active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon path={item.icon} solid={active} className={`w-5 h-5 flex-shrink-0 ${active ? 'text-kreeda-orange' : 'text-white/60'}`} />
                {!isCollapsed && (
                  <span className={`font-medium text-sm whitespace-nowrap ${active ? 'text-white' : 'text-white/70'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 py-4 px-2 space-y-1">
          {bottomMenu.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                title={item.label}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-all ${
                  active ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon path={item.icon} solid={active} className={`w-5 h-5 flex-shrink-0 ${active ? 'text-kreeda-orange' : 'text-white/60'}`} />
                {!isCollapsed && (
                  <span className={`font-medium text-sm whitespace-nowrap ${active ? 'text-white' : 'text-white/70'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-white/10 py-3 px-3 flex justify-end">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon
              path={isCollapsed ? icons.chevronRight : icons.chevronLeft}
              className="w-5 h-5 text-kreeda-orange"
            />
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
