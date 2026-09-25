import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import {
  HYDERABAD_LOCALITIES,
  JOB_CATEGORIES,
  SHIFT_TYPES,
  URGENCY_OPTIONS
} from '../../utils/constants';
import { Briefcase, MapPin, IndianRupee, Clock, ArrowRight, Zap, Check } from 'lucide-react';

const COMMON_JOB_PRESETS = [
  { title: 'Cafe Waiter & Service Staff', category: 'Hospitality', wage: 650, wageType: 'daily', shift: 'morning' },
  { title: 'Kitchen Helper & Utensil Cleaning', category: 'Hospitality', wage: 700, wageType: 'daily', shift: 'evening' },
  { title: 'Retail Billing & Store Assistant', category: 'Retail', wage: 15000, wageType: 'monthly', shift: 'morning' },
  { title: 'Delivery Rider (Own Two-Wheeler)', category: 'Delivery', wage: 850, wageType: 'daily', shift: 'flexible' },
  { title: 'Supermarket Shelf Helper', category: 'Retail', wage: 600, wageType: 'daily', shift: 'morning' },
  { title: 'Event Catering Crew Member', category: 'Events', wage: 900, wageType: 'daily', shift: 'evening' }
];

export const PostJobPage = () => {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Hospitality',
    description: '',
    vacancies: 1,
    wageAmount: 650,
    wageType: 'daily',
    isNegotiable: false,
    shift: 'morning',
    hoursPerDay: 8,
    locality: profile?.address?.locality || 'Madhapur',
    addressText: profile?.address?.street || 'Main Road',
    urgency: 'immediate'
  });

  const applyPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      category: preset.category,
      wageAmount: preset.wage,
      wageType: preset.wageType,
      shift: preset.shift,
      description: `Need reliable and punctual staff for ${preset.title}. Immediate start in ${formData.locality}, Hyderabad.`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      addToast('Please provide a job title and description', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        vacancies: Number(formData.vacancies) || 1,
        wage: {
          amount: Number(formData.wageAmount),
          type: formData.wageType,
          isNegotiable: formData.isNegotiable
        },
        workTimings: {
          shift: formData.shift,
          hoursPerDay: Number(formData.hoursPerDay) || 8
        },
        location: {
          addressText: formData.addressText.trim() || `${formData.locality}, Hyderabad`,
          locality: formData.locality,
          city: 'Hyderabad',
          pincode: '500081'
        },
        urgency: formData.urgency
      };

      await jobService.createJob(payload);
      addToast('Job posted successfully! It is now live in Hyderabad.', 'success');
      navigate('/employer/dashboard');
    } catch (err) {
      addToast(err.message || 'Failed to post job', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>60-Second Fast Job Post</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Post an Opening in Hyderabad
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Local candidates in your neighborhood will be able to apply in 1 tap
          </p>
        </div>

        {/* 1-Click Fast Presets */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            ⚡ Quick 1-Click Templates:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COMMON_JOB_PRESETS.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => applyPreset(preset)}
                className="p-2.5 bg-gray-50 hover:bg-brand-50 hover:border-brand-300 border border-gray-200 rounded-xl text-left text-xs transition-all group"
              >
                <div className="font-bold text-gray-800 group-hover:text-brand-700 line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  ₹{preset.wage}/{preset.wageType}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Job Title */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Job Title / Role
            </label>
            <input
              type="text"
              placeholder="e.g. Cafe Waiter, Kitchen Helper, Store Billing"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Category & Vacancies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {JOB_CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Number of Vacancies
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Wage / Pay Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-emerald-950 mb-1">
                Pay Amount (₹)
              </label>
              <input
                type="number"
                min={100}
                value={formData.wageAmount}
                onChange={(e) => setFormData({ ...formData, wageAmount: e.target.value })}
                required
                className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-emerald-950 mb-1">Pay Type</label>
              <select
                value={formData.wageType}
                onChange={(e) => setFormData({ ...formData, wageType: e.target.value })}
                className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-gray-800"
              >
                <option value="daily">Per Day (₹/day)</option>
                <option value="hourly">Per Hour (₹/hr)</option>
                <option value="monthly">Per Month (₹/mo)</option>
              </select>
            </div>
          </div>

          {/* Shift and Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none capitalize"
              >
                {SHIFT_TYPES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Hours Per Day
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={formData.hoursPerDay}
                onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location in Hyderabad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Locality (Hyderabad)
              </label>
              <select
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {HYDERABAD_LOCALITIES.filter((l) => l !== 'All Localities').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}, Hyderabad
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Exact Street / Landmark
              </label>
              <input
                type="text"
                placeholder="e.g. Near Metro Pillar 12, Main Road"
                value={formData.addressText}
                onChange={(e) => setFormData({ ...formData, addressText: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Hiring Urgency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCY_OPTIONS.map((uo) => (
                <button
                  key={uo.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: uo.value })}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    formData.urgency === uo.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {uo.label.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Job Duties & Requirements
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. Table service and greeting customers. Free lunch provided. Friendly behavior required."
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
            Publish Job to Hyderabad Feed
          </Button>
        </form>
      </div>
    </div>
  );
};
