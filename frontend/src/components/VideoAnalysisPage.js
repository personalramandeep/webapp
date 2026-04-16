import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SkillRadarChart from './analysis/SkillRadarChart';
import CourtHeatmap from './analysis/CourtHeatmap';
import KeyMoments from './analysis/KeyMoments';
import AIPerformanceScore from './analysis/AIPerformanceScore';
import AICoachCard from './analysis/AICoachCard';
import CoachReviews from './analysis/CoachReviews';
import RecommendedContent from './analysis/RecommendedContent';

const VideoAnalysisPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data - In production, this would come from API
  const videoData = {
    title: 'Singles Match - Court 2',
    duration: '18:32',
    currentTime: '0:00',
    keyMoments: 8,
    aiScore: 92,
    grade: 'A',
    thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&h=675&fit=crop'
  };

  const skillsData = {
    footwork: 88,
    smash: 92,
    defense: 85,
    netPlay: 78,
    endurance: 90
  };

  const heatmapData = [
    { x: 30, y: 25, intensity: 0.9 },
    { x: 50, y: 40, intensity: 0.7 },
    { x: 70, y: 30, intensity: 0.85 },
    { x: 45, y: 60, intensity: 0.6 },
    { x: 55, y: 75, intensity: 0.8 },
    { x: 35, y: 50, intensity: 0.65 },
    { x: 65, y: 55, intensity: 0.75 },
  ];

  const keyMomentsData = [
    { 
      id: 1, 
      time: '2:43', 
      title: 'Perfect Smash', 
      category: 'strength', 
      description: 'Powerful downward smash with excellent timing',
      thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=300&h=200&fit=crop' 
    },
    { 
      id: 2, 
      time: '5:12', 
      title: 'Quick Recovery', 
      category: 'strength', 
      description: 'Exceptional footwork returning to center court',
      thumbnail: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=300&h=200&fit=crop' 
    },
    { 
      id: 3, 
      time: '8:34', 
      title: 'Net Position', 
      category: 'weakness', 
      description: 'Slow reaction at net, needs improvement',
      thumbnail: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=300&h=200&fit=crop' 
    },
    { 
      id: 4, 
      time: '12:18', 
      title: 'Rally Winner', 
      category: 'highlight', 
      description: 'Extended rally won with strategic placement',
      thumbnail: 'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=300&h=200&fit=crop' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#1A1A1A] border-b border-gray-800 px-6 py-4">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">
                Dashboard
              </button>
              <span>›</span>
              <button className="hover:text-white transition-colors">My Videos</button>
              <span>›</span>
              <span className="text-kreeda-orange">{videoData.title}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-white border-opacity-5 rounded-lg hover:border-opacity-10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-white border-opacity-5 rounded-lg hover:border-opacity-10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
            </div>
          </div>

          {/* Page Title */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{videoData.title}</h1>
            <button className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#2a2a2a] border border-white border-opacity-5 rounded-xl overflow-hidden"
            >
              {/* Video Player */}
              <div className="relative aspect-video bg-gray-900">
                <img 
                  src={videoData.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                
                {/* Play Button Overlay */}
                {!isPlaying && (
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-20 h-20 bg-kreeda-orange rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </button>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center gap-4">
                    <button className="text-white hover:text-kreeda-orange transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </button>
                    <span className="text-white text-sm">{videoData.currentTime} / {videoData.duration}</span>
                    <div className="flex-1 h-1 bg-gray-700 rounded-full">
                      <div className="h-full w-0 bg-kreeda-orange rounded-full"></div>
                    </div>
                    <button className="text-white hover:text-kreeda-orange transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="px-3 py-1 bg-[#2a2a2a] rounded-full text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-kreeda-orange rounded-full"></span>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      {videoData.keyMoments} key moments
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Chips */}
              <div className="p-4 border-t border-white border-opacity-5">
                <div className="flex items-center gap-3 mb-2">
                  <button className="px-3 py-1.5 bg-green-500 bg-opacity-10 text-green-400 rounded-full text-sm flex items-center gap-2 hover:bg-opacity-20 transition-colors">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Strengths
                  </button>
                  <button className="px-3 py-1.5 bg-red-500 bg-opacity-10 text-red-400 rounded-full text-sm flex items-center gap-2 hover:bg-opacity-20 transition-colors">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Weaknesses
                  </button>
                  <button className="px-3 py-1.5 bg-kreeda-orange bg-opacity-10 text-kreeda-orange rounded-full text-sm flex items-center gap-2 hover:bg-opacity-20 transition-colors">
                    <span className="w-2 h-2 bg-kreeda-orange rounded-full"></span>
                    Highlights
                  </button>
                </div>
                <p className="text-gray-500 text-xs">Track how this match impacted your overall performance →</p>
              </div>
            </motion.div>

            {/* Skill Breakdown & Court Coverage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillRadarChart skills={skillsData} />
              <CourtHeatmap heatmapData={heatmapData} />
            </div>

            {/* Key Moments */}
            <KeyMoments moments={keyMomentsData} />
          </div>

          {/* Right Column (1/3) - Sticky */}
          <div className="lg:col-span-1 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <AIPerformanceScore score={videoData.aiScore} grade={videoData.grade} />
              <AICoachCard />
              <CoachReviews />
              <RecommendedContent />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-kreeda-orange rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
};

export default VideoAnalysisPage;
