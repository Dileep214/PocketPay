import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, PlusCircle, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isWorker, isEmployer, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-blue-500 text-lg font-black text-white shadow-[0_16px_30px_rgba(37,99,235,0.28)]">
              P
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-brand-600">
                PocketPay
              </span>
              <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:inline-block">
                Hyperlocal
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 md:flex">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            <span>Hyderabad</span>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 text-sm font-semibold text-slate-600 shadow-sm md:flex">
          <Link to="/jobs" className="rounded-full px-3 py-2 transition-colors hover:bg-slate-100 hover:text-brand-600">
            Browse Jobs
          </Link>
          {isWorker && (
            <Link to="/worker/dashboard" className="rounded-full px-3 py-2 transition-colors hover:bg-slate-100 hover:text-brand-600">
              My Applications
            </Link>
          )}
          {isEmployer && (
            <>
              <Link to="/employer/dashboard" className="rounded-full px-3 py-2 transition-colors hover:bg-slate-100 hover:text-brand-600">
                My Job Posts
              </Link>
              <Link
                to="/employer/post-job"
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2 text-brand-700 transition-colors hover:bg-blue-100"
              >
                <PlusCircle className="h-4 w-4" />
                Post a Job
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={isEmployer ? '/employer/profile' : '/worker/profile'}
                className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-brand-50 text-xs font-black text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Logout"
                className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-2xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-gradient-to-r from-brand-600 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-[0_16px_32px_rgba(37,99,235,0.26)] transition-all hover:brightness-105"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
