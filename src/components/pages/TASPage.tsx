import React, { useState } from 'react';
import {
  BookOpenCheck,
  FileText,
  History,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TrainingStrategy, AssessmentToolMapping, Language } from '../../types';
import { translations, mockTASStrategies } from '../../data/mockData';

interface TASPageProps {
  language: Language;
}

export const TASPage: React.FC<TASPageProps> = ({ language }) => {
  const t = translations[language];
  const [strategies, setStrategies] = useState<TrainingStrategy[]>(mockTASStrategies);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('TAS-UEE30820');
  const [previewTool, setPreviewTool] = useState<{
    tool: AssessmentToolMapping;
    lang: 'en' | 'tet';
  } | null>(null);

  const currentStrategy = strategies.find((s) => s.id === selectedStrategyId) || strategies[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.tas} — {language === 'en' ? 'Training & Assessment Strategy Matrix' : 'Estratéjia Formasaun & Avaliasaun'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Version-controlled ASQA/INDMO compliance strategies with bilingual English & Tetum assessment instruments.'
              : 'Estratéjia formasaun kontrolada ho versaun no instrumentu avaliasaun bilingue Inglés & Tetun.'}
          </p>
        </div>

        {/* Strategy selector dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStrategyId}
            onChange={(e) => setSelectedStrategyId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.qualificationCode} - {s.qualificationTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Qualification & Strategy Header Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-xs backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 mb-1">
              {currentStrategy.qualificationCode}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentStrategy.qualificationTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentStrategy.targetGroup}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {currentStrategy.currentVersion}
            </span>
          </div>
        </div>

        {/* Delivery Mode & Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              DELIVERY METHODOLOGY & WORKSHOP PRACTICUM
            </span>
            <p className="text-slate-700 font-medium leading-relaxed">
              {currentStrategy.deliveryMode}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ENTRY & LLN PREREQUISITES
            </span>
            <p className="text-slate-700 font-medium leading-relaxed">
              {currentStrategy.entryRequirements}
            </p>
          </div>
        </div>
      </div>

      {/* Version History (CRITICAL REQUIREMENT) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            {language === 'en' ? 'Version History & Audit Lineage' : 'Istóriku Versaun & Auditoria'}
          </h3>
        </div>

        <div className="space-y-2">
          {currentStrategy.versions.map((ver, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {ver.version}
                </span>
                <span className="font-medium text-slate-800">{ver.changeSummary}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono shrink-0">
                <span>Approved by: {ver.approvedBy}</span>
                <span>•</span>
                <span>{ver.releaseDate}</span>
                <span
                  className={`px-2 py-0.2 rounded-full font-sans font-bold text-[10px] ${
                    ver.status === 'Current Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {ver.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Rows of Assessment Tools Mapped to Units (CRITICAL REQUIREMENT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'en'
                ? 'Assessment Tools Mapped to Units of Competency'
                : 'Ferramenta Avaliasaun Mapeada ba Unidade Kompeténsia'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'en'
                ? 'Each accredited unit includes synchronized English & Tetum marking guides and observation checklists.'
                : 'Kada unidade inklui guia avaliasaun sinkronizadu iha lian Inglés no Tetun.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              <Globe2 className="h-3.5 w-3.5" />
              <span>Bilingual Rubrics (EN / TET)</span>
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Unit of Competency</th>
                <th className="py-3.5 px-4">Instrument Type</th>
                <th className="py-3.5 px-4">Resource Code</th>
                <th className="py-3.5 px-4">Industry Validation</th>
                <th className="py-3.5 px-4 text-center">English Version</th>
                <th className="py-3.5 px-4 text-center">Tetum Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentStrategy.assessmentTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-mono font-bold text-indigo-700">{tool.unitCode}</div>
                    <div className="font-medium text-slate-800 line-clamp-1 mt-0.5">
                      {tool.unitTitle}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                      {tool.toolType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {tool.resourceCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Validated</span>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      {tool.industryValidator}
                    </div>
                  </td>

                  {/* Dual English / Tetum Version Buttons */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setPreviewTool({ tool, lang: 'en' })}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      <span>🇬🇧 EN Tool</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setPreviewTool({ tool, lang: 'tet' })}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 hover:text-amber-900 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800 transition-colors cursor-pointer"
                    >
                      <span>🇹🇱 TET Gia</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bilingual Assessment Instrument Preview Modal */}
      {previewTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">{previewTool.lang === 'en' ? '🇬🇧' : '🇹🇱'}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {previewTool.lang === 'en' ? 'English Assessment Instrument' : 'Instrumentu Avaliasaun Tetun'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {previewTool.tool.resourceCode} • {previewTool.tool.unitCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewTool(null)}
                className="rounded-xl border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">
                  {previewTool.lang === 'en'
                    ? `Assessment Guide: ${previewTool.tool.unitTitle}`
                    : `Guia Avaliasaun: ${previewTool.tool.unitTitle} (Tradusaun Ofisiál Tetun)`}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {previewTool.lang === 'en'
                    ? 'This assessment guide contains the validated benchmark answers, performance observation criteria, required equipment checklist, and safety requirements aligned with ASQA Standards for RTOs 2015.'
                    : 'Gia ida-ne\'e kontein resposta padraun valida, kritériu observasaun prátika, lista ekipamentu nesesáriu, no ezijénsia seguransa konforme padraun nasionál TVET INDMO.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  {previewTool.lang === 'en'
                    ? 'Sample Performance Criteria & Marking Rubric'
                    : 'Ezemplu Kritériu Desempenhu & Rubrika Nota'}
                </h4>

                <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  <div className="p-3 bg-white flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-slate-800 block">Criterion 1: Safe Isolation & LOTO</strong>
                      <span className="text-slate-600">
                        {previewTool.lang === 'en'
                          ? 'Candidate isolates power source, locks tag, and performs test-before-touch verification.'
                          : 'Kandidatu izola fonte enerjia, xave tag, no halo teste antes kaer sirkuitu.'}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Satisfactory
                    </span>
                  </div>

                  <div className="p-3 bg-white flex items-start justify-between gap-3">
                    <div>
                      <strong className="text-slate-800 block">Criterion 2: Circuit Diagnostics</strong>
                      <span className="text-slate-600">
                        {previewTool.lang === 'en'
                          ? 'Accurate calculation and measurement of voltage drop across resistance elements using calibrated meter.'
                          : 'Kalkulasaun no medida voltajen drop presizu uza multímetru kalibradu tuir padraun.'}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      Satisfactory
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="text-[11px] text-slate-400">
                  Industry Endorsed: {previewTool.tool.industryValidator}
                </div>
                <button
                  onClick={() => {
                    alert(
                      language === 'en'
                        ? 'Simulated PDF download started. File: ' + previewTool.tool.resourceCode + '.pdf'
                        : 'Simulasaun download PDF hahú ona. Ficheiru: ' + previewTool.tool.resourceCode + '.pdf'
                    );
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Full Tool PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
