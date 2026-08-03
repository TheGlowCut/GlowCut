import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MdArrowBackIosNew,
  MdArrowForward,
  MdArrowForwardIos,
  MdAutoAwesome,
  MdCalendarMonth,
  MdClose,
  MdContentCut,
  MdCreditCard,
  MdDownload,
  MdLocationOn,
  MdMenu,
  MdOutlineSpa,
  MdSearch,
  MdShield,
  MdStar,
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import landingHero from '../../../assets/home/landing-hero.png';
import aiPortrait from '../../../assets/home/ai-portrait.png';
import leadStylistImage from '../../../assets/home/lead-stylist.png';
import stylistGrid from '../../../assets/home/stylist-grid.png';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import { useSalonList } from '../../../hooks/useSalon';
import * as salonService from '../../../services/salonService';
import AuthContext from '../../../context/AuthContext';
import SocketContext, { SOCKET_EVENTS } from '../../../context/SocketContext';
import Avatar from '../../../components/ui/Avatar';
import './Home.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salon & Service', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const BENEFITS = [
  { label: 'Calendar', icon: MdCalendarMonth },
  { label: 'Online Bookings', icon: MdContentCut },
  { label: 'Sales & Payments', icon: MdCreditCard, active: true },
  { label: 'Calls & Text', icon: MdShield },
];

const SERVICES = [
  { title: 'Haircut & Styling', icon: MdContentCut },
  { title: 'Hair Treatment', icon: MdOutlineSpa },
  { title: 'Hair Coloring', icon: MdAutoAwesome },
  { title: 'Spa & Facial', icon: MdStar },
];

const STATS = [
  { value: '127%', label: 'Increase in Monthly Revenue', icon: MdAutoAwesome },
  { value: '64%', label: 'Higher Rebooking Rates', icon: MdContentCut },
  { value: '42%', label: 'Decrease in No-Show Losses', icon: MdCalendarMonth },
];



const FOOTER_LINKS = {
  Company: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Contact Us', to: '/contact-us' },
    { label: 'Careers', to: '/careers' },
  ],
};

const socialLinks = [
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'X', icon: FaXTwitter },
  { label: 'LinkedIn', icon: FaLinkedinIn },
];

function Brand() {
  return (
    <Link to="/" className="home-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function GoldButton({ children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`home-gold-button ${className}`}>
      <span>{children}</span>
      <MdArrowForward aria-hidden="true" />
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user, profile, userType } = useContext(AuthContext);
  const { socket, isConnected } = useContext(SocketContext) || {};
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchArea, setSearchArea] = useState('');

  const { salons, isLoading: loadingSalons } = useSalonList();
  const [stylists, setStylists] = useState([]);
  const [loadingStylists, setLoadingStylists] = useState(true);
  const profileAvatar =
    user?.profileImage || user?.avatar || profile?.profileImage || profile?.avatar;

  useEffect(() => {
    salonService
      .getAvailableBarbers()
      .then((list) => setStylists(Array.isArray(list) ? list.slice(0, 5) : []))
      .catch(() => setStylists([]))
      .finally(() => setLoadingStylists(false));
  }, []);

  // Real-time barber status updates via socket
  const handleBarberStatusChange = useCallback((data) => {
    if (!data?._id) return;
    setStylists((prev) => {
      const updated = prev.map((b) => {
        if (String(b._id) === String(data._id)) {
          return {
            ...b,
            isAvailable: data.isAvailable ?? b.isAvailable,
            status: data.status ?? b.status,
          };
        }
        return b;
      });
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) return;
    socket.on(SOCKET_EVENTS.BARBER_STATUS_CHANGED, handleBarberStatusChange);
    return () => {
      socket.off(SOCKET_EVENTS.BARBER_STATUS_CHANGED, handleBarberStatusChange);
    };
  }, [socket, isConnected, handleBarberStatusChange]);

  const goToNearbySalons = () => {
    const query = searchArea.trim();
    navigate(query ? `/salons/nearby?area=${encodeURIComponent(query)}` : '/salons/nearby');
  };

  return (
    <main className="glow-home">
      <section className="home-hero" style={{ '--hero-image': `url(${landingHero})` }}>
        <div className="home-shell">
          <header className="home-header">
            <Brand />

            <nav className="home-nav" aria-label="Main navigation">
              {NAV_LINKS.map((item, index) => (
                <Link key={item.label} to={item.to} className={index === 0 ? 'active' : ''}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="home-header-actions">
              <GoldButton onClick={() => navigate('/salons/nearby')} className="home-header-cta">
                Book Now
              </GoldButton>
              <button type="button" className="home-header-search" aria-label="Search salons" onClick={() => navigate('/services')}>
                <MdSearch />
              </button>
              {userType === 'authenticated' && (
                <button type="button" className="home-header-profile" aria-label="Profile" onClick={() => navigate('/profile')}>
                  <Avatar src={profileAvatar} alt={profile?.name || 'Profile'} size="md" className="home-profile-avatar" />
                </button>
              )}
            </div>

            <button
              type="button"
              aria-label="Open menu"
              className="home-menu-button"
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
                  aria-label="Close menu"
                  className="home-menu-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                />
                <motion.aside
                  className="home-mobile-menu"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="home-mobile-menu-head">
                    <Brand />
                    <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
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

          <div className="home-hero-copy">
            <h1>
              Redefining the
              <br />
              Future of <span>Style</span>
            </h1>
            <p>
              Our advanced AI-stylist scans your facial structure to recommend the trendiest
              haircuts and colors tailored specifically for you.
            </p>

            <form
              className="home-search"
              onSubmit={(event) => {
                event.preventDefault();
                goToNearbySalons();
              }}
            >
              <label>
                <MdLocationOn />
                Find Nearest Salon
              </label>
              <div className="home-search-row">
                <div>
                  <MdSearch />
                  <input
                    value={searchArea}
                    onChange={(event) => setSearchArea(event.target.value)}
                    placeholder="Enter your area..."
                    aria-label="Area"
                  />
                </div>
                <button type="submit">
                  Search
                  <MdSearch />
                </button>
              </div>
            </form>

            {/* <div className="home-benefits">
              {BENEFITS.map(({ label, icon: Icon, active }) => (
                <span key={label} className={active ? 'active' : ''}>
                  <Icon />
                  {label}
                </span>
              ))}
            </div> */}

            <a
              href="/app-release.apk"
              download="app-release.apk"
              className="home-download-app"
            >
              <MdDownload />
              <span>Download Our App</span>
            </a>
          </div>

          <div className="home-slider-controls" aria-hidden="true">
            <button type="button">
              <MdArrowBackIosNew />
            </button>
            <button type="button">
              <MdArrowForwardIos />
            </button>
          </div>
        </div>
      </section>
{/* 
      <section className="home-shell home-feature-wrap">
        <article className="home-feature-card">
          <header className="home-feature-heading">
            <h2>Luminary Aesthetics</h2>
            <div className="home-feature-meta">
              <span className="stars">★★★★★</span>
              <span>4.9 (2000+)</span>
              <i />
              <span>Mon - Sun</span>
              <i />
              <span>9:00 AM - 10:00 PM</span>
            </div>
            <div className="home-feature-location">
              <MdLocationOn />
              <span>123 Opal Street, Suite 400, Los Angeles, CA, USA</span>
              <MdArrowForward />
              <button type="button" onClick={() => navigate('/salons/nearby')}>
                Get Direction
              </button>
            </div>
          </header>

          <div className="home-feature-body">
            <div className="home-feature-grid">
              <div className="home-feature-image">
                <img src={landingHero} alt="Luminary Aesthetics salon interior" />
              </div>

              <div className="home-services-grid">
                {SERVICES.map(({ title, icon: Icon }) => (
                  <button type="button" key={title} onClick={() => navigate('/services')}>
                    <span className="home-service-icon">
                      <Icon />
                    </span>
                    <strong>{title}</strong>
                    <small>Expert cuts & styles, tailored just for you.</small>
                    <MdArrowForward className="home-service-arrow" />
                  </button>
                ))}
              </div>
            </div>

            <div className="home-service-filter">
              <h3>Services</h3>
              <div>
                {['All Services', 'Hair Services', 'Color Services', 'Spa & Skin', 'Other Services', 'Offer & Payment'].map(
                  (item, index) => (
                    <button type="button" key={item} className={index === 0 ? 'active' : ''}>
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="home-appointment">
              <div className="home-appointment-service">
                <MdOutlineSpa />
                <span>
                  <strong>Korean Treatment</strong>
                  <small>60 min &nbsp; • &nbsp; From PKR 6,000</small>
                </span>
              </div>
              <div className="home-appointment-date">
                <MdCalendarMonth />
                <span>Tomorrow, &nbsp; 11:30 AM</span>
              </div>
              <GoldButton onClick={() => navigate('/salons/nearby')}>Book Now</GoldButton>
            </div>
          </div>
        </article>
      </section> */}

      <section className="home-shell home-stats-section">
        <h2>Smarter Growth From Day One</h2>
        <div className="home-stats">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={value}>
              <Icon />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-shell home-salons-section">
        <div className="home-eyebrow">
          <i />
          Top Rated
        </div>
        <div className="home-section-heading">
          <div>
            <h2>
              Top-Rated Salons in <span>Karachi</span>
            </h2>
            <p>
              Discover the highest-rated salons trusted by thousands of customers for premium
              beauty and grooming services.
            </p>
          </div>
          <button type="button" onClick={() => navigate('/salons/nearby')}>
            View All <MdArrowForward />
          </button>
        </div>

        <div className="home-salon-grid">
          {loadingSalons ? (
            Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="animate-pulse bg-[#14151b] h-[400px] rounded-[32px]"></article>
            ))
          ) : (
            salons.slice(0, 3).map((salon) => (
              <article key={salon._id || salon.id}>
                <div className="home-salon-image">
                  <img
                    src={salon.coverImage || salon.coverPhoto || salon.logo || salon.image || salon.images?.[0] || landingHero}
                    alt={salon.name}
                    onError={(event) => {
                      event.currentTarget.src = landingHero;
                    }}
                  />
                  <span>
                    <MdStar /> {salon.averageRating ? Number(salon.averageRating).toFixed(1) : 'New'}
                  </span>
                </div>
                <div className="home-salon-copy">
                  <div className="home-salon-title">
                    <h3>{salon.name}</h3>
                  </div>
                  <p>
                    <MdLocationOn /> {salon.address?.area || 'Area'}
                  </p>
                  <div className="home-salon-tags">
                    <span>Hair</span>
                    <span>Color</span>
                    <span>Spa</span>
                  </div>
                  <div className="home-salon-actions">
                    <small>
                      <i /> {salon.status || 'Open'}
                    </small>
                    <GoldButton onClick={() => navigate(`/salons/${salon._id || salon.id}`)}>Book Now</GoldButton>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="home-shell home-ai-section">
        <div className="home-ai-copy">
          <span>New AI Feature</span>
          <h2>
            Find Your Perfect Look
            <br />
            with <strong>AI Analysis</strong>
          </h2>
          <p>
            Our advanced AI-stylist scans your facial structure to recommend the trendiest
            haircuts and colors tailored specifically for you.
          </p>
          <GoldButton onClick={() => navigate('/ai/style-consultant')}>Discover Your Look</GoldButton>
        </div>
        <div className="home-ai-portrait">
          <img src={aiPortrait} alt="AI hairstyle analysis portrait" />
        </div>
      </section>

      <section className="home-shell home-stylists-section">
        <div className="home-centered-eyebrow">
          <i />
          Our Team
          <i />
        </div>
        <h2>
          Meet Our <span>Expert Stylists</span>
        </h2>
        <p>
          Choose from experienced professionals who specialize in precision cuts, premium
          coloring, skincare, and modern beauty services.
        </p>

        <div className="home-stylists-grid">
          {loadingStylists ? (
            <div className="h-96 w-full rounded-3xl animate-pulse bg-[#14151b]"></div>
          ) : stylists.length > 0 ? (
            <>
              <article className="home-lead-stylist">
                <img src={stylists[0].profileImage || leadStylistImage} alt={stylists[0].name || stylists[0].userName} />
                <div className="home-stylist-shade" />
                <span className={`home-stylist-badge ${stylists[0].isAvailable !== false ? 'available' : ''}`}>
                  ● &nbsp; {stylists[0].isAvailable !== false ? 'Available Today' : 'Currently Booked'}
                </span>
                <div className="home-lead-copy">
                  <div className="home-lead-meta">
                    <span>
                      <MdStar /> 4.9
                    </span>
                    <span>{stylists[0].role || 'Stylist'}</span>
                    <span>1.8k appointments</span>
                  </div>
                  <h3>{stylists[0].name || stylists[0].userName}</h3>
                  <p>{stylists[0].role || 'Senior Stylist'}</p>
                  <GoldButton onClick={() => navigate('/stylists')}>Book Appointment</GoldButton>
                </div>
              </article>

              <div className="home-side-stylists">
                {stylists.slice(1).map((stylist, index) => (
                  <article key={stylist._id || stylist.id || stylist.userName}>
                    <div className="home-side-stylist-image">
                      {stylist.profileImage ? (
                        <div
                          role="img"
                          aria-label={stylist.name || stylist.userName}
                          className={`home-side-stylist-photo home-side-stylist-photo-${index + 1}`}
                          style={{ backgroundImage: `url(${stylist.profileImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        />
                      ) : (
                        <div
                          role="img"
                          aria-label={stylist.name || stylist.userName}
                          className={`home-side-stylist-photo home-side-stylist-photo-${index + 1}`}
                          style={{ '--stylist-grid': `url(${stylistGrid})` }}
                        />
                      )}
                      <div className="home-stylist-shade" />
                      <span className={`home-stylist-badge ${stylist.isAvailable !== false && stylist.status !== 'inactive' ? 'available' : ''}`}>
                        ● &nbsp; {stylist.status === 'inactive' ? 'Inactive' : stylist.isAvailable !== false ? 'Available' : 'Booked'}
                      </span>
                      <h3>{stylist.name || stylist.userName}</h3>
                    </div>
                    <div className="home-side-stylist-copy">
                      <p>{stylist.role || 'Stylist'}</p>
                      <small>{stylist.specialization || 'Professional'}</small>
                      <button type="button" onClick={() => navigate('/stylists')}>
                        Book <MdArrowForward />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full text-center py-12 text-[#8e9097]">
              No stylists available at the moment.
            </div>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-shell">
          <div className="home-footer-grid">
            <div className="home-footer-cta">
              <h2>Are you ready to get started?</h2>
              <GoldButton onClick={() => navigate('/auth/signup')}>Get Started for free</GoldButton>
              <a
                href="/app-release.apk"
                download="app-release.apk"
                className="home-download-app-footer"
              >
                <MdDownload />
                <span>Download Our App</span>
              </a>
            </div>

            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div className="home-footer-links" key={title}>
                <h3>{title}</h3>
                {links.map((link) => (
                  <Link key={link.label} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="home-footer-bottom">
            <Brand />
            <div className="home-socials">
              {socialLinks.map(({ label, icon: Icon }) => (
                <a key={label} href="#" aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="home-copyright">Copyright 2026 Glow&Cut</div>
      </footer>
    </main>
  );
}
