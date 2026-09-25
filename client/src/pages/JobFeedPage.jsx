import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { JobFilterBar } from '../components/jobs/JobFilterBar';
import { JobCard } from '../components/jobs/JobCard';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MapPin, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';

export const JobFeedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  
  // 1-Click Apply Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [workerNote, setWorkerNote] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);

  const { isAuthenticated, isWorker, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    locality: searchParams.get('locality') || 'All Localities',
    category: searchParams.get('category') || 'All Categories',
    wageType: searchParams.get('wageType') || '',
    urgency: searchParams.get('urgency') || '',
    search: searchParams.get('search') || '',
    page: 1
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        limit: 12
      };
      const res = await jobService.getJobs(params);
      setJobs(res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Update URL query params
    const params = new URLSearchParams();
    if (newFilters.locality && newFilters.locality !== 'All Localities') params.set('locality', newFilters.locality);
    if (newFilters.category && newFilters.category !== 'All Categories') params.set('category', newFilters.category);
    if (newFilters.wageType) params.set('wageType', newFilters.wageType);
    if (newFilters.urgency) params.set('urgency', newFilters.urgency);
    if (newFilters.search) params.set('search', newFilters.search);
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      locality: 'All Localities',
      category: 'All Categories',
      wageType: '',
      urgency: '',
      search: '',
      page: 1
    };
    setFilters(defaultFilters);
    setSearchParams(new URLSearchParams());
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      addToast('Please login or register to apply for jobs', 'info');
      navigate('/login?redirect=/jobs');
      return;
    }
    if (!isWorker) {
      addToast('Employers cannot apply for jobs. Switch to a worker account.', 'error');
      return;
    }
    setSelectedJobForApply(job);
    setWorkerNote('I am interested and available to start immediately.');
  };

  const handleConfirmApply = async () => {
    if (!selectedJobForApply) return;
    setSubmittingApply(true);
    try {
      await applicationService.applyToJob(selectedJobForApply._id, workerNote);
      addToast(`Applied successfully to ${selectedJobForApply.title}!`, 'success');
      setSelectedJobForApply(null);
      // Refresh job applicant count
      fetchJobs();
    } catch (err) {
      addToast(err.message || 'Application failed', 'error');
    } finally {
      setSubmittingApply(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Hyderabad Job Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {loading ? 'Searching local jobs...' : `${meta.total} active positions available near you`}
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <JobFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 h-72 animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-14 bg-gray-100 rounded-xl"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onApply={handleApplyClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-800">No jobs match your filters</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Try choosing 'All Localities' or selecting another category to see more openings in Hyderabad.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      )}

      {/* 1-Click Quick Apply Modal */}
      <Modal
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        title="Quick 1-Click Application"
      >
        {selectedJobForApply && (
          <div className="space-y-4">
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-3">
              <h4 className="font-bold text-sm text-brand-900">{selectedJobForApply.title}</h4>
              <p className="text-xs text-brand-700">{selectedJobForApply.businessName} • {selectedJobForApply.location?.locality}</p>
              <div className="mt-1 font-bold text-xs text-emerald-700">
                ₹{selectedJobForApply.wage?.amount} / {selectedJobForApply.wage?.type}
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-1">
              <p className="font-semibold text-gray-800">Your profile details will be sent directly:</p>
              <p>👤 <strong>Name:</strong> {user?.name}</p>
              <p>📞 <strong>Phone:</strong> {user?.phone}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Optional note to employer (e.g. shift preference or start time):
              </label>
              <textarea
                rows={2}
                value={workerNote}
                onChange={(e) => setWorkerNote(e.target.value)}
                maxLength={150}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                placeholder="Can start today morning..."
              />
              <span className="text-[10px] text-gray-400 block text-right">
                {workerNote.length}/150 characters
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                className="flex-1"
                onClick={() => setSelectedJobForApply(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                loading={submittingApply}
                onClick={handleConfirmApply}
              >
                Confirm & Apply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
