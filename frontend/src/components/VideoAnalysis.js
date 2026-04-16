import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoAnalysisPage from './VideoAnalysisPage';
import { motion } from 'framer-motion';

const VideoAnalysis = () => {
  const { videoId } = useParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 0, label: 'Uploading video to secure storage', duration: 1500 },
    { id: 1, label: 'Detecting player pose (MediaPipe)', duration: 1800 },
    { id: 2, label: 'Classifying shot types (Smash, Clear, Drop, Net Kill, Drive)', duration: 2000 },
    { id: 3, label: 'Mapping court coverage', duration: 1500 },
    { id: 4, label: 'Generating performance score & insights', duration: 1200 },
  ];

  useEffect(() => {
    // Animate progress from 0 to 100% over 8 seconds
    const totalDuration = 8000;
    const intervalTime = 50;
    const increment = 100 / (totalDuration / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    // Animate steps sequentially
    let cumulativeTime = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index + 1);
      }, cumulativeTime);
      cumulativeTime += step.duration;
    });

    // Show analysis page after processing
    const totalTime = steps.reduce((sum, step) => sum + step.duration, 0);
    setTimeout(() => {
      setIsProcessing(false);
    }, totalTime + 500);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  // Show processing screen
  if (isProcessing) {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          {/* Circular Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg width="220" height="220" className="transform -rotate-90">
                <circle cx="110" cy="110" r={radius} stroke="#333" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="110" cy="110" r={radius} stroke="#F45831" strokeWidth="8" fill="none"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-5xl mb-2"
                >
                  🏸
                </motion.div>
                <motion.div className="text-white text-3xl font-bold">
                  {Math.round(progress)}%
                </motion.div>
              </div>
            </div>
          </div>

          <motion.h1 className="text-white text-3xl font-bold mb-3">
            Analyzing your video...
          </motion.h1>
          <motion.p className="text-gray-400 text-lg mb-10">
            Our AI is detecting your shots, footwork, and court coverage
          </motion.p>

          {/* Steps */}
          <div className="bg-[#2A2724] rounded-2xl p-8 mb-8 border border-gray-800 max-w-lg mx-auto">
            <div className="space-y-4 text-left">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isActive = index === currentStep - 1;

                return (
                  <motion.div key={step.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-6 h-6 rounded-full bg-kreeda-orange flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 rounded-full border-3 border-kreeda-orange border-t-transparent"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed transition-colors ${isCompleted || isActive ? 'text-white font-medium' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.p className="text-gray-500 text-sm">
            This usually takes under 2 minutes. You'll be notified when ready.
          </motion.p>
        </div>
      </div>
    );
  }

  // Show analysis results page
  return <VideoAnalysisPage />;
};

export default VideoAnalysis;
