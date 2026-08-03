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
  MdStar,
  MdAccessTime,
  MdStore,
  MdSpa,
  MdContentCut as MdScissors,
  MdPalette,
  MdDry,
  MdBrush,
  MdPerson,
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import * as salonService from '../../../services/salonService';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import landingHero from '../../../assets/home/landing-hero.png';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import './Services.css';

// ─── Constants ─────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salons & Service', to: '/services' },
  { label: 'Salon & Barbers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const SERVICE_CATEGORIES = [
  { key: 'all', label: 'All Services', icon: MdContentCut },
  { key: 'haircuts', label: 'Haircuts', icon: MdScissors, terms: ['haircut', 'cut', 'trim', 'fade', 'buzz', 'taper'] },
  { key: 'grooming', label: 'Grooming', icon: MdPerson, terms: ['grooming', 'beard', 'shave', 'moustache', 'facial hair'] },
  { key: 'color', label: 'Color', icon: MdPalette, terms: ['color', 'colour', 'dye', 'bleach', 'highlight', 'balayage', 'toner'] },
  { key: 'spa', label: 'Spa', icon: MdSpa, terms: ['spa', 'facial', 'mask', 'steam', 'scrub', 'massage', 'cleanse'] },
  { key: 'styling', label: 'Styling', icon: MdBrush, terms: ['styling', 'blow-dry', 'blow dry', 'straighten', 'curl', 'perm', 'updo'] },
  { key: 'treatment', label: 'Treatments', icon: MdDry, terms: ['treatment', 'keratin', 'botox', 'repair', 'deep condition', 'scalp'] },
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

// ─── Helpers ───────────────────────────────────────────────

const getEntityId = (entity) => entity?._id || entity?.id || '';

const getSalonImage = (salon) =>
  salon?.coverImage || salon?.coverPhoto || salon?.logo || salon?.image || landingHero;

const getSalonRating = (salon) => {
  const value = Number(salon?.averageRating ?? salon?.rating ?? 0);
  return Number.isFinite(value) ? value : 0;
};

const getSalonLocation = (salon) => {
  const address = salon?.address;
  if (typeof address === 'string' && address.trim()) return address;
  const parts = [address?.area, address?.city, salon?.area, salon?.city, salon?.location].filter(Boolean);
  return [...new Set(parts)].slice(0, 2).join(', ') || 'Location not provided';
};

const isSalonOpen = (salon) => {
  if (typeof salon?.isActive === 'boolean') return salon.isActive;
  if (typeof salon?.isOpen === 'boolean') return salon.isOpen;
  if (typeof salon?.openNow === 'boolean') return salon.openNow;
  const status = String(salon?.status || salon?.availability || '').toLowerCase();
  if (['closed', 'inactive', 'suspended', 'unavailable'].includes(status)) return false;
  if (['open', 'active', 'approved', 'available'].includes(status)) return true;
  return true;
};

const getServiceSalonId = (service) =>
  getEntityId(service?.salon) ||
  getEntityId(service?.salonId) ||
  service?.salon ||
  service?.salonId ||
  '';

const serviceSearchText = (service) =>
  `${service?.name || ''} ${service?.category || ''} ${service?.description || ''}`.toLowerCase();

// ─── Sub-components ────────────────────────────────────────

function Brand() {
  return (
    <Link to="/" className="services-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function GoldButton({ children, onClick, className = '', disabled = false }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`services-gold-button ${className}`}>
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

// ─── Main Component ────────────────────────────────────────

export default function Services() {
  const navigate = useNavigate();
  const { user, profile, userType } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [salons, setSalons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const profileAvatar =
    user?.profileImage || user?.avatar || profile?.profileImage || profile?.avatar;

  // ── Fetch data ──

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError('');

    const [salonResult, serviceResult] = await Promise.allSettled([
      salonService.getSalons({ limit: 60 }),
      salonService.getServiceCatalog({ limit: 250, status: 'active' }),
    ]);

    if (salonResult.status === 'fulfilled') {
      setSalons(Array.isArray(salonResult.value) ? salonResult.value : []);
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

  // ── Data derived state ──

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

  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    const category = SERVICE_CATEGORIES.find((c) => c.key === activeCategory);
    if (!category) return services;
    return services.filter((service) =>
      category.terms.some((term) => serviceSearchText(service).includes(term))
    );
  }, [services, activeCategory]);

  const salonsWithServices = useMemo(() => {
    const salonHasServices = new Set();
    services.forEach((service) => {
      const salonId = String(getServiceSalonId(service));
      if (salonId) salonHasServices.add(salonId);
    });
    return salons
      .filter((salon) => salonHasServices.has(String(getEntityId(salon))))
      .sort((a, b) => getSalonRating(b) - getSalonRating(a));
  }, [salons, services]);

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

  const getSalonNameForService = (service) => {
    const salonId = String(getServiceSalonId(service));
    const salon = salons.find((s) => String(getEntityId(s)) === salonId);
    return salon?.name || 'GlowCut Partner';
  };

  const getSalonIdForService = (service) => {
    const salonId = String(getServiceSalonId(service));
    return salonId;
  };

  const formatPrice = (price) => {
    const num = Number(price || 0);
    return `Rs ${num.toLocaleString()}`;
  };

  const formatDuration = (minutes) => {
    const mins = Number(minutes || 0);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
  };

  // ── Render ──

  return (
    <main className="services-page">
      <div className="services-shell">
        {/* ── Header ── */}
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
            <GoldButton className="services-header-cta" onClick={() => navigate('/services')}>
              Book Now
            </GoldButton>
            {userType === 'authenticated' && (
              <button type="button" className="services-header-profile" aria-label="Profile" onClick={() => navigate('/profile')}>
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

        {/* ── Mobile Menu ── */}
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
                  <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
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
                    navigate('/services');
                  }}
                >
                  Book Now
                </GoldButton>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Hero / Intro ── */}
        <section className="services-intro">
          <div className="services-eyebrow">
            <i />
            Discover
          </div>
          <h1>
            Explore <span>Salons & Services</span>
          </h1>
          <p>
            Browse our curated partner salons and explore services tailored just for you.
          </p>
        </section>

        {/* ── Loading / Error ── */}
        {loading ? (
          <section className="services-loading-section">
            <div className="services-salon-grid">
              {Array.from({ length: 6 }, (_, i) => (
                <SalonSkeleton key={i} />
              ))}
            </div>
          </section>
        ) : error ? (
          <section className="services-state-card">
            <MdRefresh />
            <h2>Salons could not be loaded</h2>
            <p>{error}</p>
            <GoldButton onClick={fetchCatalog}>Try Again</GoldButton>
          </section>
        ) : (
          <>
            {/* ════════════════════════════════════════════════
                SECTION 1: PARTNER SALONS
               ════════════════════════════════════════════════ */}
            <section className="services-salons-section" id="services-salons">
              <div className="services-section-header">
                <div>
                  <div className="services-eyebrow">
                    <i />
                    Partner Salons
                  </div>
                  <h2>
                    Premium <span>Grooming Spots</span>
                  </h2>
                </div>
                <div className="services-section-meta">
                  <span className="services-count-badge">{salonsWithServices.length} Salons</span>
                  <p>
                    Hand-picked partner salons ready to serve you with top-notch quality and style.
                  </p>
                </div>
              </div>

              {salonsWithServices.length === 0 ? (
                <div className="services-state-card services-state-card-sm">
                  <MdStore />
                  <h2>No partner salons yet</h2>
                  <p>Check back soon as new premium salons join Glow&Cut.</p>
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
                  {salonsWithServices.map((salon) => {
                    const salonId = getEntityId(salon);
                    const rating = getSalonRating(salon);
                    const open = isSalonOpen(salon);

                    return (
                      <motion.article
                        className="services-salon-card"
                        key={salonId || salon.name}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <div className="services-card-image">
                          <img
                            src={getSalonImage(salon)}
                            alt={`${salon.name || 'Salon'} interior`}
                            onError={(e) => { e.currentTarget.src = landingHero; }}
                          />
                          <span className="services-card-rating-badge">
                            <MdStar />
                            {rating > 0 ? rating.toFixed(1) : 'New'}
                          </span>
                          <span className={`services-card-status ${open ? 'open' : 'closed'}`}>
                            <i />
                            {open ? 'Open' : 'Closed'}
                          </span>
                        </div>

                        <div className="services-card-copy">
                          <div className="services-card-title">
                            <h3>{salon.name || 'GlowCut Partner Salon'}</h3>
                          </div>
                          <p className="services-card-location">
                            <MdLocationOn />
                            {getSalonLocation(salon)}
                          </p>
                          <div className="services-card-tags">
                            {getSalonTags(salon).map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                          <div className="services-card-actions">
                            <div className="services-card-meta">
                              <small>
                                <MdContentCut />
                                {servicesBySalon.get(salonId)?.length || 0} services
                              </small>
                            </div>
                            <GoldButton
                              disabled={!open}
                              onClick={() =>
                                navigate(salonId ? `/salons/${salonId}` : '/salons/nearby')
                              }
                            >
                              {open ? 'View Salon' : 'Closed'}
                            </GoldButton>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              )}
            </section>

            {/* ════════════════════════════════════════════════
                SECTION 2: SERVICES BY CATEGORY
               ════════════════════════════════════════════════ */}
            <section className="services-services-section" id="services-services">
              <div className="services-section-header">
                <div>
                  <div className="services-eyebrow">
                    <i />
                    Browse Services
                  </div>
                  <h2>
                    Find Your <span>Perfect Style</span>
                  </h2>
                </div>
                <div className="services-section-meta">
                  <span className="services-count-badge">{filteredServices.length} Services</span>
                  <p>
                    Explore services by category — from classic cuts to luxury spa treatments.
                  </p>
                </div>
              </div>

              {/* Category Tabs */}
              <div className="services-category-tabs">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.key;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      className={`services-category-tab ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.key)}
                    >
                      <span className="services-category-icon">
                        <Icon />
                      </span>
                      <span className="services-category-label">{cat.label}</span>
                      {isActive && <motion.span className="services-category-indicator" layoutId="categoryIndicator" />}
                    </button>
                  );
                })}
              </div>

              {/* Services Grid */}
              {filteredServices.length === 0 ? (
                <div className="services-state-card services-state-card-sm">
                  <MdContentCut />
                  <h2>No services found</h2>
                  <p>No services match this category. Try another category above.</p>
                </div>
              ) : (
                <motion.div
                  className="services-service-grid"
                  key={activeCategory}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredServices.map((service, index) => {
                    const serviceId = getEntityId(service);
                    const salonName = getSalonNameForService(service);
                    const salonId = getSalonIdForService(service);
                    const activeCat = SERVICE_CATEGORIES.find(c => c.key === activeCategory);
                    const CatIcon = activeCat?.icon || MdContentCut;

                    return (
                      <motion.div
                        className="services-service-card"
                        key={serviceId || index}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="services-service-card-top">
                          <div className="services-service-icon">
                            <CatIcon />
                          </div>
                          <div className="services-service-info">
                            <h4>{service.name}</h4>
                            <span className="services-service-salon">
                              <MdStore />
                              {salonName}
                            </span>
                          </div>
                        </div>

                        <div className="services-service-details">
                          <div className="services-service-detail-item">
                            <span className="services-detail-label">Price</span>
                            <strong className="services-detail-value price">
                              {formatPrice(service.price)}
                            </strong>
                          </div>
                          <div className="services-service-detail-item">
                            <span className="services-detail-label">Duration</span>
                            <strong className="services-detail-value">
                              <MdAccessTime />
                              {formatDuration(service.duration)}
                            </strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="services-view-salon-btn"
                          onClick={() =>
                            navigate(salonId ? `/salons/${salonId}` : '/salons/nearby')
                          }
                        >
                          View Salon
                          <MdArrowForward />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </section>
          </>
        )}
      </div>

      {/* ── Footer ── */}
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
