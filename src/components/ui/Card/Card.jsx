import React from 'react';
import { motion } from 'framer-motion';

const VARIANTS = {
  elevated: 'glass-elevated',
  outlined: 'bg-transparent border border-primary/20',
  filled: 'bg-surface-container border-0',
  glass: 'glass-panel',
};

export default function Card({
  children,
  className = '',
  variant = 'glass',
  hoverable = false,
  as: Component = 'div',
  ...rest
}) {
  const Comp = hoverable ? motion.div : Component;

  return (
    <Comp
      className={`
        rounded-xl
        ${VARIANTS[variant] || VARIANTS.glass}
        ${hoverable ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      {...(hoverable ? { whileHover: { y: -2 }, transition: { duration: 0.2 } } : {})}
      {...rest}
    >
      {children}
    </Comp>
  );
}
