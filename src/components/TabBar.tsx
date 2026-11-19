'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HomeIcon, SparklesIcon, HeartIcon } from './Icons';

export default function TabBar() {
  const pathname = usePathname();
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/matches');
        if (!res.ok) return;
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
    <nav className="w-full flex-shrink-0 bg-white border-t border-gray-100 z-30 select-none pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-[56px] px-6 max-w-sm mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href === '/discover' && pathname === '/');
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-rose-500 font-bold'
                  : 'text-gray-400 hover:text-gray-600 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-6 h-6 transition-transform duration-150" filled={isActive} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full inline-flex items-center justify-center leading-none shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-semibold leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-rose-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
