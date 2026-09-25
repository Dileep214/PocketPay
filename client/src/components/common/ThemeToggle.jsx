import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`relative p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-amber-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 select-none ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-fade-in transform hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 hover:text-brand-600 animate-fade-in transform hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};
