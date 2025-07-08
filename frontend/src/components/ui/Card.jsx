import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`rounded-2xl shadow p-4 bg-white ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div {...props} className={`mb-2 font-medium text-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div {...props} className={`${className}`}>
      {children}
    </div>
  );
}
