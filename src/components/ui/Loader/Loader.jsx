import React from 'react';

export default function Loader({ variant = 'spinner', label, className = '' }) {
  if (variant === 'full') {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-md bg-background">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-surface-container-high rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-warm" />
        </div>
        {label && (
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
            {label}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'scan') {
    return (
      <div className={`relative flex items-center gap-xs text-primary ${className}`}>
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-warm-sm" />
        <span className="font-label-md text-label-md tracking-widest uppercase">
          {label || 'Analysis in Progress...'}
        </span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-on-surface-variant animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={`inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label={label || 'Loading'}
    />
  );
}
