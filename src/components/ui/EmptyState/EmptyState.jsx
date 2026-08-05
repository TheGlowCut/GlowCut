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
      className={`flex flex-col items-center justify-center text-center py-xl px-lg rounded-xl border border-dashed border-[#E4B56C]/20 bg-[#E4B56C]/5 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[#E4B56C]/10 flex items-center justify-center mb-md text-[#E4B56C]">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-xl font-serif text-white mb-xs">{title}</h3>
      {description && (
        <p className="text-sm font-sans text-[#A1A1AA] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-md">{action}</div>}
    </div>
  );
}
