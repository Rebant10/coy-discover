import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TabBar from '@/components/TabBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coy - Discover',
  description: 'Find your match on Coy - Anonymous crush discovery',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Coy',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`${inter.className} h-full antialiased text-gray-900 overflow-hidden`}>
        {/* Desktop Presentation Container with Ambient Background */}
        <div className="w-full h-[100dvh] flex items-center justify-center bg-gradient-to-br from-slate-100 via-rose-50/30 to-purple-50/40 p-0 md:p-6 lg:p-8 relative overflow-hidden select-none">
          {/* Ambient Background Glow Elements (Desktop Only) */}
          <div className="hidden md:block pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl" />
          <div className="hidden md:block pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

          {/* Desktop Companion Guide (Shown on larger screens) */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 mr-10 select-none flex-shrink-0">
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-gray-200/80 shadow-sm">
              <div className="flex items-baseline mb-2">
                <span className="text-3xl font-black tracking-tight text-gray-950">coy</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-0.5" />
              </div>
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2">
                Discover Mode
              </p>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Swipe right on people you like. When they like you back, it&apos;s a mutual match!
              </p>
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>35 campus profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>Instant match on pre-likes</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-xs text-xs text-gray-500">
              <p className="font-bold text-gray-800 mb-2">⌨️ Desktop Controls</p>
              <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span>Pass</span>
                  <kbd className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-sans border border-gray-200">← Arrow</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Like</span>
                  <kbd className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-sans border border-gray-200">→ Arrow</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span>Undo Pass</span>
                  <kbd className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-sans border border-gray-200">Ctrl + Z</kbd>
                </div>
              </div>
            </div>
          </aside>

          {/* Device Mockup Frame: Edge-to-edge on mobile, sleek floating frame on desktop */}
          <main className="w-full h-full md:h-[min(840px,calc(100vh-48px))] max-w-[420px] flex flex-col bg-white relative md:rounded-[40px] md:border md:border-gray-200/90 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15),0_10px_25px_rgba(244,63,94,0.08)] overflow-hidden flex-shrink-0">
            {/* Desktop Phone Notch Indicator */}
            <div className="hidden md:flex justify-center pt-2.5 pb-0.5 flex-shrink-0 bg-white">
              <div className="w-24 h-4 rounded-full bg-gray-900/10 flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-gray-900/20" />
              </div>
            </div>

            {/* Main screen area */}
            <div className="flex-1 min-h-0 relative overflow-hidden">
              {children}
            </div>

            {/* Bottom Tab Bar */}
            <TabBar />
          </main>
        </div>
      </body>
    </html>
  );
}
