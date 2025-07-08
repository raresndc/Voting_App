// src/components/ui/Card.jsx
import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`rounded-2xl shadow-lg p-6 bg-white bg-opacity-20 backdrop-blur-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div {...props} className={`mb-2 font-medium text-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
}
