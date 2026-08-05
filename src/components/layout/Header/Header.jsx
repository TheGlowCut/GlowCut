import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MdMenu, MdClose, MdChat, MdNotifications, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../ui/Button';
import Avatar from '../../ui/Avatar';
import AuthContext from '../../../context/AuthContext';
import glowcutLogo from '../../../assets/logos/glowcut-mark-XZgku7lW.png';

const AUTH_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Salon & Barbers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

const GUEST_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Salon & Barbers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant', guestWarning: true },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { userType, user, profile, logout } = useContext(AuthContext);

  const isAuthenticated = userType === 'authenticated';
  const isGuest = userType === 'guest';
  const isAdmin = profile?.role?.toLowerCase() === 'admin';
  const profileAvatar =
    user?.profileImage || user?.avatar || profile?.profileImage || profile?.avatar;

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
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-[#0a0a0a] shadow-sm border-b border-[#E4B56C]/10">
      <div className="absolute inset-0 bg-gradient-to-r from-[#E4B56C]/5 via-transparent to-transparent pointer-events-none" />

      <Link to="/" className="flex items-center gap-base flex-shrink-0 relative z-10">
        <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10 rounded-full" />
        <span className="text-3xl font-serif font-bold text-[#E4B56C] tracking-tight">
          GlowCut
        </span>
      </Link>

      <div className="hidden md:flex gap-1 relative z-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `text-sm font-sans font-bold px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-[#E4B56C] bg-[#E4B56C]/10'
                  : link.label === 'Manage Salon'
                  ? 'text-[#E4B56C] font-bold bg-[#E4B56C]/5 border border-[#E4B56C]/20'
                  : 'text-[#A1A1AA] hover:text-[#E4B56C] hover:bg-white/5'
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
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-xs group"
            aria-label="Profile"
          >
              <Avatar
              src={profileAvatar}
              alt={profile?.name || 'Profile'}
              size="sm"
              className="group-hover:shadow-[0_0_20px_rgba(228,181,108,0.2)] transition-all"
            />
          </button>
        ) : isGuest ? (
          <div className="flex items-center gap-sm">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLoginSignup}
              className="hidden sm:flex border-[#E4B56C] text-[#E4B56C]"
            >
              Login / Signup
            </Button>
            <button
              onClick={handleGuestIconClick}
              className="w-8 h-8 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:border-[#E4B56C]/30 transition-colors"
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
          className="md:hidden text-[#A1A1AA] ml-xs"
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
            className="absolute top-20 left-0 right-0 bg-[#111111]/95 backdrop-blur-2xl border-b border-[#E4B56C]/10 flex flex-col p-md gap-sm md:hidden z-50"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-sans font-bold px-3 py-3 rounded-lg block transition-all ${
                    isActive
                      ? 'text-[#E4B56C] bg-[#E4B56C]/10 font-bold'
                      : link.label === 'Manage Salon'
                      ? 'text-[#E4B56C] font-bold bg-[#E4B56C]/5'
                      : 'text-[#A1A1AA] hover:text-[#E4B56C] hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isGuest && (
              <button
                onClick={() => { setMobileOpen(false); handleLoginSignup(); }}
                className="mt-sm w-full py-sm bg-[#E4B56C] text-black rounded-xl text-sm font-sans font-bold"
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
    <header className="flex justify-between items-center w-full px-container-margin py-base bg-[#0a0a0a]/90 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img src={glowcutLogo} alt="GlowCut" className="w-8 h-8 rounded-full" />
        <h2 className="text-xl font-serif text-white tracking-tight">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-gutter">
        <div className="flex items-center gap-4">
          <button className="text-[#A1A1AA] hover:text-white transition-colors relative">
            <MdChat className="text-xl" />
            {unreadChat && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#E4B56C] rounded-full" />
            )}
          </button>
          <button className="text-[#A1A1AA] hover:text-white transition-colors">
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
              className="group-hover:scale-105 group-hover:shadow-warm transition-all cursor-pointer"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
