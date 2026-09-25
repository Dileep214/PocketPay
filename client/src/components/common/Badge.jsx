import React from 'react';

export const Badge = ({
  children,
  variant = 'gray',
  size = 'sm',
  className = ''
}) => {
  const sizeStyles = {
    xs: 'text-[11px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5'
  };

  const variantStyles = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-50 text-blue-700 border border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-800 font-medium border border-emerald-100',
    amber: 'bg-amber-50 text-amber-800 border border-amber-100',
    red: 'bg-red-50 text-red-700 border border-red-100'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.gray} ${className}`}
    >
      {children}
    </span>
  );
};
