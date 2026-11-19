import { Profile } from '@/lib/types';

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="w-full h-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col select-none touch-none">
      {/* Photo section */}
      <div className="relative flex-shrink-0 h-[56%] sm:h-[60%] w-full bg-gray-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover object-top select-none pointer-events-none"
          draggable={false}
          loading="eager"
        />

        {/* Coy-style gradient bottom overlay for text readability */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-12 pb-3.5 px-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow">
              {profile.name}
            </h2>
            <span className="text-xl sm:text-2xl font-semibold text-rose-300 drop-shadow">
              {profile.age}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5 text-white/90 text-xs sm:text-sm font-medium">
            <svg
              width="14"
              height="14"
              style={{ width: '14px', height: '14px' }}
              className="w-3.5 h-3.5 text-rose-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{profile.city}</span>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="flex-1 min-h-0 p-3.5 sm:p-4 overflow-y-auto overscroll-contain flex flex-col justify-between bg-white">
        <div>
          {/* College pill */}
          <div className="inline-flex items-center gap-1.5 text-gray-700 text-xs sm:text-sm font-medium mb-2.5 bg-gray-50 border border-gray-200/70 px-3 py-1 rounded-full">
            <svg
              width="16"
              height="16"
              style={{ width: '16px', height: '16px' }}
              className="w-4 h-4 text-rose-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span className="truncate">{profile.college}</span>
          </div>

          {/* Bio text */}
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3">
            {profile.bio}
          </p>
        </div>

        {/* Interests pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="px-2.5 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[11px] sm:text-xs font-semibold tracking-tight"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
