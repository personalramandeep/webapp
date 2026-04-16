import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentVideos = ({ onUploadClick }) => {
  const navigate = useNavigate();

  // Mock video data
  const videos = [
    {
      id: 'video-1',
      thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop',
      title: 'Singles Match - Court 2',
      date: '2 days ago',
      duration: '45:32',
      analyzed: true,
      score: 85
    },
    {
      id: 'video-2',
      thumbnail: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=400&h=300&fit=crop',
      title: 'Practice Session',
      date: '3 days ago',
      duration: '32:15',
      analyzed: true,
      score: 78
    },
    {
      id: 'video-3',
      thumbnail: 'https://images.unsplash.com/photo-1594623930572-300a3011d9ae?w=400&h=300&fit=crop',
      title: 'Tournament - Finals',
      date: '1 week ago',
      duration: '58:20',
      analyzed: true,
      score: 92
    },
  ];

  const handleVideoClick = (videoId) => {
    navigate(`/analysis/${videoId}`);
  };

  return (
    <div className="space-y-6" data-testid="recent-videos-section">
      {/* Upload Card */}
      <div className="bg-gradient-to-r from-orange-900 to-red-900 bg-opacity-50 rounded-2xl p-6 border border-orange-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-kreeda-orange rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Upload New Video</h3>
              <p className="text-orange-200 text-sm">Last analyzed: 1 day ago</p>
            </div>
          </div>
          <button
            onClick={onUploadClick}
            className="bg-kreeda-orange hover:bg-opacity-90 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            data-testid="upload-video-button"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload
          </button>
        </div>
      </div>

      {/* Recent Videos Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-xl">Recent Videos</h3>
          <button className="text-kreeda-orange hover:text-orange-400 text-sm font-semibold transition-colors">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video.id)}
              className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all cursor-pointer hover:scale-105"
              data-testid={`video-card-${video.id}`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-lg font-semibold">
                  {video.duration}
                </div>
                {/* AI Score Badge */}
                {video.analyzed && (
                  <div className="absolute top-3 right-3 bg-kreeda-orange text-white text-sm px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {video.score}
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                    <button className="bg-kreeda-orange text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-xl">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      View Analysis
                    </button>
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <h4 className="text-white font-semibold mb-1 truncate">{video.title}</h4>
                <p className="text-gray-400 text-sm">{video.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentVideos;
