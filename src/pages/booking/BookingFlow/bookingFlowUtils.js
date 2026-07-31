import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salons & Service', to: '/services' },
  { label: 'Salons& Barbers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
];

export const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', to: '/contact-us' },
    { label: 'Careers', to: '/careers' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms and Conditions', to: '/terms-of-service' },
  ],
  Features: [
    { label: 'Online Booking', to: '/services' },
    { label: 'Sales & Payments', to: '/services' },
    { label: 'Marketing & Automation', to: '/stylists' },
    { label: 'Reporting', to: '/profile' },
    { label: 'Mini-CRM', to: '/support/help' },
  ],
};

export const SOCIAL_LINKS = [
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'X', icon: FaXTwitter },
  { label: 'LinkedIn', icon: FaLinkedinIn },
];

export const getEntityId = (entity) => entity?._id || entity?.id || '';

export const normalizeService = (service) => {
  const serviceId = getEntityId(service);
  return {
    ...service,
    _id: serviceId,
    id: serviceId,
    duration: Number(service?.duration) || 0,
    price: Number(service?.price) || 0,
  };
};

export const formatCurrency = (amount = 0) => `Rs ${Number(amount || 0).toLocaleString()}`;

export const formatDuration = (minutes = 0) => {
  const totalMinutes = Number(minutes) || 0;
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const remainder = totalMinutes % 60;
    return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
  }
  return `${totalMinutes} min`;
};

export const formatTimeLabel = (time) => {
  if (!time) return '';
  const [hourString, minute = '00'] = time.split(':');
  const hour = Number(hourString);
  if (!Number.isFinite(hour)) return time;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute}`;
};

export const buildUpcomingDays = (count = 7) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      iso: date.toISOString().split('T')[0],
      weekdayShort: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dayNumber: date.toLocaleDateString('en-US', { day: 'numeric' }),
    };
  });

export const formatBookingMoment = (isoDate, time) => {
  if (!isoDate) return 'Not selected';
  const date = new Date(`${isoDate}T00:00:00`);
  const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  if (!time) return dayLabel;
  const [hourString] = time.split(':');
  const suffix = Number(hourString) >= 12 ? 'PM' : 'AM';
  return `${dayLabel}, ${formatTimeLabel(time)} ${suffix}`;
};

export const getFirstAvailableBarber = (barbers = []) =>
  barbers.find((barber) => barber?.isAvailable !== false && barber?.status !== 'inactive') ||
  barbers[0] ||
  null;

export const getSalonQuery = (salonId) => (salonId ? `?salonId=${encodeURIComponent(salonId)}` : '');

