'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

export default function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#f43f5e', '#ec4899', '#a855f7', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
      const newPieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: -(Math.random() * 300 + 100),
        rotation: Math.random() * 720 - 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.3,
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[99] pointer-events-none overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute rounded-sm"
              style={{
                left: '50%',
                top: '40%',
                width: piece.size,
                height: piece.size * 0.6,
                backgroundColor: piece.color,
              }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: piece.x * 5,
                y: [0, piece.y, piece.y + 600],
                rotate: piece.rotation,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              exit={{ opacity: 0 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

