import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { APPLICATION_STATUS_MAP } from '../../utils/constants';
import {
  Briefcase,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Building,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Zap
} from 'lucide-react';

export const WorkerDashboardPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationService.getMyApplications();
      setApplications(res.data || []);
    } catch (err) {
      addToast(err.message || 'Could not load your applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId, jobTitle) => {
    if (!window.confirm(`Withdraw application for "${jobTitle}"?`)) return;
    try {
      await applicationService.withdrawApplication(applicationId);
      addToast('Application withdrawn successfully', 'info');
      setApplications((prev) => prev.filter((a) => a._id !== applicationId));
    } catch (err) {
      addToast(err.message || 'Withdrawal failed', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Summary Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 uppercase">
                Worker
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {profile?.locality || 'Hyderabad'}, Hyderabad • {user?.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/worker/profile"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
          >
            Edit Skills & Wage
          </Link>
          <Link
            to="/jobs"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            Find More Jobs
          </Link>
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Your Job Applications</h3>
            <p className="text-xs text-gray-500">Track progress and connect with employers</p>
          </div>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            {applications.length} submitted
          </span>
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
        ) : applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => {
              const job = app.jobId || {};
              const employer = job.employerId || {};
              const statusConfig = APPLICATION_STATUS_MAP[app.status] || APPLICATION_STATUS_MAP.applied;
              const isShortlistedOrHired = app.status === 'shortlisted' || app.status === 'hired';

              return (
                <div
                  key={app._id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${
                    app.status === 'shortlisted'
                      ? 'border-brand-300 ring-1 ring-brand-200'
                      : app.status === 'hired'
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="font-bold text-base text-gray-900 hover:text-brand-600 transition-colors"
                        >
                          {job.title || 'Job Post'}
                        </Link>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-1">
                        <span className="flex items-center gap-1 font-medium text-gray-800">
                          <Building className="w-3.5 h-3.5 text-gray-400" />
                          {job.businessName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          {job.location?.locality}, Hyderabad
                        </span>
                        <span className="font-semibold text-emerald-700">
                          ₹{job.wage?.amount} / {job.wage?.type}
                        </span>
                      </div>
                    </div>

                    {app.status === 'applied' && (
                      <button
                        onClick={() => handleWithdraw(app._id, job.title)}
                        className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1 self-start p-1"
                        title="Withdraw"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    )}
                  </div>

                  {/* Worker's note */}
                  {app.workerNote && (
                    <p className="text-xs text-gray-500 italic mb-3">
                      Your note: "{app.workerNote}"
                    </p>
                  )}

                  {/* Unlocked Employer Contact Hook if Shortlisted or Hired */}
                  {isShortlistedOrHired && employer.phone && (
                    <div className="bg-brand-50/80 border border-brand-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="text-xs text-brand-900">
                        <span className="font-bold block">🎉 The employer shortlisted you!</span>
                        <span>Employer: <strong>{employer.name}</strong> ({employer.phone})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${employer.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Employer</span>
                        </a>

                        <a
                          href={`https://wa.me/${employer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi, I saw that you shortlisted my application for ${job.title} on WorkNear.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-[11px] text-gray-400 flex items-center justify-between pt-2 border-t border-gray-100">
                    <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <span>View Original Job</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">You haven't applied to any jobs yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Browse Hyderabad jobs in your locality and apply in 1 click without any resume.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Browse Local Jobs Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
