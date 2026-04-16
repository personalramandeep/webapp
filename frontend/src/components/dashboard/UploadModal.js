import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [gameType, setGameType] = useState('singles');
  const [cameraView, setCameraView] = useState('baseline');
  const [videoType, setVideoType] = useState('match');
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, success, error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file
      if (!['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(file.type)) {
        setError('Please select a valid video file (MP4, MOV, AVI)');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        setError('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 10) / 10 + ' ' + sizes[i];
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setProgress(0);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Simulate upload completion
      setTimeout(() => {
        clearInterval(interval);
        setUploadState('success');
        const videoId = `video-${Date.now()}`;
        const videoData = {
          id: videoId,
          title: selectedFile.name.replace(/\.[^/.]+$/, ''),
          thumbnail: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop',
          videoUrl: URL.createObjectURL(selectedFile),
          aiScore: Math.floor(Math.random() * 30) + 70,
          videoType: videoType === 'match' ? 'Match' : 'Practice',
          aiFeedback: 'Great footwork and positioning!',
          uploadDate: new Date().toISOString(),
          gameType,
          cameraView
        };
        
        setTimeout(() => {
          if (onUploadComplete) {
            onUploadComplete(videoData);
          }
          handleClose();
          // Navigate to analysis page
          navigate(`/analysis/${videoId}`);
        }, 1000);
      }, 3000);

    } catch (err) {
      setUploadState('error');
      setError(err.message || 'Upload failed. Please try again.');
    }
  };

  const handleClose = () => {
    if (uploadState === 'uploading' || uploadState === 'processing') return;
    setSelectedFile(null);
    setGameType('singles');
    setCameraView('baseline');
    setVideoType('match');
    setUploadState('idle');
    setProgress(0);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" data-testid="upload-modal">
      <div className="bg-[#2A2724] rounded-2xl max-w-3xl w-full mx-4 border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-kreeda-orange bg-opacity-20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upload Video</h2>
              <p className="text-gray-400 text-sm">Upload your training session for AI analysis</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-colors"
            disabled={uploadState === 'uploading' || uploadState === 'processing'}
            data-testid="modal-close-button"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload State Views */}
          {uploadState === 'idle' && (
            <>
              {/* File Selection */}
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-kreeda-orange transition-colors cursor-pointer bg-gray-800 bg-opacity-30">
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo"
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                    data-testid="file-input"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-kreeda-orange bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">Choose a video file</p>
                    <p className="text-gray-400 text-sm">MP4, MOV, AVI (max 100MB)</p>
                  </label>
                </div>
              ) : (
                <>
                  {/* Selected File Display */}
                  <div className="bg-gray-800 bg-opacity-50 rounded-xl p-4 flex items-center justify-between border border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-kreeda-orange bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-kreeda-orange transition-colors px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Change
                    </button>
                  </div>

                  {/* Game Type Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-white font-semibold">Game Type</label>
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center cursor-help" title="Select your game format">
                        <span className="text-gray-400 text-xs">i</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setGameType('singles')}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                          gameType === 'singles'
                            ? 'border-kreeda-orange bg-kreeda-orange bg-opacity-10 text-white'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="font-semibold">Singles</span>
                      </button>
                      <button
                        disabled
                        className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-700 text-gray-600 cursor-not-allowed relative"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          Doubles
                        </span>
                        <span className="absolute -top-2 -right-2 bg-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-400">Soon</span>
                      </button>
                    </div>
                  </div>

                  {/* Camera View Selection */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-white font-semibold">Camera View</label>
                      <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center cursor-help" title="Select your camera angle">
                        <span className="text-gray-400 text-xs">i</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCameraView('baseline')}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                          cameraView === 'baseline'
                            ? 'border-kreeda-orange bg-kreeda-orange bg-opacity-10 text-white'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="font-semibold">Baseline</span>
                      </button>
                      <button
                        onClick={() => setCameraView('front')}
                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                          cameraView === 'front'
                            ? 'border-kreeda-orange bg-kreeda-orange bg-opacity-10 text-white'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="font-semibold">Front (Net)</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Type Selection */}
                  <div>
                    <label className="text-white font-semibold block mb-3">Select Video Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setVideoType('match')}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                          videoType === 'match'
                            ? 'border-kreeda-orange bg-kreeda-orange bg-opacity-10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800 bg-opacity-30'
                        }`}
                      >
                        {videoType === 'match' && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-kreeda-orange rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-3xl">🏆</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Match</h3>
                        <p className="text-gray-400 text-sm">Competitive gameplay footage</p>
                      </button>

                      <button
                        onClick={() => setVideoType('practice')}
                        className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                          videoType === 'practice'
                            ? 'border-kreeda-orange bg-kreeda-orange bg-opacity-10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800 bg-opacity-30'
                        }`}
                      >
                        {videoType === 'practice' && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-kreeda-orange rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-3xl">🎓</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Practice</h3>
                        <p className="text-gray-400 text-sm">Training session recordings</p>
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Start Upload Button */}
                  <button
                    onClick={handleStartUpload}
                    className="w-full bg-kreeda-orange hover:bg-opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    data-testid="upload-submit-button"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Start Upload</span>
                  </button>
                </>
              )}
            </>
          )}

          {/* Uploading State */}
          {uploadState === 'uploading' && (
            <div className="py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-kreeda-orange bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-kreeda-orange animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  {progress < 50 ? 'Uploading your video...' : progress < 90 ? 'Almost there, please wait...' : 'Finalizing upload...'}
                </h3>
                <p className="text-gray-400">{progress}% complete</p>
              </div>
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-kreeda-orange h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Processing State */}
          {uploadState === 'processing' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-kreeda-orange bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-kreeda-orange border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Processing your video...</h3>
              <p className="text-gray-400">Our AI is analyzing your gameplay</p>
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden mt-4">
                <div className="bg-kreeda-orange h-full animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadState === 'success' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Upload Successful!</h3>
              <p className="text-gray-400">Your video has been uploaded and is being processed</p>
            </div>
          )}

          {/* Error State */}
          {uploadState === 'error' && (
            <div className="py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Upload Failed</h3>
                <p className="text-gray-400">{error || 'Something went wrong. Please try again.'}</p>
              </div>
              <button
                onClick={() => {
                  setUploadState('idle');
                  setProgress(0);
                  setError(null);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
