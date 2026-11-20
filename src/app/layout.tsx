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
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full antialiased text-gray-900 overflow-hidden`}>
        {/* Clean web layout: centered on desktop, edge-to-edge on mobile */}
        <div className="w-full h-[100dvh] flex justify-center bg-gray-50 select-none">
          <main className="w-full max-w-md h-full flex flex-col bg-white relative shadow-sm border-x border-gray-100 overflow-hidden">
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
