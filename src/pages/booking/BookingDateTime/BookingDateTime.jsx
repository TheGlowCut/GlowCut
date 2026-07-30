import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import * as salonService from '../../../services/salonService';
import BookingFlowShell from '../BookingFlow/BookingFlowShell';
import {
  buildUpcomingDays,
  formatTimeLabel,
  getFirstAvailableBarber,
  getSalonQuery,
} from '../BookingFlow/bookingFlowUtils';

export default function BookingDateTime() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { booking, setSalon, setStylist, setTimeSlot } = useBooking();
  const salonId = searchParams.get('salonId') || booking.salon?._id || booking.salon?.id || '';

  const dates = useMemo(() => buildUpcomingDays(7), []);
  const [selectedDate, setSelectedDate] = useState(
    booking.date && dates.some((date) => date.iso === booking.date) ? booking.date : dates[0]?.iso || ''
  );
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(booking.timeSlot || '');

  useEffect(() => {
    if (!salonId || booking.services.length === 0) {
      toast.error('Choose a service first to continue booking.');
      navigate(`/booking/service${getSalonQuery(salonId)}`, { replace: true });
    }
  }, [booking.services.length, navigate, salonId]);

  useEffect(() => {
    if (!salonId) return;
    let active = true;

    Promise.allSettled([
      booking.salon ? Promise.resolve(booking.salon) : salonService.getSalonById(salonId),
      booking.stylist ? Promise.resolve([booking.stylist]) : salonService.getSalonBarbers(salonId),
    ]).then(([salonResult, barberResult]) => {
      if (!active) return;

      if (salonResult.status === 'fulfilled' && salonResult.value) {
        setSalon(salonResult.value);
      }

      if (!booking.stylist && barberResult.status === 'fulfilled' && Array.isArray(barberResult.value)) {
        const defaultBarber = getFirstAvailableBarber(barberResult.value);
        if (defaultBarber) setStylist(defaultBarber);
      }
    });

    return () => {
      active = false;
    };
  }, [booking.salon, booking.stylist, salonId, setSalon, setStylist]);

  useEffect(() => {
    if (!salonId || !booking.stylist || !selectedDate) return;
    let active = true;

    setLoading(true);
    bookingService
      .getAvailableTimeSlots(salonId, booking.stylist._id || booking.stylist.id, selectedDate)
      .then((data) => {
        if (!active) return;
        const availableSlots = Array.isArray(data)
          ? data.filter((slot) => slot.status === 'available').slice(0, 8)
          : [];
        setSlots(availableSlots);

        setSelectedSlot((current) => {
          const nextSlot = availableSlots.some((slot) => slot.time === current)
            ? current
            : availableSlots[0]?.time || '';
          if (nextSlot) setTimeSlot(selectedDate, nextSlot, selectedDate);
          return nextSlot;
        });
      })
      .catch(() => {
        if (!active) return;
        setSlots([]);
        setSelectedSlot('');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [booking.stylist, salonId, selectedDate, setTimeSlot]);

  const handleTimeSelect = (time) => {
    setSelectedSlot(time);
    setTimeSlot(selectedDate, time, selectedDate);
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      toast.error('Please select an available time slot.');
      return;
    }
    navigate(`/booking/confirm${getSalonQuery(salonId)}`);
  };

  return (
    <BookingFlowShell currentStep="datetime" title="Pick a date & time">
      <div className="booking-flow-date-grid">
        {dates.map((date) => {
          const isSelected = selectedDate === date.iso;
          return (
            <button
              key={date.iso}
              type="button"
              className={`booking-flow-date-option ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date.iso)}
            >
              <span>{date.weekdayShort}</span>
              <span>{date.dayNumber}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="booking-flow-loading">Loading available slots...</div>
      ) : slots.length ? (
        <div className="booking-flow-slot-grid">
          {slots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              className={`booking-flow-time-option ${selectedSlot === slot.time ? 'selected' : ''}`}
              onClick={() => handleTimeSelect(slot.time)}
            >
              {formatTimeLabel(slot.time)}
            </button>
          ))}
        </div>
      ) : (
        <div className="booking-flow-empty">No available slots for the selected date.</div>
      )}

      <div className="booking-flow-actions">
        <button
          type="button"
          className="booking-flow-back-link"
          onClick={() => navigate(`/booking/service${getSalonQuery(salonId)}`)}
        >
          <MdArrowBack /> Back
        </button>
        <button type="button" className="booking-flow-primary-button" onClick={handleContinue} disabled={!selectedSlot}>
          Continue <MdArrowForward />
        </button>
      </div>
    </BookingFlowShell>
  );
}

