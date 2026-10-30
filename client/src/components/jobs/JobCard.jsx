import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowRight, Zap } from 'lucide-react';
import { Badge } from '../common/Badge';

export const JobCard = ({ job, onApply }) => {
  const wageLabel = {
    daily: '/ day',
    hourly: '/ hr',
    monthly: '/ month'
  }[job.wage?.type] || '/ day';

  const urgencyPills = {
    immediate: { label: 'Immediate Need', color: 'bg-red-50 text-red-700 border-red-200' },
    this_week: { label: 'This Week', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    flexible: { label: 'Flexible', color: 'bg-blue-50 text-blue-700 border-blue-200' }
  };

  const urgency = urgencyPills[job.urgency] || urgencyPills.immediate;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)] sm:p-5">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-blue-50 via-white to-transparent opacity-90" />

      <div className="relative flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="blue" size="xs">
            {job.category}
          </Badge>
          <span className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${urgency.color}`}>
            {job.urgency === 'immediate' && <Zap className="h-3 w-3 fill-current text-red-600" />}
            {urgency.label}
          </span>
        </div>

        <Link to={`/jobs/${job._id}`} className="block group">
          <h3 className="line-clamp-1 text-base font-black tracking-tight text-slate-900 transition-colors group-hover:text-brand-600 sm:text-lg">
            {job.title}
          </h3>
          <p className="mb-3 text-xs font-medium text-slate-600 sm:text-sm">{job.businessName}</p>
        </Link>

        <div className="mb-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-emerald-50 to-white p-3">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Pay</span>
              <div className="mt-1 flex items-end gap-1 text-xl font-black text-emerald-700 sm:text-2xl">
                <span>₹{job.wage?.amount?.toLocaleString('en-IN')}</span>
                <span className="text-[10px] font-bold text-emerald-600">{wageLabel}</span>
              </div>
            </div>
            {job.wage?.isNegotiable && (
              <span className="rounded-full bg-emerald-200/70 px-2 py-1 text-[10px] font-bold text-emerald-900">
                Negotiable
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
            <span className="font-semibold text-slate-800">{job.location?.locality}</span>
            <span className="text-slate-400">•</span>
            <span className="truncate text-slate-500">{job.location?.city}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span className="capitalize">{job.workTimings?.shift} Shift</span>
            <span className="text-slate-400">•</span>
            <span>{job.workTimings?.hoursPerDay || 8} hrs/day</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
            <span>
              {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
            </span>
            {job.applicantsCount > 0 && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">{job.applicantsCount} applied</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 rounded-2xl bg-slate-100 px-3 py-2.5 text-center text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200 sm:text-sm"
          >
            View Details
          </Link>

          {onApply ? (
            <button
              onClick={() => onApply(job)}
              className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-500 px-3 py-2.5 text-center text-xs font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] transition-all hover:brightness-105 sm:text-sm"
            >
              <span>Apply Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Link
              to={`/jobs/${job._id}`}
              className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-500 px-3 py-2.5 text-center text-xs font-black text-white shadow-[0_12px_24px_rgba(37,99,235,0.28)] transition-all hover:brightness-105 sm:text-sm"
            >
              <span>Apply</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
