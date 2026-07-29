import React from 'react';
import { MdSchedule, MdCheckCircle } from 'react-icons/md';

export default function ServiceCard({ service, selected = false, onSelect }) {
  const { name, price, description, duration } = service;

  return (
    <div
      onClick={onSelect}
      className={`p-md rounded-xl transition-all duration-200 cursor-pointer group relative ${
        selected
          ? 'bg-primary/15 border border-primary shadow-warm-sm'
          : 'bg-surface-container border border-white/5 hover:border-primary/30 hover:bg-surface-container-high'
      }`}
    >
      {selected && (
        <MdCheckCircle className="absolute top-3 right-3 text-primary text-xl" />
      )}
      <div className="flex justify-between items-start mb-xs pr-6">
        <h4 className="font-headline-md text-headline-md group-hover:text-primary transition-colors text-on-surface">
          {name}
        </h4>
        <span className="font-bold text-primary font-headline-md whitespace-nowrap ml-sm">
          {price}
        </span>
      </div>
      {description && (
        <p className="text-on-surface-variant font-body-md mb-sm opacity-80">
          {description}
        </p>
      )}
      {duration && (
        <span className="text-caption font-caption flex items-center gap-xs opacity-60">
          <MdSchedule className="text-base" /> {duration}
        </span>
      )}
    </div>
  );
}
