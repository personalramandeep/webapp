import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate processing (React StrictMode safe)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const sessionId = params.get('session_id');

        if (!sessionId) {
          throw new Error('No session_id found in URL');
        }

        // Get backend URL from environment
        const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;

        // Exchange session_id for user data and set cookie
        const response = await fetch(`${backendUrl}/api/auth/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important: include cookies
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }

        const userData = await response.json();

        // Redirect to dashboard with user data
        navigate('/dashboard', { 
          replace: true,
          state: { user: userData }
        });

      } catch (error) {
        console.error('Auth error:', error);
        // Redirect back to login on error
        navigate('/', { replace: true });
      }
    };

    processSession();
  }, [navigate, location]);

  // Show loading state while processing
  return (
    <div className="min-h-screen bg-kreeda-charcoal flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kreeda-orange mx-auto"></div>
        <p className="text-white text-lg">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;