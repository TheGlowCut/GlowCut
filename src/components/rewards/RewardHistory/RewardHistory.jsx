import React from 'react';
import { MdEventAvailable, MdRateReview, MdShare, MdCheck, MdAdd } from 'react-icons/md';
import { motion } from 'framer-motion';

const ICON_MAP = {
  booking: MdEventAvailable,
  review: MdRateReview,
  share: MdShare,
};

export default function RewardHistory({ entries = [], onAction }) {
  return (
    <div className="glass-panel rounded-xl p-base space-y-sm border border-white/5">
      {entries.map((entry, i) => {
        const Icon = ICON_MAP[entry.type] || MdEventAvailable;
        return (
          <motion.div
            key={i}
            className="flex items-center justify-between p-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-sm">
              <Icon className="text-primary text-xl" />
              <div>
                <div className="font-label-md text-label-md text-on-surface">{entry.label}</div>
                <div className="font-caption text-caption text-on-surface-variant">
                  +{entry.points} Points
                </div>
              </div>
            </div>

            {entry.completed ? (
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                <MdCheck className="text-primary text-xl" />
              </div>
            ) : (
              <button
                onClick={() => onAction?.(entry)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-primary/50 transition-all active:scale-90"
              >
                <MdAdd className="text-on-surface-variant text-xl" />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
