import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0,0);
  }, [])

  const handleGoBack = () => {
    // Go back to the previous page if possible, otherwise go to home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated floating grocery icons */}
      <div className="absolute top-10 left-5 text-6xl animate-float-slow opacity-30">
        🥑
      </div>
      <div className="absolute bottom-10 right-5 text-7xl animate-float opacity-40">
        🥕
      </div>
      <div className="absolute top-1/3 right-1/4 text-5xl animate-float-medium opacity-30">
        🍅
      </div>
      <div className="absolute bottom-1/4 left-10 text-6xl animate-float-slow opacity-20">
        🫑
      </div>
      <div className="absolute top-2/3 left-1/3 text-5xl animate-float-medium opacity-25">
        🍎
      </div>
      <div className="absolute top-10 right-10 text-5xl animate-float opacity-30">
        🧀
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md mx-auto animate-fadeInUp">
        <div className="mb-8 relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 blur-3xl rounded-full"></div>
          <h1 className="text-9xl md:text-9xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent relative z-10">
            404
          </h1>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 text-lg mb-8">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>

        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;