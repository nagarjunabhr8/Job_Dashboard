import { useState, useEffect } from 'react';
import type { Job, JobStatus } from '../types/job';
import { JOB_STATUS_LABELS } from '../types/job';
import { X, Building2, Briefcase, Link2, FileText, MapPin, DollarSign, Calendar, AlignLeft, MessageSquare } from 'lucide-react';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialStatus?: JobStatus;
  editJob?: Job | null;
  onUpdate?: (id: string, job: Partial<Job>) => void;
}

const SOURCES = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Recruiter',
  'AngelList',
  'HackerNews',
  'Other'
];

const RESUME_OPTIONS = [
  'Standard Resume',
  'Technical Resume',
  'Product Manager Resume',
  'Designer Resume',
  'Marketing Resume',
  'Sales Resume',
  'Custom Resume A',
  'Custom Resume B',
  'Other'
];

export function AddJobModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialStatus = 'saved',
  editJob,
  onUpdate
}: AddJobModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    source: SOURCES[0],
    resumeUsed: RESUME_OPTIONS[0],
    status: initialStatus,
    dateApplied: '',
    salary: '',
    location: '',
    notes: '',
  });

  const [newUpdate, setNewUpdate] = useState('');
  const [updates, setUpdates] = useState<{ id: string; date: string; message: string }[]>([]);

  useEffect(() => {
    if (editJob) {
      setFormData({
        companyName: editJob.companyName,
        jobTitle: editJob.jobTitle,
        jobUrl: editJob.jobUrl || '',
        source: editJob.source,
        resumeUsed: editJob.resumeUsed,
        status: editJob.status,
        dateApplied: editJob.dateApplied || '',
        salary: editJob.salary || '',
        location: editJob.location || '',
        notes: editJob.notes,
      });
      setUpdates(editJob.updates);
    } else {
      setFormData({
        companyName: '',
        jobTitle: '',
        jobUrl: '',
        source: SOURCES[0],
        resumeUsed: RESUME_OPTIONS[0],
        status: initialStatus,
        dateApplied: '',
        salary: '',
        location: '',
        notes: '',
      });
      setUpdates([]);
    }
    setNewUpdate('');
  }, [editJob, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editJob && onUpdate) {
      onUpdate(editJob.id, {
        ...formData,
        updates,
      });
    } else {
      onSave({
        ...formData,
        updates,
      });
    }
    onClose();
  };

  const handleAddUpdate = () => {
    if (!newUpdate.trim()) return;
    setUpdates(prev => [{
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      message: newUpdate.trim()
    }, ...prev]);
    setNewUpdate('');
  };

  const handleDeleteUpdate = (id: string) => {
    setUpdates(prev => prev.filter(u => u.id !== id));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {editJob ? 'Edit Job Application' : 'Add New Job'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g., Google"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Title *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Job URL
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.jobUrl}
                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  {SOURCES.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Resume Used *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    required
                    value={formData.resumeUsed}
                    onChange={(e) => setFormData({ ...formData, resumeUsed: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                  >
                    {RESUME_OPTIONS.map(resume => (
                      <option key={resume} value={resume}>{resume}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  {Object.entries(JOB_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date Applied
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dateApplied}
                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g., Remote, New York"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Salary Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g., $100k - $150k"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Notes
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Add any notes about this position..."
                  />
                </div>
              </div>
            </div>

            {/* Updates Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Updates & Progress
              </h3>
              
              {/* Add Update */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newUpdate}
                  onChange={(e) => setNewUpdate(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUpdate())}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                  placeholder="Add an update (e.g., 'Got callback from recruiter')..."
                />
                <button
                  type="button"
                  onClick={handleAddUpdate}
                  disabled={!newUpdate.trim()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Updates List */}
              {updates.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                  {updates.map((update) => (
                    <div 
                      key={update.id}
                      className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{update.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(update.date)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No updates yet. Add one above!</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            {editJob ? 'Save Changes' : 'Add Job'}
          </button>
        </div>
      </div>
    </div>
  );
}
