import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MOCK_VIDEOS } from '../../mocks/fixtures';

const VideoTile = ({ video, index, onClick }) => {
  const [showType, setShowType] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setShowType((v) => !v), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative rounded-3xl overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/5] overflow-hidden bg-[#1B3B36]/40">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Alternating badge */}
        <div className="absolute top-3 right-3 z-20">
          <AnimatePresence mode="wait">
            {showType ? (
              <motion.div
                key="type"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-xl shadow-lg"
              >
                <span className="text-white/90 font-semibold text-xs">Singles</span>
              </motion.div>
            ) : (
              <motion.div
                key="score"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-xl flex items-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span className="text-white font-bold text-sm">{video.aiScore}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-6 z-10">
          <p className="text-white/90 text-xs italic text-center line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
            "Great footwork! Focus on your net play for better results."
          </p>
          <button className="bg-kreeda-orange hover:bg-opacity-90 text-white rounded-xl px-8 py-3 shadow-lg font-semibold transform translate-y-8 group-hover:translate-y-0 transition-transform delay-150 duration-300">
            View Analysis
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const RecentVideos = ({ onUploadClick }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Orange-gradient Upload band */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-kreeda-orange/20 to-kreeda-orange/5 border border-kreeda-orange/30 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:shadow-2xl transition-all"
      >
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Upload New Video</h3>
            <p className="text-white/60 text-sm">Last analyzed: 1 day ago</p>
          </div>
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-2 bg-kreeda-orange hover:bg-opacity-90 text-white h-10 px-4 rounded-xl shadow-lg font-semibold"
          >
            <svg className="w-4 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553-1.276A1 1 0 0118 5.618v8.764a1 1 0 01-1.447.894L14 13.768V6.232l2.553-1.508z" clipRule="evenodd" />
            </svg>
            Upload
          </button>
        </div>
      </motion.div>

      {/* Recent Videos header + grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recent Videos</h2>
          <button className="text-white hover:text-kreeda-orange text-sm transition-colors px-3 py-1.5">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
          {MOCK_VIDEOS.slice(0, 4).map((video, index) => (
            <VideoTile
              key={video.id}
              video={video}
              index={index}
              onClick={() => navigate(`/analysis/${video.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentVideos;
