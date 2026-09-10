import React from 'react';
import {
  Search,
  Bell,
  Globe,
  ShieldCheck,
  Menu,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/mockData';

interface TopBarProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickNavigate?: (pageId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  language,
  onToggleLanguage,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: hamburger + search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <button
          id="btn-sidebar-toggle"
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-slate-550 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5 text-slate-600" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="input-global-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-9 pr-4 py-1.5 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right side: RTO org pill, language toggle, notifications, user avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* RTO Identifier Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-50/80 to-sky-50/80 border border-indigo-100/60 px-3 py-1.5 text-xs text-indigo-900 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span className="font-semibold text-slate-800">East Timor Institute of Tech</span>
          <span className="text-slate-400">|</span>
          <span className="font-mono text-indigo-600 font-medium">RTO #41289</span>
        </div>

        {/* Multilingual Switcher: English / Tetum */}
        <div className="flex items-center rounded-xl bg-slate-100/90 p-1 border border-slate-200/80 text-xs font-medium">
          <button
            id="btn-lang-en"
            onClick={() => onToggleLanguage('en')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              language === 'en'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
          <button
            id="btn-lang-tet"
            onClick={() => onToggleLanguage('tet')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
              language === 'tet'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🇹🇱</span>
            <span>Tetun</span>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            id="btn-notifications"
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="3 compliance notices"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Elena Rostova"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-slate-800 leading-tight">Elena Rostova</div>
            <div className="text-slate-500 text-[11px] leading-tight">Compliance Director</div>
          </div>
        </div>
      </div>
    </header>
  );
};
