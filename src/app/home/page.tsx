import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-gray-50/40 select-none">
      <div className="flex items-baseline mb-4">
        <span className="text-4xl font-black tracking-tight text-gray-900 leading-none">coy</span>
        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 ml-1" />
      </div>

      <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-3xl mb-4 shadow-sm">
        🏠
      </div>

      <h1 className="text-xl font-black text-gray-900 mb-2">Home (Placeholder)</h1>
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
        As per the assignment brief, this Home tab is kept blank as a placeholder. Head over to the Discover tab to try the swipe experience!
      </p>

      {/* Button with generous horizontal padding so text never touches rounded ends */}
      <Link
        href="/discover"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 active:scale-95 transition-all whitespace-nowrap leading-none"
      >
        <span>Go to Discover</span>
        <span>✨</span>
      </Link>
    </div>
  );
}
