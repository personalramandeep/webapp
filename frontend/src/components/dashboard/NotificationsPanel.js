import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_NOTIFICATIONS } from '../../mocks/fixtures';

const ICON_MAP = {
  review: {
    bg: 'from-kreeda-orange/30 to-kreeda-orange/10',
    color: 'text-kreeda-orange',
    path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  sparkles: {
    bg: 'from-purple-500/30 to-purple-500/10',
    color: 'text-purple-400',
    path: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  trophy: {
    bg: 'from-yellow-500/30 to-yellow-500/10',
    color: 'text-yellow-400',
    path: 'M5 3v4M3 5h4M6 17v4m-2-2h4m6-16l2.5 5 5.5.5-4 3.5 1 5.5L12 13l-5 3 1-5.5L4 7l5.5-.5L12 1z',
  },
  fire: {
    bg: 'from-green-500/30 to-green-500/10',
    color: 'text-green-400',
    path: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.24 17 7.07c1.84 3.65-.4 6.16-.4 6.16z',
  },
  user: {
    bg: 'from-blue-500/30 to-blue-500/10',
    color: 'text-blue-400',
    path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
};

const NotificationRow = ({ notification }) => {
  const icon = ICON_MAP[notification.icon] || ICON_MAP.sparkles;

  return (
    <button className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex gap-3 ${notification.unread ? 'bg-white/[0.02]' : ''}`}>
      <div className={`w-10 h-10 bg-gradient-to-br ${icon.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <svg className={`w-5 h-5 ${icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className="text-white text-sm font-semibold line-clamp-1">{notification.title}</p>
          {notification.unread && <span className="w-2 h-2 bg-kreeda-orange rounded-full flex-shrink-0 mt-1.5"></span>}
        </div>
        <p className="text-white/60 text-xs line-clamp-2 mb-1">{notification.body}</p>
        <p className="text-white/40 text-[10px]">{notification.timeAgo}</p>
      </div>
    </button>
  );
};

const NotificationsPanel = ({ isOpen, onClose }) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-96 max-h-[70vh] bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-kreeda-orange text-white text-xs font-semibold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button className="text-kreeda-orange text-xs font-medium hover:opacity-80">
                Mark all read
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(70vh-100px)] divide-y divide-white/5">
              {MOCK_NOTIFICATIONS.map((n) => (
                <NotificationRow key={n.id} notification={n} />
              ))}
            </div>

            <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02]">
              <button className="w-full text-center text-kreeda-orange text-sm font-medium hover:opacity-80">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
