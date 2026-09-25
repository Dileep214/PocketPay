import React from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { HYDERABAD_LOCALITIES, JOB_CATEGORIES, WAGE_TYPES, URGENCY_OPTIONS } from '../../utils/constants';

export const JobFilterBar = ({ filters, onChange, onReset }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const hasActiveFilters =
    filters.search ||
    filters.locality !== 'All Localities' ||
    filters.category !== 'All Categories' ||
    filters.wageType ||
    filters.urgency;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Input & Locality Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Keyword Search */}
        <div className="relative sm:col-span-1 lg:col-span-7">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search job title, helper, cook, waiter, store..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
          {filters.search && (
            <button
              onClick={() => handleInputChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hyderabad Locality Dropdown */}
        <div className="relative sm:col-span-1 lg:col-span-5">
          <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filters.locality || 'All Localities'}
            onChange={(e) => handleInputChange('locality', e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white appearance-none transition-all cursor-pointer font-medium text-gray-800"
          >
            {HYDERABAD_LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All Localities' ? '📍 All Localities (Hyderabad)' : `📍 ${loc}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Horizontal Filter Chips */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {JOB_CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All Categories') === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleInputChange('category', cat)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all select-none ${
                  isSelected
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Quick Selects: Wage Type & Urgency */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Wage Type */}
          <select
            value={filters.wageType || ''}
            onChange={(e) => handleInputChange('wageType', e.target.value)}
            className="py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {WAGE_TYPES.map((wt) => (
              <option key={wt.value} value={wt.value}>
                {wt.label}
              </option>
            ))}
          </select>

          {/* Urgency */}
          <select
            value={filters.urgency || ''}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            className="py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Urgency Levels</option>
            <option value="immediate">⚡ Immediate (Today)</option>
            <option value="this_week">📅 This Week</option>
            <option value="flexible">🔄 Flexible</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold p-1 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
