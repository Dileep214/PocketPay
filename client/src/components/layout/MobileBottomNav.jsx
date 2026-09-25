import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, PlusCircle, User, LogIn, Home } from 'lucide-react';

export const MobileBottomNav = () => {
  const { isAuthenticated, isWorker, isEmployer } = useAuth();

  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 py-2 text-[11px] font-medium transition-colors ${
      isActive ? 'text-brand-600 font-semibold' : 'text-gray-500 hover:text-gray-800'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-15">
        <NavLink to="/" className={navClass}>
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/jobs" className={navClass}>
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span>Find Jobs</span>
        </NavLink>

        {isEmployer && (
          <NavLink to="/employer/post-job" className={navClass}>
            <PlusCircle className="w-5 h-5 mb-0.5 text-brand-600" />
            <span className="text-brand-600">Post Job</span>
          </NavLink>
        )}

        {isWorker && (
          <NavLink to="/worker/dashboard" className={navClass}>
            <FileText className="w-5 h-5 mb-0.5" />
            <span>Applications</span>
          </NavLink>
        )}

        {isEmployer && (
          <NavLink to="/employer/dashboard" className={navClass}>
            <FileText className="w-5 h-5 mb-0.5" />
            <span>My Jobs</span>
          </NavLink>
        )}

        {isAuthenticated ? (
          <NavLink
            to={isEmployer ? '/employer/profile' : '/worker/profile'}
            className={navClass}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </NavLink>
        ) : (
          <NavLink to="/login" className={navClass}>
            <LogIn className="w-5 h-5 mb-0.5" />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
