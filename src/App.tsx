import React, { useState } from 'react';
import { Sidebar, PageId } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './components/pages/DashboardPage';
import { StudentsPage } from './components/pages/StudentsPage';
import { AssessmentsPage } from './components/pages/AssessmentsPage';
import { TrainersPage } from './components/pages/TrainersPage';
import { SchedulingPage } from './components/pages/SchedulingPage';
import { TASPage } from './components/pages/TASPage';
import { CertificatesPage } from './components/pages/CertificatesPage';
import { CompliancePage } from './components/pages/CompliancePage';

import {
  Language,
  ScheduledSession,
  AuditLog,
  AssessmentRecord,
} from './types';
import {
  mockStudents,
  mockTrainers,
  mockScheduledSessions,
  mockAuditLogs,
} from './data/mockData';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation & Layout State
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live State
  const [sessions, setSessions] = useState<ScheduledSession[]>(mockScheduledSessions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Field assessment navigation linkage
  const [fieldStudentId, setFieldStudentId] = useState<string | null>(null);
  const [fieldUnitCode, setFieldUnitCode] = useState<string | null>(null);

  const hasSchedulingConflict = sessions.some((s) => s.hasConflict);

  const handleLaunchFieldAssessment = (studentId: string, unitCode: string) => {
    setFieldStudentId(studentId);
    setFieldUnitCode(unitCode);
    setCurrentPage('assessments');
  };

  const handleAssessmentRecorded = (newRecord: AssessmentRecord) => {
    // Add audit log entry
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(8900 + Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: newRecord.assessorName,
      role: 'Assessor',
      category: 'Assessment',
      action: `Practical Observation ${newRecord.result}`,
      details: `Unit ${newRecord.unitCode} assessed for ${newRecord.studentName} with ${newRecord.evidenceCount} evidence photo proofs.`,
      ipAddress: '103.14.92.11 (Mobile Terminal)',
      hash: `0x${Math.random().toString(16).substring(2, 18)}`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleSessionsUpdate = (updatedSessions: ScheduledSession[]) => {
    setSessions(updatedSessions);
    // Add audit log for conflict resolution
    const newLog: AuditLog = {
      id: `LOG-${Math.floor(8900 + Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Elena Rostova',
      role: 'Compliance Director',
      category: 'Compliance',
      action: 'Timetable Scheduling Conflict Resolved',
      details: 'Auto-shifted Computer Lab 3 session to avoid double-booking trainer David Chen.',
      ipAddress: '103.14.92.5',
      hash: `0x${Math.random().toString(16).substring(2, 18)}`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/20 to-sky-50/30 text-slate-900 font-sans antialiased">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => {
          setCurrentPage(page);
          if (page !== 'assessments') {
            setFieldStudentId(null);
            setFieldUnitCode(null);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        language={language}
        hasSchedulingConflict={hasSchedulingConflict}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar with Global Search, Multilingual Toggle & Profile */}
        <TopBar
          language={language}
          onToggleLanguage={(lang) => setLanguage(lang)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* Interactive Quick Tour Pill for Sales Demo */}
        <div className="bg-gradient-to-r from-indigo-900/90 via-violet-900/90 to-slate-900/90 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-indigo-200">
              {language === 'en' ? 'Client Sales Demo Mode:' : 'Modu Demonstrasaun ba Kliente:'}
            </span>
            <span className="hidden sm:inline text-slate-300">
              {language === 'en'
                ? 'Try the headline Assessor Authorization Blocker, Mobile Offline Field Tablet, or Public QR Verification.'
                : 'Teste Trava Autorizasaun Avaliadór, Tablet Terrenu Offline, ka Verifikasaun Públika.'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage('trainers')}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300 transition-colors cursor-pointer"
            >
              ⚡ {language === 'en' ? 'Assessor Blocker' : 'Trava Avaliadór'}
            </button>
            <button
              onClick={() => setCurrentPage('assessments')}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-sky-300 transition-colors cursor-pointer"
            >
              📱 {language === 'en' ? 'Offline Tablet' : 'Tablet Offline'}
            </button>
            <button
              onClick={() => setCurrentPage('certificates')}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
            >
              🔒 {language === 'en' ? 'Public Verify' : 'Verifika Públiku'}
            </button>
          </div>
        </div>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="mx-auto max-w-7xl">
            {currentPage === 'dashboard' && (
              <DashboardPage
                language={language}
                onNavigate={(page) => setCurrentPage(page)}
                sessions={sessions}
                auditLogs={auditLogs}
              />
            )}

            {currentPage === 'students' && (
              <StudentsPage
                students={mockStudents}
                language={language}
                onLaunchFieldAssessment={handleLaunchFieldAssessment}
              />
            )}

            {currentPage === 'assessments' && (
              <AssessmentsPage
                language={language}
                onRecordAdded={handleAssessmentRecorded}
                preSelectedStudentId={fieldStudentId}
                preSelectedUnitCode={fieldUnitCode}
              />
            )}

            {currentPage === 'trainers' && (
              <TrainersPage
                trainers={mockTrainers}
                language={language}
              />
            )}

            {currentPage === 'scheduling' && (
              <SchedulingPage
                sessions={sessions}
                onUpdateSessions={handleSessionsUpdate}
                language={language}
              />
            )}

            {currentPage === 'tas' && (
              <TASPage language={language} />
            )}

            {currentPage === 'certificates' && (
              <CertificatesPage language={language} />
            )}

            {currentPage === 'compliance' && (
              <CompliancePage
                language={language}
                auditLogs={auditLogs}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
