'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HomeIcon, SparklesIcon, HeartIcon } from './Icons';

export default function TabBar() {
  const pathname = usePathname();
  const [matchCount, setMatchCount] = useState(0);

  // Poll for match updates to keep badge in sync
  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        if (isMounted) {
          setMatchCount(data.matches?.length || 0);
        }
      } catch {
        // silent
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  const tabs = [
    { href: '/home', label: 'Home', icon: HomeIcon, badge: 0 },
    { href: '/discover', label: 'Discover', icon: SparklesIcon, badge: 0 },
    { href: '/matches', label: 'Matches', icon: HeartIcon, badge: matchCount },
  ];

  return (
    <nav className="w-full flex-shrink-0 bg-white border-t border-gray-100 z-30 select-none pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex justify-around items-center h-14 sm:h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href === '/discover' && pathname === '/');
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center min-w-[64px] min-h-[48px] py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-rose-500 font-semibold'
                  : 'text-gray-400 hover:text-gray-600 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-6 h-6 transition-transform duration-150" filled={isActive} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs mt-0.5 tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
