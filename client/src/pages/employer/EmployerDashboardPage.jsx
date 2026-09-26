import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  PlusCircle,
  Users,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  ArrowRight,
  Briefcase
} from 'lucide-react';

export const EmployerDashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getMyJobs();
      setJobs(res.data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch jobs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();

    const handleApplicationChanged = () => {
      fetchMyJobs();
    };

    window.addEventListener('pocketpay:application-changed', handleApplicationChanged);
    return () => {
      window.removeEventListener('pocketpay:application-changed', handleApplicationChanged);
    };
  }, []);

  const handleToggleStatus = async (jobId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await jobService.updateJobStatus(jobId, nextStatus);
      addToast(`Job status updated to ${nextStatus}`, 'success');
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: nextStatus } : j))
      );
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleMarkFilled = async (jobId) => {
    try {
      await jobService.updateJobStatus(jobId, 'filled');
      addToast('Job marked as Filled! Congratulations.', 'success');
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: 'filled' } : j))
      );
    } catch (err) {
      addToast(err.message || 'Failed to update job', 'error');
    }
  };

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);
  const activeJobsCount = jobs.filter((j) => j.status === 'active').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Business Header Banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {profile?.businessName || `${user?.name}'s Business`}
              </h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                Employer
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {profile?.address?.locality || 'Hyderabad'}, Hyderabad • {user?.phone}
            </p>
          </div>
        </div>

        <Link
          to="/employer/post-job"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job (60s)</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">Active Jobs</span>
          <div className="text-2xl font-black text-brand-600 mt-1">{activeJobsCount}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase">Total Applicants</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalApplicants}</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">Business Profile</span>
            <div className="text-xs font-bold text-gray-800 mt-1">Verified Locality</div>
          </div>
          <Link
            to="/employer/profile"
            className="text-xs font-semibold text-brand-600 hover:underline"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Your Posted Jobs</h3>
            <p className="text-xs text-gray-500">Manage listings and view applicant phone numbers</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 h-36 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-8 bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 shadow-sm space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-base font-bold text-gray-900 hover:text-brand-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <Badge
                        variant={
                          job.status === 'active'
                            ? 'emerald'
                            : job.status === 'filled'
                            ? 'blue'
                            : 'gray'
                        }
                        size="xs"
                      >
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                      <span>{job.category}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">
                        ₹{job.wage?.amount} / {job.wage?.type}
                      </span>
                      <span>•</span>
                      <span>{job.location?.locality}, Hyderabad</span>
                      <span>•</span>
                      <span>{job.vacancies} vacancies</span>
                    </div>
                  </div>

                  {/* Applicants CTA Button */}
                  <Link
                    to={`/employer/jobs/${job._id}/applicants`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold text-xs border border-brand-200 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Candidates ({job.applicantsCount || 0})</span>
                  </Link>
                </div>

                {/* Bottom Quick Controls */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-gray-400">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.status !== 'filled' && (
                      <button
                        onClick={() => handleToggleStatus(job._id, job.status)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        {job.status === 'active' ? (
                          <>
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Pause Job</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume Job</span>
                          </>
                        )}
                      </button>
                    )}

                    {job.status !== 'filled' && (
                      <button
                        onClick={() => handleMarkFilled(job._id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg transition-colors flex items-center gap-1 border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark Filled</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">You haven't posted any jobs yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Post an opening in under 60 seconds to start receiving applications from workers in your Hyderabad neighborhood.
            </p>
            <Link
              to="/employer/post-job"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Your First Job</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
