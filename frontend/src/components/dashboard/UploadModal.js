import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { addUploadedVideo } from '../../mocks/reviewStore';
import { VIDEO_THUMBNAILS } from '../../mocks/fixtures';

const VIDEO_TYPES = [
  { id: 'Match', label: 'Match', desc: 'Competitive gameplay footage', iconBg: 'from-yellow-500/20 to-yellow-500/10', iconColor: 'text-yellow-400', iconPath: 'M5 3v4M3 5h4M6 17v4m-2-2h4m6-16l2.5 5 5.5.5-4 3.5 1 5.5L12 13l-5 3 1-5.5L4 7l5.5-.5L12 1z' },
  { id: 'Practice', label: 'Practice', desc: 'Training session recordings', iconBg: 'from-blue-500/20 to-blue-500/10', iconColor: 'text-blue-400', iconPath: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222' },
];

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [videoType, setVideoType] = useState('Practice');
  const [gameType, setGameType] = useState('singles');
  const [cameraView, setCameraView] = useState('baseline');
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | processing | success
  const [progress, setProgress] = useState(0);

  // Fake progress ticker
  useEffect(() => {
    if (uploadState !== 'uploading' && uploadState !== 'processing') return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (uploadState === 'uploading' && p < 90) return p + 8;
        if (uploadState === 'processing' && p < 100) return p + 12;
        return p;
      });
    }, 200);
    return () => clearInterval(id);
  }, [uploadState]);

  // State transitions
  useEffect(() => {
    if (uploadState === 'uploading' && progress >= 90) {
      setUploadState('processing');
      setProgress(0);
    }
    if (uploadState === 'processing' && progress >= 100) {
      setUploadState('success');
      const newVideoId = `v-upload-${Date.now()}`;
      addUploadedVideo({
        id: newVideoId,
        title: pendingFile?.name?.replace(/\.[^.]+$/, '') || 'New Upload',
        thumbnail: VIDEO_THUMBNAILS.smash,
        uploadedAt: new Date().toISOString(),
        duration: 42,
        aiScore: 72,
        grade: 'B',
        status: 'analyzed',
      });
      setTimeout(() => {
        onUploadComplete?.({ videoId: newVideoId });
        handleClose();
        navigate(`/analysis/${newVideoId}`);
      }, 1200);
    }
  }, [uploadState, progress]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setPendingFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) setPendingFile(e.target.files[0]);
  };

  const startUpload = () => {
    setUploadState('uploading');
    setProgress(0);
  };

  const handleClose = () => {
    setPendingFile(null);
    setVideoType('Practice');
    setGameType('singles');
    setCameraView('baseline');
    setUploadState('idle');
    setProgress(0);
    setDragActive(false);
    onClose?.();
  };

  if (!isOpen) return null;

  const isDismissable = uploadState === 'idle';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={isDismissable ? handleClose : undefined}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1A1A1A] to-[#1A1A1A]/95 border border-white/20 rounded-3xl shadow-2xl pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-kreeda-orange/30 to-kreeda-orange/10 rounded-2xl flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553-1.276A1 1 0 0118 5.618v8.764a1 1 0 01-1.447.894L14 13.768V6.232l2.553-1.508z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Upload Video</h2>
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium">
                    4 / 5 free
                  </span>
                </div>
                <p className="text-sm text-white/60">Upload your training session for AI analysis</p>
              </div>
            </div>
            {isDismissable && (
              <button
                onClick={handleClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="p-5 md:p-8">
            {/* Idle + no file → drag/drop zone */}
            {uploadState === 'idle' && !pendingFile && (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 md:p-12 transition-all ${
                  dragActive
                    ? 'border-kreeda-orange bg-kreeda-orange/10'
                    : 'border-white/20 bg-white/5 hover:border-white/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/mov,video/avi"
                  onChange={handleChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-kreeda-orange/20 to-kreeda-orange/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-kreeda-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">Drag and drop your video here</p>
                    <p className="text-sm text-white/60 mb-4">or click to browse files</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-kreeda-orange hover:bg-opacity-90 text-white font-semibold rounded-xl shadow-lg transition-colors"
                  >
                    Browse Files
                  </button>
                  <div className="mt-4 text-xs text-white/50 space-y-0.5">
                    <p>Supported formats: MP4, MOV, AVI</p>
                    <p>Maximum file size: 100MB</p>
                    <p>Max duration: 90 seconds (45 sec on free plan)</p>
                  </div>
                </div>
              </div>
            )}

            {/* File picked → config step */}
            {uploadState === 'idle' && pendingFile && (
              <div className="flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-kreeda-orange/20 to-kreeda-orange/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-kreeda-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm14.553-1.276A1 1 0 0118 5.618v8.764a1 1 0 01-1.447.894L14 13.768V6.232l2.553-1.508z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{pendingFile.name}</p>
                    <p className="text-sm text-white/50">{(pendingFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                  <button
                    onClick={() => setPendingFile(null)}
                    className="text-white/50 hover:text-white text-sm underline"
                  >
                    Change
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex-1 min-w-[140px]">
                    <h3 className="text-white font-semibold text-sm mb-2">Game Type</h3>
                    <div className="flex gap-2">
                      {[
                        { value: 'singles', label: 'Singles', enabled: true },
                        { value: 'doubles', label: 'Doubles', enabled: false },
                      ].map(({ value, label, enabled }) => (
                        <button
                          key={value}
                          onClick={() => enabled && setGameType(value)}
                          disabled={!enabled}
                          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            gameType === value
                              ? 'border-kreeda-orange bg-kreeda-orange/10 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                          } ${!enabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {label}
                          {!enabled && <span className="text-[10px] text-white/40 ml-1">Soon</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <h3 className="text-white font-semibold text-sm mb-2">Camera View</h3>
                    <div className="flex gap-2">
                      {[
                        { value: 'front_net', label: 'Front (Net)' },
                        { value: 'baseline', label: 'Baseline' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setCameraView(value)}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                            cameraView === value
                              ? 'border-kreeda-orange bg-kreeda-orange/10 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3">Select Video Type</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {VIDEO_TYPES.map((type) => {
                      const selected = videoType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setVideoType(type.id)}
                          className={`relative p-3 md:p-4 rounded-xl border-2 transition-all ${
                            selected ? 'border-kreeda-orange bg-kreeda-orange/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          {selected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-kreeda-orange rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${type.iconBg} rounded-lg flex items-center justify-center mb-2 mx-auto`}>
                            <svg className={`w-5 h-5 ${type.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={type.iconPath} />
                            </svg>
                          </div>
                          <p className="text-white font-medium text-sm">{type.label}</p>
                          <p className="text-white/50 text-xs mt-1">{type.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={startUpload}
                  className="w-full py-4 bg-kreeda-orange hover:bg-opacity-90 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Start Upload
                </button>
              </div>
            )}

            {/* Uploading */}
            {uploadState === 'uploading' && (
              <div className="flex flex-col items-center gap-6 py-4 md:py-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white">Uploading to server...</span>
                    <span className="text-sm font-medium text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    />
                  </div>
                </div>
                <p className="text-sm text-white/60">
                  {progress < 50 ? 'Uploading your video to the server...' : progress < 90 ? 'Almost there, please wait...' : 'Finalizing upload...'}
                </p>
              </div>
            )}

            {/* Processing */}
            {uploadState === 'processing' && (
              <div className="flex flex-col items-center gap-6 py-4 md:py-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-kreeda-orange/20 to-kreeda-orange/10 rounded-2xl flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-kreeda-orange border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Processing Video</h3>
                  <p className="text-sm text-white/60">Generating thumbnail and preparing your video...</p>
                </div>
                <div className="w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-white">Finalizing...</span>
                    <span className="text-sm font-medium text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                      className="h-full bg-gradient-to-r from-kreeda-orange to-yellow-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Success */}
            {uploadState === 'success' && (
              <div className="flex flex-col items-center gap-6 py-4 md:py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center"
                >
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Upload Successful!</h3>
                  <p className="text-sm text-white/60">Your video has been uploaded and analyzed successfully.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UploadModal;
