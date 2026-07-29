import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MdArrowForward,
  MdClose,
  MdMenu,
  MdPeople,
  MdRefresh,
  MdStar,
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import AuthContext from '../../../context/AuthContext';
import GuestBlock from '../../../components/auth/GuestBlock';
import * as salonService from '../../../services/salonService';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import leadStylistImage from '../../../assets/home/lead-stylist.png';
import stylistGrid from '../../../assets/home/stylist-grid.png';
import './Stylists.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salon & Service', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
];

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', to: '/contact-us' },
    { label: 'Careers', to: '/careers' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms and Conditions', to: '/terms-of-service' },
  ],
  Features: [
    { label: 'Online Booking', to: '/services' },
    { label: 'Sales & Payments', to: '/rewards/glow' },
    { label: 'Marketing & Automation', to: '/support/updates' },
    { label: 'Reporting', to: '/profile' },
    { label: 'Mini-CRM', to: '/profile' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'X', icon: FaXTwitter },
  { label: 'LinkedIn', icon: FaLinkedinIn },
];

const FALLBACK_POSITIONS = ['left top', 'right top', 'left bottom', 'right bottom'];

const getEntityId = (entity) => entity?._id || entity?.id || '';

const getSalonId = (stylist) =>
  getEntityId(stylist?.salon) ||
  getEntityId(stylist?.salonId) ||
  stylist?.salon ||
  stylist?.salonId ||
  '';

const getRating = (stylist) => {
  const value = Number(stylist?.averageRating ?? stylist?.rating ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const getSpecialty = (stylist) => {
  const firstService = Array.isArray(stylist?.services) ? stylist.services[0] : null;
  const value =
    stylist?.specialty ||
    stylist?.title ||
    firstService?.name ||
    stylist?.description ||
    'GlowCut Specialist';

  return String(value).split(/[.!]/)[0].trim() || 'GlowCut Specialist';
};

const getExperience = (stylist) => {
  const value = Number(stylist?.experience ?? stylist?.yearsExperience ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const getProfileImage = (stylist) =>
  stylist?.profileImage || stylist?.image || stylist?.avatar || '';

const getBadge = (stylist) => {
  const rating = getRating(stylist);
  const experience = getExperience(stylist);

  if (rating >= 4.5 || stylist?.isVerified) return { label: 'Top Rated', tone: 'top' };
  if (stylist?.isAvailable) return { label: 'Available Today', tone: 'available' };
  if (experience >= 5) return { label: 'Premium', tone: 'premium' };
  return { label: 'New', tone: 'new' };
};

function Brand() {
  return (
    <Link to="/" className="stylists-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function GoldButton({ children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`stylists-gold-button ${className}`}>
      <span>{children}</span>
      <MdArrowForward />
    </button>
  );
}

function StylistPhoto({ stylist, index }) {
  const image = getProfileImage(stylist);
  const fallbackIndex = index % 5;
  const fallbackStyle =
    fallbackIndex === 4
      ? {
          backgroundImage: `url(${leadStylistImage})`,
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
        }
      : {
          backgroundImage: `url(${stylistGrid})`,
          backgroundPosition: FALLBACK_POSITIONS[fallbackIndex],
          backgroundSize: '200% 200%',
        };

  return (
    <div
      className="stylists-card-photo"
      style={fallbackStyle}
      role="img"
      aria-label={stylist?.name || 'GlowCut stylist'}
    >
      {image && (
        <img
          src={image}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

function StylistSkeleton() {
  return (
    <div className="stylists-card stylists-skeleton" aria-hidden="true">
      <div />
      <i />
      <i />
      <i />
    </div>
  );
}

export default function Stylists() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guestBlockOpen, setGuestBlockOpen] = useState(false);
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStylists = useCallback(async () => {
    setLoading(true);
    setError('');

    const [allResult, availableResult] = await Promise.allSettled([
      salonService.getStylists({ limit: 60, status: 'active' }),
      salonService.getAvailableBarbers({ limit: 60 }),
    ]);

    const allStylists =
      allResult.status === 'fulfilled' && Array.isArray(allResult.value)
        ? allResult.value
        : [];
    const availableStylists =
      availableResult.status === 'fulfilled' && Array.isArray(availableResult.value)
        ? availableResult.value
        : [];

    const availableIds = new Set(
      availableStylists.map((stylist) => String(getEntityId(stylist))).filter(Boolean),
    );
    const source = allStylists.length > 0 ? allStylists : availableStylists;

    if (source.length > 0) {
      setStylists(
        source.map((stylist) => ({
          ...stylist,
          isAvailable:
            typeof stylist.isAvailable === 'boolean'
              ? stylist.isAvailable
              : availableIds.has(String(getEntityId(stylist))),
        })),
      );
    } else {
      setStylists([]);
      if (allResult.status === 'rejected' && availableResult.status === 'rejected') {
        setError('We could not load stylists right now. Please try again.');
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStylists();
  }, [fetchStylists]);

  const orderedStylists = useMemo(
    () =>
      [...stylists].sort((a, b) => {
        const availabilityDelta = Number(Boolean(b.isAvailable)) - Number(Boolean(a.isAvailable));
        return availabilityDelta || getRating(b) - getRating(a);
      }),
    [stylists],
  );

  const handleView = (stylist) => {
    if (userType === 'guest') {
      setGuestBlockOpen(true);
      return;
    }

    const salonId = getSalonId(stylist);
    navigate(salonId ? `/salons/${salonId}` : '/salons/nearby');
  };

  return (
    <main className="stylists-page">
      <div className="stylists-shell">
        <header className="stylists-header">
          <Brand />

          <nav className="stylists-nav" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={item.to === '/stylists' ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <GoldButton
            className="stylists-header-cta"
            onClick={() => navigate('/salons/nearby')}
          >
            Book Now
          </GoldButton>

          <button
            type="button"
            className="stylists-menu-button"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <MdMenu />
          </button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation"
                className="stylists-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                className="stylists-mobile-menu"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
              >
                <div>
                  <Brand />
                  <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileOpen(false)}
                  >
                    <MdClose />
                  </button>
                </div>
                {NAV_LINKS.map((item) => (
                  <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                <GoldButton
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/salons/nearby');
                  }}
                >
                  Book Now
                </GoldButton>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <section className="stylists-intro">
          <div className="stylists-eyebrow">
            <i />
            Our Teams
          </div>
          <h1>
            Meet our expect <span>Stylists</span>
          </h1>
          <p>Verified professionals across cutting, color, skincare, and beauty.</p>
        </section>

        <section className="stylists-results" aria-live="polite">
          {loading ? (
            <div className="stylists-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <StylistSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="stylists-state-card">
              <MdRefresh />
              <h2>Stylists could not be loaded</h2>
              <p>{error}</p>
              <GoldButton onClick={fetchStylists}>Try Again</GoldButton>
            </div>
          ) : orderedStylists.length === 0 ? (
            <div className="stylists-state-card">
              <MdPeople />
              <h2>No stylists available right now</h2>
              <p>Partner salons update their teams and availability throughout the day.</p>
            </div>
          ) : (
            <motion.div
              className="stylists-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {orderedStylists.map((stylist, index) => {
                const rating = getRating(stylist);
                const experience = getExperience(stylist);
                const badge = getBadge(stylist);

                return (
                  <motion.article
                    className="stylists-card"
                    key={getEntityId(stylist) || `${stylist.name}-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <StylistPhoto stylist={stylist} index={index} />
                    <div className="stylists-card-shade" />

                    <span className={`stylists-badge ${badge.tone}`}>
                      <i />
                      {badge.label}
                    </span>

                    <span className="stylists-rating">
                      <MdStar />
                      {rating > 0 ? rating.toFixed(1) : 'New'}
                    </span>

                    <div className="stylists-card-copy">
                      <h2>{stylist.name || 'GlowCut Specialist'}</h2>
                      <p>
                        {getSpecialty(stylist)}
                        {experience > 0 && <span> · {experience}y</span>}
                      </p>
                      <GoldButton onClick={() => handleView(stylist)}>View</GoldButton>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>

      <footer className="stylists-footer">
        <div className="stylists-shell">
          <div className="stylists-footer-grid">
            <div className="stylists-footer-cta">
              <h2>Are you ready to get started?</h2>
              <GoldButton onClick={() => navigate('/auth/signup')}>Get Started for free</GoldButton>
            </div>

            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div className="stylists-footer-links" key={title}>
                <h3>{title}</h3>
                {links.map((link) => (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="stylists-footer-bottom">
            <Brand />
            <div className="stylists-socials">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <a key={label} href="#" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="stylists-copyright">Copyright 2026 Glow&Cut</div>
      </footer>

      <GuestBlock isOpen={guestBlockOpen} onClose={() => setGuestBlockOpen(false)} />
    </main>
  );
}
