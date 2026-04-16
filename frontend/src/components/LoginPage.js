import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleEnterArena = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark Theme with Gradient */}
      <div className="w-full lg:w-1/2 relative flex flex-col justify-center items-center p-8 lg:p-16 overflow-hidden">
        {/* Subtle gradient background for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-kreeda-charcoal via-kreeda-charcoal to-kreeda-green opacity-90"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Logo - Larger size (increased by 20%) */}
          <div className="flex justify-center mb-4">
            <img 
              src="https://customer-assets.emergentagent.com/job_performance-insights-15/artifacts/08oq0dtt_LogoForVC.png" 
              alt="Kreeda Logo" 
              className="h-[132px] w-auto"
              data-testid="kreeda-logo"
              style={{ marginBottom: '16px' }}
            />
          </div>

          {/* Heading with Animated Text - Center Aligned */}
          <div className="text-center" style={{ marginBottom: '12px' }}>
            <h1 className="text-white text-3xl lg:text-4xl font-bold leading-tight whitespace-nowrap mb-6">
              Turn every match into
            </h1>
            
            {/* Rotating Phrases - Center Aligned - Uniform Color */}
            <div className="rotating-text-container flex justify-center">
              <h2 
                className="rotating-text text-kreeda-orange text-3xl lg:text-4xl font-bold"
                data-testid="rotating-phrase-1"
              >
                Smarter Training
              </h2>
              <h2 
                className="rotating-text text-kreeda-orange text-3xl lg:text-4xl font-bold"
                data-testid="rotating-phrase-2"
              >
                Real Progress
              </h2>
              <h2 
                className="rotating-text text-kreeda-orange text-3xl lg:text-4xl font-bold"
                data-testid="rotating-phrase-3"
              >
                Instant Insights
              </h2>
            </div>
          </div>

          {/* Subtitle - Updated with better contrast */}
          <p 
            className="text-gray-300 text-lg text-center font-medium"
            style={{ marginBottom: '32px' }}
          >
            Your AI Badminton Coach — right on your phone
          </p>

          {/* Enter Arena Button - Smaller, more compact */}
          <div className="flex justify-center">
            <button
              onClick={handleEnterArena}
              className="bg-kreeda-orange text-white font-bold text-base py-3 px-8 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                boxShadow: '0 8px 32px rgba(244, 88, 49, 0.4)',
                marginBottom: '8px'
              }}
              data-testid="enter-arena-button"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Enter the Arena</span>
            </button>
          </div>

          {/* Microcopy below CTA */}
          <p 
            className="text-gray-400 text-sm text-center"
            style={{ marginBottom: '24px' }}
          >
            Start analyzing your first match in seconds
          </p>

          {/* Footer Text */}
          <p className="text-gray-500 text-xs text-center">
            By continuing, you agree to Kreeda's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Right Side - Video Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="background-video"
        >
          <source 
            src="https://customer-assets.emergentagent.com/job_performance-insights-15/artifacts/y13fqkye_LoadingShuttle-MT5ZETEs.webm" 
            type="video/webm" 
          />
        </video>
        {/* Overlay gradient for depth */}
        <div className="video-overlay absolute inset-0" />
      </div>
    </div>
  );
};

export default LoginPage;