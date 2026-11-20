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
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 bg-white">
        <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center animate-pulse mb-3">
          <span className="text-2xl">💕</span>
        </div>
        <p className="text-sm font-semibold text-gray-500 animate-pulse">
          Loading your matches...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain px-4 pt-3 pb-8 select-none bg-gray-50/40">
      {/* Header - Coy Brand Style */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="flex items-baseline">
            <span className="text-2xl font-black tracking-tight text-gray-900 leading-none">coy</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 ml-1.5">
            Matches
          </span>
        </div>

        <Link
          href="/discover"
          className="inline-flex items-center justify-center gap-1.5 h-8 px-4 rounded-full bg-rose-50 hover:bg-rose-100/80 border border-rose-200/90 text-rose-600 text-xs font-bold whitespace-nowrap transition-all active:scale-95 shadow-xs"
        >
          <span>+ Discover</span>
        </Link>
      </div>

      {matches.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-100 to-pink-50 border border-rose-200/60 flex items-center justify-center text-4xl mb-4 shadow-sm">
            💫
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-1.5">No mutual matches yet</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
            Swipe right on profiles you like. When they like you back, they will appear here!
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap leading-none"
          >
            <span>Start Discovering</span>
            <span>🔥</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Top Horizontal Story / New Matches Row */}
          <div>
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                New Matches ({matches.length})
              </h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
              {matches.map((match) => (
                <div key={`story-${match.id}`} className="flex flex-col items-center flex-shrink-0 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-400 shadow-md group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-gray-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={match.profile.photo}
                        alt={match.profile.name}
                        className="w-full h-full object-cover object-top select-none pointer-events-none"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 mt-1 max-w-[64px] truncate text-center">
                    {match.profile.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Connections List */}
          <div>
            <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-2.5 px-1">
              All Connections
            </h3>
            <div className="flex flex-col gap-2.5">
              {matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow active:bg-gray-50/80 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={match.profile.photo}
                      alt={match.profile.name}
                      className="w-full h-full object-cover object-top select-none pointer-events-none"
                      draggable={false}
                    />
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {match.profile.name}
                      </h4>
                      <span className="text-xs font-semibold text-rose-500 flex-shrink-0">
                        {match.profile.age}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {match.profile.college} • {match.profile.city}
                    </p>

                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      {match.profile.interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center justify-center h-5 px-2.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-semibold leading-none shadow-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Say Hi Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Opening chat with ${match.profile.name}! 👋`);
                      }}
                      className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap leading-none"
                    >
                      Say Hi 👋
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
