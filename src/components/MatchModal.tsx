'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Profile } from '@/lib/types';

interface MatchModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MatchModal({ profile, isOpen, onClose }: MatchModalProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!profile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-6 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm flex flex-col items-center text-center"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[11px] font-extrabold tracking-wider uppercase mb-3 leading-none whitespace-nowrap"
            >
              Mutual Connection
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl sm:text-5xl font-black italic tracking-tight bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 bg-clip-text text-transparent drop-shadow-lg mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              It&apos;s a Match!
            </motion.h2>

            <motion.p
              className="text-white/80 text-xs sm:text-sm font-medium mb-6 max-w-xs leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You and <span className="text-white font-bold">{profile.name}</span> secretly liked each other.
            </motion.p>

            {/* Overlapping Avatars */}
            <motion.div
              className="relative flex items-center justify-center mb-8 w-full"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring' }}
            >
              {/* User Avatar (Left) */}
              <div className="relative -mr-3 w-22 h-22 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-rose-100 z-10 transform -rotate-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                  alt="You"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Matched Profile Avatar (Right) */}
              <div className="relative -ml-3 w-22 h-22 sm:w-24 sm:h-24 rounded-full border-4 border-rose-500 shadow-2xl overflow-hidden bg-gray-900 z-10 transform rotate-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Center Floating Heart */}
              <div className="absolute z-20 w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 border-2 border-white flex items-center justify-center shadow-xl animate-bounce">
                <span className="text-lg">💖</span>
              </div>
            </motion.div>

            {/* Action Buttons - flex-col with gap-3 (guaranteed clean separation) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="w-full flex flex-col gap-3"
            >
              <button
                onClick={() => {
                  onClose();
                  router.push('/matches');
                }}
                className="w-full h-12 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-500/30 hover:brightness-110 active:scale-95 transition-all inline-flex items-center justify-center whitespace-nowrap"
              >
                View in Matches 💕
              </button>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs backdrop-blur-md active:scale-95 transition-all inline-flex items-center justify-center whitespace-nowrap"
              >
                Keep Swiping
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
