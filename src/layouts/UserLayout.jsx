import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileBottomNav from '../components/layout/MobileBottomNav';

export default function UserLayout() {
  const { pathname } = useLocation();
  const isSalonDetailRoute = /^\/salons\/[^/]+$/.test(pathname);
  const isBookingShowcaseRoute = [
    '/booking/service',
    '/booking/date-time',
    '/booking/confirm',
<<<<<<< HEAD
    '/booking/summary',
    '/booking/waiting-lounge',
    '/ai/style-consultant',
    '/privacy-policy',
=======
>>>>>>> 140809b6ab3636ebecb3f88316daf34a8e32b865
  ].includes(pathname);
  const isMarketingRoute =
    pathname === '/' ||
    pathname === '/services' ||
    pathname === '/stylists' ||
<<<<<<< HEAD
    pathname === '/privacy-policy' ||
    pathname === '/terms-of-service' ||
    pathname === '/careers' ||
=======
>>>>>>> 140809b6ab3636ebecb3f88316daf34a8e32b865
    isSalonDetailRoute ||
    isBookingShowcaseRoute;

  return (
    <div className={`min-h-screen flex flex-col ${isMarketingRoute ? 'bg-[#02050c]' : 'bg-background'}`}>
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
