import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MdArrowForward, MdClose, MdDownload, MdMenu } from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import '../../../pages/home/Home/Home.css';

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

export default function HomeHeader({
  navLinks = [],
  showCta = true,
  showDownloadInMenu = false,
  activeIndex = 0,
}) {
  const navigate = useNavigate();
  const { userType, profile } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileAvatar = profile?.profileImage || profile?.avatar;

  return (
    <>
      <header className="home-header">
        <Brand />

        <nav className="home-nav" aria-label="Main navigation">
          {navLinks.map((item, index) => (
            <Link key={item.label} to={item.to} className={index === activeIndex ? 'active' : ''}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="home-header-actions">
          {showCta && (
            <GoldButton onClick={() => navigate('/services')} className="home-header-cta">
              Book Now
            </GoldButton>
          )}
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
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              ))}
              {showCta && (
                <GoldButton
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/services');
                  }}
                >
                  Book Now
                </GoldButton>
              )}
              {showDownloadInMenu && (
                <a
                  href="/app-release.apk"
                  download="app-release.apk"
                  className="home-download-app-mobile"
                  onClick={() => setMobileOpen(false)}
                >
                  <MdDownload />
                  <span>Download Our App</span>
                </a>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
