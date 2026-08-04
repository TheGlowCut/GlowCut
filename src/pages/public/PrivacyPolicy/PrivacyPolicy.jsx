import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdShield,
  MdLockOutline,
  MdOutlinePersonSearch,
  MdOutlineStorage,
  MdDescription,
  MdMenu,
  MdClose,
  MdPersonOutline
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import '../../../pages/home/Home/Home.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

function Brand() {
  return (
    <Link to="/" className="home-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

const HIGHLIGHTS = [
  { icon: MdShield, title: 'Your trust first', text: 'We treat your data with the same care as our own.' },
  { icon: MdLockOutline, title: 'Encrypted by default', text: 'Traffic and storage secured with industry-standard encryption.' },
  { icon: MdOutlinePersonSearch, title: 'You stay in control', text: 'Access, export, or delete your data anytime from Settings.' },
  { icon: MdOutlineStorage, title: 'Minimum data, maximum use', text: "We collect only what's needed to power your bookings." }
];

const SECTIONS = [
  { title: '1. Information we collect', text: 'Account details you provide (name, email, phone), booking history, payment metadata handled by our payment processors, and technical data like device type and IP address to keep the service secure and reliable.' },
  { title: '2. How we use your information', text: 'To operate the booking platform, confirm appointments, process payments, personalize recommendations, prevent fraud, and — only with your permission — send marketing communications you can opt out of at any time.' },
  { title: '3. Sharing & third parties', text: 'We share limited data with the salon or stylist you book with, our payment processors, and infrastructure providers under strict confidentiality. We never sell your personal data.' },
  { title: '4. Data retention', text: 'We keep your account data while your account is active. Booking and transaction records are retained as required by law. You can request deletion at any time from Settings or by contacting us.' },
  { title: '5. Your rights', text: "You may access, correct, export, or delete your personal data. Depending on your region, you may also object to processing or withdraw consent. Reach out and we'll respond within 30 days." },
  { title: '6. Cookies & analytics', text: 'We use essential cookies to keep you signed in and privacy-friendly analytics to understand how the product is used. You can control non-essential cookies from your browser settings.' },
  { title: '7. Children\'s privacy', text: 'Glow&Cut is not directed to children under 16. We do not knowingly collect personal information from children.' },
  { title: '8. Changes to this policy', text: 'We may update this policy as the product evolves. Material changes will be announced via email or in-app notice before they take effect.' }
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { userType, profile } = useContext(AuthContext);
  const profileAvatar = profile?.profileImage || profile?.avatar;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="glow-home flex flex-col min-h-screen font-sans bg-[#0a0a0a]">
      <div className="home-shell" style={{ flexShrink: 0, position: 'relative', zIndex: 50 }}>
        <header className="home-header">
          <Brand />

          <nav className="home-nav" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <Link key={item.label} to={item.to} className={item.active ? 'text-[#E4B56C]' : ''}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="home-header-actions">
            {userType === 'authenticated' ? (
              <button type="button" className="home-header-profile" aria-label="Profile" onClick={() => navigate('/profile')}>
                <Avatar src={profileAvatar} alt={profile?.name || 'Profile'} size="md" className="home-profile-avatar" />
              </button>
            ) : (
              <button type="button" className="home-header-profile" aria-label="Search">
                <MdPersonOutline className="text-xl text-white" />
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
            <motion.div
              className="home-mobile-nav-overlay"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="home-mobile-nav-header">
                <Brand />
                <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <MdClose />
                </button>
              </div>
              <nav className="home-mobile-nav-links">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={item.active ? 'text-[#E4B56C]' : ''}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 w-full max-w-[1000px] mx-auto py-16 px-4 md:px-8 relative z-10 flex flex-col gap-12">
        
        <motion.div initial="initial" animate="animate" variants={fadeUp} className="flex flex-col gap-4">
          <div className="self-start border border-[#E4B56C]/30 bg-[#111111] px-4 py-1.5 rounded-full flex items-center gap-2 mb-2">
            <span className="text-[#E4B56C] opacity-50">—</span>
            <span className="text-[#E4B56C] font-mono text-[9px] uppercase tracking-widest font-bold">LAST UPDATED: JULY 23, 2026</span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight">
            Privacy <span className="text-[#E4B56C]">Policy</span>
          </h1>
          
          <p className="text-[#A1A1AA] text-sm md:text-base max-w-xl leading-relaxed">
            This page explains what we collect, how we use it, and the controls you have over your data at Glow&Cut.
          </p>
        </motion.div>

        <motion.div initial="initial" animate="animate" variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                <div className="w-8 h-8 rounded-full border border-[#E4B56C]/30 bg-black flex items-center justify-center">
                  <Icon className="text-[#E4B56C] text-sm" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#A1A1AA] text-[11px] leading-relaxed">{item.text}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div initial="initial" animate="animate" variants={{
          animate: { transition: { staggerChildren: 0.05 } }
        }} className="flex flex-col gap-4">
          {SECTIONS.map((section, index) => (
            <motion.div key={index} variants={fadeUp} className="bg-[#111111] border border-white/5 rounded-[1.5rem] p-8 flex items-start gap-5">
              <div className="w-8 h-8 rounded-xl border border-[#E4B56C]/20 bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                <MdDescription className="text-[#E4B56C] text-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-white text-[15px] font-semibold">{section.title}</h2>
                <p className="text-[#A1A1AA] text-[12px] leading-relaxed max-w-4xl">{section.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <footer className="home-footer" style={{ marginTop: 'auto' }}>
        <div className="home-shell flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/10 mt-12 gap-6">
          <Brand />
          
          <div className="flex items-center gap-6 text-[#A1A1AA] text-xs">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
          </div>
        </div>
        <div className="home-shell flex justify-between items-center pb-8">
          <div className="text-[#A1A1AA] text-[10px]">© 2026 GlowCut Cyber-Chic Salons. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
