import type { Job } from '../types/job';
import { JOB_STATUS_COLORS, JOB_STATUS_LABELS } from '../types/job';
import { Building2, MapPin, ExternalLink, Calendar, FileText, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysSince = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group relative">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate pr-6" title={job.jobTitle}>
            {job.jobTitle}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Building2 className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{job.companyName}</span>
          </div>
        </div>
        
        {/* Menu button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(job);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(job.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${JOB_STATUS_COLORS[job.status]}`}>
          {JOB_STATUS_LABELS[job.status]}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-gray-500">
        {job.location && (
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <FileText className="w-3 h-3 mr-1.5 flex-shrink-0" />
          <span className="truncate" title={job.resumeUsed}>{job.resumeUsed}</span>
        </div>

        {job.source && (
          <div className="flex items-center">
            <ExternalLink className="w-3 h-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{job.source}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-3 h-3 mr-1" />
          {job.dateApplied ? (
            <span title={`Applied: ${formatDate(job.dateApplied)}`}>
              Applied {getDaysSince(job.dateApplied)}
            </span>
          ) : (
            <span>Added {getDaysSince(job.createdAt)}</span>
          )}
        </div>
        
        {job.updates.length > 0 && (
          <span className="text-xs text-primary-600 font-medium">
            {job.updates.length} update{job.updates.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Click to edit */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => onEdit(job)}
      />
    </div>
  );
}
