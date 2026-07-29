import React from 'react';
import { MdInbox } from 'react-icons/md';

export default function EmptyState({
  icon: Icon = MdInbox,
  title = 'Nothing here yet',
  description = '',
  action = null,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-xl px-lg rounded-xl border border-dashed border-primary/20 bg-primary/[0.02] ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-md text-primary">
        <Icon className="text-2xl" />
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{title}</h3>
      {description && (
        <p className="font-body-md text-on-surface-variant max-w-sm">{description}</p>
      )}
      {action && <div className="mt-md">{action}</div>}
    </div>
  );
}
