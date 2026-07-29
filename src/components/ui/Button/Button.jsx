import React from 'react';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-primary text-on-primary shadow-warm hover:shadow-warm-lg',
  secondary:
    'bg-secondary text-on-secondary hover:opacity-90',
  outline:
    'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
  ghost:
    'bg-white/5 border border-white/10 text-on-surface hover:bg-white/10',
  text: 'bg-transparent text-primary hover:text-primary-fixed',
  danger: 'bg-error text-on-error hover:opacity-90',
  cream: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
  olive: 'bg-primary-container text-on-primary-container hover:opacity-90',
};

const SIZES = {
  sm: 'px-sm py-xs text-xs rounded-lg',
  md: 'px-md py-sm text-label-md rounded-xl',
  lg: 'px-xl py-md text-headline-md rounded-xl',
  full: 'w-full h-14 rounded-xl text-label-md',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      className={`
        font-sora font-bold inline-flex items-center justify-center gap-2
        transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
        disabled:hover:scale-100
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="text-lg" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="text-lg" />}
        </>
      )}
    </motion.button>
  );
}
