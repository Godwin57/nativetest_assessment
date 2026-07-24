'use client';

import { Bell } from 'lucide-react';

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
