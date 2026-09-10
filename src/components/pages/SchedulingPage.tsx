import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Wrench,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Sparkles,
  Calendar,
  Filter,
} from 'lucide-react';
import { ScheduledSession, Language } from '../../types';
import { translations } from '../../data/mockData';

interface SchedulingPageProps {
  sessions: ScheduledSession[];
  onUpdateSessions: (sessions: ScheduledSession[]) => void;
  language: Language;
}

export const SchedulingPage: React.FC<SchedulingPageProps> = ({
  sessions,
  onUpdateSessions,
  language,
}) => {
  const t = translations[language];
  const [filterTrainer, setFilterTrainer] = useState<string>('All');
  const [conflictResolvedNotice, setConflictResolvedNotice] = useState(false);

  const hasConflict = sessions.some((s) => s.hasConflict);

  const handleResolveConflict = () => {
    // Resolve conflict by moving session SES-102 to 14:00 - 16:00 and removing conflict flag
    const updated = sessions.map((ses) => {
      if (ses.id === 'SES-102') {
        return {
          ...ses,
          startTime: '14:00',
          endTime: '16:00',
          hasConflict: false,
          conflictDetails: undefined,
        };
      }
      if (ses.id === 'SES-101') {
        return {
          ...ses,
          hasConflict: false,
          conflictDetails: undefined,
        };
      }
      return ses;
    });

    onUpdateSessions(updated);
    setConflictResolvedNotice(true);
    setTimeout(() => setConflictResolvedNotice(false), 5000);
  };

  const handleTriggerConflict = () => {
    // Re-trigger conflict for demonstration purposes
    const updated = sessions.map((ses) => {
      if (ses.id === 'SES-102') {
        return {
          ...ses,
          startTime: '10:00',
          endTime: '12:00',
          hasConflict: true,
          conflictDetails: 'Double-booking clash with SES-101 in Workshop A.',
        };
      }
      if (ses.id === 'SES-101') {
        return {
          ...ses,
          hasConflict: true,
          conflictDetails: 'Double-booking clash with SES-102 in Computer Lab 3.',
        };
      }
      return ses;
    });

    onUpdateSessions(updated);
    setConflictResolvedNotice(false);
  };

  const filteredSessions = sessions.filter((s) => {
    return filterTrainer === 'All' || s.trainerName.includes(filterTrainer);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.scheduling} — {language === 'en' ? 'Workshop & Resource Timetable' : 'Oráriu Ofisina & Rekursu'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Real-time multi-campus scheduling of trainers, high-risk workshops, and diagnostic equipment.'
              : 'Oráriu tempu-reál ba formadór, ofisina no ekipamentu tékniku.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterTrainer}
            onChange={(e) => setFilterTrainer(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All Trainers</option>
            <option value="David Chen">David Chen</option>
            <option value="Alex Santos">Alex Santos</option>
            <option value="Domingos Ximenes">Domingos Ximenes</option>
          </select>
        </div>
      </div>

      {/* Visual Conflict-Detection Warning Banner (CRITICAL REQUIREMENT) */}
      {hasConflict ? (
        <div
          id="banner-scheduling-conflict"
          className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 p-5 sm:p-6 shadow-md transition-all animate-fadeIn"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-white shrink-0 shadow-sm animate-bounce">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900 uppercase tracking-wider mb-1">
                  CRITICAL RESOURCE CLASH
                </div>
                <h3 className="text-base font-extrabold text-amber-950">
                  {t.conflictWarning}: Trainer Double-Booked
                </h3>
                <p className="text-xs text-amber-900 mt-1 max-w-2xl leading-relaxed">
                  Trainer <strong className="font-bold">David Chen</strong> is simultaneously allocated to
                  two active sessions on <strong>2026-09-15</strong> between <strong>10:00 - 12:00</strong>:
                  {' '}<em>"DC Circuit Diagnostics" (Workshop A)</em> and <em>"Theory Moderation" (Computer Lab 3)</em>.
                </p>
              </div>
            </div>

            {/* Resolve Conflict Action Button */}
            <div className="shrink-0">
              <button
                id="btn-resolve-conflict"
                onClick={handleResolveConflict}
                className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-5 py-2.5 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{t.resolveConflict} (Auto-Shift Time)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-emerald-950">
                {language === 'en' ? 'All Sessions Conflict-Free' : 'Oráriu Hotu Livre Hosi Konflitu'}
              </h3>
              <p className="text-[11px] text-emerald-800">
                All 5 timetable blocks have verified trainer availability, venue capacity, and specialized equipment reservation.
              </p>
            </div>
          </div>
          <button
            onClick={handleTriggerConflict}
            className="text-[11px] font-bold text-slate-500 hover:text-amber-700 underline cursor-pointer"
          >
            Re-simulate Conflict
          </button>
        </div>
      )}

      {conflictResolvedNotice && (
        <div className="rounded-xl bg-emerald-100 border border-emerald-200 p-3 text-emerald-900 text-xs font-semibold animate-fadeIn">
          ✓ {t.conflictResolved}! Computer Lab 3 session shifted to 14:00 - 16:00 without disrupting workshop practicum.
        </div>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions.map((ses) => (
          <div
            key={ses.id}
            className={`rounded-2xl border p-5 transition-all shadow-xs backdrop-blur-sm relative overflow-hidden flex flex-col justify-between ${
              ses.hasConflict
                ? 'border-amber-300 bg-amber-50/70 ring-2 ring-amber-400/50 shadow-md'
                : 'border-slate-200/80 bg-white/90 hover:shadow-md'
            }`}
          >
            {ses.hasConflict && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Clash Detected
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                  {ses.unitCode}
                </span>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {ses.cohort}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{ses.title}</h3>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono font-medium text-slate-800">
                    {ses.date} • {ses.startTime} - {ses.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{ses.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    Trainer: <strong className="text-slate-800">{ses.trainerName}</strong> ({ses.studentCount} students)
                  </span>
                </div>
              </div>

              {/* Equipment Requirements */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Wrench className="h-3 w-3" />
                  <span>Reserved Equipment & Kits</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ses.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {ses.hasConflict && (
              <div className="mt-4 pt-3 border-t border-amber-200 text-[11px] text-amber-900 font-medium">
                ⚠️ {ses.conflictDetails}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
