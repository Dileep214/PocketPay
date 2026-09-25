import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { HYDERABAD_LOCALITIES, SHIFT_TYPES } from '../../utils/constants';
import { User, MapPin, IndianRupee, Clock, Check, Plus, X } from 'lucide-react';

const COMMON_SKILLS = [
  'Waiter',
  'Kitchen Helper',
  'Cook',
  'Delivery Rider',
  'Retail Cashier',
  'Shelf Stocker',
  'Housekeeping',
  'Event Helper',
  'Warehouse Packing',
  'Security Guard',
  'Dishwasher',
  'Barista / Tea Maker'
];

export const WorkerProfilePage = () => {
  const { user, profile, setProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    locality: profile?.locality || 'Madhapur',
    bio: profile?.bio || '',
    skills: profile?.skills || [],
    preferredWageAmount: profile?.preferredWage?.amount || 600,
    preferredWageType: profile?.preferredWage?.type || 'daily',
    availabilityShift: profile?.availability?.shift || 'morning',
    languages: profile?.languages || ['Telugu', 'Hindi']
  });

  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill]
      };
    });
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    if (!formData.skills.includes(customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
    }
    setCustomSkill('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        locality: formData.locality,
        bio: formData.bio,
        skills: formData.skills,
        preferredWage: {
          amount: Number(formData.preferredWageAmount),
          type: formData.preferredWageType
        },
        availability: {
          immediate: true,
          shift: formData.availabilityShift
        },
        languages: formData.languages
      };

      const res = await apiClient.put('/profiles/worker/me', payload);
      setProfile(res.data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Worker Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Employers see these details when you apply to jobs in Hyderabad
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs sm:text-sm">
          {/* Full Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Primary Locality in Hyderabad */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Your Locality in Hyderabad
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

          {/* Expected Wage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">
                Expected Pay (₹)
              </label>
              <input
                type="number"
                value={formData.preferredWageAmount}
                onChange={(e) =>
                  setFormData({ ...formData, preferredWageAmount: e.target.value })
                }
                min={100}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1.5">Wage Type</label>
              <select
                value={formData.preferredWageType}
                onChange={(e) =>
                  setFormData({ ...formData, preferredWageType: e.target.value })
                }
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="daily">Per Day (₹/day)</option>
                <option value="hourly">Per Hour (₹/hr)</option>
                <option value="monthly">Per Month (₹/mo)</option>
              </select>
            </div>
          </div>

          {/* Shift Preference */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Available Shift Timing
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SHIFT_TYPES.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, availabilityShift: st.value })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    formData.availabilityShift === st.value
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {st.label.replace(' Shift', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Selection */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Select Your Skills & Job Preferences
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_SKILLS.map((skill) => {
                const selected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                      selected
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Skill */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add other skill (e.g. Electrician, Carpenter)..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <Button size="sm" variant="secondary" onClick={addCustomSkill}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Short Bio */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Short Bio / Previous Experience (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              maxLength={250}
              placeholder="e.g. 2 years experience in cafe service. Punctual and friendly."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none text-xs"
            />
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading}>
            Save Profile Details
          </Button>
        </form>
      </div>
    </div>
  );
};
