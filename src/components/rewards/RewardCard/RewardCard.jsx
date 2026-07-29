import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';

export default function RewardCard({ reward, userPoints = 0, onRedeem }) {
  const { name, description, image, pointsCost, redeemed = false } = reward;
  const affordable = userPoints >= pointsCost;

  return (
    <motion.div
      className="glass-panel rounded-xl overflow-hidden group border border-white/5"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-32 bg-surface-container-high relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-primary/20 font-label-md text-label-md text-primary">
          {pointsCost} PTS
        </div>
      </div>
      <div className="p-md space-y-sm">
        <h3 className="font-label-md text-label-md text-on-surface">{name}</h3>
        <p className="font-caption text-caption text-on-surface-variant leading-relaxed">{description}</p>
        <Button
          variant={affordable ? 'primary' : 'outline'}
          size="full"
          className="!h-auto !w-full py-2 !rounded-lg"
          disabled={!affordable || redeemed}
          onClick={() => onRedeem?.(reward)}
        >
          {redeemed ? 'Redeemed' : affordable ? 'Redeem Now' : 'Not Enough Points'}
        </Button>
      </div>
    </motion.div>
  );
}
