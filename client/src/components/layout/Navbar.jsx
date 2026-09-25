import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Briefcase, PlusCircle, User, LogOut, ChevronRight } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isWorker, isEmployer, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and City Badge */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              W
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-brand-600 transition-colors">
                WorkNear
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-100">
                Hyperlocal
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-medium">Hyderabad</span>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/jobs" className="hover:text-brand-600 transition-colors">
            Browse Jobs
          </Link>
          {isWorker && (
            <Link to="/worker/dashboard" className="hover:text-brand-600 transition-colors">
              My Applications
            </Link>
          )}
          {isEmployer && (
            <>
              <Link to="/employer/dashboard" className="hover:text-brand-600 transition-colors">
                My Job Posts
              </Link>
              <Link
                to="/employer/post-job"
                className="inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700"
              >
                <PlusCircle className="w-4 h-4" />
                Post a Job
              </Link>
            </>
          )}
        </nav>

        {/* Right Auth / Profile Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to={isEmployer ? '/employer/profile' : '/worker/profile'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
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
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
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
