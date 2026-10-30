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
    <div className="mx-auto max-w-md py-6 sm:py-12">
      <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-blue-500 text-xl font-black text-white shadow-[0_18px_30px_rgba(37,99,235,0.28)]">
            W
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Log in to PocketPay
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your mobile number and password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                placeholder="+919876511111"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 transition-all focus:border-blue-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 transition-all focus:border-blue-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading} className="mt-2">
            <span>Log In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="border-t border-slate-100 pt-3 text-center text-sm text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 transition-colors hover:text-brand-700">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
