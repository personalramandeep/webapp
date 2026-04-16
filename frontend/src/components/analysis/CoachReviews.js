import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoachReviews = () => {
  const [expandedId, setExpandedId] = useState(null);

  const coaches = [
    { 
      id: 1, 
      name: 'Prabasharan Kaur', 
      status: 'in_review', 
      avatar: '👨‍🏫', 
      specialization: 'Singles Strategy',
      rating: 4.8,
      sentDaysAgo: 2,
      message: 'Please focus on my footwork and net play techniques.'
    },
    { 
      id: 2, 
      name: 'Sumit Singh', 
      status: 'pending', 
      avatar: '👨‍💼', 
      specialization: 'Defensive Play',
      rating: 4.6,
      sentDaysAgo: 2,
      message: 'Would love feedback on my defensive positioning.'
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-500 bg-opacity-10 text-yellow-400 text-xs rounded-full border border-yellow-500 border-opacity-20">
            Pending
          </span>
        );
      case 'in_review':
        return (
          <span className="px-2 py-1 bg-blue-500 bg-opacity-10 text-blue-400 text-xs rounded-full border border-blue-500 border-opacity-20">
            In Review
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-500 bg-opacity-10 text-green-400 text-xs rounded-full border border-green-500 border-opacity-20">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-10 h-10 bg-yellow-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'in_review':
        return (
          <div className="w-10 h-10 bg-blue-500 bg-opacity-10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#1a1a1a] border border-white border-opacity-5 rounded-xl p-6 backdrop-blur-xl"
      style={{
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Coach Reviews</h3>
        <button className="text-kreeda-orange text-sm font-semibold hover:underline">
          + Request
        </button>
      </div>

      <div className="space-y-3">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="bg-[#2a2a2a] border border-white border-opacity-5 rounded-lg overflow-hidden hover:border-opacity-10 transition-all"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === coach.id ? null : coach.id)}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <div className="text-3xl">{coach.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white truncate">{coach.name}</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-400">{coach.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{coach.specialization}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(coach.status)}
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedId === coach.id ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedId === coach.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-white border-opacity-5"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                      {getStatusIcon(coach.status)}
                      <div className="flex-1">
                        {coach.status === 'pending' && (
                          <>
                            <p className="text-sm text-yellow-400 font-semibold mb-1">Waiting for coach to respond</p>
                            <p className="text-xs text-gray-400">Sent {coach.sentDaysAgo} days ago</p>
                          </>
                        )}
                        {coach.status === 'in_review' && (
                          <>
                            <p className="text-sm text-blue-400 font-semibold mb-1">Coach is reviewing your video</p>
                            <p className="text-xs text-gray-400">Sent {coach.sentDaysAgo} days ago</p>
                          </>
                        )}
                      </div>
                    </div>
                    {coach.message && (
                      <div className="bg-[#1a1a1a] rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-400 mb-1">Your note:</p>
                        <p className="text-sm text-gray-300 italic">"{coach.message}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-3 border border-dashed border-gray-600 rounded-lg hover:border-kreeda-orange hover:bg-kreeda-orange hover:bg-opacity-5 transition-all text-sm text-gray-400 hover:text-kreeda-orange">
        + Add Another Coach
      </button>
    </motion.div>
  );
};

export default CoachReviews;
