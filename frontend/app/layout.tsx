import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'NativeTalk — Support Dashboard',
  description: 'Customer support ticketing and management dashboard for NativeTalk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-48 min-h-screen">
            {/* Mobile top spacer — gives the fixed hamburger button room so it doesn't overlap the Topbar */}
            <div className="md:hidden h-14 bg-white border-b border-slate-100 flex items-center px-16">
              <span className="font-semibold text-slate-700 text-sm tracking-tight">
                native<span className="text-green-500">talk</span>
              </span>
            </div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
