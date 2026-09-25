import React, { useState } from 'react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { HYDERABAD_LOCALITIES } from '../../utils/constants';
import { Building, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';

const BUSINESS_TYPES = [
  'Restaurant / Cafe',
  'Retail / Shop',
  'Delivery / Logistics',
  'Events',
  'Housekeeping',
  'Construction',
  'Other'
];

export const EmployerProfilePage = () => {
  const { user, profile, setProfile } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: profile?.businessName || '',
    businessType: profile?.businessType || 'Restaurant / Cafe',
    contactPerson: profile?.contactPerson || '',
    locality: profile?.address?.locality || 'Madhapur',
    street: profile?.address?.street || '',
    pincode: profile?.address?.pincode || '500081'
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      addToast('Business name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
        contactPerson: formData.contactPerson.trim(),
        address: {
          locality: formData.locality,
          street: formData.street.trim(),
          city: 'Hyderabad',
          pincode: formData.pincode.trim()
        }
      };

      const res = await apiClient.put('/profiles/employer/me', payload);
      setProfile(res.data);
      addToast('Business profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update business profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Business Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            This information is shown to candidates on your job posts in Hyderabad
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          {/* Owner Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Account Owner Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Business / Shop Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Business / Store / Cafe Name
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
            />
          </div>

          {/* Business Category */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Business Category
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          {/* Contact Person Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Contact Person / Hiring Manager
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh (Manager)"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Hyderabad Locality */}
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
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">
              Street / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g. Plot 42, Hitech City Road"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
            Save Business Details
          </Button>
        </form>
      </div>
    </div>
  );
};
