import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdContentCut,
  MdPeople,
  MdChat,
  MdLogout,
  MdClose
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/shop', icon: <MdDashboard /> },
    { name: 'Service Menu', path: '/admin/services', icon: <MdContentCut /> },
    { name: 'Barbers / Staff', path: '/admin/barbers', icon: <MdPeople /> },
    { name: 'Booking Manage', path: '/admin/booking', icon: <MdPeople /> },
  ];

  const sidebarContent = (
    <div className="h-full bg-[#111111] border-r border-white/5 flex flex-col justify-between p-4 w-64">
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#E4B56C]/20 rounded-full" />
              <div className="absolute inset-0 border border-[#E4B56C]/40 rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#E4B56C] rounded-full" />
            </div>
            <span className="text-xl font-serif tracking-wider text-white">
              GLOW<span className="text-[#E4B56C]">CUT</span>
            </span>
            <span className="text-[9px] bg-[#E4B56C]/10 text-[#E4B56C] border border-[#E4B56C]/20 px-2 py-0.5 rounded-full uppercase font-bold">
              Admin
            </span>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-full hover:bg-white/5 text-[#A1A1AA]"
            aria-label="Close sidebar"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#E4B56C] text-black shadow-[0_0_20px_rgba(228,181,108,0.2)]'
                    : 'text-[#A1A1AA] hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={() => { handleLogout(); onClose(); }}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all active:scale-95"
      >
        <MdLogout className="text-lg" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar - always visible on lg+ */}
      <div className="hidden lg:block fixed left-0 top-0 z-40 h-screen">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen lg:hidden max-w-[85vw]"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
