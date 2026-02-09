import type { Job, JobStatus } from '../types/job';
import { KANBAN_COLUMNS } from '../types/job';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  jobs: Job[];
  searchQuery: string;
  onAddJob: (status: JobStatus) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

export function KanbanBoard({ 
  jobs, 
  searchQuery,
  onAddJob, 
  onEditJob, 
  onDeleteJob,
  onStatusChange 
}: KanbanBoardProps) {
  
  const getJobsByStatus = (status: JobStatus): Job[] => {
    return jobs
      .filter(job => job.status === status)
      .filter(job => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          job.companyName.toLowerCase().includes(query) ||
          job.jobTitle.toLowerCase().includes(query) ||
          job.source.toLowerCase().includes(query) ||
          job.resumeUsed.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {KANBAN_COLUMNS.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          jobs={getJobsByStatus(status)}
          onAddJob={onAddJob}
          onEditJob={onEditJob}
          onDeleteJob={onDeleteJob}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
