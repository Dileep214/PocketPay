import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Phone, Lock, ArrowRight, UserCheck, Briefcase } from 'lucide-react';

export const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      addToast('Please enter both phone number and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await login(phone, password);
      addToast(`Welcome back, ${user.name}!`, 'success');
      if (redirect) {
        navigate(redirect);
      } else if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/worker/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xl mx-auto shadow-inner">
            W
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Log in to PocketPay
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter your mobile number and password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+919876511111"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            className="mt-2"
          >
            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
