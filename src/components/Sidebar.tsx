import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  UserCheck,
  CalendarDays,
  BookOpenCheck,
  Award,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Radio,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/mockData';

export type PageId =
  | 'dashboard'
  | 'students'
  | 'assessments'
  | 'trainers'
  | 'scheduling'
  | 'tas'
  | 'certificates'
  | 'compliance';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  language: Language;
  hasSchedulingConflict?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  collapsed,
  onToggleCollapse,
  language,
  hasSchedulingConflict,
}) => {
  const t = translations[language];

  const navItems = [
    {
      id: 'dashboard' as PageId,
      label: t.dashboard,
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'students' as PageId,
      label: t.students,
      icon: GraduationCap,
      badge: '6',
    },
    {
      id: 'assessments' as PageId,
      label: t.assessments,
      icon: ClipboardCheck,
      badge: 'Field',
    },
    {
      id: 'trainers' as PageId,
      label: t.trainers,
      icon: UserCheck,
      badge: 'Audit Check',
      highlightBadge: true,
    },
    {
      id: 'scheduling' as PageId,
      label: t.scheduling,
      icon: CalendarDays,
      badge: hasSchedulingConflict ? 'Conflict' : undefined,
      badgeAlert: hasSchedulingConflict,
    },
    {
      id: 'tas' as PageId,
      label: t.tas,
      icon: BookOpenCheck,
      badge: 'EN / TET',
    },
    {
      id: 'certificates' as PageId,
      label: t.certificates,
      icon: Award,
      badge: 'QR',
    },
    {
      id: 'compliance' as PageId,
      label: t.compliance,
      icon: ShieldCheck,
      badge: undefined,
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 shadow-md shadow-indigo-500/20 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold tracking-tight text-slate-900 text-base leading-tight">
                Qualify<span className="text-indigo-600">RTO</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 truncate">
                Vocational Compliance SMS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {language === 'en' ? 'Core Navigation' : 'Navegasaun Prinsipál'}
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectPage(item.id)}
              title={collapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-50/90 via-violet-50/70 to-sky-50/50 text-indigo-700 shadow-xs border border-indigo-100/80 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-indigo-600 to-violet-600" />
              )}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {!collapsed && (
                <div className="flex flex-1 items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-2 inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                        item.badgeAlert
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : item.highlightBadge
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Compliance Status Pill */}
      <div className="p-3 border-t border-slate-100">
        {!collapsed ? (
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 p-3 border border-slate-200/70 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>ASQA & INDMO Ready</span>
              </div>
              <span className="text-[10px] font-mono font-medium text-indigo-600 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                100%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {language === 'en'
                ? 'Immutable audit logging active. Offline sync storage enabled.'
                : 'Rejistu auditoria ativu. Modu offline preparadu.'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="ASQA & INDMO Compliance Guard Active">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
