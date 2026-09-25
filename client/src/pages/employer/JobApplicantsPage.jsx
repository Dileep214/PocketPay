import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { ApplicantCard } from '../../components/applicants/ApplicantCard';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Users, Briefcase, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

export const JobApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getJobApplications(jobId)
      ]);
      setJob(jobRes.data);
      setApplications(appsRes.data || []);
    } catch (err) {
      addToast(err.message || 'Failed to fetch applicants', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationService.updateCandidateStatus(applicationId, newStatus);
      addToast(`Candidate marked as ${newStatus}!`, 'success');
      setApplications((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      addToast(err.message || 'Status update failed', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/employer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Jobs</span>
        </Link>
      </div>

      {/* Job Context Header */}
      {job && (
        <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">
                Reviewing Candidates
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {job.title}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {job.location?.locality}, Hyderabad • ₹{job.wage?.amount}/{job.wage?.type} • {job.vacancies} vacancies
              </p>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3.5 py-2 rounded-2xl border border-gray-200 self-start sm:self-auto">
              <Users className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold text-gray-800">
                {applications.length} Candidates Applied
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Candidate List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-200 rounded-2xl p-5 h-44 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-10 bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application) => (
              <ApplicantCard
                key={application._id}
                application={application}
                onStatusUpdate={handleStatusUpdate}
                jobTitle={job?.title}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
            <Users className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">No applications received yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              As soon as local workers in Hyderabad apply to this opening, their profile and verified contact details will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
