'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import ProfileCard from './ProfileCard';
import { Profile } from '@/lib/types';

interface SwipeableCardProps {
  profile: Profile;
  onSwipe: (profileId: number, action: 'like' | 'pass') => void;
  isTop: boolean;
  externalTrigger?: 'like' | 'pass' | null;
}

export default function SwipeableCard({
  profile,
  onSwipe,
  isTop,
  externalTrigger,
}: SwipeableCardProps) {
  const [exitX, setExitX] = useState<number>(0);
  const [swiping, setSwiping] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 0, 240], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [15, 90], [0, 1]);
  const passOpacity = useTransform(x, [-15, -90], [0, 1]);

  useEffect(() => {
    if (externalTrigger && isTop && !swiping) {
      const dir = externalTrigger === 'like' ? 600 : -600;
      setExitX(dir);
      setSwiping(true);
      onSwipe(profile.id, externalTrigger);
    }
  }, [externalTrigger, isTop, onSwipe, profile.id, swiping]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetThreshold = 80;
    const velocityThreshold = 350;

    if (info.offset.x > offsetThreshold || info.velocity.x > velocityThreshold) {
      setExitX(600);
      setSwiping(true);
      onSwipe(profile.id, 'like');
    } else if (info.offset.x < -offsetThreshold || info.velocity.x < -velocityThreshold) {
      setExitX(-600);
      setSwiping(true);
      onSwipe(profile.id, 'pass');
    }
  };

  // Background stacked card
  if (!isTop) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 pointer-events-none">
        <div className="w-full h-full max-h-[560px] rounded-[28px] transform scale-[0.95] translate-y-3 opacity-60 transition-all duration-300">
          <ProfileCard profile={profile} />
        </div>
      </div>
    );
  }

  // Active top card
  return (
    <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 z-10">
      <motion.div
        className="w-full h-full max-h-[560px] relative cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={
          swiping
            ? {
                x: exitX,
                opacity: 0,
                rotate: exitX > 0 ? 18 : -18,
                transition: { duration: 0.28, ease: 'easeOut' },
              }
            : { x: 0, opacity: 1 }
        }
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      >
        {/* LIKE Stamp */}
        <motion.div
          className="absolute top-8 left-6 z-30 pointer-events-none border-4 border-emerald-400 bg-emerald-500/25 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-xl shadow-emerald-500/30"
          style={{ opacity: likeOpacity, rotate: -16 }}
        >
          <span className="text-emerald-400 text-3xl font-black tracking-widest uppercase drop-shadow">
            LIKE
          </span>
        </motion.div>

        {/* NOPE Stamp */}
        <motion.div
          className="absolute top-8 right-6 z-30 pointer-events-none border-4 border-rose-500 bg-rose-500/25 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-xl shadow-rose-500/30"
          style={{ opacity: passOpacity, rotate: 16 }}
        >
          <span className="text-rose-400 text-3xl font-black tracking-widest uppercase drop-shadow">
            NOPE
          </span>
        </motion.div>

        <ProfileCard profile={profile} />
      </motion.div>
    </div>
  );
}
