export type Language = 'en' | 'tet';

export type StudentStage = 'Enquiry' | 'Enrolled' | 'In Training' | 'Completed' | 'Certified';

export type UnitStatus = 'Competent' | 'In Progress' | 'Not Started' | 'NYC' | 'RPL';

export interface UnitCompetency {
  code: string;
  title: string;
  titleTet: string;
  nominalHours: number;
  theoryStatus: 'Passed' | 'Pending' | 'Not Attempted';
  theoryScore?: number;
  practicalStatus: 'Satisfactory' | 'Pending' | 'Not Attempted';
  overallStatus: UnitStatus;
  assessorName?: string;
  assessedDate?: string;
}

export interface Student {
  id: string;
  usi: string; // Unique Student Identifier
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  cohort: string;
  stage: StudentStage;
  progressPercent: number;
  enrolmentDate: string;
  completionDate?: string;
  avatar: string;
  employer?: string;
  units: UnitCompetency[];
}

export interface AssessorCredential {
  unitCode: string;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expired';
}

export interface TrainerAssessor {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
  taeCredential: string; // e.g., TAE40122 Certificate IV in Training and Assessment
  taeValidUntil: string;
  industryExperienceYears: number;
  currencyStatus: 'Compliant' | 'Pending Review' | 'Expired';
  authorisedUnits: AssessorCredential[];
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  unitCode: string;
  unitTitle: string;
  type: 'Theory' | 'Practical Observation' | 'Workplace Portfolio';
  assessorId: string;
  assessorName: string;
  date: string;
  result: 'Competent' | 'Not Yet Competent' | 'Under Review';
  location: string;
  hasEvidence: boolean;
  evidenceCount: number;
}

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'video' | 'document';
  title: string;
  timestamp: string;
  geoTag: string;
  url: string;
  verified: boolean;
}

export interface ObservationCriterion {
  id: string;
  text: string;
  textTet: string;
  checked: boolean;
}

export interface ScheduledSession {
  id: string;
  title: string;
  unitCode: string;
  cohort: string;
  trainerId: string;
  trainerName: string;
  venue: string;
  equipment: string[];
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  studentCount: number;
  hasConflict?: boolean;
  conflictDetails?: string;
}

export interface TASVersion {
  version: string;
  releaseDate: string;
  approvedBy: string;
  changeSummary: string;
  status: 'Current Approved' | 'Archived' | 'Draft';
}

export interface AssessmentToolMapping {
  id: string;
  unitCode: string;
  unitTitle: string;
  toolType: 'Theory Exam' | 'Practical Observation' | 'Workplace Project' | 'Third-Party Report';
  resourceCode: string;
  enDocUrl: string;
  tetDocUrl: string;
  validationDate: string;
  industryConsulted: boolean;
  industryValidator: string;
}

export interface TrainingStrategy {
  id: string;
  qualificationCode: string;
  qualificationTitle: string;
  currentVersion: string;
  targetGroup: string;
  deliveryMode: string;
  entryRequirements: string;
  versions: TASVersion[];
  assessmentTools: AssessmentToolMapping[];
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  usi: string;
  qualificationCode: string;
  qualificationTitle: string;
  issueDate: string;
  signatory: string;
  signatoryTitle: string;
  status: 'Valid' | 'Revoked' | 'Expired';
  qrCodeUrl: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  category: 'Assessment' | 'Certification' | 'Compliance' | 'TAS' | 'Student';
  action: string;
  details: string;
  ipAddress: string;
  hash: string;
}

export interface ComplaintAppeal {
  id: string;
  lodgedDate: string;
  complainantType: 'Student' | 'Employer' | 'Trainer' | 'External';
  complainantName: string;
  category: 'Assessment Appeal' | 'Training Quality' | 'Facilities & Safety' | 'Admin & Fees';
  description: string;
  status: 'Under Review' | 'Resolved' | 'Escalated to ASQA/INAP';
  assignedOfficer: string;
  resolution?: string;
}

export interface ContinuousImprovement {
  id: string;
  source: 'Audit Finding' | 'Student Feedback' | 'Industry Advisory' | 'Moderation Meeting';
  identifiedDate: string;
  issue: string;
  actionPlan: string;
  leadPerson: string;
  targetDate: string;
  status: 'Implemented' | 'In Progress' | 'Planned';
  outcome: string;
}
