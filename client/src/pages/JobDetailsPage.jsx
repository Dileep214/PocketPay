import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  MapPin,
  Clock,
  Users,
  IndianRupee,
  Building,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Calendar,
  Share2
} from 'lucide-react';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [workerNote, setWorkerNote] = useState('Available to start immediately.');
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, isWorker, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobService.getJobById(id);
        setJob(res.data);
      } catch (err) {
        addToast(err.message || 'Job not found', 'error');
      } finally {
        setLoading(false);
      }
    };

    const checkApplication = async () => {
      if (isAuthenticated && isWorker) {
        try {
          const res = await applicationService.getMyApplications();
          const apps = res.data || [];
          const exists = apps.some((app) => (app.jobId?._id || app.jobId) === id);
          setHasApplied(exists);
        } catch (err) {
          // ignore error in check
        }
      }
    };

    fetchJob();
    checkApplication();
  }, [id, isAuthenticated, isWorker]);

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await applicationService.applyToJob(id, workerNote);
      setHasApplied(true);
      setApplyModalOpen(false);
      addToast('Application submitted successfully!', 'success');
      // Increment applicant counter visually
      setJob((prev) => ({ ...prev, applicantsCount: (prev.applicantsCount || 0) + 1 }));
    } catch (err) {
      addToast(err.message || 'Failed to submit application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Look at this job on WorkNear: ${job?.title} at ${job?.businessName}, Hyderabad`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Job link copied to clipboard!', 'info');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-3/4"></div>
        <div className="h-28 bg-gray-100 rounded-2xl"></div>
        <div className="h-40 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Job Not Found</h2>
        <Link to="/jobs" className="text-sm font-semibold text-brand-600">
          ← Return to job listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-8 space-y-6">
      {/* Top Navigation & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-700 shadow-sm transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Main Job Header Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue" size="sm">
              {job.category}
            </Badge>
            {job.urgency === 'immediate' && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current text-red-600" />
                Immediate Need
              </span>
            )}
            <span className="text-xs text-gray-500">
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700">
            <Building className="w-4 h-4 text-brand-600" />
            <span>{job.businessName}</span>
          </div>
        </div>

        {/* Wage & Work Timings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              Wage / Salary
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">
              ₹{job.wage?.amount?.toLocaleString('en-IN')}
              <span className="text-sm font-medium text-emerald-600 ml-1">
                / {job.wage?.type}
              </span>
            </div>
            {job.wage?.isNegotiable && (
              <span className="text-[11px] text-emerald-800 font-medium">Negotiable based on experience</span>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Shift & Timings
            </span>
            <div className="text-lg font-bold text-gray-800 capitalize">
              {job.workTimings?.shift} Shift
            </div>
            <div className="text-xs text-gray-600">
              {job.workTimings?.hoursPerDay || 8} hours per day
            </div>
          </div>
        </div>

        {/* Location & Vacancies Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-gray-100 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">{job.location?.locality}, Hyderabad</p>
              <p className="text-gray-500 text-xs">{job.location?.addressText}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900">{job.vacancies} Positions Available</p>
              <p className="text-gray-500 text-xs">{job.applicantsCount || 0} candidates applied so far</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Job Role & Requirements</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>
      </div>

      {/* Sticky Bottom Apply Action Bar (Mobile & Desktop) */}
      <div className="fixed md:static bottom-0 left-0 right-0 z-30 bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 p-4 md:p-0 shadow-lg md:shadow-none">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <span className="text-xs text-gray-500 block">Total Pay</span>
            <span className="text-xl font-bold text-emerald-700">
              ₹{job.wage?.amount} / {job.wage?.type}
            </span>
          </div>

          {hasApplied ? (
            <div className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You Have Applied (Status: Under Review)</span>
            </div>
          ) : !isAuthenticated ? (
            <Link
              to={`/login?redirect=/jobs/${job._id}`}
              className="w-full md:w-auto text-center px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all"
            >
              Login to Apply in 1 Tap
            </Link>
          ) : isWorker ? (
            <Button
              size="lg"
              className="w-full md:w-auto px-8"
              onClick={() => setApplyModalOpen(true)}
            >
              1-Tap Apply Now
            </Button>
          ) : (
            <div className="text-xs text-gray-500 italic">
              (You are logged in as an Employer)
            </div>
          )}
        </div>
      </div>

      {/* 1-Click Application Confirmation Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Submit 1-Click Application"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Your verified phone number (<strong>{user?.phone}</strong>) and profile will be submitted to{' '}
            <strong>{job.businessName}</strong>. If shortlisted, they will call or WhatsApp you directly.
          </p>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Add a quick note (Optional):
            </label>
            <textarea
              rows={2}
              value={workerNote}
              onChange={(e) => setWorkerNote(e.target.value)}
              maxLength={150}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => setApplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              loading={submitting}
              onClick={handleApply}
            >
              Send Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
