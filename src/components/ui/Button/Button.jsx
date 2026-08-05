import React from 'react';
import { motion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-[#E4B56C] text-black shadow-[0_0_20px_rgba(228,181,108,0.2)] hover:shadow-[0_0_30px_rgba(228,181,108,0.3)]',
  secondary:
    'bg-[#222222] text-white hover:opacity-90',
  outline:
    'bg-transparent border-2 border-[#E4B56C] text-[#E4B56C] hover:bg-[#E4B56C]/10',
  ghost:
    'bg-white/5 border border-white/10 text-white hover:bg-white/10',
  text: 'bg-transparent text-[#E4B56C] hover:text-[#E4B56C]',
  danger: 'bg-red-500 text-white hover:opacity-90',
  cream: 'bg-[#111111] text-white hover:opacity-90',
  olive: 'bg-[#E4B56C]/10 text-[#E4B56C] hover:opacity-90',
};

const SIZES = {
  sm: 'px-sm py-xs text-xs rounded-lg',
  md: 'px-md py-sm text-sm rounded-xl',
  lg: 'px-xl py-md text-xl font-serif rounded-xl',
  full: 'w-full h-14 rounded-xl text-sm',
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
