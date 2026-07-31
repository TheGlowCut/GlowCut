import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useBooking } from '../../../hooks/useBooking';
import * as salonService from '../../../services/salonService';
import BookingFlowShell from '../BookingFlow/BookingFlowShell';
import {
  formatCurrency,
  formatDuration,
  getSalonQuery,
  normalizeService,
} from '../BookingFlow/bookingFlowUtils';

export default function BookingService() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { booking, setSalon, setStylist, setServices } = useBooking();
  const salonId = searchParams.get('salonId') || booking.salon?._id || booking.salon?.id || '';

  const [services, setLocalServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!salonId) {
      toast.error('Please start your booking from a salon page.');
      navigate('/salons/nearby', { replace: true });
    }
  }, [navigate, salonId]);

  useEffect(() => {
    if (!salonId) return;
    let active = true;

    setLoading(true);
    Promise.allSettled([
      booking.salon ? Promise.resolve(booking.salon) : salonService.getSalonById(salonId),
      salonService.getSalonServices(salonId),
      salonService.getSalonBarbers(salonId),
    ]).then(([salonResult, serviceResult, barberResult]) => {
      if (!active) return;

      if (salonResult.status === 'fulfilled' && salonResult.value) {
        setSalon(salonResult.value);
      }

      const nextServices =
        serviceResult.status === 'fulfilled' && Array.isArray(serviceResult.value)
          ? serviceResult.value.map(normalizeService)
          : [];
      setLocalServices(nextServices);

      if (nextServices.length) {
        const currentServiceId = booking.services[0]?.id || booking.services[0]?._id || '';
        const nextSelected =
          nextServices.find((service) => service.id === currentServiceId) || nextServices[0];

        if (
          nextSelected &&
          (booking.services.length !== 1 || currentServiceId !== nextSelected.id)
        ) {
          setServices([nextSelected]);
        }
      }

      if (barberResult.status === 'fulfilled' && Array.isArray(barberResult.value)) {
        const salonBarbers = barberResult.value;
        const stylistId = booking.stylist?._id || booking.stylist?.id || '';
        const stylistInSalon =
          stylistId && salonBarbers.some((barber) => (barber?._id || barber?.id) === stylistId);
        if (booking.stylist && !stylistInSalon) {
          // Never auto-select — just drop a stylist picked on another salon.
          setStylist(null);
        }
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [booking.salon, booking.services.length, booking.stylist, salonId, setSalon, setServices, setStylist]);

  const selectedServiceId = booking.services[0]?.id || booking.services[0]?._id || '';

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || booking.services[0] || null,
    [booking.services, selectedServiceId, services]
  );

  const handleContinue = () => {
    if (!selectedService) {
      toast.error('Please choose a service first.');
      return;
    }
    if (!booking.stylist) {
      toast.error('No barber selected. Please choose a barber on the salon page first.');
      return;
    }
    navigate(`/booking/date-time${getSalonQuery(salonId)}`);
  };

  return (
    <BookingFlowShell currentStep="service" title="Choose a service">
      {loading ? (
        <div className="booking-flow-loading">Loading salon services...</div>
      ) : services.length ? (
        <>
          <div className="booking-flow-service-list">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`booking-flow-service-option ${isSelected ? 'selected' : ''}`}
                  onClick={() => setServices([service])}
                >
                  <span className="booking-flow-service-meta">
                    <i className={`booking-flow-radio ${isSelected ? 'selected' : ''}`} />
                    <span className="booking-flow-service-copy">
                      <strong>{service.name}</strong>
                      <span>{formatDuration(service.duration)}</span>
                    </span>
                  </span>
                  <strong className="booking-flow-service-price">{formatCurrency(service.price)}</strong>
                </button>
              );
            })}
          </div>

          <div className="booking-flow-actions">
            <button type="button" className="booking-flow-back-link" onClick={() => navigate(-1)}>
              <MdArrowBack /> Back
            </button>
            <button type="button" className="booking-flow-primary-button" onClick={handleContinue}>
              Continue <MdArrowForward />
            </button>
          </div>
        </>
      ) : (
        <div className="booking-flow-empty">This salon has not published any services yet.</div>
      )}
    </BookingFlowShell>
  );
}
