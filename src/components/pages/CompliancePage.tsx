import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Hash,
  Sparkles,
} from 'lucide-react';
import { AuditLog, ComplaintAppeal, ContinuousImprovement, Language } from '../../types';
import {
  translations,
  mockAuditLogs,
  mockComplaints,
  mockContinuousImprovement,
} from '../../data/mockData';

interface CompliancePageProps {
  language: Language;
  auditLogs: AuditLog[];
}

export const CompliancePage: React.FC<CompliancePageProps> = ({
  language,
  auditLogs,
}) => {
  const t = translations[language];

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'audit-trail' | 'complaints' | 'continuous-improvement'>(
    'audit-trail'
  );

  // Filter state for audit logs
  const [searchAudit, setSearchAudit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Complaints state
  const [complaints, setComplaints] = useState<ComplaintAppeal[]>(mockComplaints);
  const [ciItems, setCiItems] = useState<ContinuousImprovement[]>(mockContinuousImprovement);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCat = selectedCategory === 'All' || log.category === selectedCategory;
    const q = searchAudit.toLowerCase();
    const matchesQuery =
      !q ||
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.id.toLowerCase().includes(q);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.compliance} — {language === 'en' ? 'Quality & Governance Hub' : 'Sentru Kualidade & Governasaun'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Immutable cryptographic audit trails, student complaints registers, and continuous improvement tracking.'
              : 'Rejistu auditoria kriptográfiku imutavel, keixa & rekursu, no melloria kontínua.'}
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('audit-trail')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'audit-trail'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Audit Trail' : 'Trilha Auditoria'}</span>
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'complaints'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Complaints & Appeals' : 'Keixa & Rekursu'}</span>
          </button>
          <button
            onClick={() => setActiveTab('continuous-improvement')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'continuous-improvement'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{language === 'en' ? 'Continuous Improvement' : 'Melloria Kontínua'}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: IMMUTABLE AUDIT TRAIL TABLE */}
      {activeTab === 'audit-trail' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchAudit}
                onChange={(e) => setSearchAudit(e.target.value)}
                placeholder="Search actor, action, details, hash..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="All">All Categories</option>
                <option value="Assessment">Assessment</option>
                <option value="Certification">Certification</option>
                <option value="Compliance">Compliance</option>
                <option value="TAS">TAS</option>
                <option value="Student">Student</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Log ID & Timestamp</th>
                  <th className="py-3.5 px-4">Actor & Role</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Action Taken</th>
                  <th className="py-3.5 px-4">Audit Details</th>
                  <th className="py-3.5 px-4">IP / Source</th>
                  <th className="py-3.5 px-4 text-right">Integrity Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 font-mono">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-indigo-700">{log.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.timestamp}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-semibold text-slate-900">{log.actor}</div>
                      <div className="text-[10px] text-slate-500">{log.role}</div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          log.category === 'Compliance'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : log.category === 'Assessment'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-semibold text-slate-800">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-600 max-w-sm">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-4 text-[10px] text-slate-400">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-500">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {log.hash}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: COMPLAINTS & APPEALS REGISTER */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Complaints & Appeals Register (ASQA Standard 6)
              </h2>
              <p className="text-xs text-slate-500">
                Transparent and prompt handling of student grievances, assessment appeals, and employer notices.
              </p>
            </div>
            <button
              onClick={() => {
                alert('New appeal ticket dialogue initiated. Workflow assigned to Compliance Director.');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log New Appeal</span>
            </button>
          </div>

          <div className="space-y-3">
            {complaints.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-xs">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{item.category}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Lodged: {item.lodgedDate} • By: {item.complainantName} ({item.complainantType})
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{item.description}</p>

                {item.resolution && (
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs space-y-0.5">
                    <strong className="text-slate-800 block text-[11px]">
                      RESOLUTION ACTION (Officer: {item.assignedOfficer})
                    </strong>
                    <p className="text-slate-600">{item.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CONTINUOUS IMPROVEMENT (CI) REGISTER */}
      {activeTab === 'continuous-improvement' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Continuous Improvement Register (CI)
              </h2>
              <p className="text-xs text-slate-500">
                Documented evidence of systemic enhancements in training packages, assessment tools, and learner support.
              </p>
            </div>
            <button
              onClick={() => {
                alert('Continuous Improvement proposal form loaded.');
              }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add CI Action</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ciItems.map((ci) => (
              <div
                key={ci.id}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-xs backdrop-blur-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-xs">
                      {ci.id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      Source: {ci.source}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{ci.issue}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    <strong>Action Plan:</strong> {ci.actionPlan}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Lead: {ci.leadPerson}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-sans font-bold text-[10px] ${
                        ci.status === 'Implemented'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {ci.status}
                    </span>
                  </div>
                  <div className="bg-emerald-50/60 p-2 rounded-xl text-[11px] text-emerald-900 border border-emerald-100">
                    <strong>Outcome:</strong> {ci.outcome}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
