import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdArrowForward, 
  MdMenu, 
  MdClose,
  MdWork,
  MdStarOutline,
  MdPeopleOutline,
  MdWorkspacePremium,
  MdCalendarToday,
  MdAutoAwesome,
  MdLocationOn
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import toast from 'react-hot-toast';

import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import landingHero from '../../../assets/home/landing-hero.png';
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

const JOBS = [
  {
    title: 'Senior Hair Stylist',
    department: 'SALON OPERATIONS',
    location: 'Karachi, PK (On-site)',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Manager',
    department: 'SUPPORT',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Frontend Engineer',
    department: 'ENGINEERING',
    location: 'Karachi, PK (Hybrid)',
    type: 'Full-time',
  },
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

export default function Careers() {
  const navigate = useNavigate();
  const { userType, profile } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileAvatar = profile?.profileImage || profile?.avatar;

  const handleGetStarted = () => {
    navigate('/auth/signup');
  };

  return (
    <main className="glow-home flex flex-col min-h-screen font-sans bg-[#0a0a0a]">
      <div className="home-shell" style={{ flexShrink: 0, position: 'relative', zIndex: 50 }}>
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

      {/* Hero Section */}
      <section className="relative w-full min-h-[500px] flex items-center pt-20 pb-16">
        <div className="absolute inset-0 z-0">
          <img
            alt="Careers at Glow Cut"
            className="w-full h-full object-cover opacity-30"
            src={landingHero}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E4B56C]/30 bg-[#E4B56C]/10 text-[#E4B56C] text-xs font-bold tracking-widest uppercase mb-6">
              <MdWork className="text-[14px]" /> Careers
            </div>
            <h1 className="text-5xl md:text-6xl text-white font-medium mb-6 tracking-tight">
              Join Our <span className="text-[#E4B56C]">Team</span>
            </h1>
            <p className="text-[#A1A1AA] text-lg leading-relaxed">
              Help us revolutionize the grooming industry with cutting-edge technology and premium service.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full flex-1">
        
        {/* Why Work With Us */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl text-white font-medium mb-6">Why Work With Us?</h2>
            <p className="text-[#A1A1AA] text-[15px] leading-relaxed">
              At Glow Cut, we're building the future of salon bookings. We combine high-end aesthetics with cutting-edge technology. Our team is passionate, diverse, and dedicated to elevating the everyday grooming experience into something extraordinary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { icon: MdStarOutline, title: 'Grow Your Career', desc: 'We invest in our people and support your professional growth.' },
              { icon: MdPeopleOutline, title: 'Great Team Culture', desc: 'Work with passionate, collaborative and supportive people.' },
              { icon: MdWorkspacePremium, title: 'Competitive Benefits', desc: 'Enjoy attractive salary packages and performance rewards.' },
              { icon: MdCalendarToday, title: 'Work-Life Balance', desc: 'Flexible schedules and understanding of your personal time.' },
              { icon: MdAutoAwesome, title: 'Modern Environment', desc: 'We use advanced tools and technologies to stay ahead of the curve.' },
            ].map((feature, i) => (
              <div key={i} className="bg-[#111111] border border-white/5 p-8 rounded-[1.5rem] flex flex-col items-center text-center hover:border-white/10 transition-colors">
                <feature.icon className="text-[#E4B56C] text-4xl mb-6" />
                <h3 className="text-white font-medium mb-3">{feature.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 mb-12">
          <div className="flex items-center gap-3 mb-10">
            <MdWork className="text-[#E4B56C] text-2xl" />
            <h2 className="text-2xl md:text-3xl text-white font-medium">Open Positions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {JOBS.map((job) => (
              <div key={job.title} className="bg-[#111111] border border-white/5 p-8 rounded-[1.5rem] flex flex-col hover:border-[#E4B56C]/30 transition-colors group cursor-pointer" onClick={() => toast('Application portal opening soon!')}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl text-white font-medium">{job.title}</h3>
                  <span className="px-3 py-1 rounded-full border border-[#E4B56C]/40 text-[#E4B56C] text-[11px] uppercase tracking-wider">
                    {job.type}
                  </span>
                </div>
                <p className="text-[#E4B56C] text-xs font-bold tracking-widest uppercase mb-10">
                  {job.department}
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                  <p className="text-[#A1A1AA] flex items-center gap-2 text-sm">
                    <MdLocationOn className="text-[#E4B56C]" /> {job.location}
                  </p>
                  <button className="w-10 h-10 rounded-full bg-[#E4B56C] flex items-center justify-center text-black group-hover:bg-[#cfa462] transition-colors">
                    <MdArrowForward />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

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
