import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, IndianRupee, ArrowRight, Zap } from 'lucide-react';
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
    <div className="bg-white border border-gray-200 hover:border-brand-500 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between">
      <div>
        {/* Top Badges: Category & Urgency */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <Badge variant="blue" size="xs">
            {job.category}
          </Badge>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${urgency.color}`}
          >
            {job.urgency === 'immediate' && <Zap className="w-3 h-3 fill-current text-red-600" />}
            {urgency.label}
          </span>
        </div>

        {/* Title and Business Name */}
        <Link to={`/jobs/${job._id}`} className="block group">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3 line-clamp-1">
            {job.businessName}
          </p>
        </Link>

        {/* Wage Card Highlight */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 mb-3 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Pay</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-700 flex items-center">
              <span>₹{job.wage?.amount?.toLocaleString('en-IN')}</span>
              <span className="text-xs font-medium text-emerald-600 ml-1">{wageLabel}</span>
            </div>
          </div>
          {job.wage?.isNegotiable && (
            <span className="text-[10px] font-medium bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md">
              Negotiable
            </span>
          )}
        </div>

        {/* Essential Job Meta: Locality, Timings, Vacancies */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span className="font-semibold text-gray-800">{job.location?.locality}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 truncate">{job.location?.city}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="capitalize">{job.workTimings?.shift} Shift</span>
            <span className="text-gray-400">•</span>
            <span>{job.workTimings?.hoursPerDay || 8} hrs/day</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>
              {job.vacancies} {job.vacancies === 1 ? 'vacancy' : 'vacancies'}
            </span>
            {job.applicantsCount > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{job.applicantsCount} applied</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
        <Link
          to={`/jobs/${job._id}`}
          className="flex-1 text-center py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
        >
          View Details
        </Link>

        {onApply ? (
          <button
            onClick={() => onApply(job)}
            className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1"
          >
            <span>Apply Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all text-center flex items-center justify-center gap-1"
          >
            <span>Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
