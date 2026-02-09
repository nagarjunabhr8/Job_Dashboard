export type JobStatus = 
  | 'saved' 
  | 'applied' 
  | 'screening' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn';

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  source: string; // LinkedIn, Indeed, Company Website, Referral, etc.
  resumeUsed: string;
  status: JobStatus;
  dateApplied?: string;
  salary?: string;
  location?: string;
  notes: string;
  updates: JobUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface JobUpdate {
  id: string;
  date: string;
  message: string;
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  saved: 'bg-gray-100 text-gray-700 border-gray-200',
  applied: 'bg-blue-100 text-blue-700 border-blue-200',
  screening: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  interview: 'bg-purple-100 text-purple-700 border-purple-200',
  offer: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  withdrawn: 'bg-gray-100 text-gray-500 border-gray-200',
};

export const KANBAN_COLUMNS: JobStatus[] = [
  'saved',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
];
