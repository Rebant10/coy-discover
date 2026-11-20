import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="h-full overflow-y-auto px-5 py-4 flex flex-col justify-start select-none bg-white">
      {/* Top Header - Coy Style */}
      <header className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-baseline">
          <span className="text-2xl font-black tracking-tight text-gray-950 leading-none">coy</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          ⚙️
        </div>
      </header>

      {/* Main Card - Styled exactly after Coy's signature onboarding card */}
      <div className="mt-5 p-6 rounded-[28px] bg-[#ECE8FF] border border-[#DCD3FE] shadow-sm flex flex-col items-start text-left">
        <span className="text-3xl mb-3">🤫</span>
        <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mb-1">
          Home (Placeholder)
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-5">
          As required by the assignment brief, the Home tab is kept blank as a placeholder. The swipe-based matching experience is built in the Discover tab.
        </p>

        <Link
          href="/discover"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white text-xs font-bold shadow-md hover:bg-gray-800 active:scale-95 transition-all whitespace-nowrap leading-none"
          style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '12px', paddingBottom: '12px' }}
        >
          <span>Explore Discover</span>
          <span>✨</span>
        </Link>
      </div>

      {/* Secondary Placeholder Card */}
      <div className="mt-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-lg">
            💌
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Your crushes</h4>
            <p className="text-[11px] text-gray-400">0/3 slots used</p>
          </div>
        </div>
        <span className="text-xs font-bold text-rose-500">More slots</span>
      </div>
    </div>
  );
}
