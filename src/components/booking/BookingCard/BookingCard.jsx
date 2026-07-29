import React from 'react';
import { MdStorefront, MdCalendarToday, MdContentCut } from 'react-icons/md';
import Card from '../../ui/Card';
import BookingStatus from '../BookingStatus';

/**
 * BookingCard
 * Compact summary card for booking lists (Profile > My Bookings, history views).
 * Reuses the salon/slot/service iconography from Booking Summary but condensed
 * into a single list-friendly row.
 */
export default function BookingCard({ booking, onClick }) {
  const { salonName, service, dateLabel, timeLabel, status } = booking;

  return (
    <Card
      hoverable
      className="p-md flex flex-col gap-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <MdStorefront className="text-primary-container text-xl" />
          <h4 className="font-headline-md text-headline-md text-on-surface">{salonName}</h4>
        </div>
        <BookingStatus status={status} />
      </div>

      <div className="flex flex-wrap items-center gap-md text-on-surface-variant font-body-md text-sm">
        <span className="flex items-center gap-xs">
          <MdContentCut className="text-base" /> {service}
        </span>
        <span className="flex items-center gap-xs">
          <MdCalendarToday className="text-base" /> {dateLabel}, {timeLabel}
        </span>
      </div>
    </Card>
  );
}
