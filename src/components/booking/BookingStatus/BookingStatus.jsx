import React from 'react';
import { MdCheckCircle, MdAccessTime, MdCancel, MdDirectionsRun } from 'react-icons/md';

const STATUS_MAP = {
  confirmed: {
    label: 'Confirmed',
    icon: MdCheckCircle,
    classes: 'bg-secondary/10 text-secondary border-secondary/30',
  },
  in_progress: {
    label: 'In Progress',
    icon: MdDirectionsRun,
    classes: 'bg-primary-container/10 text-primary-container border-primary-container/30',
  },
  upcoming: {
    label: 'Upcoming',
    icon: MdAccessTime,
    classes: 'bg-white/5 text-on-surface-variant border-white/10',
  },
  completed: {
    label: 'Completed',
    icon: MdCheckCircle,
    classes: 'bg-tertiary/10 text-tertiary border-tertiary/30',
  },
  cancelled: {
    label: 'Cancelled',
    icon: MdCancel,
    classes: 'bg-error/10 text-error border-error/30',
  },
};

/**
 * BookingStatus
 * Small status chip used in BookingCard / history lists to indicate
 * where a booking is in its lifecycle.
 */
export default function BookingStatus({ status = 'upcoming' }) {
  const config = STATUS_MAP[status] || STATUS_MAP.upcoming;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-sm py-1 rounded-full border font-label-md text-label-md ${config.classes}`}
    >
      <Icon className="text-sm" />
      {config.label}
    </span>
  );
}
