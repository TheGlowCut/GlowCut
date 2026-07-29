import React from 'react';

const VARIANTS = {
  primary: 'bg-primary/15 text-primary border border-primary/25',
  secondary: 'bg-secondary/15 text-secondary border border-secondary/25',
  neutral: 'bg-white/5 text-on-surface-variant border border-white/10',
  success: 'bg-primary/20 text-primary border border-primary/30',
  rating: 'bg-background/80 text-on-surface border border-primary/30',
  outline: 'bg-transparent text-on-surface-variant border border-outline-variant',
  olive: 'bg-primary-container/20 text-primary-container border border-primary-container/30',
};

export default function Badge({
  children,
  variant = 'neutral',
  icon: Icon,
  dot = false,
  dotColor = 'bg-primary',
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-sm py-1 rounded-full
        font-label-md text-label-md
        ${VARIANTS[variant] || VARIANTS.neutral}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {Icon && <Icon className="text-sm" />}
      {children}
    </span>
  );
}
