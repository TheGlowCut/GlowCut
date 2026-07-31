import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MdAccessTime,
  MdArrowForward,
  MdCalendarToday,
  MdCheckCircle,
  MdClose,
  MdFavorite,
  MdFavoriteBorder,
  MdLocationOn,
  MdMenu,
  MdPhone,
  MdSearch,
  MdShare,
  MdStar,
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import GuestBlock from '../../../components/auth/GuestBlock';
import Loader from '../../../components/ui/Loader';
import { useSalon } from '../../../hooks/useSalon';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import * as salonService from '../../../services/salonService';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import landingHero from '../../../assets/home/landing-hero.png';
import leadStylistImage from '../../../assets/home/lead-stylist.png';
import loginShowcase from '../../../assets/auth/login-showcase.png';
import './SalonDetail.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salon & Service', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const FOOTER_LINKS = {
  Company: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Contact Us', to: '/contact-us' },
    { label: 'Careers', to: '/careers' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'X', icon: FaXTwitter },
  { label: 'LinkedIn', icon: FaLinkedinIn },
];

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const generateUpcomingDays = () => {
  const result = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isoDate = d.toISOString().split('T')[0];
    const dayEnum = dayNames[d.getDay()];
    let label = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayEnum;
    result.push({ isoDate, label, dayEnum, dateText: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
  }
  return result;
};

const getEntityId = (entity) => entity?._id || entity?.id || '';

const getImageValue = (image) => {
  if (typeof image === 'string') return image;
  return image?.url || image?.secure_url || image?.src || '';
};

const getSalonLocation = (salon) => {
  if (typeof salon?.address === 'string') return salon.address;
  const parts = [
    salon?.address?.street,
    salon?.address?.area,
    salon?.address?.city,
    salon?.area,
    salon?.city,
  ].filter(Boolean);
  return [...new Set(parts)].join(', ') || 'Location not provided';
};

const getSalonRating = (salon) => {
  const value = Number(salon?.averageRating ?? salon?.rating ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const getBarberImage = (barber) =>
  barber?.profileImage || barber?.image || barber?.avatar || leadStylistImage;

const getBarberSpecialty = (barber) =>
  barber?.specialty ||
  barber?.title ||
  barber?.services?.[0]?.name ||
  barber?.description ||
  'GlowCut Specialist';

const formatTime = (time) => {
  if (!time) return '';
  const [hourString, minute = '00'] = time.split(':');
  const hour = Number(hourString);
  if (!Number.isFinite(hour)) return time;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
};

function Brand() {
  return (
    <Link to="/" className="salon-detail-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function RatingStars({ rating = 0 }) {
  return (
    <span className="salon-detail-stars" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <MdStar key={index} className={index < Math.round(rating) ? 'filled' : ''} />
      ))}
    </span>
  );
}

function Footer() {
  return (
    <footer className="salon-detail-footer">
      <div className="salon-detail-shell salon-detail-footer-grid">
        <div className="salon-detail-footer-cta">
          <h2>Are you ready to<br />get started?</h2>
          <Link to="/auth/signup">
            Get Started for free <MdArrowForward />
          </Link>
        </div>

        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div className="salon-detail-footer-links" key={title}>
            <h3>{title}</h3>
            {links.map((link) => (
              <Link key={link.label} to={link.to}>{link.label}</Link>
            ))}
          </div>
        ))}

        <div className="salon-detail-footer-brand"><Brand /></div>
        <div className="salon-detail-socials">
          {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
            <a href="#" aria-label={label} key={label} onClick={(event) => event.preventDefault()}>
              <Icon />
            </a>
          ))}
        </div>
      </div>
      <div className="salon-detail-copyright">©2026 Glow&Cut</div>
    </footer>
  );
}

export default function SalonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, userType } = useContext(AuthContext);
  const { salon, isLoading, error } = useSalon(id);
  const { booking, setSalon, setServices: setBookingServices, toggleService, setStylist, setTimeSlot } = useBooking();

  const [dates] = useState(generateUpcomingDays);
  const [selectedDate, setSelectedDate] = useState(0);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guestBlockOpen, setGuestBlockOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingSalon, setSavingSalon] = useState(false);
  const [highlightBarbers, setHighlightBarbers] = useState(false);
  const barberHighlightTimer = useRef(null);
  const barberHighlightFrame = useRef(null);
  const profileAvatar =
    user?.profileImage || user?.avatar || profile?.profileImage || profile?.avatar;

  // Switching to a different salon must start a fresh selection. The booking
  // context keeps services/barber/date between visits, so without a reset the
  // previous salon's selected services (and their total price) would leak into
  // the new salon's "Book a visit" sidebar — and Continue booking could even
  // create a booking with the WRONG salon's services. Detect the salon change
  // here and clear the stale selection before the new salon is registered.
  useEffect(() => {
    if (!salon) return;
    const currentSalonId = getEntityId(booking.salon);
    if (currentSalonId && currentSalonId !== getEntityId(salon)) {
      setBookingServices([]);
      setStylist(null);
      setTimeSlot(null, null, null);
      setSelectedDate(0);
      setSelectedSlot('');
    }
    setSalon(salon);
  }, [salon, setSalon, setBookingServices, setStylist, setTimeSlot]);

  // Restore the saved state for this salon from the backend once the user
  // is authenticated (guests always start unsaved). The profile payload
  // (publicUser.savedSalonIds) gives an instant hint; the fetch keeps it
  // accurate even if the profile is stale.
  useEffect(() => {
    if (userType !== 'authenticated' || !id) return undefined;
    let active = true;
    if (profile?.savedSalonIds?.includes(id)) setSaved(true);
    salonService
      .getSavedSalons()
      .then((list) => {
        if (!active) return;
        const ids = new Set(Array.isArray(list) ? list.map(getEntityId) : []);
        setSaved(ids.has(id));
      })
      .catch(() => {
        // Non-critical — leave the button in its default (unsaved) state.
      });
    return () => {
      active = false;
    };
  }, [id, userType, profile?.savedSalonIds]);

  useEffect(() => {
    if (!id) return undefined;
    let active = true;

    setLoadingBarbers(true);
    Promise.allSettled([
      salonService.getSalonServices(id),
      salonService.getSalonBarbers(id),
    ]).then(([serviceResult, barberResult]) => {
      if (!active) return;
      setServices(serviceResult.status === 'fulfilled' && Array.isArray(serviceResult.value)
        ? serviceResult.value
        : []);
      setBarbers(barberResult.status === 'fulfilled' && Array.isArray(barberResult.value)
        ? barberResult.value
        : []);
      setLoadingServices(false);
      setLoadingBarbers(false);
    });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!barbers.length) {
      if (!loadingBarbers) setLoadingReviews(false);
      return undefined;
    }

    let active = true;
    setLoadingReviews(true);
    Promise.allSettled(
      barbers.map((barber) => salonService.getBarberReviews(getEntityId(barber)))
    ).then((results) => {
      if (!active) return;

      const merged = results.flatMap((result, index) => {
        if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return [];
        return result.value.map((review) => ({ ...review, barber: barbers[index] }));
      });
      const unique = merged.filter((review, index, list) => {
        const reviewId = getEntityId(review);
        return !reviewId || list.findIndex((item) => getEntityId(item) === reviewId) === index;
      });
      setReviews(unique);
      setLoadingReviews(false);
    });

    return () => {
      active = false;
    };
  }, [barbers, loadingBarbers]);

  // Never auto-select a stylist — the user must pick one explicitly from the
  // team section. The booking context keeps its stylist between visits, so a
  // barber picked on a previous salon would silently stay selected (and
  // Continue booking would create a booking for the WRONG barber). If the
  // current stylist doesn't belong to this salon, clear it so the "select a
  // stylist" error shows instead of proceeding blindly.
  useEffect(() => {
    if (loadingBarbers || !booking.stylist) return;
    const stylistId = getEntityId(booking.stylist);
    if (barbers.some((barber) => getEntityId(barber) === stylistId)) return;
    setStylist(null);
  }, [barbers, loadingBarbers, booking.stylist, setStylist]);

  const barber = booking.stylist;
  const hasWorkingDaysConfigured = barber?.workingDays && barber.workingDays.length > 0;
  const workingDays = hasWorkingDaysConfigured ? barber.workingDays : [];

  useEffect(() => {
    if (!id) return undefined;
    if (!booking.stylist) {
      // Barbers may still be loading — a stylist can be auto-selected any
      // moment, so keep the skeleton. Once loaded with no stylist, stop and
      // show the clear "no stylist" message.
      if (loadingBarbers) return undefined;
      setSlots([]);
      setSelectedSlot('');
      setLoadingSlots(false);
      return undefined;
    }
    let active = true;
    setLoadingSlots(true);
    const barberId = getEntityId(booking.stylist);

    const day = dates[selectedDate];
    if (hasWorkingDaysConfigured && !workingDays.includes(day.dayEnum)) {
      if (active) {
        setSlots([]);
        setSelectedSlot('');
        setLoadingSlots(false);
      }
      return;
    }

    bookingService
      .getAvailableTimeSlots(id, barberId, day.isoDate)
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data) ? data : [];
        setSlots(list);
        const firstAvailable = list.find((slot) => slot.status === 'available');
        setSelectedSlot((current) =>
          list.some((slot) => slot.time === current && slot.status === 'available')
            ? current
            : firstAvailable?.time || ''
        );
      })
      .catch(() => {
        if (!active) return;
        setSlots([]);
        setSelectedSlot('');
      })
      .finally(() => {
        if (active) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [id, booking.stylist, loadingBarbers, dates, selectedDate]);

  const galleryImages = useMemo(() => {
    if (!salon) return [landingHero, loginShowcase, landingHero];
    const nestedImages = [
      ...(Array.isArray(salon.gallery) ? salon.gallery : []),
      ...(Array.isArray(salon.images) ? salon.images : []),
      ...(Array.isArray(salon.photos) ? salon.photos : []),
    ];
    const candidates = [
      salon.coverImage,
      salon.coverPhoto,
      salon.image,
      ...nestedImages,
      landingHero,
      loginShowcase,
    ].map(getImageValue).filter(Boolean);
    const unique = [...new Set(candidates)];
    while (unique.length < 3) unique.push(unique[0] || landingHero);
    return unique.slice(0, 3);
  }, [salon]);

  const displayedReviews = useMemo(() => reviews.slice(0, 3), [reviews]);
  const rating = getSalonRating(salon);
  const reviewCount = Number(salon?.reviewCount ?? salon?.reviewsCount ?? reviews.length ?? 0);
  const location = getSalonLocation(salon);
  const startingPrice = services.length
    ? Math.min(...services.map((service) => Number(service.price) || 0))
    : 0;
  // Only services that actually belong to THIS salon count towards the total.
  // This keeps the sidebar honest even in the brief moment before a stale
  // selection from a previous salon is cleared after switching salons.
  const selectedInMenu = useMemo(
    () =>
      booking.services.filter((item) =>
        services.some((service) => getEntityId(service) === getEntityId(item))
      ),
    [booking.services, services]
  );
  const selectedTotal = selectedInMenu.reduce(
    (sum, service) => sum + (Number(service.price) || 0),
    0
  );
  const selectedStylistId = getEntityId(booking.stylist);

  const ratingDistribution = useMemo(() => {
    const counts = [5, 4, 3, 2, 1].map((score) =>
      reviews.filter((review) => Math.round(Number(review.rating) || 0) === score).length
    );
    const max = Math.max(...counts, 1);
    return counts.map((count, index) => ({
      score: 5 - index,
      count,
      width: `${Math.max((count / max) * 100, count ? 7 : 0)}%`,
      percent: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
    }));
  }, [reviews]);

  const scrollToBooking = () => {
    document.getElementById('salon-booking')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleServiceToggle = (service) => {
    const serviceId = getEntityId(service);
    toggleService({
      ...service,
      _id: serviceId,
      id: serviceId,
      price: Number(service.price) || 0,
      duration: Number(service.duration) || 0,
    });
  };

  // When the user tries to book without a barber, flash a red border around
  // the barber cards for one second so the eye is drawn to the team section.
  const flashBarberSelection = () => {
    document.getElementById('salon-team')?.scrollIntoView({ behavior: 'smooth' });
    window.clearTimeout(barberHighlightTimer.current);
    window.cancelAnimationFrame(barberHighlightFrame.current);
    // Toggle the class off and on so rapid repeated clicks replay the pulse
    // animation instead of keeping a static red border.
    setHighlightBarbers(false);
    barberHighlightFrame.current = requestAnimationFrame(() => {
      setHighlightBarbers(true);
      barberHighlightTimer.current = window.setTimeout(() => setHighlightBarbers(false), 1000);
    });
  };

  useEffect(
    () => () => {
      window.clearTimeout(barberHighlightTimer.current);
      window.cancelAnimationFrame(barberHighlightFrame.current);
    },
    []
  );

  useEffect(() => {
    if (booking.stylist) setHighlightBarbers(false);
  }, [booking.stylist]);

  const handleConfirm = () => {
    if (userType === 'guest') {
      setGuestBlockOpen(true);
      return;
    }
    // Only flag services as stale once this salon's menu has actually loaded —
    // while loading, `services` is empty and would wrongly flag everything.
    const staleSelected = !loadingServices
      ? booking.services.filter(
          (item) => !services.some((service) => getEntityId(service) === getEntityId(item))
        )
      : [];
    if (staleSelected.length) {
      // Services from a previously visited salon are still lingering — drop
      // them so this salon's booking can never proceed with the wrong services.
      setBookingServices(selectedInMenu);
      toast.error('Please select a service from this salon first');
      document.getElementById('salon-services')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!booking.services.length) {
      toast.error('Select at least one service first');
      document.getElementById('salon-services')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (!barbers.length && !loadingBarbers) {
      toast.error('This salon has no barbers available, so booking is currently unavailable.');
      flashBarberSelection();
      return;
    }
    if (!booking.stylist) {
      toast.error('Please choose a barber first');
      flashBarberSelection();
      return;
    }
    if (!barbers.some((barber) => getEntityId(barber) === getEntityId(booking.stylist))) {
      toast.error('Please choose a barber from this salon');
      flashBarberSelection();
      return;
    }
    if (!selectedSlot) {
      toast.error('Please pick an available time slot');
      return;
    }

    const day = dates[selectedDate];
    setTimeSlot(day.isoDate, selectedSlot, day.label);
    navigate(`/booking/service?salonId=${encodeURIComponent(id)}`);
  };

  const handleSave = async () => {
    if (userType !== 'authenticated') {
      setGuestBlockOpen(true);
      return;
    }
    if (!id || savingSalon) return;

    setSavingSalon(true);
    try {
      if (saved) {
        await salonService.unsaveSalon(id);
        setSaved(false);
        toast.success('Salon removed from your saved salons');
      } else {
        await salonService.saveSalon(id);
        setSaved(true);
        toast.success('Salon saved to your profile');
      }
    } catch (saveError) {
      toast.error(saveError?.message || 'Could not update saved salons. Please try again.');
    } finally {
      setSavingSalon(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: salon?.name || 'Glow&Cut salon',
      text: `Discover ${salon?.name || 'this salon'} on Glow&Cut`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Salon link copied');
      }
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') toast.error('Could not share this salon');
    }
  };

  if (isLoading) return <Loader variant="full" label="Loading salon" />;

  if (error || !salon) {
    return (
      <main className="salon-detail-page salon-detail-error">
        <Brand />
        <h1>We could not find this salon.</h1>
        <Link to="/services">Browse salons <MdArrowForward /></Link>
      </main>
    );
  }

  return (
    <motion.div
      className="salon-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <header className="salon-detail-shell salon-detail-header">
        <Brand />
        <nav className="salon-detail-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className={link.to === '/stylists' ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="salon-detail-header-actions">
          <button type="button" className="salon-detail-book-button header-cta" onClick={scrollToBooking}>
            Book Now <MdArrowForward />
          </button>
          <button type="button" className="salon-detail-header-search" aria-label="Search salons" onClick={() => navigate('/services')}>
            <MdSearch />
          </button>
          {userType === 'authenticated' && (
            <button type="button" className="salon-detail-header-profile" aria-label="Profile" onClick={() => navigate('/profile')}>
              <Avatar src={profileAvatar} alt={profile?.name || 'Profile'} size="md" className="salon-detail-profile-avatar" />
            </button>
          )}
        </div>
        <button
          type="button"
          className="salon-detail-menu-button"
          aria-label="Open navigation"
          onClick={() => setMenuOpen(true)}
        >
          <MdMenu />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="salon-detail-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="salon-detail-mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            >
              <button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}>
                <MdClose />
              </button>
              <Brand />
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="salon-detail-shell">
        <section className="salon-detail-gallery" aria-label={`${salon.name} gallery`}>
          {galleryImages.map((image, index) => (
            <div className={index === 0 ? 'salon-detail-gallery-main' : ''} key={`${image}-${index}`}>
              <img
                src={image}
                alt={index === 0 ? salon.name : `${salon.name} interior ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.src = index === 0 ? landingHero : loginShowcase;
                }}
              />
            </div>
          ))}
        </section>

        <div className="salon-detail-content-grid">
          <div className="salon-detail-main-column">
            <section className="salon-detail-overview">
              <span className="salon-detail-badge">
                {salon.isVerified ? 'Verified salon' : 'Premium salon'} · {salon.name}
              </span>
              <h1>{salon.name}</h1>
              <div className="salon-detail-meta">
                <RatingStars rating={rating} />
                <strong>{rating.toFixed(1)}</strong>
                <span>({reviewCount.toLocaleString()} reviews)</span>
                <i />
                <span><MdLocationOn /> {location}</span>
                <i />
                <span><MdAccessTime /> {salon.isOpen === false ? 'Closed now' : 'Open until 10 PM'}</span>
              </div>
              <div className="salon-detail-actions">
                <button type="button" className="salon-detail-book-button" onClick={scrollToBooking}>
                  Book Now <MdArrowForward />
                </button>
                <button type="button" className={saved ? 'is-saved' : ''} disabled={savingSalon} onClick={handleSave}>
                  {savingSalon ? (
                    <span className="salon-detail-save-spinner" />
                  ) : saved ? (
                    <MdFavorite />
                  ) : (
                    <MdFavoriteBorder />
                  )}{' '}
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button type="button" onClick={handleShare}><MdShare /> Share</button>
                <a href={salon.phone ? `tel:${salon.phone}` : '#'}><MdPhone /> Call</a>
              </div>
            </section>

            <section className="salon-detail-services" id="salon-services">
              <h2>Services</h2>
              {loadingServices ? (
                <div className="salon-detail-service-grid">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div className="salon-detail-service-card is-loading" key={index} />
                  ))}
                </div>
              ) : services.length ? (
                <div className="salon-detail-service-grid">
                  {services.slice(0, 8).map((service) => {
                    const serviceId = getEntityId(service);
                    const selected = booking.services.some((item) => getEntityId(item) === serviceId);
                    return (
                      <article className={`salon-detail-service-card ${selected ? 'selected' : ''}`} key={serviceId}>
                        <div>
                          <h3>{service.name}</h3>
                          <p>
                            {Number(service.duration) || 45} min · Rs {Number(service.price || 0).toLocaleString()}
                          </p>
                        </div>
                        <button type="button" onClick={() => handleServiceToggle(service)}>
                          {selected ? 'Added' : 'Book'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="salon-detail-empty">This salon has not published its service menu yet.</p>
              )}
            </section>

            <section className="salon-detail-team" id="salon-team">
              <h2>Meet the team</h2>
              {loadingBarbers ? (
                <div className="salon-detail-team-grid">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div className="salon-detail-team-card is-loading" key={index} />
                  ))}
                </div>
              ) : barbers.length ? (
                <div className="salon-detail-team-grid">
                  {barbers.slice(0, 3).map((barber) => {
                    const barberId = getEntityId(barber);
                    const selected = selectedStylistId === barberId;
                    return (
                      <button
                        type="button"
                        className={`salon-detail-team-card ${selected ? 'selected' : ''} ${
                          highlightBarbers ? 'salon-detail-team-card-error' : ''
                        }`}
                        key={barberId}
                        onClick={() => setStylist(barber)}
                      >
                        <img
                          src={getBarberImage(barber)}
                          alt={barber.name}
                          onError={(event) => { event.currentTarget.src = leadStylistImage; }}
                        />
                        <span className="salon-detail-team-shade" />
                        <span className="salon-detail-team-copy">
                          <strong>{barber.name}</strong>
                          <small>{getBarberSpecialty(barber)}</small>
                        </span>
                        {selected && <MdCheckCircle className="salon-detail-team-check" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="salon-detail-empty">
                  This salon has no barbers yet, so online booking isn't available here.
                </p>
              )}
            </section>

            <section className="salon-detail-reviews">
              <div className="salon-detail-reviews-heading">
                <div>
                  <span className="salon-detail-badge">Guest stories</span>
                  <h2>What our clients say</h2>
                </div>
                <div className="salon-detail-rating-summary">
                  <div>
                    <strong>{rating.toFixed(1)}</strong>
                    <RatingStars rating={rating} />
                    <small>{reviewCount.toLocaleString()} reviews</small>
                  </div>
                  <div className="salon-detail-distribution">
                    {ratingDistribution.map((row) => (
                      <div key={row.score}>
                        <span>{row.score}</span>
                        <i><b style={{ width: row.width }} /></i>
                        <small>{row.percent}%</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {loadingReviews ? (
                <div className="salon-detail-review-grid">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div className="salon-detail-review-card is-loading" key={index} />
                  ))}
                </div>
              ) : displayedReviews.length ? (
                <div className="salon-detail-review-grid">
                  {displayedReviews.map((review, index) => {
                    const author =
                      review.user?.userName ||
                      review.user?.name ||
                      review.customer?.name ||
                      'GlowCut customer';
                    return (
                      <article className={`salon-detail-review-card tone-${index + 1}`} key={getEntityId(review) || index}>
                        <RatingStars rating={Number(review.rating) || 0} />
                        <p>{review.comment || review.review || 'A wonderful salon experience.'}</p>
                        <div>
                          <span>{author.charAt(0).toUpperCase()}</span>
                          <p>
                            <strong>{author}</strong>
                            <small>{review.barber?.name || 'Verified visit'} · {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : 'Recently'}</small>
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="salon-detail-empty">No client reviews have been published yet.</p>
              )}

              <div className="salon-detail-review-footer">
                <span>Showing {displayedReviews.length} of {reviewCount.toLocaleString()} reviews</span>
                <button type="button" onClick={() => navigate('/profile/feedback')}>
                  Read all reviews <MdArrowForward />
                </button>
              </div>
            </section>
          </div>

          <aside className="salon-detail-booking-card" id="salon-booking">
            <h2>Book a visit</h2>
            <p>Available slots for next 7 days</p>
            <div className="salon-detail-date-picker">
              {dates.map((day, index) => {
                const isAvailable = !hasWorkingDaysConfigured || workingDays.includes(day.dayEnum);
                const isSelected = selectedDate === index;
                return (
                  <button
                    type="button"
                    disabled={!isAvailable}
                    className={`${isSelected ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                    onClick={() => {
                      if (!isAvailable) {
                        toast.error(`Barber is not available on ${day.dayEnum}s.`);
                        return;
                      }
                      setSelectedDate(index);
                      setSelectedSlot('');
                    }}
                    key={day.isoDate}
                  >
                    <span className="salon-detail-date-label">
                      {day.label === "Today" || day.label === "Tomorrow" ? day.label : day.dayEnum.slice(0, 3)}
                    </span>
                    <span className="salon-detail-date-number">{day.dateText.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
            <div className="salon-detail-slots">
              {loadingSlots
                ? Array.from({ length: 10 }, (_, index) => <i key={index} />)
                : slots.map((slot) => (
                    <button
                      type="button"
                      disabled={slot.status === 'unavailable'}
                      className={`${selectedSlot === slot.time ? 'selected' : ''} ${slot.status === 'unavailable' ? 'unavailable' : ''}`}
                      onClick={() => {
                        if (slot.status === 'available') setSelectedSlot(slot.time);
                      }}
                      key={slot.time}
                    >
                      {slot.time.includes(':') ? formatTime(slot.time) : slot.time}
                    </button>
                  ))}
            </div>
            {!loadingSlots && !slots.length && (
              <p className="salon-detail-no-slots">
                {!loadingBarbers && !barbers.length
                  ? 'No barbers in this salon — booking is unavailable here.'
                  : !loadingBarbers && !booking.stylist
                    ? 'Select a barber to see available slots.'
                    : 'No slots available for this day.'}
              </p>
            )}
            <div className="salon-detail-booking-price">
              <span>{selectedInMenu.length ? 'Selected total' : 'Starting from'}</span>
              <strong>Rs {(selectedInMenu.length ? selectedTotal : startingPrice).toLocaleString()}</strong>
            </div>
            {!loadingBarbers && !booking.stylist && (
              <div className="salon-detail-booking-error" role="alert">
                <strong>{barbers.length ? 'Select a barber' : 'No barber available'}</strong>
                <span>
                  {barbers.length
                    ? 'Please choose a barber from the team section above to continue booking.'
                    : 'This salon has no barbers, so booking is unavailable here. Please explore another salon.'}
                </span>
              </div>
            )}
            <button type="button" className="salon-detail-continue" onClick={handleConfirm}>
              Continue booking <MdArrowForward />
            </button>
            <small><MdCalendarToday /> Instant confirmation</small>
          </aside>
        </div>
      </main>

      <Footer />
      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </motion.div>
  );
}