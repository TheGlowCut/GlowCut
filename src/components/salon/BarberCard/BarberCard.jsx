import React from 'react';
import { MdStar, MdAccessTime } from 'react-icons/md';

export default function BarberCard({ barber, onClick }) {
  const { name, specialty, rating, reviewCount, image, available, nextSlot } = barber;

  return (
    <div
      onClick={onClick}
      className="bg-surface-container/60 backdrop-blur-2xl rounded-2xl p-xl border border-primary/10 shadow-soft hover:shadow-warm hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden w-full"
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-20 h-20 rounded-2xl border-2 p-0.5 shrink-0 overflow-hidden ${
            available ? 'border-primary' : 'border-white/10'
          }`}
        >
          <img src={image} alt={name} className="w-full h-full object-cover rounded-2xl" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="font-headline-md text-headline-md text-on-surface truncate">{name}</h4>
              <p className="text-primary font-headline-sm text-headline-sm mt-1 truncate">{specialty}</p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${
                available
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-white/5 text-on-surface-variant border-white/10'
              }`}
            >
              {available ? 'Available' : nextSlot}
            </span>
          </div>
          <div className="flex items-center gap-2 text-primary mt-3">
            <MdStar className="text-lg" />
            <span className="font-bold text-headline-sm">{rating}</span>
            <span className="text-on-surface-variant opacity-60 text-sm">
              ({reviewCount} Reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
