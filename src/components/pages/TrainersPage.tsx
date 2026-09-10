import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  AlertOctagon,
  CheckCircle2,
  Lock,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  FileBadge,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { TrainerAssessor, Language } from '../../types';
import { translations, mockTrainers } from '../../data/mockData';

interface TrainersPageProps {
  trainers: TrainerAssessor[];
  language: Language;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ trainers, language }) => {
  const t = translations[language];

  // Unit options for testing authorization
  const availableUnits = [
    { code: 'UEENEEE104A', title: 'Solve problems in d.c. circuits (Electrotechnology)' },
    { code: 'UEENEEE101A', title: 'Apply OHS regulations, codes and practices in the workplace' },
    { code: 'CPCCWHS1001', title: 'Prepare to work safely in the construction industry (White Card)' },
    { code: 'CPCCCA3002', title: 'Carry out setting out (Carpentry & Civil)' },
    { code: 'SITXFSA005', title: 'Use hygienic practices for food safety (Commercial Cookery)' },
    { code: 'BSBWHS411', title: 'Implement and monitor WHS policies & procedures (Leadership)' },
  ];

  // State for the Headline Authorization Validator
  const [selectedUnitCode, setSelectedUnitCode] = useState<string>('UEENEEE104A');
  const [selectedAssessorId, setSelectedAssessorId] = useState<string>('TRN-02'); // Default to Maria da Costa (Expired) to showcase the feature immediately!
  const [assessmentDate, setAssessmentDate] = useState<string>('2026-09-10'); // Today's date in our simulation

  // Validation Logic
  const validationResult = useMemo(() => {
    const assessor = trainers.find((tr) => tr.id === selectedAssessorId);
    if (!assessor) {
      return {
        authorized: false,
        reason: 'Assessor profile not located in active register.',
        errorType: 'unknown',
      };
    }

    // 1. Check general TAE Currency
    const dateSelected = new Date(assessmentDate);
    const taeExpiry = new Date(assessor.taeValidUntil);
    const isTaeExpired = dateSelected > taeExpiry;

    // 2. Check if assessor is authorised for this specific unit
    const unitAuth = assessor.authorisedUnits.find(
      (u) => u.unitCode === selectedUnitCode
    );

    if (!unitAuth) {
      return {
        authorized: false,
        reason: `${assessor.name} is NOT credentialed or authorised for unit ${selectedUnitCode}. Scope of practice covers other vocational disciplines.`,
        errorType: 'scope_mismatch',
        assessor,
      };
    }

    // 3. Check effective date range for this unit
    const validFrom = new Date(unitAuth.validFrom);
    const validTo = new Date(unitAuth.validTo);
    const isDateInRange = dateSelected >= validFrom && dateSelected <= validTo;

    if (isTaeExpired || !isDateInRange || unitAuth.status === 'Expired') {
      return {
        authorized: false,
        reason: isTaeExpired
          ? `${assessor.name}'s TAE certification expired on ${assessor.taeValidUntil}. Assessment decision on ${assessmentDate} is strictly prohibited by ASQA Standard 1.14.`
          : `Scope authorization for unit ${selectedUnitCode} expired on ${unitAuth.validTo}. Effective currency evidence is overdue.`,
        errorType: 'expired_credential',
        assessor,
        unitAuth,
      };
    }

    return {
      authorized: true,
      reason: `${assessor.name} holds active TAE40122 certification and current industry currency for ${selectedUnitCode} (Valid until ${unitAuth.validTo}).`,
      errorType: 'none',
      assessor,
      unitAuth,
    };
  }, [trainers, selectedAssessorId, selectedUnitCode, assessmentDate]);

  // Demo presets
  const handleSelectPreset = (scenario: 'expired' | 'scope' | 'valid') => {
    if (scenario === 'expired') {
      setSelectedAssessorId('TRN-02'); // Maria da Costa
      setSelectedUnitCode('UEENEEE104A');
      setAssessmentDate('2026-09-10');
    } else if (scenario === 'scope') {
      setSelectedAssessorId('TRN-03'); // Alex Santos (Civil)
      setSelectedUnitCode('UEENEEE104A'); // Electrotechnology
      setAssessmentDate('2026-09-10');
    } else {
      setSelectedAssessorId('TRN-01'); // David Chen
      setSelectedUnitCode('UEENEEE104A');
      setAssessmentDate('2026-09-10');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Headline Compliance Technology</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.trainers} — {language === 'en' ? 'Assessor Register & Scope Guard' : 'Rejistu Avaliadór & Guardiao Kredensiál'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Effective-dated credentials, industry currency tracking, and automated audit blocking for uncredentialed assessment attempts.'
              : 'Kredensiál ho data efetiva, akonpanhamentu kurrénsia indústria, no trava automátika ba tentativa avaliasaun la autorizada.'}
          </p>
        </div>
      </div>

      {/* CRITICAL DEMO FEATURE: Interactive Assessor Authorization Blocker */}
      <div className="rounded-3xl border-2 border-indigo-200/90 bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/20 p-5 sm:p-7 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-indigo-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs">
                ★
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {t.assessorAuthorizationHeadline}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Test how the compliance engine intercepts and prevents invalid assessment entries before they contaminate the national database.'
                : 'Teste oinsá sistema trava rejistu avaliasaun bainhira avaliadór la iha kredensiál válidu.'}
            </p>
          </div>

          {/* Quick Demo Scenario Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {language === 'en' ? 'Quick Demo Scenarios:' : 'Senáriu Rápidu:'}
            </span>
            <button
              id="btn-test-expired"
              onClick={() => handleSelectPreset('expired')}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                selectedAssessorId === 'TRN-02'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-100/80 text-rose-800 hover:bg-rose-200'
              }`}
            >
              🔴 Expired Credential (Blocked)
            </button>
            <button
              id="btn-test-scope"
              onClick={() => handleSelectPreset('scope')}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                selectedAssessorId === 'TRN-03'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-100/80 text-rose-800 hover:bg-rose-200'
              }`}
            >
              🔴 Scope Mismatch (Blocked)
            </button>
            <button
              id="btn-test-valid"
              onClick={() => handleSelectPreset('valid')}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                selectedAssessorId === 'TRN-01'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-100/80 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              🟢 Fully Authorised (Passed)
            </button>
          </div>
        </div>

        {/* Input Parameters: Unit, Assessor, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Unit of Competency
            </label>
            <select
              id="select-validator-unit"
              value={selectedUnitCode}
              onChange={(e) => setSelectedUnitCode(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {availableUnits.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code} - {u.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Selected Assessor
            </label>
            <select
              id="select-validator-assessor"
              value={selectedAssessorId}
              onChange={(e) => setSelectedAssessorId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              {trainers.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.name} ({tr.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Assessment Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="input-validator-date"
                type="date"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Verification Output Banner */}
        <div className="mt-6">
          {!validationResult.authorized ? (
            /* VISIBLE HIGH-IMPACT RED WARNING (HEADLINE FEATURE) */
            <div
              id="banner-assessor-blocked"
              className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-5 shadow-md space-y-3 transition-all animate-fadeIn"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shrink-0 shadow-sm animate-pulse">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                    <Lock className="h-3 w-3" />
                    SYSTEM COMPLIANCE LOCK ENGAGED
                  </div>
                  <h3 className="text-base font-extrabold text-rose-950">
                    {language === 'en'
                      ? 'Assessor not authorised for this unit on this date'
                      : 'Avaliadór la iha autorizasaun ba unidade ida-ne\'e iha data ne\'e'}
                  </h3>
                  <p className="text-xs font-semibold text-rose-800 mt-1 leading-relaxed">
                    {validationResult.reason}
                  </p>
                </div>
              </div>

              {/* Detailed Compliance Audit Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-rose-200/80 text-xs font-mono">
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-slate-500 block uppercase">ASQA Standard 1.14</span>
                  <span className="text-rose-700 font-bold">NON-COMPLIANT</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Scope of Registration</span>
                  <span className="text-rose-700 font-bold">UNAUTHORIZED / LAPSED</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Audit Consequence</span>
                  <span className="text-rose-900 font-bold">CRITICAL FINDING (Level 3)</span>
                </div>
              </div>

              {/* Locked Button */}
              <div className="pt-2 flex items-center justify-between">
                <p className="text-[11px] text-rose-700 italic">
                  Decision cannot be submitted or recorded into student transcripts without compliance override by RTO Manager.
                </p>
                <button
                  disabled
                  className="rounded-xl bg-slate-300 text-slate-500 px-4 py-2 text-xs font-bold cursor-not-allowed flex items-center gap-2 opacity-80"
                >
                  <Lock className="h-4 w-4" />
                  <span>Decision Submission Blocked</span>
                </button>
              </div>
            </div>
          ) : (
            /* GREEN AUTHORIZED BANNER */
            <div
              id="banner-assessor-authorized"
              className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-5 shadow-sm space-y-3 transition-all animate-fadeIn"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shrink-0 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    <CheckCircle2 className="h-3 w-3" />
                    ASQA STANDARDS SATISFIED
                  </div>
                  <h3 className="text-base font-extrabold text-emerald-950">
                    {t.assessorAuthorizedMsg}
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    {validationResult.reason}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-emerald-200">
                <p className="text-[11px] text-emerald-700">
                  All evidence criteria verified against National Training Register (TGA) & INDMO credentials.
                </p>
                <button
                  onClick={() => {
                    alert(
                      language === 'en'
                        ? 'Assessor authorization confirmed! Proceeding to practical observation record.'
                        : 'Autorizasaun avaliadór konfirmada! Kontinua ba rejistu observasaun.'
                    );
                  }}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Proceed to Authorize Assessment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trainers & Assessors Register */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Registered Assessors & Scope Matrix' : 'Rejistu Avaliadór & Matris Ámbitu'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'en'
                ? 'Effective-dated credentials mapped to accredited units of competency'
                : 'Kredensiál ho data válidu mapeadu ba unidade kompeténsia'}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {trainers.length} Staff Registered
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {trainers.map((tr) => (
            <div
              key={tr.id}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-sm space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={tr.avatar}
                    alt={tr.name}
                    className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{tr.name}</h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          tr.currencyStatus === 'Compliant'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tr.currencyStatus === 'Expired'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {tr.currencyStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{tr.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TAE CREDENTIAL</span>
                    <span className="font-semibold text-slate-800">{tr.taeCredential}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VALID UNTIL</span>
                    <span
                      className={`font-mono font-semibold ${
                        new Date(tr.taeValidUntil) < new Date('2026-09-10')
                          ? 'text-rose-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {tr.taeValidUntil}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authorized Units Matrix Table */}
              <div className="border-t border-slate-100 pt-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Authorized Scope of Assessment (Effective-Dated)
                </div>
                <div className="flex flex-wrap gap-2">
                  {tr.authorisedUnits.map((auth, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-2 text-xs flex items-center gap-2 font-mono ${
                        auth.status === 'Active'
                          ? 'bg-slate-50 border-slate-200 text-slate-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <span className="font-bold text-indigo-700">{auth.unitCode}</span>
                      <span className="text-[10px] text-slate-400">
                        {auth.validFrom} to {auth.validTo}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          auth.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {auth.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
