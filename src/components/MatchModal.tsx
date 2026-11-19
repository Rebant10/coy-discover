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

  // Handle escape key
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-xs sm:max-w-sm w-full text-center shadow-2xl max-h-[90dvh] overflow-y-auto select-none"
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Celebration emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.25, 1] }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-5xl sm:text-6xl mb-2"
            >
              💕
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent mb-1"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              It&apos;s a Match!
            </motion.h2>

            <motion.p
              className="text-xs sm:text-sm text-gray-500 mb-5"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              You and <span className="font-bold text-gray-800">{profile.name}</span> liked each other!
            </motion.p>

            {/* Profile Avatar with glow effect */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-rose-300 shadow-xl bg-rose-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                  <span className="text-base sm:text-lg">✨</span>
                </div>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="space-y-2.5"
            >
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-bold text-sm sm:text-base hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/25 active:scale-95"
              >
                Keep Swiping
              </button>
              <button
                onClick={() => {
                  onClose();
                  router.push('/matches');
                }}
                className="w-full py-2.5 bg-rose-50/70 text-rose-600 rounded-full font-bold text-sm sm:text-base border border-rose-200 hover:bg-rose-100/70 transition-all active:scale-95"
              >
                View Matches
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
