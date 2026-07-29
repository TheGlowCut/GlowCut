import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdMenu } from 'react-icons/md';
import Sidebar from '../components/layout/Sidebar';
import { AdminHeader } from '../components/layout/Header';

const TITLES = {
  '/admin/shop': 'Command Center',
  '/admin/global': 'Platform Control Center',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isGlobal = pathname.startsWith('/admin/global');
  const variant = isGlobal ? 'global' : 'shopkeeper';

  const matchedTitle = Object.entries(TITLES).find(([prefix]) =>
    pathname.startsWith(prefix)
  );
  const title = matchedTitle ? matchedTitle[1] : 'Dashboard';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 rounded-xl bg-primary text-on-primary shadow-warm flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95"
        aria-label="Open menu"
      >
        <MdMenu className="text-xl" />
      </button>

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <main className="lg:ml-64 min-h-screen">
        <AdminHeader
          title={title}
          avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBNJaH3ty0k1DIfjl-VY4GvzwGr_vgAtyMLzIeZDNTb6eri4mpdrE3GSEe4yldLBIDruIrIIdkmSfhUPTtuVmhEQCg43SibgJixBbedYgRgNuJ0KOXRqIvm3nElmEqdkKhZ_s3vrFzu2upHF3inkzMx5fkoOQIqpRgwwmfoPHbRbAOnL2pFo2yHzD_hULivANKwoMFErEenyvS-c4CitLoCU7GLQNWmU83HVIh33EiIZntF1MLMj98hOyEW7s2e-vAsSALdZZFNRiw"
        />
        <motion.div
          className="p-3 sm:p-4 md:p-container-margin space-y-section-gap max-w-full overflow-x-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
