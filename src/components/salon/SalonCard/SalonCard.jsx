import React from 'react';
import { MdPinDrop, MdStar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function SalonCard({ salon }) {
  const navigate = useNavigate();
  const id = salon._id || salon.id;
  const name = salon.name;
  const image = salon.coverImage || salon.logo || salon.image || 'https://via.placeholder.com/600x400?text=GlowCut';
  const location = salon.address
    ? [salon.address.area, salon.address.city].filter(Boolean).join(', ')
    : salon.location || 'Location unavailable';
  const rating = salon.averageRating ?? salon.rating ?? 0;
  const priceTier = salon.priceTier || '$$';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card hoverable className="group overflow-hidden">
        <div className="relative h-64">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient removed as per request */}
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-sm py-xs rounded-full flex items-center gap-xs border border-primary/30">
            <MdStar className="text-primary text-sm" />
            <span className="text-on-surface font-label-md text-label-md">{rating.toFixed ? rating.toFixed(1) : rating}</span>
          </div>
        </div>
        <div className="p-md">
          <h4 className="font-headline-md text-headline-md mb-xs text-on-surface">{name}</h4>
          <p className="font-caption text-caption text-on-surface-variant mb-md flex items-center gap-xs">
            <MdPinDrop className="text-sm" /> {location}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary font-bold text-lg">{priceTier}</span>
            <Button variant="outline" size="sm" onClick={() => navigate(`/salons/${id}`)}>
              Book Now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
