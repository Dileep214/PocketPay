import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 h-9 gap-1.5',
    md: 'text-sm px-4 py-2.5 h-11 gap-2',
    lg: 'text-base px-5 py-3.5 h-13 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-600 to-blue-500 text-white shadow-[0_16px_30px_rgba(37,99,235,0.28)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.34)] hover:-translate-y-0.5',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_16px_30px_rgba(16,185,129,0.28)] hover:-translate-y-0.5',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_16px_30px_rgba(239,68,68,0.20)] hover:-translate-y-0.5',
    whatsapp: 'bg-gradient-to-r from-[#25D366] to-[#1fbf5a] text-white shadow-[0_16px_30px_rgba(37,211,102,0.20)] hover:-translate-y-0.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
