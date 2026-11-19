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
  // Rotation proportional to drag
  const rotate = useTransform(x, [-200, 0, 200], [-16, 0, 16]);
  // Like & Nope badge opacities
  const likeOpacity = useTransform(x, [20, 90], [0, 1]);
  const passOpacity = useTransform(x, [-20, -90], [0, 1]);

  // Handle external trigger (from desktop/mobile buttons or keyboard)
  useEffect(() => {
    if (externalTrigger && isTop && !swiping) {
      const dir = externalTrigger === 'like' ? 500 : -500;
      setExitX(dir);
      setSwiping(true);
      onSwipe(profile.id, externalTrigger);
    }
  }, [externalTrigger, isTop, onSwipe, profile.id, swiping]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetThreshold = 80;
    const velocityThreshold = 400;

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

  // Background card in deck
  if (!isTop) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3 pointer-events-none">
        <div className="w-full max-w-sm h-full max-h-[540px] transform scale-[0.95] translate-y-2 opacity-60 transition-all duration-300">
          <ProfileCard profile={profile} />
        </div>
      </div>
    );
  }

  // Active top card
  return (
    <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3 z-10">
      <motion.div
        className="w-full max-w-sm h-full max-h-[540px] relative cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        onDragEnd={handleDragEnd}
        animate={
          swiping
            ? {
                x: exitX,
                opacity: 0,
                rotate: exitX > 0 ? 25 : -25,
                transition: { duration: 0.28, ease: 'easeOut' },
              }
            : { x: 0, opacity: 1 }
        }
        initial={{ scale: 0.94, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      >
        {/* LIKE Stamp Overlay */}
        <motion.div
          className="absolute top-6 left-6 z-20 pointer-events-none border-4 border-emerald-500 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl shadow-lg"
          style={{ opacity: likeOpacity, rotate: -15 }}
        >
          <span className="text-emerald-500 text-3xl sm:text-4xl font-black tracking-wider uppercase">
            LIKE
          </span>
        </motion.div>

        {/* NOPE Stamp Overlay */}
        <motion.div
          className="absolute top-6 right-6 z-20 pointer-events-none border-4 border-rose-500 bg-rose-500/10 px-3.5 py-1.5 rounded-xl shadow-lg"
          style={{ opacity: passOpacity, rotate: 15 }}
        >
          <span className="text-rose-500 text-3xl sm:text-4xl font-black tracking-wider uppercase">
            NOPE
          </span>
        </motion.div>

        <ProfileCard profile={profile} />
      </motion.div>
    </div>
  );
}
