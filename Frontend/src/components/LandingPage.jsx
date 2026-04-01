import { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Premium cinematic landing intro for Grocerio.
 * @param {Object} props
 * @param {Function} props.onComplete - Called when animation finishes to show the main app.
 */
const LandingIntro = ({ onComplete }) => {
  // Disable scrolling while intro is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Total duration of the intro (milliseconds)
  const totalDuration = 3200;

  // Automatically call onComplete after the animation ends
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, totalDuration);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Floating elements animation (continuous)
  const floatAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700"
        animate={{
          background: [
            'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #f97316 100%)',
            'linear-gradient(135deg, #065f46 0%, #34d399 50%, #fb923c 100%)',
            'linear-gradient(135deg, #047857 0%, #10b981 50%, #f97316 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Curtain layers (top and bottom) */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-900 to-gray-800 z-10"
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} // custom easing for smoothness
      />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-900 to-gray-800 z-10"
        initial={{ y: 0 }}
        animate={{ y: '100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Floating grocery elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-7xl opacity-30"
        animate={floatAnimation}
      >
        🥑
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/4 text-7xl opacity-30"
        animate={{
          ...floatAnimation,
          transition: { ...floatAnimation.transition, delay: 1 },
        }}
      >
        🍅
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/3 text-7xl opacity-20"
        animate={{
          ...floatAnimation,
          transition: { ...floatAnimation.transition, delay: 2 },
        }}
      >
        🥕
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/3 text-7xl opacity-20"
        animate={{
          ...floatAnimation,
          transition: { ...floatAnimation.transition, delay: 1.5 },
        }}
      >
        🫑
      </motion.div>

      {/* Central content */}
      <div className="relative z-20 text-center text-white px-4">
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-4 tracking-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
        >
          Grocerio
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          Fresh Groceries Delivered to Your Doorstep
        </motion.p>
      </div>

      {/* Subtle radial overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default LandingIntro;