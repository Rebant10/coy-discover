'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface EmptyStateProps {
  onReset?: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-6 text-center select-none"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Radar pulse effect */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-24 h-24 rounded-full bg-rose-500/10 animate-ping" />
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-4xl shadow-xl shadow-rose-500/30 text-white">
          ✨
        </div>
      </div>

      <h2 className="text-2xl font-black text-gray-900 mb-2">
        You&apos;ve seen everyone nearby!
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
        You&apos;ve swiped through all available profiles. Check out your matches or restart the demo feed.
      </p>

      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        <Link
          href="/matches"
          className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 active:scale-95 transition-all text-center"
        >
          View Mutual Matches 💕
        </Link>

        {onReset && (
          <button
            onClick={onReset}
            className="w-full py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 active:scale-95 transition-all"
          >
            🔄 Reset Swipes (Demo)
          </button>
        )}
      </div>
    </motion.div>
  );
}
