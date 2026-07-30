import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MdArrowForward,
  MdClose,
  MdContentCut,
  MdLocationOn,
  MdMenu,
  MdRefresh,
  MdSearch,
  MdStar,
  MdTune,
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import * as salonService from '../../../services/salonService';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import landingHero from '../../../assets/home/landing-hero.png';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import './Services.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salon & Service', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const FILTERS = [
  { label: 'All', key: 'all' },
  { label: 'Hair', key: 'hair', terms: ['hair', 'haircut', 'styling'] },
  { label: 'Color', key: 'color', terms: ['color', 'colour', 'dye'] },
  { label: 'Spa & Skin', key: 'spa', terms: ['spa', 'skin', 'facial'] },
  { label: 'Nails', key: 'nails', terms: ['nail', 'manicure', 'pedicure'] },
  { label: 'Barber', key: 'barber', terms: ['barber', 'beard', 'grooming'] },
  { label: 'Open Now', key: 'open' },
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

const getEntityId = (entity) => entity?._id || entity?.id || '';

const getServiceSalonId = (service) =>
  getEntityId(service?.salon) ||
  getEntityId(service?.salonId) ||
  service?.salon ||
  service?.salonId ||
  '';

const getSalonImage = (salon) =>
  salon?.coverImage || salon?.coverPhoto || salon?.logo || salon?.image || landingHero;

const getSalonRating = (salon) => {
  const value = Number(salon?.averageRating ?? salon?.rating ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const getSalonLocation = (salon) => {
  const address = salon?.address;
  if (typeof address === 'string' && address.trim()) return address;

  const parts = [
    address?.area,
    address?.city,
    salon?.area,
    salon?.city,
    salon?.location,
  ].filter(Boolean);

  return [...new Set(parts)].slice(0, 2).join(', ') || 'Location not provided';
};

const isSalonOpen = (salon) => {
  if (typeof salon?.isOpen === 'boolean') return salon.isOpen;
  if (typeof salon?.openNow === 'boolean') return salon.openNow;

  const status = String(salon?.status || salon?.availability || '').toLowerCase();
  if (['closed', 'inactive', 'suspended', 'unavailable'].includes(status)) return false;
  if (['open', 'active', 'approved', 'available'].includes(status)) return true;

  return true;
};

const serviceSearchText = (service) =>
  `${service?.name || ''} ${service?.category || ''}`.toLowerCase();

function Brand() {
  return (
    <Link to="/" className="services-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function GoldButton({ children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`services-gold-button ${className}`}>
      <span>{children}</span>
      <MdArrowForward />
    </button>
  );
}

function SalonSkeleton() {
  return (
    <div className="services-salon-card services-skeleton" aria-hidden="true">
      <div className="services-skeleton-image" />
      <div className="services-skeleton-copy">
        <i />
        <i />
        <div>
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const { user, profile, userType } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [salons, setSalons] = useState([]);
  const [catalogSalons, setCatalogSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minimumRating, setMinimumRating] = useState(0);
  const profileAvatar =
    user?.profileImage || user?.avatar || profile?.profileImage || profile?.avatar;

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError('');

    const [salonResult, serviceResult] = await Promise.allSettled([
      salonService.getSalons({ limit: 60 }),
      salonService.getServiceCatalog({ limit: 250, status: 'active' }),
    ]);

    if (salonResult.status === 'fulfilled') {
      const nextSalons = Array.isArray(salonResult.value) ? salonResult.value : [];
      setSalons(nextSalons);
      setCatalogSalons(nextSalons);
    } else {
      setSalons([]);
      setError('We could not load salons right now. Please try again.');
    }

    if (serviceResult.status === 'fulfilled') {
      setServices(Array.isArray(serviceResult.value) ? serviceResult.value : []);
    } else {
      setServices([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const servicesBySalon = useMemo(() => {
    const map = new Map();

    services.forEach((service) => {
      const salonId = String(getServiceSalonId(service));
      if (!salonId) return;
      const current = map.get(salonId) || [];
      current.push(service);
      map.set(salonId, current);
    });

    return map;
  }, [services]);

  const runSearch = async (event) => {
    event?.preventDefault();
    setSearching(true);
    setError('');

    try {
      let result;
      const cleanQuery = query.trim();
      const cleanLocation = location.trim();

      if (cleanQuery) {
        const salonMatches = await salonService.searchSalons(cleanQuery);
        const serviceSalonIds = new Set(
          services
            .filter((service) => serviceSearchText(service).includes(cleanQuery.toLowerCase()))
            .map((service) => String(getServiceSalonId(service)))
            .filter(Boolean),
        );
        const serviceMatches = catalogSalons.filter((salon) =>
          serviceSalonIds.has(String(getEntityId(salon))),
        );
        const merged = new Map();
        [...(Array.isArray(salonMatches) ? salonMatches : []), ...serviceMatches].forEach(
          (salon) => {
            const key = String(getEntityId(salon) || salon.name);
            merged.set(key, salon);
          },
        );
        result = [...merged.values()];
      } else if (cleanLocation) {
        result = await salonService.getSalonsByCity(cleanLocation);
      } else {
        result = await salonService.getSalons({ limit: 60 });
      }

      let nextSalons = Array.isArray(result) ? result : [];
      if (cleanQuery && cleanLocation) {
        const locationNeedle = cleanLocation.toLowerCase();
        nextSalons = nextSalons.filter((salon) =>
          getSalonLocation(salon).toLowerCase().includes(locationNeedle),
        );
      }

      setSalons(nextSalons);
    } catch {
      setSalons([]);
      setError('Search could not be completed. Please check your connection and retry.');
    } finally {
      setSearching(false);
    }
  };

  const visibleSalons = useMemo(() => {
    const filter = FILTERS.find((item) => item.key === activeFilter);

    return salons
      .filter((salon) => getSalonRating(salon) >= minimumRating)
      .filter((salon) => {
        if (!filter || filter.key === 'all') return true;
        if (filter.key === 'open') return isSalonOpen(salon);

        const salonServices = servicesBySalon.get(String(getEntityId(salon))) || [];
        return salonServices.some((service) =>
          filter.terms.some((term) => serviceSearchText(service).includes(term)),
        );
      })
      .sort((a, b) => getSalonRating(b) - getSalonRating(a));
  }, [activeFilter, minimumRating, salons, servicesBySalon]);

  const getSalonTags = (salon) => {
    const salonServices = servicesBySalon.get(String(getEntityId(salon))) || [];
    const labels = salonServices
      .map((service) => service.category || service.name)
      .filter(Boolean)
      .map((label) => String(label).trim())
      .filter((label, index, array) => array.indexOf(label) === index)
      .slice(0, 3);

    return labels.length > 0 ? labels : ['Salon'];
  };

  return (
    <main className="services-page">
      <div className="services-shell">
        <header className="services-header">
          <Brand />

          <nav className="services-nav" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={item.to === '/services' ? 'active' : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="services-header-actions">
            <GoldButton
              className="services-header-cta"
              onClick={() => navigate('/salons/nearby')}
            >
              Book Now
            </GoldButton>
            <button type="button" className="services-header-search" aria-label="Search salons" onClick={() => navigate('/services')}>
              <MdSearch />
            </button>
            {userType === 'authenticated' && (                <button type="button" className="services-header-profile" aria-label="Profile" onClick={() => navigate('/profile')}>
                <Avatar src={profileAvatar} alt={profile?.name || 'Profile'} size="md" className="services-profile-avatar" />
              </button>
            )}
          </div>

          <button
            type="button"
            className="services-menu-button"
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
                className="services-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                className="services-mobile-menu"
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

        <section className="services-intro">
          <div className="services-eyebrow">
            <i />
            Discover
          </div>
          <h1>
            Find your next <span>Favorite Salon</span>
          </h1>
          <p>
            Curated luxury salons and independent stylists - filter by service, distance, and vibe.
          </p>

          <form className="services-search-bar" onSubmit={runSearch}>
            <label className="services-query-input">
              <MdSearch />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search salons, services..."
                aria-label="Search salons and services"
              />
            </label>
            <label className="services-location-input">
              <MdLocationOn />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Location"
                aria-label="Location"
              />
            </label>
            <button
              type="button"
              className={filtersOpen ? 'services-filter-button active' : 'services-filter-button'}
              onClick={() => setFiltersOpen((current) => !current)}
            >
              <MdTune />
              Filters
            </button>
            <button type="submit" className="services-search-button" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
              {!searching && <MdArrowForward />}
            </button>
          </form>

          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                className="services-advanced-filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span>Minimum rating</span>
                {[0, 4, 4.5].map((rating) => (
                  <button
                    type="button"
                    key={rating}
                    className={minimumRating === rating ? 'active' : ''}
                    onClick={() => setMinimumRating(rating)}
                  >
                    {rating === 0 ? 'Any rating' : `${rating}+`}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="services-filter-chips">
            {FILTERS.map((filter) => (
              <button
                type="button"
                key={filter.key}
                className={activeFilter === filter.key ? 'active' : ''}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="services-results" aria-live="polite">
          {loading ? (
            <div className="services-salon-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <SalonSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className="services-state-card">
              <MdRefresh />
              <h2>Salons could not be loaded</h2>
              <p>{error}</p>
              <GoldButton onClick={fetchCatalog}>Try Again</GoldButton>
            </div>
          ) : visibleSalons.length === 0 ? (
            <div className="services-state-card">
              <MdContentCut />
              <h2>No matching salons found</h2>
              <p>Try a different service, location, or rating filter.</p>
              <button
                type="button"
                className="services-clear-button"
                onClick={() => {
                  setActiveFilter('all');
                  setMinimumRating(0);
                  setQuery('');
                  setLocation('');
                  fetchCatalog();
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div
              className="services-salon-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.055 } },
              }}
            >
              {visibleSalons.map((salon) => {
                const salonId = getEntityId(salon);
                const rating = getSalonRating(salon);
                const open = isSalonOpen(salon);

                return (
                  <motion.article
                    className="services-salon-card"
                    key={salonId || salon.name}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="services-card-image">
                      <img
                        src={getSalonImage(salon)}
                        alt={`${salon.name || 'Salon'} interior`}
                        onError={(event) => {
                          event.currentTarget.src = landingHero;
                        }}
                      />
                      <span>
                        <MdStar />
                        {rating > 0 ? rating.toFixed(1) : 'New'}
                      </span>
                    </div>

                    <div className="services-card-copy">
                      <div className="services-card-title">
                        <h2>{salon.name || 'GlowCut Partner Salon'}</h2>
                      </div>
                      <p>
                        <MdLocationOn />
                        {getSalonLocation(salon)}
                      </p>
                      <div className="services-card-tags">
                        {getSalonTags(salon).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="services-card-actions">
                        <small className={open ? 'open' : 'closed'}>
                          <i />
                          {open ? 'Open' : 'Closed'}
                        </small>
                        <GoldButton
                          onClick={() =>
                            navigate(salonId ? `/salons/${salonId}` : '/salons/nearby')
                          }
                        >
                          View
                        </GoldButton>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>

      <footer className="services-footer">
        <div className="services-shell">
          <div className="services-footer-grid">
            <div className="services-footer-cta">
              <h2>Are you ready to get started?</h2>
              <GoldButton onClick={() => navigate('/auth/signup')}>Get Started for free</GoldButton>
            </div>
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div className="services-footer-links" key={title}>
                <h3>{title}</h3>
                {links.map((link) => (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="services-footer-bottom">
            <Brand />
            <div className="services-socials">
              {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
                <a key={label} href="#" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="services-copyright">Copyright 2026 Glow&Cut</div>
      </footer>
    </main>
  );
}
