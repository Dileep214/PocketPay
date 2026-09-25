export const HYDERABAD_LOCALITIES = [
  'All Localities',
  'Madhapur',
  'Gachibowli',
  'Hitec City',
  'Kondapur',
  'Banjara Hills',
  'Jubilee Hills',
  'Ameerpet',
  'Kukatpally',
  'Begumpet',
  'Secunderabad',
  'Charminar',
  'Dilsukhnagar',
  'Manikonda',
  'Miyapur',
  'Uppal'
];

export const JOB_CATEGORIES = [
  'All Categories',
  'Hospitality',
  'Retail',
  'Delivery',
  'Warehouse',
  'Housekeeping',
  'Events',
  'General Labor',
  'Other'
];

export const WAGE_TYPES = [
  { value: '', label: 'All Wage Types' },
  { value: 'daily', label: 'Daily Pay (₹/day)' },
  { value: 'hourly', label: 'Hourly Pay (₹/hr)' },
  { value: 'monthly', label: 'Monthly Salary (₹/mo)' }
];

export const SHIFT_TYPES = [
  { value: 'morning', label: 'Morning Shift' },
  { value: 'evening', label: 'Evening Shift' },
  { value: 'night', label: 'Night Shift' },
  { value: 'flexible', label: 'Flexible / Any Shift' }
];

export const URGENCY_OPTIONS = [
  { value: 'immediate', label: 'Immediate (Today / Tomorrow)', badgeColor: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'this_week', label: 'This Week', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'flexible', label: 'Flexible Start', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' }
];

export const APPLICATION_STATUS_MAP = {
  applied: { label: 'Applied', color: 'bg-gray-100 text-gray-700' },
  reviewed: { label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
  shortlisted: { label: 'Shortlisted 🎉', color: 'bg-emerald-100 text-emerald-800 font-semibold' },
  hired: { label: 'Hired ✅', color: 'bg-green-600 text-white' },
  rejected: { label: 'Not Selected', color: 'bg-red-50 text-red-600' },
  withdrawn: { label: 'Withdrawn', color: 'bg-gray-200 text-gray-500' }
};
