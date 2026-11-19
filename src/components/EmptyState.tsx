'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  onReset?: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-6xl mb-4">✨</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        You&apos;ve seen everyone!
      </h2>
      <p className="text-gray-500 max-w-xs mb-6">
        You&apos;ve swiped through all available profiles. Check back later for new people to discover.
      </p>
      <div className="p-4 bg-rose-50 rounded-2xl mb-4">
        <p className="text-sm text-rose-600 font-medium">
          💡 Check your Matches tab to see who you&apos;ve connected with!
        </p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-medium text-sm hover:from-rose-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          🔄 Reset &amp; Start Over
        </button>
      )}
    </motion.div>
  );
}
