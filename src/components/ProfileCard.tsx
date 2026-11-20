'use client';

import { useState } from 'react';
import { Profile } from '@/lib/types';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-gray-950 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.22)] border border-black/10 select-none touch-none flex flex-col justify-end">
      {/* Background Photo - Full Bleed */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profile.photo}
        alt={profile.name}
        className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
        draggable={false}
        loading="eager"
      />

      {/* Top Floating Badge - Generous horizontal padding so text and dot never touch rounded ends */}
      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 h-7 px-3.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold leading-none shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <span className="tracking-wide">Active nearby</span>
      </div>

      {/* Top Right Info Toggle Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails(!showDetails);
        }}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white inline-flex items-center justify-center hover:bg-black/75 transition-colors shadow-md active:scale-90"
        aria-label="Toggle details"
      >
        <span className="text-xs font-bold font-serif leading-none">{showDetails ? '✕' : 'ℹ'}</span>
      </button>

      {/* Cinematic Dark Gradient Overlay - smooth multi-stop so face is clear and text is readable */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/95 via-black/60 via-45% to-transparent pointer-events-none" />

      {/* Card Content Overlay - 38px bottom clearance guarantees tags sit completely above the 28px corner curvature */}
      <div
        className="relative z-10 px-6 pb-10 text-white flex flex-col gap-2"
        style={{ paddingBottom: '38px', paddingLeft: '24px', paddingRight: '24px' }}
      >
        {/* Name & Age Row */}
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md truncate">
            {profile.name}
          </h2>
          <span className="text-xl sm:text-2xl font-semibold text-rose-300 drop-shadow flex-shrink-0">
            {profile.age}
          </span>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/90 text-white text-[11px] font-black flex-shrink-0 ml-1 shadow-sm"
            title="Verified Profile"
          >
            ✓
          </span>
        </div>

        {/* Location & College Single Line */}
        <div className="flex items-center gap-2 text-xs font-medium text-white/90 truncate">
          <span className="inline-flex items-center gap-1 flex-shrink-0">
            <span className="text-xs">📍</span>
            <span>{profile.city}</span>
          </span>
          <span className="text-white/40">•</span>
          <span className="inline-flex items-center gap-1 truncate">
            <span className="text-xs">🎓</span>
            <span className="truncate">{profile.college}</span>
          </span>
        </div>

        {/* Bio Text */}
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal line-clamp-2 mt-0.5">
          {profile.bio}
        </p>

        {/* Interest tags - spaced generously with safe clearance from card corners */}
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center justify-center h-6 px-3.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-semibold tracking-wide leading-none shadow-xs"
            >
              {interest}
            </span>
          ))}
        </div>

        {/* Detailed Drawer (toggled via (i) button) */}
        {showDetails && (
          <div className="mt-2 pt-2.5 border-t border-white/20 text-xs text-white/90 animate-fadeIn">
            <p className="font-bold text-rose-300 text-xs mb-1">About {profile.name.split(' ')[0]}:</p>
            <p className="text-white/80 leading-relaxed text-xs">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
}
