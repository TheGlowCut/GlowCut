import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdArrowForward, 
  MdMenu, 
  MdClose,
  MdVerifiedUser,
  MdPersonOutline,
  MdCalendarToday,
  MdCreditCard,
  MdEdit,
  MdArticle
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import '../../../pages/home/Home/Home.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Salon & Service', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
];

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms and Conditions', to: '/terms-of-service' },
  ],
  Features: [
    { label: 'Online Booking', to: '/services' },
    { label: 'Sales & Payments', to: '/payments' },
    { label: 'Marketing & Automation', to: '/marketing' },
    { label: 'Reporting', to: '/reporting' },
    { label: 'Mini-CRM', to: '/crm' },
  ]
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

export default function TermsOfService() {
  const navigate = useNavigate();
  const { userType, profile } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileAvatar = profile?.profileImage || profile?.avatar;

  const handleGetStarted = () => {
    navigate('/auth/signup');
  };

  return (
    <main className="glow-home flex flex-col min-h-screen font-sans">
      <div className="home-shell" style={{ flexShrink: 0 }}>
        <header className="home-header">
          <Brand />

          <nav className="home-nav" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="home-header-actions">
            <GoldButton onClick={() => navigate('/services')} className="home-header-cta">
              Book Now
            </GoldButton>
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
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="home-mobile-nav-actions">
                <GoldButton onClick={() => { setMobileOpen(false); navigate('/services'); }}>
                  Book Now
                </GoldButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto py-16 px-4 md:px-8 relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border border-[#E4B56C]/20 bg-[#E4B56C]/10 flex items-center justify-center mb-6 mt-8">
          <MdArticle className="text-2xl text-[#E4B56C]" />
        </div>
        
        <h1 className="text-4xl md:text-5xl text-white font-medium mb-3 tracking-tight text-center">
          Terms of <span className="text-[#E4B56C]">Service</span>
        </h1>
        
        <p className="text-[#A1A1AA] text-[15px] mb-12 text-center">
          Effective Date: July 28, 2026
        </p>

        <div className="w-full bg-[#111111] rounded-[2rem] border border-white/5 p-6 md:p-12 shadow-2xl flex flex-col space-y-10">
          
          <section className="flex gap-6 border-b border-white/5 pb-10">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <MdVerifiedUser className="text-[#E4B56C] text-xl" />
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-3">1. Acceptance of Terms</h2>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
                By accessing or using the Glow Cut platform (including our mobile app and website), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </div>
          </section>

          <section className="flex gap-6 border-b border-white/5 pb-10">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <MdPersonOutline className="text-[#E4B56C] text-xl" />
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-3">2. User Accounts</h2>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
                To use most features of Glow Cut, you must register for an account. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </div>
          </section>

          <section className="flex gap-6 border-b border-white/5 pb-10">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <MdCalendarToday className="text-[#E4B56C] text-xl" />
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-3">3. Booking & Cancellations</h2>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
                When you book a service through Glow Cut, you enter into a direct agreement with the respective salon. Cancellations or rescheduling must be done in accordance with the specific salon's cancellation policy. Glow Cut reserves the right to suspend users who repeatedly no-show without prior notice.
              </p>
            </div>
          </section>

          <section className="flex gap-6 border-b border-white/5 pb-10">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <MdCreditCard className="text-[#E4B56C] text-xl" />
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-3">4. Payments</h2>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
                All payments made through the Glow Cut platform are securely processed. Prices for services are set by the individual salons and are subject to change. Any applicable tech fees or platform charges will be clearly displayed before you confirm your booking.
              </p>
            </div>
          </section>

          <section className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              <MdEdit className="text-[#E4B56C] text-xl" />
            </div>
            <div>
              <h2 className="text-xl text-white font-medium mb-3">5. Modifications to Service</h2>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
                We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </div>
          </section>
          
        </div>
      </div>

      <footer className="home-footer" style={{ marginTop: 'auto' }}>
        <div className="home-shell">
          <div className="home-footer-grid">
            <div className="home-footer-cta">
              <h2>Are you ready to<br/>get started?</h2>
              <GoldButton onClick={handleGetStarted}>Get Started for free</GoldButton>
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
        <div className="home-copyright">©2026 Glow&Cut<br/><br/>©2026 Glow&Cut</div>
      </footer>
    </main>
  );
}
