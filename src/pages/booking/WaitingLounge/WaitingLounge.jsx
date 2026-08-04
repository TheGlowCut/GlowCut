import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdSchedule,
  MdVideogameAsset,
  MdQuiz,
  MdGridView,
  MdLeaderboard,
  MdChevronRight,
  MdTrendingUp,
  MdVisibility,
  MdFavorite,
  MdStorefront,
  MdContentCut,
  MdAttachMoney,
  MdWarning,
  MdPerson,
  MdArrowForward,
  MdMenu,
  MdClose,
  MdPersonOutline,
  MdStarRate,
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import Card from '../../../components/ui/Card';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import '../../../pages/home/Home/Home.css';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant' },
  { label: 'Live Queue', to: '/booking/waiting-lounge', active: true },
];

const FOOTER_LINKS = {
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact Support', to: '/contact' },
  ],
  Solutions: [
    { label: 'AI Hair Stylist', to: '/ai' },
    { label: 'Live Queues', to: '/booking/waiting-lounge' },
    { label: 'For Salons', to: '/for-salons' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Use', to: '/terms-of-service' },
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

const GAMES = [
  {
    title: 'Barber Trivia',
    description: 'Test your style IQ and win instant loyalty points.',
    icon: MdQuiz,
  },
  {
    title: 'Style Match-3',
    description: 'Connect shears & combs to clear the luxury board.',
    icon: MdGridView,
  },
];

const VIDEOS = [
  {
    title: 'Classic Fade Tutorial',
    description: 'Sleek low-fade blend guidelines',
    views: '12.4K views',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Textured Crop Volume',
    description: 'Modern top crop texturing styling',
    views: '9.2K views',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1595959223842-888e404b901a?q=80&w=600&auto=format&fit=crop',
  },
  {
    title: 'Sovereign Beard Trim',
    description: 'Luxe hot towel beard alignment',
    views: '14.1K views',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop',
  },
];

export default function WaitingLounge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = useBooking();
  
  const { userType, profile } = useContext(AuthContext);
  const profileAvatar = profile?.profileImage || profile?.avatar;
  const [mobileOpen, setMobileOpen] = useState(false);

  const bookingId = location.state?.bookingId || booking.createdBookings?.[0]?._id || booking.createdBookings?.[0]?.id;

  const [liveBooking, setLiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError(true);
      return;
    }
    
    let cancelled = false;

    const poll = async () => {
      try {
        const [updated, queueInfo] = await Promise.all([
          bookingService.getBookingStatus(bookingId),
          bookingService.getQueueStatusByBookingId(bookingId).catch(() => null)
        ]);
        if (cancelled) return;
        
        const mergedData = { ...updated, queueData: queueInfo };
        setLiveBooking(mergedData);
        setLoading(false);
        
        if (updated.status === 'confirmed' || queueInfo?.status === 'called') {
          toast.success("It's your turn! Heading to live tracking...");
          setTimeout(() => navigate('/booking/live-tracking'), 1500);
        } else if (updated.status === 'cancelled' || updated.status === 'rejected' || queueInfo?.status === 'cancelled') {
          toast.error('Your booking was cancelled by the salon.');
          navigate('/salons/nearby');
        }
      } catch (err) {
        if (!liveBooking) {
          setError(true);
          setLoading(false);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 15000);
    
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!liveBooking) return;

    let targetDate;
    
    if (liveBooking.queueData && liveBooking.queueData.estimatedWaitTime !== undefined) {
      const baseTime = new Date(liveBooking.queueData.updatedAt || liveBooking.queueData.createdAt || new Date());
      targetDate = new Date(baseTime.getTime() + (liveBooking.queueData.estimatedWaitTime * 60 * 1000));
    } else if (liveBooking.bookingDate && liveBooking.startTime) {
      const [hours, minutes] = liveBooking.startTime.split(':');
      targetDate = new Date(liveBooking.bookingDate);
      targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      return;
    }

    const updateCountdown = () => {
      const qStatus = liveBooking.queueData?.status;
      const bStatus = liveBooking.status;

      if (['in-progress', 'completed'].includes(bStatus) || ['in_service', 'completed'].includes(qStatus)) {
        setCountdownText(bStatus === 'completed' || qStatus === 'completed' ? 'Completed' : 'Service In Progress');
        return;
      }
      
      const isReady = ['called', 'checked_in'].includes(qStatus);

      if (isReady) {
        setCountdownText('Your slot is ready! Please head to the chair.');
        return;
      }

      const now = new Date();
      const diff = targetDate - now;

      if (diff > 0) {
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        const pad = (num) => String(num).padStart(2, '0');
        setCountdownText(`${pad(h)}h : ${pad(m)}m : ${pad(s)}s remaining`);
      } else {
        setCountdownText('Your slot is ready! Please head to the chair.');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [liveBooking]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary flex items-center justify-center animate-spin [animation-duration:8s]">
          <MdSchedule className="text-[32px] text-primary" />
        </div>
        <h2 className="mt-6 font-display-lg text-headline-lg text-on-surface animate-pulse">Syncing with Salon...</h2>
        <p className="text-on-surface-variant font-label-md mt-2">Retrieving your live queue status</p>
      </main>
    );
  }

  if (error || !liveBooking) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="bg-surface-container rounded-2xl p-xl max-w-lg text-center border border-white/10 shadow-soft">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <MdWarning className="text-primary text-4xl" />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Couldn't Find That Booking</h2>
          <p className="text-on-surface-variant font-body-md mb-6 leading-relaxed">
            Looks like this session expired or the booking ID isn't valid anymore. No worries — just grab a fresh slot and we'll get you sorted.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold transition-all shadow-warm-sm hover:brightness-105 active:scale-95"
          >
            Book a New Appointment
          </button>
        </div>
      </main>
    );
  }

  const stylistName = liveBooking?.barberId?.name || booking?.stylist?.name || 'Your stylist';
  const stylistImage = liveBooking?.barberId?.profileImage || liveBooking?.barberId?.image || booking?.stylist?.profileImage || booking?.stylist?.image || '';
  const queuePosition = liveBooking?.queueNumber;
  const progressPercent = liveBooking?.status === 'confirmed' ? 100 : liveBooking?.status === 'pending' ? 30 : 60;
  const salonName = liveBooking?.salonId?.name || 'GlowCut Salon';
  const serviceName = liveBooking?.serviceId?.name || 'Grooming Service';
  const finalAmount = liveBooking?.finalAmount || liveBooking?.price || 0;

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

      <div className="flex-1 w-full max-w-6xl mx-auto py-12 px-4 md:px-8 relative z-10">
        <section className="mb-16">
          <div className="bg-[#111111] p-6 md:p-10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
            <div className="flex-1 w-full max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 text-[10px] font-bold tracking-widest uppercase mb-6">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> LIVE QUEUE STATUS
              </div>
              
              <h1 className="text-4xl md:text-[44px] text-white font-serif mb-6 tracking-tight">
                {countdownText ? (
                  <span className={countdownText.includes('ready') || countdownText.includes('Progress') ? 'text-green-500' : 'text-[#E4B56C]'}>
                    {countdownText}
                  </span>
                ) : (
                  <>Status: <span className="text-[#34d399] capitalize">{liveBooking?.status || 'Pending'}</span></>
                )}
              </h1>
              
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-[#E4B56C] rounded-full relative transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                >
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-5 rounded-2xl border border-white/5 bg-[#1a1a1a]/40">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-[#E4B56C] font-bold uppercase tracking-widest">Salon</span>
                  <span className="font-bold text-white flex items-start gap-1.5 text-[11px] leading-tight"><MdStorefront className="text-[#E4B56C] text-sm shrink-0"/> <span>{salonName}</span></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-[#E4B56C] font-bold uppercase tracking-widest">Service</span>
                  <span className="font-bold text-white flex items-start gap-1.5 text-[11px] leading-tight"><MdContentCut className="text-[#E4B56C] text-sm shrink-0"/> <span>{serviceName}</span></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-[#E4B56C] font-bold uppercase tracking-widest">Total</span>
                  <span className="font-bold text-white flex items-start gap-1.5 text-[11px] leading-tight"><span className="text-[#E4B56C] font-mono text-sm leading-none">$</span> <span>PKR {finalAmount.toLocaleString()}</span></span>
                </div>
                <div className="flex flex-col gap-1.5 border-l border-white/10 pl-5">
                  <span className="text-[9px] text-[#E4B56C] font-bold uppercase tracking-widest">Token / Queue</span>
                  <span className="font-serif text-[#E4B56C] text-xl leading-none">#{queuePosition || '--'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 bg-[#0a0a0a] p-4 pr-12 rounded-[1.5rem] border border-white/5 min-w-[280px]">
              <div className="relative">
                {stylistImage ? (
                  <img
                    className="w-16 h-16 rounded-full border border-green-500 object-cover"
                    alt={stylistName}
                    src={stylistImage}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border border-green-500 bg-white/5 flex items-center justify-center">
                    <MdPersonOutline className="text-white/50 text-2xl" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-[#A1A1AA] text-[10px] uppercase tracking-widest mb-1">
                  ASSIGNED TO
                </p>
                <p className="text-white text-lg font-serif">{stylistName}</p>
                <p className="text-[#E4B56C] text-[11px] mt-1">
                  Glow&Cut Specialist
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl text-white font-serif">Quick Play Games</h2>
              <MdVideogameAsset className="text-[#E4B56C] text-2xl" />
            </div>
            <div className="flex flex-col gap-4">
              {GAMES.map((game) => {
                const Icon = game.icon;
                return (
                  <div key={game.title} className="bg-[#111111] p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#E4B56C]/30 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#E4B56C]/10 flex items-center justify-center">
                        <Icon className="text-xl text-[#E4B56C]" />
                      </div>
                      <div className="flex-1 pr-4">
                        <h3 className="text-white text-[15px] font-serif mb-1">{game.title}</h3>
                        <p className="text-[#A1A1AA] text-xs leading-relaxed">{game.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast('Mini-games coming soon!')}
                      className="px-5 py-2 rounded-full bg-[#E4B56C] text-black text-xs font-bold whitespace-nowrap hover:bg-[#cfa462] transition-colors"
                    >
                      Play Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl text-white font-serif">Trending Styles</h2>
              <MdTrendingUp className="text-green-500 text-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {VIDEOS.map((video, i) => (
                <div
                  key={i}
                  className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 cursor-pointer flex flex-col group hover:border-white/20 transition-colors"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={video.title}
                      src={video.image}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[#E4B56C] text-[10px] mb-1 leading-tight line-clamp-1">{video.description}</p>
                    <h3 className="text-white text-sm font-serif mb-3 line-clamp-1">{video.title}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="flex items-center gap-1 text-white text-[11px] font-bold">
                        <MdStarRate className="text-[#E4B56C] text-sm" /> {video.rating}
                      </span>
                      <span className="flex items-center gap-1 text-[#A1A1AA] text-[11px]">
                        <MdVisibility className="text-[12px]" /> {video.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="home-footer" style={{ marginTop: 'auto' }}>
        <div className="home-shell">
          <div className="home-footer-grid">
            <div className="home-footer-cta">
              <Brand />
              <p className="text-[#A1A1AA] text-sm leading-relaxed mt-4 max-w-xs">
                Pakistan's premium grooming and styling platform powered by advanced AI face scanners and elite live queue systems.
              </p>
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

          <div className="home-footer-bottom mt-16 pt-8 border-t border-white/10 flex flex-col items-center">
            <div className="text-[#A1A1AA] text-xs">© 2026 Glow&Cut Cyber-Chic Salons. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
