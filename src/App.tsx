import { useState, useMemo } from 'react';
import type { Job, JobStatus } from './types/job';
import { JOB_STATUS_LABELS } from './types/job';
import { useLocalStorage } from './hooks/useLocalStorage';
import { KanbanBoard } from './components/KanbanBoard';
import { AddJobModal } from './components/AddJobModal';
import { StatsCard } from './components/StatsCard';
import { 
  Briefcase, 
  Search, 
  Plus, 
  BarChart3, 
  LayoutGrid, 
  CheckCircle2,
  Clock,
  Calendar,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

function App() {
  const [jobs, setJobs] = useLocalStorage<Job[]>('job-board-jobs', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [initialStatus, setInitialStatus] = useState<JobStatus>('saved');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'board' | 'stats'>('board');

  // Stats calculations
  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter(j => j.status !== 'saved').length;
    const interviews = jobs.filter(j => ['interview', 'offer'].includes(j.status)).length;
    const offers = jobs.filter(j => j.status === 'offer').length;
    const thisWeek = jobs.filter(j => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(j.createdAt) > weekAgo;
    }).length;

    return { total, applied, interviews, offers, thisWeek };
  }, [jobs]);

  const handleAddJob = (status: JobStatus = 'saved') => {
    setInitialStatus(status);
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newJob: Job = {
      ...jobData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const handleUpdateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === id 
        ? { ...job, ...updates, updatedAt: new Date().toISOString() }
        : job
    ));
  };

  const handleDeleteJob = (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(prev => prev.filter(job => job.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: JobStatus) => {
    handleUpdateJob(id, { status });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          if (confirm(`Import ${imported.length} jobs? This will merge with your existing data.`)) {
            setJobs(prev => {
              const existingIds = new Set(prev.map(j => j.id));
              const newJobs = imported.filter((j: Job) => !existingIds.has(j.id));
              return [...newJobs, ...prev];
            });
          }
        }
      } catch {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL jobs? This cannot be undone.')) {
      setJobs([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Job Board Assistant</h1>
            </div>

            {/* Nav Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('board')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'board' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Board
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'stats' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Stats
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <label className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Import
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportData} 
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportData}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="h-6 w-px bg-gray-200 mx-1" />
              <button
                onClick={() => handleAddJob('saved')}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Job</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'board' ? (
          <>
            {/* Search Bar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies, resumes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Kanban Board */}
            <KanbanBoard
              jobs={jobs}
              searchQuery={searchQuery}
              onAddJob={handleAddJob}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteJob}
              onStatusChange={handleStatusChange}
            />
          </>
        ) : (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard
                title="Total Jobs"
                value={stats.total}
                icon={<Briefcase className="w-5 h-5" />}
                color="blue"
                subtitle="All tracked applications"
              />
              <StatsCard
                title="Applied"
                value={stats.applied}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="green"
                subtitle={`${stats.total > 0 ? Math.round((stats.applied / stats.total) * 100) : 0}% application rate`}
              />
              <StatsCard
                title="Interviews"
                value={stats.interviews}
                icon={<Calendar className="w-5 h-5" />}
                color="purple"
                subtitle={`${stats.applied > 0 ? Math.round((stats.interviews / stats.applied) * 100) : 0}% interview rate`}
              />
              <StatsCard
                title="Offers"
                value={stats.offers}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="green"
                subtitle={`${stats.interviews > 0 ? Math.round((stats.offers / stats.interviews) * 100) : 0}% offer rate`}
              />
              <StatsCard
                title="This Week"
                value={stats.thisWeek}
                icon={<Clock className="w-5 h-5" />}
                color="yellow"
                subtitle="New applications"
              />
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
                {Object.entries(JOB_STATUS_LABELS).map(([status, label]) => {
                  const count = jobs.filter(j => j.status === status).length;
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-500 mt-1">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
                {jobs.slice(0, 5).length > 0 ? (
                  <div className="space-y-3">
                    {jobs
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map(job => (
                        <div key={job.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{job.jobTitle}</p>
                            <p className="text-sm text-gray-500">{job.companyName}</p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No applications yet</p>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Sources</h2>
                {(() => {
                  const sources = jobs.reduce((acc, job) => {
                    acc[job.source] = (acc[job.source] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const sorted = Object.entries(sources)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5);

                  return sorted.length > 0 ? (
                    <div className="space-y-3">
                      {sorted.map(([source, count]) => (
                        <div key={source} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="text-gray-700">{source}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-500 rounded-full"
                                style={{ width: `${(count / stats.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No data yet</p>
                  );
                })()}
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  Import Data
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportData} 
                    className="hidden"
                  />
                </label>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
        onUpdate={handleUpdateJob}
        initialStatus={initialStatus}
        editJob={editingJob}
      />
    </div>
  );
}

export default App;
