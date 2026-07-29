import React from 'react';
import { MdCheck } from 'react-icons/md';

/**
 * BookingTimeline
 * Vertical stepper matching Live Tracking / Waiting Lounge: each step is
 * 'done' | 'active' | 'upcoming'. Connector lines run between steps.
 *
 * steps: [{ title, subtitle, status }]
 */
export default function BookingTimeline({ steps = [] }) {
  return (
    <div className="glass-panel rounded-xl p-lg space-y-8">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const { title, subtitle, status } = step;

        return (
          <div className="flex gap-4 relative" key={i}>
            {!isLast && (
              <div className="absolute left-[11px] top-6 bottom-[-32px] w-0.5 bg-white/10" />
            )}

            {status === 'done' && (
              <div className="z-10 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary flex-shrink-0">
                <MdCheck className="text-secondary text-sm" />
              </div>
            )}
            {status === 'active' && (
              <div className="z-10 w-6 h-6 rounded-full bg-primary-container flex items-center justify-center shadow-warm-sm flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
            {status === 'upcoming' && (
              <div className="z-10 w-6 h-6 rounded-full bg-white/5 border border-white/20 flex-shrink-0" />
            )}

            <div className="flex flex-col">
              <h3
                className={`font-label-md ${
                  status === 'done'
                    ? 'text-tertiary'
                    : status === 'active'
                    ? 'text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                {title}
              </h3>
              <p
                className={`font-caption ${
                  status === 'upcoming' ? 'text-on-surface-variant/40' : 'text-on-surface-variant/60'
                }`}
              >
                {subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
