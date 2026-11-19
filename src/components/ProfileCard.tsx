'use client';

import { useState } from 'react';
import { Profile } from '@/lib/types';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-gray-900 shadow-2xl border border-black/10 select-none touch-none flex flex-col justify-end">
      {/* Background Photo - Full Bleed */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-500"
        draggable={false}
        loading="eager"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Active nearby</span>
      </div>

      {/* Top Right Info Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        aria-label="Toggle details"
      >
        <span className="text-xs font-bold font-serif">{showDetails ? '✕' : 'ℹ'}</span>
      </button>

      {/* Deep Gradient Overlay for text contrast */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/95 via-black/60 via-40% to-transparent pointer-events-none" />

      {/* Bottom Content Area */}
      <div className="relative z-10 p-5 sm:p-6 text-white flex flex-col gap-2">
        {/* Name & Age Row */}
        <div className="flex items-baseline gap-2.5">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            {profile.name}
          </h2>
          <span className="text-2xl font-light text-rose-300 drop-shadow">
            {profile.age}
          </span>
          <span className="text-emerald-400 text-sm" title="Verified">
            ✓
          </span>
        </div>

        {/* Location & College Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/90">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/15">
            <span>📍</span>
            <span>{profile.city}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/15">
            <span>🎓</span>
            <span className="truncate max-w-[170px]">{profile.college}</span>
          </span>
        </div>

        {/* Short Bio */}
        <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal line-clamp-2 mt-0.5">
          {profile.bio}
        </p>

        {/* Interest tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-300/40 text-rose-200 text-[11px] font-semibold tracking-tight"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Detailed Drawer (toggled via (i) button) */}
        {showDetails && (
          <div className="mt-2 pt-2 border-t border-white/15 text-xs text-white/80 animate-fadeIn">
            <p className="font-semibold text-rose-300 mb-1">About {profile.name.split(' ')[0]}:</p>
            <p className="text-white/90">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
