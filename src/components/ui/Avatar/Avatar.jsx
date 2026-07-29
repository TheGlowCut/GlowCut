import React from 'react';

const SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  ring = false,
  className = '',
}) {
  return (
    <div className={`relative inline-block ${SIZES[size] || SIZES.md} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-full ${
          ring ? 'border-2 border-primary/60 shadow-warm-sm' : 'border border-white/10'
        }`}
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
            status === 'online' ? 'bg-primary' : 'bg-outline'
          }`}
        />
      )}
    </div>
  );
}
