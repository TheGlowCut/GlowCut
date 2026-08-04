import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import {
  MdPerson,
  MdStorefront,
  MdCalendarToday,
  MdAccountCircle,
  MdContentCut,
  MdAttachMoney,
  MdInfoOutline,
  MdWarning,
  MdSchedule,
  MdDownload,
  MdArrowForward,
  MdMenu,
  MdClose,
  MdPersonOutline,
  MdReceiptLong
} from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../../hooks/useBooking';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import * as bookingService from '../../../services/bookingService';
import glowcutLogo from '../../../assets/logos/glowcut-logo.jpg';
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

export default function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = useBooking();
  const receiptRef = useRef(null);

  const { userType, profile } = useContext(AuthContext);
  const profileAvatar = profile?.profileImage || profile?.avatar;
  const [mobileOpen, setMobileOpen] = useState(false);

  const bookingId = location.state?.bookingId || booking.createdBookings?.[0]?._id || booking.createdBookings?.[0]?.id;

  const [liveBooking, setLiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(bookingId);
        setLiveBooking(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary flex items-center justify-center animate-spin [animation-duration:8s]">
          <MdSchedule className="text-[32px] text-primary" />
        </div>
        <h2 className="mt-6 font-display-lg text-headline-lg text-on-surface animate-pulse">Generating Receipt...</h2>
        <p className="text-on-surface-variant font-label-md mt-2">Retrieving booking confirmation</p>
      </main>
    );
  }

  if (error || !liveBooking) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden bg-surface-container/60 backdrop-blur-2xl rounded-3xl p-xl md:p-2xl max-w-lg w-full text-center border border-error/20 shadow-soft"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-error/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6 border border-error/20 rotate-6">
              <MdWarning className="text-error text-5xl -rotate-6" />
            </div>
            <h2 className="font-display-lg text-display-lg text-on-surface mb-3">Receipt Not Found</h2>
            <p className="text-on-surface-variant font-body-lg leading-relaxed mb-8 max-w-sm mx-auto">
              We couldn't retrieve your booking details. The session may have expired or the booking ID is invalid.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-xl bg-primary text-on-primary font-headline-md font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-warm"
            >
              RETURN TO HOME
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const clientName = liveBooking.customerId?.userName || liveBooking.customerId?.name || 'Guest';
  const salonName = liveBooking.salonId?.name || 'GlowCut Salon';
  const salonAddress = liveBooking.salonId?.address ? `${liveBooking.salonId.address.area || ''}, ${liveBooking.salonId.address.city || ''}` : 'Location available in-app';
  const stylistName = liveBooking.barberId?.name || 'Assigned Stylist';
  const stylistImage = liveBooking.barberId?.profileImage || liveBooking.barberId?.image || '';
  const serviceName = liveBooking.serviceId?.name || 'Grooming Service';
  
  const bookingDate = new Date(liveBooking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const timeSlot = liveBooking.startTime || 'Pending';
  
  const basePrice = liveBooking.price || 0;
  const discount = liveBooking.discount || 0;
  const finalAmount = liveBooking.finalAmount || (basePrice - discount);

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    try {
      const imgs = receiptRef.current.querySelectorAll('img');
      imgs.forEach((img) => { img.crossOrigin = 'anonymous'; });
      const dataUrl = await toPng(receiptRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ECF6D8',
      });
      const link = document.createElement('a');
      link.download = `GlowCut_Receipt_${liveBooking._id?.slice(-8) || 'summary'}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 850;

      const drawReceipt = () => {
        ctx.fillStyle = '#ECF6D8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(logoImg, 40, 40, 55, 55);
        ctx.fillStyle = '#63B032';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('GlowCut', 108, 56);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#2D2D2D80';
        ctx.fillText('Digital Receipt', 108, 77);
        ctx.strokeStyle = '#63B032';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 100);
        ctx.lineTo(560, 100);
        ctx.stroke();
        ctx.fillStyle = '#2D2D2D';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Order: ${liveBooking._id?.slice(-8) || 'N/A'}`, 40, 135);
        ctx.fillText(`Date: ${bookingDate}`, 40, 160);
        ctx.fillText(`Time: ${timeSlot}`, 40, 185);
        ctx.fillText(`Salon: ${salonName}`, 40, 225);
        ctx.fillText(`Stylist: ${stylistName}`, 40, 260);
        ctx.fillText(`Client: ${clientName}`, 40, 295);
        ctx.strokeStyle = '#63B032';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(40, 325);
        ctx.lineTo(560, 325);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#63B032';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Service', 40, 360);
        ctx.fillText('Amount', 460, 360);
        ctx.fillStyle = '#2D2D2D';
        ctx.font = '14px sans-serif';
        ctx.fillText(serviceName, 40, 390);
        ctx.fillText(`PKR ${basePrice.toLocaleString()}`, 460, 390);
        if (discount > 0) {
          ctx.fillStyle = '#63B032';
          ctx.fillText('Discount', 40, 420);
          ctx.fillText(`-PKR ${discount.toLocaleString()}`, 460, 420);
        }
        ctx.strokeStyle = '#63B032';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 445);
        ctx.lineTo(560, 445);
        ctx.stroke();
        ctx.fillStyle = '#63B032';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Total', 40, 480);
        ctx.fillText(`PKR ${finalAmount.toLocaleString()}`, 400, 480);
        ctx.fillStyle = '#2D2D2D80';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Payment: ${liveBooking.paymentMethod}`, 40, 525);
        ctx.fillText(`Status: ${liveBooking.paymentStatus}`, 40, 550);
        ctx.fillStyle = '#63B032';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Thank you for choosing GlowCut', 300, 620);
        ctx.textAlign = 'start';
        ctx.fillStyle = '#2D2D2D40';
        ctx.font = '10px sans-serif';
        ctx.fillText('Powered by GlowCut', 40, 800);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `GlowCut_Receipt_${liveBooking._id?.slice(-8) || 'summary'}.png`;
        link.href = dataUrl;
        link.click();
      };

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = drawReceipt;
      logoImg.onerror = drawReceipt;
      logoImg.src = glowcutLogo;
    }
    toast.success('Receipt downloaded as image!');
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

      <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 md:px-8 relative z-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E4B56C]/30 bg-[#E4B56C]/10 text-[#E4B56C] text-xs font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-[#E4B56C] rotate-45"></span> {liveBooking.status}
          </div>
        </div>

        <motion.div
          ref={receiptRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-transparent p-6 md:p-10 rounded-[2rem] shadow-2xl border border-[#E4B56C]/30"
        >
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#E4B56C]/20 flex items-center justify-center">
                <MdReceiptLong className="text-[#E4B56C] text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl text-white font-medium mb-1 tracking-tight">
                  Digital Receipt
                </h2>
                <p className="text-[#A1A1AA] text-[11px] uppercase tracking-wider">
                  ORDER ID: <span className="text-[#E4B56C] font-mono">{liveBooking._id}</span>
                </p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[#A1A1AA] text-sm mb-1">{bookingDate}</p>
              <p className="text-[#E4B56C] font-mono text-xl">{timeSlot}</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex flex-col gap-2">
                <span className="text-[#E4B56C] text-[11px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <MdStorefront /> SALON
                </span>
                <p className="text-white text-lg font-medium">{salonName}</p>
                <p className="text-[#A1A1AA] text-sm">{salonAddress}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-[#E4B56C] text-[11px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <MdAccountCircle /> STYLIST
                </span>
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                  {stylistImage ? (
                    <img src={stylistImage} alt={stylistName} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <MdPersonOutline className="text-white/50 text-xl" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-[15px]">{stylistName}</p>
                    <p className="text-[#E4B56C] text-[10px] uppercase tracking-wider mt-0.5">GLOWCUT SPECIALIST</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[#E4B56C] text-[11px] uppercase tracking-widest flex items-center gap-2 mb-1">
                  <MdPersonOutline /> CUSTOMER
                </span>
                <p className="text-white text-lg font-medium">{clientName}</p>
                <p className="text-[#A1A1AA] text-sm">{liveBooking.customerId?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex flex-col">
              <h3 className="text-white text-[15px] font-medium mb-6 flex items-center gap-2">
                <MdContentCut className="text-[#E4B56C]" /> Service Ledger
              </h3>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm">{serviceName}</p>
                    <p className="text-[#A1A1AA] text-xs mt-1">{liveBooking.duration} mins</p>
                  </div>
                  <p className="text-white text-sm font-mono tracking-wide">PKR {basePrice.toLocaleString()}</p>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-white text-sm">Discount</p>
                    <p className="text-[#E4B56C] text-sm font-mono tracking-wide">- PKR {discount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[#A1A1AA] text-sm">Payment Method</p>
                  <p className="uppercase text-white text-sm tracking-wider">{liveBooking.paymentMethod}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[#A1A1AA] text-sm">Payment Status</p>
                  <p className={`uppercase text-sm tracking-wider font-medium ${liveBooking.paymentStatus === 'paid' ? 'text-green-500' : 'text-[#E4B56C]'}`}>
                    {liveBooking.paymentStatus}
                  </p>
                </div>
                
                <div className="flex justify-between items-end pt-6 mt-4 border-t border-white/5">
                  <p className="text-white font-medium">Total Amount</p>
                  <p className="text-[#E4B56C] text-2xl font-mono tracking-wide">
                    $ {finalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <button
              onClick={() => navigate('/booking/waiting-lounge', { state: { bookingId: liveBooking._id } })}
              className="w-full py-4 rounded-[1rem] bg-[#E4B56C] text-black text-sm font-medium transition-all hover:bg-[#cfa462] flex items-center justify-center gap-2"
            >
              PROCEED TO WAITING LOUNGE <MdArrowForward className="text-lg" />
            </button>
            <button
              onClick={handleDownloadImage}
              className="w-full py-4 rounded-[1rem] border border-[#E4B56C]/50 text-[#E4B56C] text-sm font-medium transition-all hover:bg-[#E4B56C]/10 flex items-center justify-center gap-2"
            >
              <MdDownload className="text-lg" /> Download Receipt as Image
            </button>
            <p className="text-center text-[#A1A1AA] text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center gap-1.5">
              <MdInfoOutline className="text-sm" /> PROCEED TO THE LOUNGE TO TRACK YOUR LIVE QUEUE STATUS
            </p>
          </div>
        </motion.div>
      </div>

      <footer className="home-footer" style={{ marginTop: 'auto' }}>
        <div className="home-shell">
          <div className="home-footer-grid">
            <div className="home-footer-cta">
              <h2>Are you ready to<br/>get started?</h2>
              <GoldButton onClick={() => navigate('/auth/signup')}>Get Started for free</GoldButton>
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
