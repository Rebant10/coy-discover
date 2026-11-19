'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import SwipeableCard from '@/components/SwipeableCard';
import MatchModal from '@/components/MatchModal';
import EmptyState from '@/components/EmptyState';
import Confetti from '@/components/Confetti';
import { Profile } from '@/lib/types';

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [externalTrigger, setExternalTrigger] = useState<'like' | 'pass' | null>(null);
  const swipingRef = useRef(false);

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleSwipe = useCallback(async (profileId: number, action: 'like' | 'pass') => {
    if (swipingRef.current) return;
    swipingRef.current = true;

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action }),
      });
      const data = await res.json();

      if (data.matched && data.matchedProfile) {
        setMatchedProfile(data.matchedProfile);
        setShowConfetti(true);
        setTimeout(() => setShowMatch(true), 150);
      }

      setCanUndo(true);
    } catch (error) {
      console.error('Failed to record swipe:', error);
    }

    // Remove profile after exit animation
    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      setExternalTrigger(null);
      swipingRef.current = false;
    }, 280);
  }, []);

  // Trigger swipe via button click or keyboard
  const triggerAction = (action: 'like' | 'pass') => {
    if (profiles.length === 0 || swipingRef.current || showMatch) return;
    setExternalTrigger(action);
  };

  const handleUndo = async () => {
    if (undoing || !canUndo || showMatch) return;
    setUndoing(true);

    try {
      const res = await fetch('/api/undo', { method: 'POST' });
      const data = await res.json();

      if (data.success && data.undoneProfile) {
        setProfiles((prev) => [data.undoneProfile, ...prev]);
        setCanUndo(false);
      }
    } catch (error) {
      console.error('Failed to undo:', error);
    } finally {
      setUndoing(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
      setCanUndo(false);
      setLoading(true);
      await fetchFeed();
    } catch (error) {
      console.error('Failed to reset:', error);
    }
  };

  // Keyboard controls for desktop testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showMatch || profiles.length === 0 || swipingRef.current) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerAction('like');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerAction('pass');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profiles, showMatch, canUndo, undoing]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center animate-pulse mb-3">
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-sm font-medium text-gray-400 animate-pulse">
          Loading discovery feed...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between relative overflow-hidden select-none">
      {/* Confetti overlay for matches */}
      <Confetti active={showConfetti} />

      {/* Top Header - Mobile friendly */}
      <header className="flex-shrink-0 px-4 pt-3.5 pb-2 flex items-center justify-between z-20 bg-white/95 backdrop-blur-sm border-b border-gray-50">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🔥</span>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent tracking-tight">
              Discover
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-400 font-medium">
            {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} waiting
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick link to Matches */}
          <Link
            href="/matches"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-semibold transition-all active:scale-95"
            title="View Matches"
          >
            <span>💕</span>
            <span>Matches</span>
          </Link>
        </div>
      </header>

      {/* Card Deck Area (fills remaining vertical space) */}
      <div className="flex-1 min-h-0 relative px-3 py-2 flex items-center justify-center overflow-hidden">
        {profiles.length === 0 ? (
          <EmptyState onReset={handleReset} />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {profiles.slice(0, 2).map((profile, index) => (
              <SwipeableCard
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                isTop={index === 0}
                externalTrigger={index === 0 ? externalTrigger : null}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls / Floating Action Buttons Bar (Always anchored above TabBar) */}
      {profiles.length > 0 && (
        <div className="flex-shrink-0 py-2 sm:py-3 px-4 flex flex-col items-center z-20 bg-gradient-to-t from-white via-white/90 to-transparent">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={!canUndo || undoing}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-150 ${
                canUndo
                  ? 'bg-amber-50 border border-amber-200 text-amber-500 shadow-md hover:bg-amber-100 active:scale-90'
                  : 'bg-gray-100/60 border border-gray-200/50 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              title="Undo last swipe (Ctrl+Z)"
              aria-label="Undo last swipe"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
              </svg>
            </button>

            {/* Pass / Nope Button */}
            <button
              onClick={() => triggerAction('pass')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-rose-200 text-rose-500 shadow-lg hover:border-rose-400 hover:bg-rose-50/50 active:scale-90 transition-all duration-150 flex items-center justify-center"
              title="Pass (Swipe Left / ←)"
              aria-label="Pass profile"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Like / Match Button */}
            <button
              onClick={() => triggerAction('like')}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-500/25 hover:from-rose-600 hover:to-pink-600 active:scale-90 transition-all duration-150 flex items-center justify-center"
              title="Like (Swipe Right / →)"
              aria-label="Like profile"
            >
              <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Reset Button (for demo purposes) */}
            <button
              onClick={handleReset}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-50 border border-gray-200 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-600 active:scale-90 transition-all duration-150 flex items-center justify-center"
              title="Reset all swipes (for demo)"
              aria-label="Reset swipes"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Desktop shortcut hint */}
          <div className="hidden sm:flex items-center gap-2 mt-1.5 text-[10px] text-gray-300 font-medium">
            <span>← Pass</span>
            <span>•</span>
            <span>→ Like</span>
            <span>•</span>
            <span>Ctrl+Z Undo</span>
          </div>
        </div>
      )}

      {/* Match Celebration Modal */}
      <MatchModal
        profile={matchedProfile}
        isOpen={showMatch}
        onClose={() => {
          setShowMatch(false);
          setShowConfetti(false);
          setMatchedProfile(null);
        }}
      />
    </div>
  );
}
