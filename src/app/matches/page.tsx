'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Match } from '@/lib/types';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center animate-pulse mb-3">
          <span className="text-2xl">💕</span>
        </div>
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Loading mutual matches...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pt-4 pb-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent tracking-tight">
            Matches
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            {matches.length} {matches.length === 1 ? 'mutual match' : 'mutual matches'}
          </p>
        </div>

        <Link
          href="/discover"
          className="text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors active:scale-95"
        >
          + Find More
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-4xl mb-4 shadow-inner">
            💫
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1.5">No matches yet</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xs leading-relaxed mb-6">
            Swipe right on people you like. When the feeling is mutual, they will appear here!
          </p>
          <Link
            href="/discover"
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            Start Discovering
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:bg-gray-50"
            >
              {/* Avatar */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-rose-200 bg-rose-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={match.profile.photo}
                  alt={match.profile.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Match Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                    {match.profile.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">
                    {match.profile.age}
                  </span>
                </div>

                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {match.profile.college} • {match.profile.city}
                </p>

                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {match.profile.interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Heart icon badge */}
              <div className="flex-shrink-0 text-xl" title="Mutual match">
                💕
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
