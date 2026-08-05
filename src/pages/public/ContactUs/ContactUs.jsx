import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdMail,
  MdPhone,
  MdLocationOn,
  MdSend,
  MdMenu,
  MdClose,
  MdPersonOutline
} from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import HomeFooter from '../../../components/layout/HomeFooter';
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

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const navigate = useNavigate();
  const { userType, profile } = useContext(AuthContext);
  const profileAvatar = profile?.profileImage || profile?.avatar;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }
    // Dummy submit
    toast.success('Message sent! Our support team will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <main className="glow-home flex flex-col min-h-screen font-sans bg-[#0a0a0a]">
      {/* Header section identical to other marketing pages */}
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

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1200px] mx-auto py-16 px-4 md:px-8 relative z-10 flex flex-col gap-12 text-white">
        <motion.header initial="initial" animate="animate" variants={fadeUp} className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <div className="self-center border border-[#E4B56C]/30 bg-[#111111] px-4 py-1.5 rounded-full flex items-center gap-2 mb-2">
            <span className="text-[#E4B56C] opacity-50">—</span>
            <span className="text-[#E4B56C] font-mono text-[9px] uppercase tracking-widest font-bold">24/7 SUPPORT AVAILABLE</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight">
            Contact <span className="text-[#E4B56C]">Us</span>
          </h1>
          <p className="text-[#A1A1AA] text-sm md:text-base leading-relaxed">
            Need help with your booking or have a question about Glow Cut? We're here to assist you 24/7.
          </p>
        </motion.header>

        <motion.div initial="initial" animate="animate" variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Contact Info */}
          <aside className="lg:col-span-5 space-y-md">
            <div className="bg-[#111111] border border-white/5 p-lg rounded-2xl border-t-4 border-[#E4B56C] hover:shadow-warm-sm transition-all flex flex-col gap-6">
              <h3 className="font-headline-md text-headline-md text-white mb-2 font-bold">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E4B56C]/10 flex items-center justify-center flex-shrink-0 border border-[#E4B56C]/20">
                    <MdMail className="text-[#E4B56C] text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Email Support</p>
                    <p className="text-[#A1A1AA] text-sm">support@glowcut.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E4B56C]/10 flex items-center justify-center flex-shrink-0 border border-[#E4B56C]/20">
                    <MdPhone className="text-[#E4B56C] text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Phone</p>
                    <p className="text-[#A1A1AA] text-sm">+92 (300) 123-4567</p>
                    <p className="text-[11px] text-[#E4B56C] font-mono mt-1">Mon-Fri, 9am - 6pm PKT</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E4B56C]/10 flex items-center justify-center flex-shrink-0 border border-[#E4B56C]/20">
                    <MdLocationOn className="text-[#E4B56C] text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Headquarters</p>
                    <p className="text-[#A1A1AA] text-sm">Glow Cut Tower, Main Boulevard<br/>PECHS, Karachi</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/5 p-lg md:p-xl rounded-2xl space-y-6">
              <h3 className="font-headline-md text-headline-md text-white mb-2 font-bold">Send us a Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-caption uppercase tracking-widest text-[#A1A1AA] text-[10px] font-bold">Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E4B56C] transition-colors text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-caption uppercase tracking-widest text-[#A1A1AA] text-[10px] font-bold">Email *</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E4B56C] transition-colors text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-caption uppercase tracking-widest text-[#A1A1AA] text-[10px] font-bold">Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E4B56C] transition-colors text-sm"
                  placeholder="How can we help?"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-caption uppercase tracking-widest text-[#A1A1AA] text-[10px] font-bold">Message *</label>
                <textarea 
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E4B56C] transition-colors resize-none text-sm"
                  placeholder="Type your message here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#E4B56C] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99 transition-all shadow-md text-sm uppercase tracking-wider"
              >
                <MdSend /> SEND MESSAGE
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <HomeFooter />
      </div>
    </main>
  );
}
