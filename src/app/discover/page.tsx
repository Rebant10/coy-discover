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
  const [error, setError] = useState<string | null>(null);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [externalTrigger, setExternalTrigger] = useState<'like' | 'pass' | null>(null);
  const swipingRef = useRef(false);

  const fetchFeed = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/feed');
      if (!res.ok) {
        throw new Error(`Feed request failed (${res.status})`);
      }
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (err: unknown) {
      console.error('Failed to fetch feed:', err);
      const msg = err instanceof Error ? err.message : 'Failed to connect to feed';
      setError(msg);
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
      if (res.ok) {
        const data = await res.json();
        if (data.matched && data.matchedProfile) {
          setMatchedProfile(data.matchedProfile);
          setShowConfetti(true);
          setTimeout(() => setShowMatch(true), 150);
          // When it's a match, rollback is disabled
          setCanUndo(false);
        } else if (action === 'pass') {
          // Rollback is ONLY allowed when passing (disliking) someone by accident
          setCanUndo(true);
        } else {
          // Regular like that isn't a mutual match also cannot be rolled back
          setCanUndo(false);
        }
      }
    } catch (err) {
      console.error('Failed to record swipe:', err);
    }

    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      setExternalTrigger(null);
      swipingRef.current = false;
    }, 280);
  }, []);

  const triggerAction = (action: 'like' | 'pass') => {
    if (profiles.length === 0 || swipingRef.current || showMatch) return;
    setExternalTrigger(action);
  };

  const handleUndo = async () => {
    if (undoing || !canUndo || showMatch) return;
    setUndoing(true);

    try {
      const res = await fetch('/api/undo', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.undoneProfile) {
          setProfiles((prev) => [data.undoneProfile, ...prev]);
          setCanUndo(false);
        }
      }
    } catch (err) {
      console.error('Failed to undo:', err);
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
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  // Keyboard shortcuts
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
      <div className="flex flex-col items-center justify-center h-full px-6 bg-white">
        <div className="w-14 h-14 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center animate-pulse mb-3">
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-sm font-semibold text-gray-500 animate-pulse">
          Finding people near you...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center bg-white">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">Couldn&apos;t load feed</h2>
        <p className="text-xs text-gray-500 mb-4 max-w-xs">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            fetchFeed();
          }}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold shadow-md hover:bg-rose-600 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between relative overflow-hidden select-none bg-gray-50/50">
      {/* Confetti celebration for matches */}
      <Confetti active={showConfetti} />

      {/* Top Header - Coy Brand Style */}
      <header className="flex-shrink-0 h-14 px-5 flex items-center justify-between z-20 bg-white/95 backdrop-blur-md border-b border-gray-100/80">
        <div className="flex items-center gap-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-black tracking-tight text-gray-950 leading-none">coy</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 ml-1">
            Discover
          </span>
        </div>

        {/* Matches Pill - Generous horizontal padding so text & emoji never touch the pill edges */}
        <Link
          href="/matches"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-bold whitespace-nowrap leading-none transition-all hover:bg-rose-100/70 active:scale-95 shadow-xs"
          style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '8px', paddingBottom: '8px' }}
        >
          <span className="text-xs">💕</span>
          <span>Matches</span>
        </Link>
      </header>

      {/* Card Deck Area */}
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

      {/* Action Buttons Bar */}
      {profiles.length > 0 && (
        <div className="flex-shrink-0 h-[76px] px-6 flex items-center justify-center gap-5 sm:gap-6 z-20 bg-white/95 backdrop-blur-sm border-t border-gray-100">
          {/* Undo Button - ONLY enabled after passing someone by accident */}
          <button
            onClick={handleUndo}
            disabled={!canUndo || undoing}
            className={`w-12 h-12 rounded-full inline-flex items-center justify-center transition-all duration-150 ${
              canUndo
                ? 'bg-amber-50 border-2 border-amber-300 text-amber-500 shadow-md hover:bg-amber-100 active:scale-90 cursor-pointer'
                : 'bg-gray-100/70 border border-gray-200 text-gray-300 cursor-not-allowed opacity-40'
            }`}
            title={canUndo ? 'Undo last pass (Ctrl+Z)' : 'Undo is only available after passing someone'}
            aria-label="Undo pass"
          >
            <svg
              width="20"
              height="20"
              style={{ width: '20px', height: '20px' }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
            </svg>
          </button>

          {/* Pass / Nope Button */}
          <button
            onClick={() => triggerAction('pass')}
            className="w-14 h-14 rounded-full bg-white border-2 border-rose-200 text-rose-500 shadow-md shadow-rose-100 hover:border-rose-400 hover:bg-rose-50/50 active:scale-90 transition-all duration-150 inline-flex items-center justify-center"
            title="Pass (Swipe Left)"
            aria-label="Pass"
          >
            <svg
              width="26"
              height="26"
              style={{ width: '26px', height: '26px' }}
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Like / Heart Button */}
          <button
            onClick={() => triggerAction('like')}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 text-white shadow-xl shadow-rose-500/35 hover:brightness-105 active:scale-90 transition-all duration-150 inline-flex items-center justify-center"
            title="Like (Swipe Right)"
            aria-label="Like"
          >
            <svg
              width="30"
              height="30"
              style={{ width: '30px', height: '30px' }}
              className="fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-400 shadow-xs hover:bg-gray-100 hover:text-gray-600 active:scale-90 transition-all duration-150 inline-flex items-center justify-center"
            title="Reset demo swipes"
            aria-label="Reset"
          >
            <svg
              width="20"
              height="20"
              style={{ width: '20px', height: '20px' }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {/* Match Modal */}
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
