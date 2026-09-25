import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { HYDERABAD_LOCALITIES } from '../utils/constants';
import { User, Phone, Lock, Building, MapPin, ArrowRight, Briefcase } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState('worker');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [locality, setLocality] = useState('Madhapur');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !password) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (role === 'employer' && !businessName.trim()) {
      addToast('Please enter your business or shop name', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: name.trim(),
        phone: phone.trim(),
        password,
        role,
        locality,
        businessName: role === 'employer' ? businessName.trim() : undefined
      });

      addToast(`Account created successfully! Welcome to WorkNear.`, 'success');
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/worker/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Join the hyperlocal network in Hyderabad
          </p>
        </div>

        {/* Dual Role Toggle Button */}
        <div className="bg-gray-100 p-1 rounded-2xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              role === 'worker'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>I Want a Job</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('employer')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              role === 'employer'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>I Want to Hire</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Your Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={role === 'employer' ? 'e.g. Ramesh Varma' : 'e.g. Kiran Kumar'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Business Name (Employer only) */}
          {role === 'employer' && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Business / Shop Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Chai Point, Freshmart, Royal Caterers"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required={role === 'employer'}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Mobile Phone Number (Calls will be received here)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Hyderabad Locality Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Your Primary Area in Hyderabad
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white appearance-none cursor-pointer"
              >
                {HYDERABAD_LOCALITIES.filter((l) => l !== 'All Localities').map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}, Hyderabad
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Create Password (min. 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            className="mt-4"
          >
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
