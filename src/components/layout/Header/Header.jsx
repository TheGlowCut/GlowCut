import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdSearch, MdMenu, MdClose, MdChat, MdNotifications, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';
import AuthContext from '../../../context/AuthContext';
import glowcutLogo from '../../../assets/logos/glowcut-logo.jpg';

const AUTH_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const GUEST_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant', guestWarning: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { userType, profile, logout } = useContext(AuthContext);

  const isAuthenticated = userType === 'authenticated';
  const isGuest = userType === 'guest';
  const isAdmin = profile?.role?.toLowerCase() === 'admin';

  let navLinks = isAuthenticated ? [...AUTH_NAV] : [...GUEST_NAV];
  if (isAuthenticated && isAdmin) {
    navLinks.push({ label: 'Manage Salon', to: '/admin/shop' });
  }

  const handleGuestIconClick = () => {
    toast('Login to set up your profile', { icon: '👤' });
  };

  const handleLoginSignup = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-[#FFF4EE] shadow-sm border-b border-primary/10">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Link to="/" className="flex items-center gap-base flex-shrink-0 relative z-10">
        <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10 rounded-full" />
        <span className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
          GlowCut
        </span>
      </Link>

      <div className="hidden md:flex gap-1 relative z-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `font-label-md text-label-md px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : link.label === 'Manage Salon'
                  ? 'text-primary font-bold bg-primary/5 border border-primary/20'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              } ${link.guestWarning && isGuest ? 'opacity-60' : ''}`
            }
          >
            {link.label}
            {link.guestWarning && isGuest && (
              <span className="ml-1 text-[10px] text-yellow-400 align-super">⚠</span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-sm flex-shrink-0 relative z-10">
        <button
          aria-label="Search"
          className="text-on-surface-variant hover:text-primary active:scale-95 transition-all"
        >
          <MdSearch className="text-2xl" />
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-xs group"
            aria-label="Profile"
          >
            <Avatar
              src={profile?.avatar}
              alt={profile?.name || 'Profile'}
              size="sm"
              ring
              className="group-hover:shadow-warm transition-all"
            />
          </button>
        ) : isGuest ? (
          <div className="flex items-center gap-sm">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoginSignup}
              className="hidden sm:flex"
            >
              Login / Signup
            </Button>
            <button
              onClick={handleGuestIconClick}
              className="w-8 h-8 rounded-full bg-surface-container border border-white/10 flex items-center justify-center text-on-surface-variant hover:border-primary/30 transition-colors"
              aria-label="Guest profile"
            >
              <MdPerson className="text-lg" />
            </button>
          </div>
        ) : (
          <Button size="sm" onClick={() => navigate('/auth/login')}>
            Login
          </Button>
        )}

        <button
          aria-label="Toggle menu"
          className="md:hidden text-on-surface-variant ml-xs"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <MdClose className="text-2xl" /> : <MdMenu className="text-2xl" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 right-0 bg-surface/95 backdrop-blur-2xl border-b border-primary/10 flex flex-col p-md gap-sm md:hidden z-50"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `font-label-md text-label-md px-3 py-3 rounded-lg block transition-all ${
                    isActive
                      ? 'text-primary bg-primary/10 font-bold'
                      : link.label === 'Manage Salon'
                      ? 'text-primary font-bold bg-primary/5'
                      : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isGuest && (
              <button
                onClick={() => { setMobileOpen(false); handleLoginSignup(); }}
                className="mt-sm w-full py-sm bg-primary text-on-primary rounded-xl font-label-md font-bold"
              >
                Login / Signup
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function AdminHeader({ title = 'Dashboard', avatarSrc, unreadChat = false }) {
  const navigate = useNavigate();
  const { profile } = useContext(AuthContext);

  const imageSource =
    avatarSrc ||
    profile?.avatar ||
    profile?.profileImage ||
    'https://via.placeholder.com/150';

  return (
    <header className="flex justify-between items-center w-full px-container-margin py-base bg-background/70 backdrop-blur-2xl border-b border-primary/10 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img src={glowcutLogo} alt="GlowCut" className="w-8 h-8 rounded-full" />
        <h2 className="font-headline-md text-headline-md text-primary tracking-tight">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-gutter">
        <div className="relative hidden md:block">
          <input
            className="bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-2 px-4 w-40 lg:w-64 transition-all duration-300 text-on-surface placeholder-on-surface-variant/50"
            placeholder="Search data..."
            type="text"
          />
          <MdSearch className="absolute right-2 top-2 text-outline text-sm" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface hover:text-primary transition-colors relative">
            <MdChat className="text-xl" />
            {unreadChat && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
          <button className="text-on-surface hover:text-primary transition-colors">
            <MdNotifications className="text-xl" />
          </button>

          <button
            onClick={() => navigate('/profile')}
            aria-label="Admin Profile Settings"
            className="flex items-center justify-center group focus:outline-none"
            title="Update Profile"
          >
            <Avatar
              src={imageSource}
              size="sm"
              alt={profile?.name || 'Admin Avatar'}
              ring
              className="group-hover:scale-105 group-hover:shadow-warm transition-all cursor-pointer"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
