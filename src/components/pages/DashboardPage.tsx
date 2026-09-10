import React from 'react';
import {
  Users,
  Layers,
  CheckCircle2,
  Award,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { Language, ScheduledSession, AuditLog } from '../../types';
import { translations } from '../../data/mockData';
import { PageId } from '../Sidebar';

interface DashboardPageProps {
  language: Language;
  onNavigate: (page: PageId) => void;
  sessions: ScheduledSession[];
  auditLogs: AuditLog[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  language,
  onNavigate,
  sessions,
  auditLogs,
}) => {
  const t = translations[language];

  const stats = [
    {
      id: 'stat-students',
      label: t.activeStudents,
      value: '482',
      subtext: '+12% vs last term',
      icon: Users,
      gradient: 'from-blue-500/10 via-indigo-500/10 to-violet-500/10',
      border: 'border-indigo-100',
      textColor: 'text-indigo-600',
      page: 'students' as PageId,
    },
    {
      id: 'stat-cohorts',
      label: t.cohortsRunning,
      value: '18',
      subtext: 'Across Dili, Baucau & Ermera',
      icon: Layers,
      gradient: 'from-violet-500/10 via-purple-500/10 to-pink-500/10',
      border: 'border-violet-100',
      textColor: 'text-violet-600',
      page: 'scheduling' as PageId,
    },
    {
      id: 'stat-assessments',
      label: t.assessmentsWeek,
      value: '64',
      subtext: '51 completed (98% pass rate)',
      icon: CheckCircle2,
      gradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
      border: 'border-emerald-100',
      textColor: 'text-emerald-600',
      page: 'assessments' as PageId,
    },
    {
      id: 'stat-certificates',
      label: t.certificatesIssued,
      value: '1,240',
      subtext: '38 issued this month',
      icon: Award,
      gradient: 'from-amber-500/10 via-orange-500/10 to-rose-500/10',
      border: 'border-amber-100',
      textColor: 'text-amber-600',
      page: 'certificates' as PageId,
    },
  ];

  const lifecycleStages = [
    { name: t.stageEnquiry, count: 28, pct: 15, color: 'bg-slate-400' },
    { name: t.stageEnrolled, count: 64, pct: 25, color: 'bg-sky-500' },
    { name: t.stageInTraining, count: 260, pct: 65, color: 'bg-indigo-600' },
    { name: t.stageCompleted, count: 82, pct: 85, color: 'bg-emerald-500' },
    { name: t.stageCertified, count: 48, pct: 100, color: 'bg-violet-600' },
  ];

  const competencyProgress = [
    {
      course: 'Certificate III in Electrotechnology Electrician (UEE30820)',
      target: 95,
      actual: 91,
      students: 184,
      trend: '+4.2%',
    },
    {
      course: 'Certificate III in Carpentry & Construction (CPC30220)',
      target: 90,
      actual: 94,
      students: 142,
      trend: '+6.1%',
    },
    {
      course: 'Certificate III in Commercial Cookery (SIT30821)',
      target: 90,
      actual: 88,
      students: 96,
      trend: '+1.8%',
    },
    {
      course: 'Certificate IV in Leadership & Management (BSB40520)',
      target: 85,
      actual: 86,
      students: 60,
      trend: '+3.5%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Soft Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute right-1/3 -top-12 h-48 w-48 rounded-full bg-sky-400/10 blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15 text-indigo-100">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>
                {language === 'en'
                  ? 'ASQA / INDMO Compliance Guard Active'
                  : 'Guardiao Konformidade ASQA / INDMO Ativu'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {language === 'en'
                ? 'Vocational Training & Compliance Executive Overview'
                : 'Rezumu Ezekutivu Formasaun Vokasionál & Konformidade'}
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed">
              {language === 'en'
                ? 'Welcome back, Elena. All 4 regional training centres are synchronised. Real-time competency tracking, offline field assessment verification, and immutable audit trails are active.'
                : 'Benvinda fali, Elena. Sentru formasaun 4 hotu sinkronizadu. Akonpanhamentu kompeténsia tempu-reál, avaliasaun terrenu offline no auditoria ativu.'}
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 shrink-0">
            <button
              id="btn-dash-field-assessment"
              onClick={() => onNavigate('assessments')}
              className="flex items-center gap-2 rounded-xl bg-white text-indigo-900 px-4 py-2.5 text-xs font-semibold shadow-sm hover:bg-indigo-50 transition-all cursor-pointer"
            >
              <FileCheck2 className="h-4 w-4 text-indigo-600" />
              <span>
                {language === 'en' ? 'Field Assessment Tool' : 'Ferramenta Terrenu'}
              </span>
            </button>
            <button
              id="btn-dash-verify-cert"
              onClick={() => onNavigate('certificates')}
              className="flex items-center gap-2 rounded-xl bg-white/15 text-white backdrop-blur-md border border-white/20 px-4 py-2.5 text-xs font-semibold hover:bg-white/25 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4 text-amber-300" />
              <span>
                {language === 'en' ? 'Public Cert Verification' : 'Verifika Sertifikadu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards with Subtle Tasteful Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={() => onNavigate(stat.page)}
              className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.gradient} p-5 backdrop-blur-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer bg-white/70`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`rounded-xl p-2 bg-white/80 shadow-2xs ${stat.textColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>{stat.subtext}</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Student Lifecycle Funnel + Competency Completion Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competency Completion Analytics (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.completionRate}</h2>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Real-time cohort progress benchmarked against national quality standards'
                  : 'Progresu kohorte tuir padraun kualidade nasionál'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>{language === 'en' ? 'View Students' : 'Haree Estudante'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {competencyProgress.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate max-w-sm">
                    {item.course}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-slate-900">{item.actual}%</span>
                    <span className="text-slate-400">/ {item.target}% target</span>
                    <span className="text-emerald-600 font-medium flex items-center text-[11px]">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {item.trend}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 transition-all duration-700"
                    style={{ width: `${item.actual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Quality Note */}
          <div className="mt-6 rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center gap-3">
            <Shield className="h-5 w-5 text-indigo-600 shrink-0" />
            <p className="text-xs text-slate-600 leading-snug">
              <strong className="text-slate-800">ASQA Standard 1.2 Satisfied:</strong> Strategy and
              assessment tools validate competency prior to qualification issuance with 100%
              evidence verification.
            </p>
          </div>
        </div>

        {/* Student Lifecycle Pipeline (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Student Lifecycle Stages' : 'Etapa Moris Estudante nian'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Enrolment to certification pathway' : 'Dalan matríkula to\'o sertifikasaun'}
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                482 Total
              </span>
            </div>

            <div className="space-y-3">
              {lifecycleStages.map((stage, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('students')}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-200/60"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${stage.color}`} />
                    <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
                      {stage.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {stage.count}
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${stage.color}`}
                        style={{ width: `${stage.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1.5"
            >
              <span>
                {language === 'en' ? 'Open Full Student Directory' : 'Loke Diretóriu Estudante Kompletu'}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Sessions + Recent Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Sessions (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">{t.upcomingSessions}</h2>
            </div>
            <button
              onClick={() => onNavigate('scheduling')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>{language === 'en' ? 'Open Timetable' : 'Loke Oráriu'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {sessions.slice(0, 3).map((ses) => (
              <div
                key={ses.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  ses.hasConflict
                    ? 'border-amber-200 bg-amber-50/60'
                    : 'border-slate-200/70 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {ses.unitCode}
                      </span>
                      {ses.hasConflict && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full animate-pulse">
                          <AlertTriangle className="h-3 w-3" />
                          Conflict
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-slate-800 mt-1">{ses.title}</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                    {ses.date} • {ses.startTime} - {ses.endTime}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span>Trainer: <strong className="text-slate-700">{ses.trainerName}</strong></span>
                  <span>•</span>
                  <span>Venue: {ses.venue}</span>
                  <span>•</span>
                  <span>Cohort: {ses.cohort}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Compliance & Audit Feed (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-xs backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">{t.recentAuditFeed}</h2>
            </div>
            <button
              onClick={() => onNavigate('compliance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>{language === 'en' ? 'Audit Register' : 'Rejistu Auditoria'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
                  <FileCheck2 className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp.split(' ')[1]}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">{log.details}</p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>Actor: {log.actor}</span>
                    <span>•</span>
                    <span>Hash: {log.hash.slice(0, 10)}...</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
