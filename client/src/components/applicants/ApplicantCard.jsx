import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Clock, IndianRupee, Check, X, ShieldCheck } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ApplicantCard = ({ application, onStatusUpdate, jobTitle }) => {
  const [updating, setUpdating] = useState(false);
  const worker = application.workerId || {};
  const profile = application.workerProfile || {};

  const cleanPhone = (worker.phone || '').replace(/[^0-9]/g, '');

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(application._id, newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const isShortlistedOrHired = application.status === 'shortlisted' || application.status === 'hired';

  return (
    <div
      className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
        application.status === 'hired'
          ? 'border-green-300 bg-green-50/20'
          : application.status === 'shortlisted'
          ? 'border-brand-300 bg-brand-50/20 ring-1 ring-brand-200'
          : 'border-gray-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        {/* Candidate Info */}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-gray-900">{worker.name || 'Candidate'}</h4>
            <Badge
              variant={
                application.status === 'hired'
                  ? 'emerald'
                  : application.status === 'shortlisted'
                  ? 'blue'
                  : 'gray'
              }
              size="xs"
            >
              {application.status.toUpperCase()}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-gray-600 mt-1">
            <span className="flex items-center gap-1 font-medium text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              {profile.locality || 'Hyderabad'}, Hyderabad
            </span>
            {profile.experienceLevel && (
              <span className="text-gray-500 capitalize">
                Exp: {profile.experienceLevel.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls for Status */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {application.status !== 'shortlisted' && application.status !== 'hired' && (
            <Button
              size="sm"
              variant="primary"
              loading={updating}
              onClick={() => handleStatusChange('shortlisted')}
            >
              Shortlist & Call
            </Button>
          )}

          {application.status === 'shortlisted' && (
            <Button
              size="sm"
              variant="success"
              loading={updating}
              onClick={() => handleStatusChange('hired')}
            >
              Mark Hired ✅
            </Button>
          )}

          {application.status !== 'rejected' && application.status !== 'hired' && (
            <button
              disabled={updating}
              onClick={() => handleStatusChange('rejected')}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-xs"
              title="Reject"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Worker Skills Pills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {profile.skills.map((skill, index) => (
            <span
              key={index}
              className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Note from worker */}
      {application.workerNote && (
        <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-700 italic border border-gray-100 mb-3">
          "{application.workerNote}"
        </div>
      )}

      {/* Direct Contact Action Bar (Unlocked for Shortlisted or Hired) */}
      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Phone: <strong className="text-gray-800">{worker.phone}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {/* Native Phone Dialer Link */}
          <a
            href={`tel:${worker.phone}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>

          {/* WhatsApp Direct Chat Hook */}
          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hi ${worker.name}, I am contacting you regarding your application for the ${jobTitle || 'job'} on WorkNear.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
