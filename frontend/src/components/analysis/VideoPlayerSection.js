import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const MOMENT_COLORS = {
  strength: 'bg-green-500',
  weakness: 'bg-red-500',
  highlight: 'bg-yellow-400',
};

const VideoPlayerSection = ({ videoUrl, thumbnail, duration: propsDuration = 0, keyMoments = [], title, aiScore }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(propsDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (propsDuration && propsDuration > 0) setDuration(propsDuration);
  }, [propsDuration]);

  const handlePlayPause = () => {
    if (videoUrl && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedData = () => {
    if (videoRef.current && videoRef.current.duration !== Infinity && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = pct * duration;
    if (videoUrl && videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const handleMomentClick = (moment, e) => {
    e.stopPropagation();
    if (videoUrl && videoRef.current) videoRef.current.currentTime = moment.timestamp;
    setCurrentTime(moment.timestamp);
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-[#2a2a2a] border border-white/5 rounded-xl sm:rounded-2xl overflow-hidden"
      data-testid="video-player-section"
    >
      <div className="relative aspect-video bg-gray-900">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnail}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedData}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />
        ) : (
          <img src={thumbnail} alt={title || 'Video'} className="w-full h-full object-cover" />
        )}

        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center group"
            data-testid="video-play-button"
          >
            <div className="w-20 h-20 bg-kreeda-orange rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </button>
        )}

        {aiScore !== undefined && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-kreeda-orange font-bold text-sm">AI Score: </span>
            <span className="text-white font-bold text-sm">{aiScore}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8">
          <div
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-2 group"
            onClick={handleTimelineClick}
          >
            <div
              className="absolute inset-y-0 left-0 bg-kreeda-orange rounded-full"
              style={{ width: `${progressPct}%` }}
            />

            {keyMoments.map((moment, i) => {
              const pct = duration > 0 ? (moment.timestamp / duration) * 100 : 0;
              const color = MOMENT_COLORS[moment.type] || 'bg-white';
              return (
                <button
                  key={i}
                  onClick={(e) => handleMomentClick(moment, e)}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 ${color} rounded-full border border-black/40 hover:scale-150 transition-transform`}
                  style={{ left: `${pct}%` }}
                  title={`${moment.title} (${formatTime(moment.timestamp)})`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-kreeda-orange transition-colors"
              data-testid="video-playpause-button"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75V3.75A.75.75 0 008.25 3h-2.5zm6 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h2.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-2.5z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>
            <span className="text-white text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex-1" />
            {keyMoments.length > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 rounded-full border border-white/10">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <span className="text-white text-[10px] font-medium">
                  {keyMoments.length} key moment{keyMoments.length === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs flex items-center gap-1.5 hover:bg-green-500/20 transition-colors">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Strengths
          </button>
          <button className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-xs flex items-center gap-1.5 hover:bg-red-500/20 transition-colors">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            Weaknesses
          </button>
          <button className="px-3 py-1.5 bg-kreeda-orange/10 text-kreeda-orange rounded-full text-xs flex items-center gap-1.5 hover:bg-kreeda-orange/20 transition-colors">
            <span className="w-1.5 h-1.5 bg-kreeda-orange rounded-full" />
            Highlights
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayerSection;
