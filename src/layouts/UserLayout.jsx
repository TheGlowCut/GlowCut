import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';

export default function UserLayout() {
  const { pathname } = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const isSalonDetailRoute = /^\/salons\/[^/]+$/.test(pathname);
  const isBookingShowcaseRoute = [
    '/booking/service',
    '/booking/date-time',
    '/booking/confirm',
    '/booking/summary',
    '/booking/waiting-lounge',
    '/ai/style-consultant',
    '/privacy-policy',
  ].includes(pathname);
  const isMarketingRoute =
    pathname === '/' ||
    pathname === '/services' ||
    pathname === '/stylists' ||
    pathname === '/privacy-policy' ||
    pathname === '/terms-of-service' ||
    pathname === '/careers' ||
    isSalonDetailRoute ||
    isBookingShowcaseRoute;

  return (
    <div className={`min-h-screen flex flex-col ${isMarketingRoute ? 'bg-[#02050c]' : 'bg-background'}`}>
      {deferredPrompt && (
        <div className="bg-primary text-on-primary py-2 px-4 flex justify-between items-center z-50">
          <span className="text-sm font-semibold">Install Glow Cut App for the best experience</span>
          <button 
            onClick={handleInstallClick}
            className="bg-background text-primary px-3 py-1 rounded-md text-xs font-bold"
          >
            Install App
          </button>
        </div>
      )}
      {!isMarketingRoute && <Header />}
      <motion.main
        className={isMarketingRoute ? 'flex-1' : 'flex-1 pt-20 pb-20 md:pb-0'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      {!isMarketingRoute && <Footer />}
      {!isMarketingRoute && <MobileBottomNav />}
    </div>
  );
}
