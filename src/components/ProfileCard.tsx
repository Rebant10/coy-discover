'use client';

import { useState } from 'react';
import { Profile } from '@/lib/types';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-gray-950 shadow-2xl border border-black/10 select-none touch-none flex flex-col justify-end">
      {/* Background Photo - Full Bleed */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
        draggable={false}
        loading="eager"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold leading-none shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span>Active nearby</span>
      </div>

      {/* Top Right Info Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
        className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white inline-flex items-center justify-center hover:bg-black/60 transition-colors shadow-sm"
        aria-label="Toggle details"
      >
        <span className="text-xs font-bold font-serif leading-none">{showDetails ? '✕' : 'ℹ'}</span>
      </button>

      {/* Dark Vignette Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent pointer-events-none" />

      {/* Card Information Overlay */}
      <div className="relative z-10 p-4 sm:p-5 text-white flex flex-col gap-1.5">
        {/* Name & Age Row */}
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md truncate">
            {profile.name}
          </h2>
          <span className="text-xl sm:text-2xl font-light text-rose-300 drop-shadow flex-shrink-0">
            {profile.age}
          </span>
          <span className="text-emerald-400 text-sm font-bold flex-shrink-0" title="Verified">
            ✓
          </span>
        </div>

        {/* Location & College in a clean, compact single line */}
        <div className="flex items-center gap-2 text-xs font-medium text-white/90 truncate">
          <span className="inline-flex items-center gap-1 flex-shrink-0">
            <span className="text-[11px]">📍</span>
            <span>{profile.city}</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="inline-flex items-center gap-1 truncate">
            <span className="text-[11px]">🎓</span>
            <span className="truncate">{profile.college}</span>
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-white/85 leading-snug font-normal line-clamp-2 mt-0.5">
          {profile.bio}
        </p>

        {/* Interest tags (compact, guaranteed to fit comfortably inside the card) */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.interests.slice(0, 4).map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold tracking-tight leading-none"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Detailed Drawer (toggled via (i) button) */}
        {showDetails && (
          <div className="mt-2 pt-2 border-t border-white/20 text-xs text-white/90 animate-fadeIn">
            <p className="font-bold text-rose-300 text-[11px] mb-0.5">About {profile.name.split(' ')[0]}:</p>
            <p className="text-white/80 leading-relaxed text-[11px]">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
