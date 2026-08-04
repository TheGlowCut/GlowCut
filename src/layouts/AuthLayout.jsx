import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isPremiumAuthRoute = pathname === '/auth/login' || pathname === '/auth/signup' || pathname === '/auth/verify-otp';

  if (isPremiumAuthRoute) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <motion.main
          className="min-h-screen"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden antialiased bg-background text-on-background">
      <div className="fixed inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="GlowCut salon ambience"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAUkalx7X5fzYogvyUrskGk6wEHJXzBTWX1Hy8cKKnbaPVoPCYJkH3pRnjwkQoyEP17L1gsVqIehiujRNOfA308V-LeU9tBOwHuDuIJs1edVI6zODmrRlRiQkotVegDyKxkcIPRYdjveLBVewQsH9NZjYiapk9-BlI2ccnDmEqLTVhh0Rq7LfhWZ8hDAu-eIeB__sDtbAaXdgfHwdIKzSImfpTnI_O_MNGxH1UGvPNSQM5E-P5Hr4f7svLoLxRq8zhnwheEWqoMD8"
        />
        <div className="absolute inset-0 warm-overlay" />
      </div>

      <header className="fixed top-0 left-0 w-full flex justify-center items-center h-20 px-margin-mobile z-20">
        <div className="flex items-center gap-base">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full" />
            <div className="absolute inset-0 border border-primary/40 rounded-full" />
            <div className="w-2 h-2 bg-primary rounded-full shadow-warm-sm" />
          </div>
          <h1 className="text-headline-md font-bold text-primary tracking-tight font-sora">
            GlowCut
          </h1>
        </div>
      </header>

      <motion.main
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>

      <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-lowest/80 border-t border-primary/10 relative z-10">
        <div className="flex items-center gap-base">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full" />
            <div className="absolute inset-0 border border-primary/40 rounded-full" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary font-sora">GlowCut</span>
        </div>
        <p className="font-caption text-caption text-on-surface-variant">
          © 2024 GlowCut Premium Salons. All rights reserved.
        </p>
        <div className="flex gap-md">
          <a className="text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-caption text-on-surface-variant hover:text-primary transition-colors" href="#">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
