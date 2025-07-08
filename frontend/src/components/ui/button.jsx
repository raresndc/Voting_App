import React from 'react';

export function Button({ children, size = 'md', className = '', ...props }) {
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button
      {...props}
      className={`${sizes[size]} rounded shadow bg-blue-600 text-white ${className}`}
    >
      {children}
    </button>
  );
}
