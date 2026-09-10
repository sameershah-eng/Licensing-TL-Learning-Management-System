import React, { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Smartphone,
  Tablet,
  MapPin,
  Calendar,
  User,
  PenTool,
  RotateCcw,
  Upload,
  Check,
  Eye,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  AssessmentRecord,
  EvidenceItem,
  ObservationCriterion,
  Language,
  Student,
} from '../../types';
import {
  translations,
  mockAssessments,
  mockEvidenceItems,
  mockObservationCriteria,
  mockStudents,
} from '../../data/mockData';

interface AssessmentsPageProps {
  language: Language;
  onRecordAdded?: (newRecord: AssessmentRecord) => void;
  preSelectedStudentId?: string | null;
  preSelectedUnitCode?: string | null;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({
  language,
  onRecordAdded,
  preSelectedStudentId,
  preSelectedUnitCode,
}) => {
  const t = translations[language];

  // Active view: 'field-tablet' or 'records-list'
  const [activeTab, setActiveTab] = useState<'field-tablet' | 'records-list'>('field-tablet');

  // Offline / Online state toggle for the field demonstration
  const [isOffline, setIsOffline] = useState<boolean>(true);
  const [queuedSyncCount, setQueuedSyncCount] = useState<number>(3);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Field capture form state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preSelectedStudentId || 'STU-2026-081'
  );
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>(
    preSelectedUnitCode || 'UEENEEE104A'
  );
  const [assessorName, setAssessorName] = useState<string>('David Chen (TRN-01)');
  const [criteria, setCriteria] = useState<ObservationCriterion[]>(mockObservationCriteria);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(mockEvidenceItems);
  const [assessmentResult, setAssessmentResult] = useState<'Competent' | 'Not Yet Competent'>(
    'Competent'
  );
  const [assessorNotes, setAssessorNotes] = useState<string>(
    'Candidate demonstrated thorough voltage drop analysis and correct LOTO procedure. All PPE maintained.'
  );
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<EvidenceItem | null>(null);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(true);

  // Assessment records state
  const [records, setRecords] = useState<AssessmentRecord[]>(mockAssessments);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Initialize canvas with a clean mock signature if canvas is mounted
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Draw pre-existing sample signature stroke
        ctx.beginPath();
        ctx.moveTo(30, 45);
        ctx.bezierCurveTo(60, 20, 90, 60, 120, 30);
        ctx.bezierCurveTo(140, 15, 170, 70, 200, 35);
        ctx.moveTo(70, 50);
        ctx.lineTo(180, 50);
        ctx.stroke();
      }
    }
  }, [activeTab]);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const toggleCriterion = (id: string) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const handleToggleOfflineMode = () => {
    if (isOffline) {
      // Switching to Online
      setIsOffline(false);
      setSyncNotice(
        language === 'en'
          ? 'Network re-established: Synchronising 3 encrypted field records to Central RTO Cloud...'
          : 'Rede ligadu: Sinkroniza rejistu terrenu 3 ba Servidór Sentrál...'
      );
      setTimeout(() => {
        setQueuedSyncCount(0);
        setSyncNotice(
          language === 'en'
            ? 'All field records successfully verified and cryptographically synced!'
            : 'Rejistu terrenu hotu sinkronizadu no verifikadu ho susesu!'
        );
      }, 1500);
    } else {
      setIsOffline(true);
      setQueuedSyncCount(3);
      setSyncNotice(
        language === 'en'
          ? 'Switched to Offline Mode — Field records will be stored locally in SQLite/IndexedDB'
          : 'Modu Offline ativu — Rejistu terrenu sei rai iha memória lokál'
      );
    }
  };

  const handleSubmitFieldAssessment = () => {
    const student = mockStudents.find((s) => s.id === selectedStudentId);
    const newRecord: AssessmentRecord = {
      id: `ASS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: selectedStudentId,
      studentName: student ? `${student.firstName} ${student.lastName}` : 'Candidate',
      unitCode: selectedUnitCode,
      unitTitle: selectedUnitCode === 'UEENEEE104A' ? 'Solve problems in d.c. circuits' : 'Workplace Safety Inductions',
      type: 'Practical Observation',
      assessorId: 'TRN-01',
      assessorName: 'David Chen',
      date: new Date().toISOString().split('T')[0],
      result: assessmentResult,
      location: 'Dili Electrical Workshop Bay 2',
      hasEvidence: true,
      evidenceCount: evidenceList.length,
    };

    setRecords([newRecord, ...records]);
    if (onRecordAdded) {
      onRecordAdded(newRecord);
    }
    setSubmitSuccess(true);
    if (isOffline) {
      setQueuedSyncCount((prev) => prev + 1);
    }
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.assessments} — {language === 'en' ? 'Field & Institutional Assessment Center' : 'Sentru Avaliasaun Terrenu & Institusionál'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Multi-mode theory and practical assessment management with rugged offline field capture.'
              : 'Jestaun avaliasaun teoria no prátika ho kapasidade foti dadus terrenu offline.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('field-tablet')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'field-tablet'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tablet className="h-4 w-4" />
            <span>{language === 'en' ? 'Field Capture (Tablet View)' : 'Avalia Terrenu (Tablet)'}</span>
          </button>
          <button
            onClick={() => setActiveTab('records-list')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'records-list'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{language === 'en' ? 'All Assessment Records' : 'Rejistu Avaliasaun Hotu'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Notice if active */}
      {syncNotice && (
        <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3 text-xs text-indigo-900 flex items-center justify-between transition-all animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="font-medium">{syncNotice}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* View 1: Rugged Tablet Mockup Field Capture Screen */}
      {activeTab === 'field-tablet' && (
        <div className="flex flex-col items-center justify-center">
          {/* Rugged Tablet Frame */}
          <div className="w-full max-w-4xl rounded-[36px] bg-slate-900 p-4 sm:p-6 shadow-2xl border-4 border-slate-700/80 relative">
            {/* Tablet Camera & Speaker Bar */}
            <div className="flex items-center justify-between px-6 pb-3 pt-1 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-600" />
                <span className="font-mono text-[11px] text-slate-300">RUGGED-TAB-TL #409</span>
              </div>
              <div className="h-3 w-3 rounded-full bg-slate-800 ring-2 ring-slate-700 mx-auto" />
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span>BAT 88%</span>
                <div className="w-5 h-2.5 rounded-xs border border-slate-400 p-0.5 flex">
                  <div className="bg-emerald-400 w-3.5 h-full rounded-xs" />
                </div>
              </div>
            </div>

            {/* Tablet Display Screen */}
            <div className="rounded-2xl bg-white overflow-hidden shadow-inner text-slate-800">
              {/* Device Top Status Bar: OFFLINE / ONLINE INDICATOR (CRITICAL REQUIREMENT) */}
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-6 py-2.5 transition-colors ${
                  isOffline
                    ? 'bg-amber-500 text-slate-950 font-medium'
                    : 'bg-emerald-600 text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  {isOffline ? (
                    <WifiOff className="h-4 w-4 shrink-0 text-slate-950 animate-pulse" />
                  ) : (
                    <Wifi className="h-4 w-4 shrink-0 text-white" />
                  )}
                  <div>
                    <span className="font-bold">
                      {isOffline ? t.offlineIndicator : t.onlineSynced}
                    </span>
                    <span className="ml-2 text-[11px] opacity-90">
                      {isOffline
                        ? `(${queuedSyncCount} records queued locally)`
                        : '(0 pending)'}
                    </span>
                  </div>
                </div>

                {/* Interactive Toggle for Sales Demo */}
                <button
                  id="btn-toggle-offline"
                  onClick={handleToggleOfflineMode}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all shadow-xs cursor-pointer ${
                    isOffline
                      ? 'bg-slate-950 text-amber-300 hover:bg-slate-800'
                      : 'bg-white text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {isOffline ? 'SIMULATE RECONNECT & SYNC' : 'SIMULATE OFFLINE REMOTE FIELD'}
                </button>
              </div>

              {/* Tablet App Content Body */}
              <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* Header within App */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      <Tablet className="h-3.5 w-3.5" />
                      <span>Field Assessor App v4.2 (Offline Engine)</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      Practical Observation Sign-Off Sheet
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    <span>Dili Electrical Workshop 3</span>
                  </div>
                </div>

                {/* Candidate & Unit Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Candidate Student
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {mockStudents.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.firstName} {s.lastName} ({s.usi} - {s.cohort})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Unit of Competency
                    </label>
                    <select
                      value={selectedUnitCode}
                      onChange={(e) => setSelectedUnitCode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      <option value="UEENEEE104A">UEENEEE104A - Solve problems in d.c. circuits</option>
                      <option value="UEENEEE101A">UEENEEE101A - Apply OHS regulations in the workplace</option>
                      <option value="CPCCWHS1001">CPCCWHS1001 - Prepare to work safely in construction</option>
                      <option value="SITXFSA005">SITXFSA005 - Use hygienic practices for food safety</option>
                    </select>
                  </div>
                </div>

                {/* Timestamped Photo/Video Evidence Thumbnails (CRITICAL REQUIREMENT) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="h-4 w-4 text-indigo-600" />
                        <span>Time-Stamped Photographic & Visual Evidence</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Geo-tagged, GPS & cryptographic time-stamped proof of performance
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        alert(
                          language === 'en'
                            ? 'Camera capture opened. New photo evidence queued with GPS timestamp.'
                            : 'Kamera loke ona. Evidénsia foun rai ona ho data GPS.'
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <Camera className="h-3.5 w-3.5 text-slate-600" />
                      <span>Add Snapshot</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {evidenceList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEvidenceModal(item)}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 cursor-pointer shadow-xs hover:ring-2 hover:ring-indigo-500 transition-all"
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          className="h-28 w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-2.5 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono text-emerald-400 backdrop-blur-xs flex items-center gap-1">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              VERIFIED
                            </span>
                            <Eye className="h-3.5 w-3.5 text-white/80 group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-[11px] font-medium text-white line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-[9px] font-mono text-slate-300 mt-0.5">
                              {item.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observation Checklist (CRITICAL REQUIREMENT) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                        <span>Performance Observation Checklist</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {language === 'en'
                          ? 'Assessor marks criteria as directly observed in real-world task execution'
                          : 'Avaliadór marka kritériu sira ne\'ebé haree direitamente iha pratika'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 font-mono">
                      {criteria.filter((c) => c.checked).length}/{criteria.length} Satisfied
                    </span>
                  </div>

                  <div className="space-y-2">
                    {criteria.map((crit) => (
                      <div
                        key={crit.id}
                        onClick={() => toggleCriterion(crit.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          crit.checked
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            crit.checked
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {crit.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 text-xs">
                          <p className="font-semibold text-slate-900 leading-snug">
                            {language === 'tet' ? crit.textTet : crit.text}
                          </p>
                          {language !== 'tet' && (
                            <p className="text-[11px] text-slate-500 mt-0.5 italic">
                              Tetun: {crit.textTet}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessor Sign-Off & Verdict Section (CRITICAL REQUIREMENT) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Digital Signature Pad */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <PenTool className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{t.assessorSignOff}</span>
                      </label>
                      <button
                        onClick={handleClearSignature}
                        className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-2 overflow-hidden">
                      <canvas
                        ref={canvasRef}
                        width={360}
                        height={90}
                        onMouseDown={handleStartDraw}
                        onMouseMove={handleDraw}
                        onMouseUp={handleStopDraw}
                        onMouseLeave={handleStopDraw}
                        onTouchStart={handleStartDraw}
                        onTouchMove={handleDraw}
                        onTouchEnd={handleStopDraw}
                        className="w-full h-24 bg-white rounded-lg cursor-crosshair touch-none"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Sign on canvas with finger or mouse to authenticate decision.
                    </p>
                  </div>

                  {/* Competency Decision & Notes */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                        Competency Determination
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAssessmentResult('Competent')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            assessmentResult === 'Competent'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Competent (C)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssessmentResult('Not Yet Competent')}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                            assessmentResult === 'Not Yet Competent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Not Yet Competent (NYC)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Assessor Observational Notes
                      </label>
                      <textarea
                        rows={2}
                        value={assessorNotes}
                        onChange={(e) => setAssessorNotes(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Final Submit & Queue Button */}
                <div className="pt-2">
                  <button
                    id="btn-submit-field-assessment"
                    onClick={handleSubmitFieldAssessment}
                    className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 py-3 text-sm font-bold text-white shadow-md hover:from-indigo-700 hover:to-sky-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>
                      {isOffline
                        ? 'Store in Offline Queue (Will Sync Automatically)'
                        : 'Commit Assessment & Generate Compliance Record'}
                    </span>
                  </button>

                  {submitSuccess && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center animate-fadeIn">
                      ✓ Assessment successfully logged! Record verified with tamper-evident digital seal.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: All Assessment Records Repository */}
      {activeTab === 'records-list' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Record ID</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Unit of Competency</th>
                  <th className="py-3.5 px-4">Assessment Type</th>
                  <th className="py-3.5 px-4">Assessor</th>
                  <th className="py-3.5 px-4">Evidence</th>
                  <th className="py-3.5 px-4">Verdict</th>
                  <th className="py-3.5 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {rec.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {rec.studentName}
                      <div className="text-[10px] text-slate-400 font-mono">{rec.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-slate-800">{rec.unitCode}</div>
                      <div className="text-[11px] text-slate-500">{rec.unitTitle}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                        {rec.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{rec.assessorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rec.location}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {rec.hasEvidence ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                          <Camera className="h-3 w-3" />
                          {rec.evidenceCount} photos
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No photos</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          rec.result === 'Competent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.result === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rec.result === 'Competent' && <CheckCircle2 className="h-3 w-3" />}
                        {rec.result}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                      {rec.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Evidence Viewer Modal */}
      {selectedEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white overflow-hidden shadow-2xl space-y-4">
            <div className="relative">
              <img
                src={selectedEvidenceModal.url}
                alt={selectedEvidenceModal.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedEvidenceModal(null)}
                className="absolute top-3 right-3 rounded-full bg-black/60 text-white p-1.5 hover:bg-black/80 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-5 pt-0 space-y-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
                  <CheckCircle2 className="h-3 w-3" />
                  CRYPTOGRAPHICALLY VERIFIED EVIDENCE
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedEvidenceModal.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">TIMESTAMP</span>
                  <span className="text-slate-800">{selectedEvidenceModal.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">LOCATION / GPS</span>
                  <span className="text-slate-800">{selectedEvidenceModal.geoTag}</span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedEvidenceModal(null)}
                  className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Close Proof Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
