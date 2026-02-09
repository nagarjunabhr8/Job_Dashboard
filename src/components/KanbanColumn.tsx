import type { Job, JobStatus } from '../types/job';
import { JOB_STATUS_LABELS } from '../types/job';
import { JobCard } from './JobCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
  onAddJob: (status: JobStatus) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

export function KanbanColumn({ 
  status, 
  jobs, 
  onAddJob, 
  onEditJob, 
  onDeleteJob
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[280px] w-[280px] max-w-[280px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm text-gray-700">
            {JOB_STATUS_LABELS[status]}
          </h2>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        </div>
        <button
          onClick={() => onAddJob(status)}
          className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          title="Add job"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Content */}
      <div 
        className={`flex-1 rounded-xl p-2 min-h-[200px] max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin ${
          status === 'saved' ? 'bg-gray-50/50' :
          status === 'applied' ? 'bg-blue-50/30' :
          status === 'screening' ? 'bg-yellow-50/30' :
          status === 'interview' ? 'bg-purple-50/30' :
          status === 'offer' ? 'bg-green-50/30' :
          'bg-red-50/30'
        }`}
      >
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>No jobs yet</p>
              <button
                onClick={() => onAddJob(status)}
                className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                Add one
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={onEditJob}
                onDelete={onDeleteJob}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
