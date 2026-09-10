import React, { useState } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Lock,
  Globe,
  Sparkles,
  Eye,
} from 'lucide-react';
import { CertificateRecord, Language } from '../../types';
import { translations, mockCertificates } from '../../data/mockData';

interface CertificatesPageProps {
  language: Language;
}

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ language }) => {
  const t = translations[language];

  // Active sub-view: 'register' or 'public-verification'
  const [activeSubTab, setActiveSubTab] = useState<'register' | 'public-verification'>('register');

  // Certificate list state
  const [certificates, setCertificates] = useState<CertificateRecord[]>(mockCertificates);
  const [searchFilter, setSearchFilter] = useState('');

  // Selected certificate for document view
  const [viewingCert, setViewingCert] = useState<CertificateRecord | null>(null);

  // Public verification state
  const [verificationInput, setVerificationInput] = useState('CERT-2026-0149');
  const [verificationResult, setVerificationResult] = useState<{
    searched: boolean;
    status: 'Valid' | 'NotFound' | 'Revoked';
    cert?: CertificateRecord;
  }>({
    searched: true,
    status: 'Valid',
    cert: mockCertificates[0],
  });

  const handleVerify = (certIdToTest?: string) => {
    const idToUse = (certIdToTest || verificationInput).trim().toUpperCase();
    const found = certificates.find(
      (c) => c.certificateNumber.toUpperCase() === idToUse
    );

    if (!found) {
      setVerificationResult({ searched: true, status: 'NotFound' });
    } else if (found.status === 'Revoked') {
      setVerificationResult({ searched: true, status: 'Revoked', cert: found });
    } else {
      setVerificationResult({ searched: true, status: 'Valid', cert: found });
    }
  };

  const handleOpenPublicVerifyWithCert = (certNumber: string) => {
    setVerificationInput(certNumber);
    setActiveSubTab('public-verification');
    handleVerify(certNumber);
  };

  const filteredCerts = certificates.filter((c) => {
    const q = searchFilter.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.qualificationTitle.toLowerCase().includes(q) ||
      c.usi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.certificates} — {language === 'en' ? 'Issuance & Verification Engine' : 'Emetisaun & Verifikasaun Sertifikadu'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Cryptographically authenticated parchment certificates with public zero-knowledge QR verification.'
              : 'Sertifikadu dijitál ho QR code no verifikasaun públika ne\'ebé proteje privasidade pesoál.'}
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveSubTab('register')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'register'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>{language === 'en' ? 'Issued Registry' : 'Rejistu Emtidu'}</span>
          </button>
          <button
            id="btn-tab-public-verification"
            onClick={() => setActiveSubTab('public-verification')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeSubTab === 'public-verification'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{language === 'en' ? 'Public Verification Portal' : 'Portál Verifikasaun Públika'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ISSUED CERTIFICATES REGISTER */}
      {activeSubTab === 'register' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-2xs backdrop-blur-sm">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search certificate ID, recipient, course..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {filteredCerts.length} certificates found
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Certificate ID</th>
                  <th className="py-3.5 px-4">Graduate / Recipient</th>
                  <th className="py-3.5 px-4">USI</th>
                  <th className="py-3.5 px-4">Qualification Conferred</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">QR</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {cert.certificateNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {cert.studentName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {cert.usi}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{cert.qualificationTitle}</div>
                      <div className="text-[10px] font-mono text-indigo-600">{cert.qualificationCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {cert.issueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <img
                        src={cert.qrCodeUrl}
                        alt="QR code"
                        className="h-7 w-7 rounded border border-slate-200"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          cert.status === 'Valid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingCert(cert)}
                          className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View Doc</span>
                        </button>
                        <button
                          onClick={() => handleOpenPublicVerifyWithCert(cert.certificateNumber)}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-all cursor-pointer"
                          title="Verify in public endpoint"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>Verify</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: PUBLIC VERIFICATION MINI-PAGE (CRITICAL REQUIREMENT) */}
      {activeSubTab === 'public-verification' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Public Portal Frame */}
          <div className="rounded-3xl border-2 border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2 border-b border-slate-100 pb-5">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-1">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {t.publicVerificationTitle}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {t.publicVerificationDesc}
              </p>
            </div>

            {/* Quick Test Samples */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Test Inputs:
              </span>
              <button
                onClick={() => {
                  setVerificationInput('CERT-2026-0149');
                  handleVerify('CERT-2026-0149');
                }}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-mono font-medium text-slate-700"
              >
                CERT-2026-0149 (Valid)
              </button>
              <button
                onClick={() => {
                  setVerificationInput('CERT-2026-0082');
                  handleVerify('CERT-2026-0082');
                }}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-mono font-medium text-slate-700"
              >
                CERT-2026-0082 (Valid)
              </button>
              <button
                onClick={() => {
                  setVerificationInput('CERT-REVOKED-99');
                  handleVerify('CERT-REVOKED-99');
                }}
                className="rounded-lg bg-rose-50 hover:bg-rose-100 px-2.5 py-1 text-xs font-mono font-medium text-rose-700"
              >
                CERT-REVOKED-99 (Revoked)
              </button>
              <button
                onClick={() => {
                  setVerificationInput('FAKE-NOT-FOUND');
                  handleVerify('FAKE-NOT-FOUND');
                }}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-mono font-medium text-slate-700"
              >
                FAKE-999 (Not Found)
              </button>
            </div>

            {/* Verification Form */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="input-certificate-id"
                  type="text"
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  placeholder="Enter Certificate Identifier (e.g. CERT-2026-0149)"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-3 py-2.5 text-sm font-mono font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 uppercase"
                />
              </div>
              <button
                id="btn-verify-certificate"
                onClick={() => handleVerify()}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                {t.verifyButton}
              </button>
            </div>

            {/* Verification Result Card: Strictly Minimal, Zero Personal Data */}
            {verificationResult.searched && (
              <div className="pt-2 animate-fadeIn">
                {verificationResult.status === 'Valid' && verificationResult.cert && (
                  <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/90 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                          NATIONAL REGISTER CONFIRMATION
                        </div>
                        <h3 className="text-base font-extrabold text-emerald-950">
                          {t.statusValid}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">QUALIFICATION CONFERRED</span>
                        <span className="font-semibold text-slate-900">{verificationResult.cert.qualificationTitle}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">CONFERRAL DATE</span>
                        <span className="font-semibold text-slate-900">{verificationResult.cert.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">ISSUING ENTITY</span>
                        <span className="font-semibold text-slate-900">RTO #41289 (Accredited Provider)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">DOCUMENT HASH</span>
                        <span className="font-semibold text-slate-900">SHA-256 0x4f..9b</span>
                      </div>
                    </div>

                    {/* Zero Personal Data Privacy Guarantee */}
                    <div className="rounded-xl bg-white/80 p-3 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                      <Lock className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Privacy-Preserving Minimal Response:</strong>
                        <p className="mt-0.5 text-slate-600">
                          No student name, date of birth, contact details, or performance scores are disclosed on this public verification endpoint.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationResult.status === 'NotFound' && (
                  <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shrink-0">
                        <XCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800">
                          AUDIT QUERY RETURN
                        </div>
                        <h3 className="text-base font-extrabold text-rose-950">
                          {t.statusNotFound}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      The identifier <strong>"{verificationInput}"</strong> does not correspond to any valid, recorded qualification credential issued by this Registered Training Organisation.
                    </p>
                  </div>
                )}

                {verificationResult.status === 'Revoked' && (
                  <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shrink-0">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                          BOARD NOTICE
                        </div>
                        <h3 className="text-base font-extrabold text-amber-950">
                          {t.statusRevoked}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      This certificate credential was rescinded or revoked following compliance/academic review. It carries no legal vocational standing.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Certificate Document Modal */}
      {viewingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-amber-50/95 p-8 sm:p-12 shadow-2xl border-8 border-amber-800/20 text-slate-800 space-y-6">
            <button
              onClick={() => setViewingCert(null)}
              className="absolute top-4 right-4 rounded-xl bg-slate-200/80 hover:bg-slate-300 p-2 text-slate-600 transition-colors"
            >
              ✕
            </button>

            {/* Certificate Layout */}
            <div className="text-center space-y-3 border-b-2 border-amber-900/20 pb-6">
              <div className="flex justify-center mb-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md">
                  <Award className="h-9 w-9 text-amber-200" />
                </div>
              </div>
              <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-amber-900">
                EAST TIMOR INSTITUTE OF TECHNOLOGY • RTO #41289
              </h4>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
                Official Testamur & Qualification
              </h2>
              <p className="text-xs text-slate-500 italic">
                Issued in accordance with the Standards for Registered Training Organisations & INDMO Framework
              </p>
            </div>

            <div className="text-center space-y-4 py-2">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                This is to certify that
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950 underline decoration-amber-500/40 decoration-2 underline-offset-8">
                {viewingCert.studentName}
              </h3>
              <p className="text-xs font-mono text-slate-500">
                Unique Student Identifier (USI): {viewingCert.usi}
              </p>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                has satisfied all academic requirements and demonstrated vocational competency in the prescribed qualification:
              </p>
              <div className="rounded-2xl bg-white/70 p-4 border border-amber-200/60 max-w-xl mx-auto shadow-2xs">
                <h4 className="text-lg font-serif font-bold text-slate-900">
                  {viewingCert.qualificationTitle}
                </h4>
                <div className="font-mono text-xs font-bold text-indigo-700 mt-1">
                  National Code: {viewingCert.qualificationCode}
                </div>
              </div>
            </div>

            {/* Bottom Signatories & QR Code */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-amber-900/20 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={viewingCert.qrCodeUrl}
                  alt="Official verification QR code"
                  className="h-16 w-16 rounded-lg border-2 border-amber-900/30 p-1 bg-white"
                />
                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-500 block">TESTAMUR NUMBER</span>
                  <strong className="text-slate-900">{viewingCert.certificateNumber}</strong>
                  <span className="text-[10px] text-slate-500 block mt-1">CONFERRED ON</span>
                  <span>{viewingCert.issueDate}</span>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic font-semibold text-slate-800 text-sm">
                  Elena Rostova
                </div>
                <div className="w-44 h-0.5 bg-slate-400 mx-auto sm:ml-auto" />
                <div className="text-[11px] font-semibold text-slate-700">
                  {viewingCert.signatoryTitle}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
