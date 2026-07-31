import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import * as salonService from '../../../services/salonService';
import BookingFlowShell from '../BookingFlow/BookingFlowShell';
import {
  formatBookingMoment,
  formatCurrency,
  getSalonQuery,
  normalizeService,
} from '../BookingFlow/bookingFlowUtils';

const addMinutesToTime = (time, minutesToAdd) => {
  const [hours, minutes] = time.split(':').map(Number);
  const total = hours * 60 + minutes + minutesToAdd;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export default function ConfirmBooking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { booking, setSalon, setStylist, setServices, totalPrice, confirmBooking } = useBooking();
  const salonId = searchParams.get('salonId') || booking.salon?._id || booking.salon?.id || '';

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!salonId) {
      toast.error('Please start your booking from a salon page.');
      navigate('/salons/nearby', { replace: true });
    }
  }, [navigate, salonId]);

  useEffect(() => {
    if (!salonId) return;
    let active = true;

    Promise.allSettled([
      booking.salon ? Promise.resolve(booking.salon) : salonService.getSalonById(salonId),
      booking.services.length ? Promise.resolve(booking.services) : salonService.getSalonServices(salonId),
      booking.stylist ? Promise.resolve([booking.stylist]) : salonService.getSalonBarbers(salonId),
    ]).then(([salonResult, serviceResult, barberResult]) => {
      if (!active) return;

      if (salonResult.status === 'fulfilled' && salonResult.value) {
        setSalon(salonResult.value);
      }

      if (serviceResult.status === 'fulfilled' && Array.isArray(serviceResult.value)) {
        const normalizedServices = serviceResult.value.map(normalizeService);
        const currentServiceId = booking.services[0]?.id || booking.services[0]?._id || '';
        const nextSelected =
          normalizedServices.find((service) => service.id === currentServiceId) ||
          normalizedServices[0];

        if (
          nextSelected &&
          (booking.services.length !== 1 || currentServiceId !== nextSelected.id)
        ) {
          setServices([nextSelected]);
        }
      }

      if (
        booking.stylist &&
        barberResult.status === 'fulfilled' &&
        Array.isArray(barberResult.value)
      ) {
        const salonBarbers = barberResult.value;
        const stylistId = booking.stylist?._id || booking.stylist?.id || '';
        const stylistInSalon =
          stylistId && salonBarbers.some((barber) => (barber?._id || barber?.id) === stylistId);
        if (!stylistInSalon) setStylist(null);
      }
    });

    return () => {
      active = false;
    };
  }, [booking.salon, booking.services, booking.stylist, salonId, setSalon, setServices, setStylist]);

  const selectedService = booking.services[0] || null;
  const whenLabel = useMemo(
    () => formatBookingMoment(booking.date, booking.timeSlot),
    [booking.date, booking.timeSlot]
  );

  const handleProceed = async () => {
    const barberId = booking.stylist?._id || booking.stylist?.id;

    if (!salonId) {
      toast.error('No salon selected. Please restart your booking.');
      navigate('/salons/nearby');
      return;
    }
    if (booking.services.length === 0) {
      toast.error('Select a service before confirming booking.');
      return;
    }
    if (!barberId) {
      toast.error('A barber is required before you confirm booking.');
      return;
    }
    if (!booking.date || !booking.timeSlot) {
      toast.error('Please choose your appointment date and time.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Processing your booking...');
    try {
      const createdBookings = [];
      let currentStartTime = booking.timeSlot;

      for (const service of booking.services) {
        const payload = {
          salonId,
          barberId,
          serviceId: service._id || service.id,
          bookingDate: booking.date,
          startTime: currentStartTime,
          paymentMethod: booking.paymentMethod || 'cash',
        };

        const created = await bookingService.createBooking(payload);
        createdBookings.push(created);
        currentStartTime = created.endTime || addMinutesToTime(currentStartTime, service.duration || 0);
      }

      confirmBooking(createdBookings);
      toast.success('Booking confirmed successfully!', { id: toastId });
      navigate('/booking/summary', {
        state: { bookingId: createdBookings[0]?._id || createdBookings[0]?.id },
      });
    } catch (error) {
      const backendMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Booking failed';
      toast.error(`Error: ${backendMsg}`, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BookingFlowShell currentStep="confirm" title="Confirm & pay">
      {selectedService ? (
        <>
          <div className="booking-flow-summary-panel">
            <div className="booking-flow-summary-row">
              <span>Service</span>
              <strong>{selectedService.name}</strong>
            </div>
            <div className="booking-flow-summary-row">
              <span>Stylist</span>
              <strong>{booking.stylist?.name || 'Assigned stylist'}</strong>
            </div>
            <div className="booking-flow-summary-row">
              <span>When</span>
              <strong>{whenLabel}</strong>
            </div>
            <div className="booking-flow-summary-total">
              <span>Total</span>
              <strong>{formatCurrency(totalPrice)}</strong>
            </div>
          </div>

          <div className="booking-flow-actions">
            <button
              type="button"
              className="booking-flow-back-link"
              onClick={() => navigate(`/booking/date-time${getSalonQuery(salonId)}`)}
            >
              <MdArrowBack /> Back
            </button>
            <button
              type="button"
              className="booking-flow-primary-button"
              onClick={handleProceed}
              disabled={submitting}
            >
              {submitting ? 'Confirming...' : 'Confirm booking'} {!submitting && <MdArrowForward />}
            </button>
          </div>
        </>
      ) : (
        <div className="booking-flow-empty">
          No booking details found.
          <button
            type="button"
            className="booking-flow-primary-button"
            onClick={() => navigate(`/booking/service${getSalonQuery(salonId)}`)}
          >
            Restart booking
          </button>
        </div>
      )}
    </BookingFlowShell>
  );
}
