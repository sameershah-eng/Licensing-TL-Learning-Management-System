import React, { useState } from 'react';
import {
  Search,
  Filter,
  GraduationCap,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building2,
  Calendar,
  ExternalLink,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Student, StudentStage, Language, UnitCompetency } from '../../types';
import { translations } from '../../data/mockData';

interface StudentsPageProps {
  students: Student[];
  language: Language;
  onLaunchFieldAssessment?: (studentId: string, unitCode: string) => void;
  selectedStudentId?: string | null;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({
  students,
  language,
  onLaunchFieldAssessment,
  selectedStudentId: initialSelectedId,
}) => {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    initialSelectedId
      ? students.find((s) => s.id === initialSelectedId) || students[0]
      : null
  );

  const stages: ('All' | StudentStage)[] = [
    'All',
    'Enquiry',
    'Enrolled',
    'In Training',
    'Completed',
    'Certified',
  ];

  const filteredStudents = students.filter((student) => {
    const matchesStage = stageFilter === 'All' || student.stage === stageFilter;
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      student.usi.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query) ||
      student.courseName.toLowerCase().includes(query) ||
      student.cohort.toLowerCase().includes(query) ||
      (student.employer && student.employer.toLowerCase().includes(query));

    return matchesStage && matchesSearch;
  });

  const getStageBadge = (stage: StudentStage) => {
    switch (stage) {
      case 'Enquiry':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Enrolled':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'In Training':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Certified':
        return 'bg-violet-50 text-violet-700 border-violet-200';
    }
  };

  const getUnitStatusBadge = (status: UnitCompetency['overallStatus']) => {
    switch (status) {
      case 'Competent':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Competent (C)
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            <Clock className="h-3 w-3" />
            In Progress
          </span>
        );
      case 'NYC':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-3 w-3" />
            NYC
          </span>
        );
      case 'RPL':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <ShieldCheck className="h-3 w-3" />
            RPL Granted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.students} — {language === 'en' ? 'Student Lifecycle & Training Registry' : 'Rejistu Estudante & Siklu Formasaun'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Comprehensive AVETMISS-compliant student progression tracking mapped to units of competency.'
              : 'Akonpanhamentu progresu estudante konforme padraun AVETMISS mapeadu ba unidade kompeténsia.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredStudents.length}</strong> of{' '}
            {students.length} students
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white/90 p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-sm">
        {/* Stage Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {stages.map((st) => {
            const count =
              st === 'All'
                ? students.length
                : students.filter((s) => s.stage === st).length;
            const isActive = stageFilter === st;

            return (
              <button
                key={st}
                id={`btn-stage-${st.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setStageFilter(st)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{st === 'All' ? (language === 'en' ? 'All' : 'Hotu') : st}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            id="input-students-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Filter by student name, USI, course...'
                : 'Buka naran, USI, kursu...'
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">USI / ID</th>
                <th className="py-3.5 px-4">Qualification / Course</th>
                <th className="py-3.5 px-4">Cohort</th>
                <th className="py-3.5 px-4">Lifecycle Stage</th>
                <th className="py-3.5 px-4">Progress</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const isSelected = selectedStudent?.id === stu.id;
                  return (
                    <tr
                      key={stu.id}
                      onClick={() => setSelectedStudent(stu)}
                      className={`group hover:bg-indigo-50/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-50/70' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={stu.avatar}
                            alt={`${stu.firstName} ${stu.lastName}`}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {stu.firstName} {stu.lastName}
                            </div>
                            <div className="text-[11px] text-slate-400">{stu.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs text-slate-700 font-semibold">
                          {stu.usi}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{stu.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                          {stu.courseName}
                        </div>
                        <div className="text-[10px] font-mono text-indigo-600">{stu.courseId}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {stu.cohort}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStageBadge(
                            stu.stage
                          )}`}
                        >
                          {stu.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-500">
                            <span>{stu.progressPercent}%</span>
                            <span>{stu.units.filter((u) => u.overallStatus === 'Competent').length}/{stu.units.length} Units</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full"
                              style={{ width: `${stu.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(stu);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                        >
                          <span>{language === 'en' ? 'Learning Plan' : 'Planu Formasaun'}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Slide-Over / Modal Panel */}
      {selectedStudent && (
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-md space-y-6">
          {/* Detail Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.firstName}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStageBadge(
                      selectedStudent.stage
                    )}`}
                  >
                    {selectedStudent.stage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStudent.courseName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-mono">USI: <strong className="text-slate-800">{selectedStudent.usi}</strong></span>
                  <span>•</span>
                  <span>Cohort: <strong className="text-slate-800">{selectedStudent.cohort}</strong></span>
                  {selectedStudent.employer && (
                    <>
                      <span>•</span>
                      <span>Employer: <strong className="text-slate-800">{selectedStudent.employer}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                title="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Learning Plan Section Mapped to Units of Competency */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span>{t.unitCompetencies} — {language === 'en' ? 'Individual Learning Plan' : 'Planu Aprendizajen Individuál'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Unit progression, theory examination scores, and practical observation sign-offs'
                    : 'Progresu unidade, nota ezame teoria no asinatura observasaun prátika'}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Unit Code & Title</th>
                    <th className="py-3 px-4">Theory</th>
                    <th className="py-3 px-4">Practical</th>
                    <th className="py-3 px-4">Assessor Sign-Off</th>
                    <th className="py-3 px-4">Competency Status</th>
                    <th className="py-3 px-4 text-right">Field Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedStudent.units.map((unit) => (
                    <tr key={unit.code} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-mono text-xs font-bold text-indigo-700">
                          {unit.code}
                        </div>
                        <div className="font-medium text-slate-900 mt-0.5">
                          {language === 'tet' ? unit.titleTet : unit.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Nominal Hours: {unit.nominalHours} hrs
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            unit.theoryStatus === 'Passed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : unit.theoryStatus === 'Pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {unit.theoryStatus}
                          {unit.theoryScore ? ` (${unit.theoryScore}%)` : ''}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            unit.practicalStatus === 'Satisfactory'
                              ? 'bg-emerald-50 text-emerald-700'
                              : unit.practicalStatus === 'Pending'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {unit.practicalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {unit.assessorName ? (
                          <div className="text-xs">
                            <div className="font-semibold text-slate-800">{unit.assessorName}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {unit.assessedDate}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Awaiting Assessor</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{getUnitStatusBadge(unit.overallStatus)}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          id={`btn-launch-field-${unit.code}`}
                          onClick={() => {
                            if (onLaunchFieldAssessment) {
                              onLaunchFieldAssessment(selectedStudent.id, unit.code);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
                        >
                          <span>{language === 'en' ? 'Field Capture' : 'Avalia Terrenu'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
