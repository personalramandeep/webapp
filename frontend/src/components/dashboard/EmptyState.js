import React from 'react';

const EmptyState = ({ onUploadClick }) => {
  return (
    <div className="space-y-6" data-testid="empty-state">
      <div>
        <h2 className="text-white text-2xl font-bold mb-2">Getting Started</h2>
        <p className="text-gray-400">We've listed a couple of steps to help you get set up on Kreeda.</p>
      </div>

      {/* Step 1: Upload Video */}
      <div className="bg-gradient-to-br from-kreeda-orange to-red-600 bg-opacity-10 rounded-lg p-8 border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-kreeda-orange bg-opacity-20 p-8 rounded-full">
            <span className="text-6xl">🎥</span>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-kreeda-orange rounded-full flex items-center justify-center text-white font-bold">
            1
          </div>
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold mb-2">Upload your first video</h3>
            <p className="text-gray-400 mb-4">
              Set up your device and seamlessly upload your match clips right to Kreeda. 
              No device? No problem - record and upload anytime, anywhere with our mobile app.
            </p>
            <button
              onClick={onUploadClick}
              className="bg-kreeda-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              data-testid="empty-state-upload-button"
            >
              Upload Video
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Find Friends */}
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            2
          </div>
          <div className="flex-1">
            <h3 className="text-white text-xl font-bold mb-2">See what your friends are doing</h3>
            <p className="text-gray-400 mb-4">
              Find your friends on Kreeda or invite them to join you. Cheer them on, 
              discover new workouts and start training with the athletes you already know.
            </p>
            <button
              className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              data-testid="find-friends-button"
            >
              Find Friends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;