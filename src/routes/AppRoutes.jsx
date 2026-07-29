import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; // 🔑 Auth Context import kiya

// Guard
import AuthGuard from '../components/auth/AuthGuard';
import RoleGuard from '../components/auth/RoleGuard';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import VerifyOtp from '../pages/auth/VerifyOtp/VerifyOtp';
import RoleSelection from '../pages/RoleSelection/RoleSelection';
import SalonSetup from '../pages/SalonSetup/SalonSetup';

// Home
import Home from '../pages/home/Home';

// Salons
import NearbySalons from '../pages/salons/NearbySalons';
import SalonDetail from '../pages/salons/SalonDetail';
import StyleGallery from '../pages/salons/StyleGallery';

// New split pages
import Services from '../pages/services/Services';
import Stylists from '../pages/stylists/Stylists';

// Booking
import ConfirmBooking from '../pages/booking/ConfirmBooking';
import BookingSummary from '../pages/booking/BookingSummary';
import WaitingLounge from '../pages/booking/WaitingLounge';
import LiveTracking from '../pages/booking/LiveTracking';
import PaymentSuccess from '../pages/booking/PaymentSuccess';

// AI
import AIStyleConsultant from '../pages/ai/AIStyleConsultant';
import ARVirtualMirror from '../pages/ai/ARVirtualMirror';

// Rewards
import GlowRewards from '../pages/rewards/GlowRewards';
import InviteAndEarn from '../pages/rewards/InviteAndEarn';
import GoldSubscription from '../pages/rewards/GoldSubscription';

// Support
import LiveChat from '../pages/support/LiveChat';
import HelpSupport from '../pages/support/HelpSupport';
import Updates from '../pages/support/Updates';

// Profile
import ProfileSettings from '../pages/profile/ProfileSettings';
import Feedback from '../pages/profile/Feedback';
import PrivacyCenter from '../pages/profile/PrivacyCenter';

// Public info
import PrivacyPolicy from '../pages/public/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService/TermsOfService';
import ContactUs from '../pages/public/ContactUs/ContactUs';
import Careers from '../pages/public/Careers/Careers';

// Admin
import ShopkeeperDashboard from '../pages/admin/ShopkeeperDashboard';
import GlobalDashboard from '../pages/admin/GlobalDashboard';

// Misc
import NotFound from '../pages/NotFound';
import ServiceMenu from '../pages/admin/ServiceMenu/ServiceMenu';
import StaffManager from '../pages/admin/StaffManager/StaffManager';
import BookingManager from '../pages/admin/BookingManager/BookingManager';

export default function AppRoutes() {
  const { profile, isAuthenticated } = useAuthContext(); // 🔑 Checking global session attributes

  return (
    <Routes>
      {/* ── Public Auth (no guard needed) ── */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* 🔒 Smart Gate: block non-owner/admin roles outright (backend's
            ownerOrAdminOnly middleware would 403 them anyway), and skip the
            form entirely if this owner already has an active salon. */}
        <Route
          path="/setup-salon"
          element={
            !isAuthenticated ? (
              <Navigate to="/auth/login" replace />
            ) : profile?.role !== 'admin' ? (
              <Navigate to="/" replace />
            ) : profile?.role === 'admin' && profile?.hasSalon ? (
              <Navigate to="/admin/shop" replace />
            ) : (
              <SalonSetup />
            )
          }
        />
      </Route>

      {/* ── Standalone immersive (own chrome) ── */}
      <Route
        path="/ai/ar-mirror"
        element={
          <AuthGuard>
            <ARVirtualMirror />
          </AuthGuard>
        }
      />

      {/* ── All guarded user-facing routes ── */}
      <Route
        element={
          <AuthGuard>
            <UserLayout />
          </AuthGuard>
        }
      >
        <Route path="/" element={<Home />} />

        {/* Salons */}
        <Route path="/salons/nearby" element={<NearbySalons />} />
        <Route path="/salons/:id" element={<SalonDetail />} />
        <Route path="/salons/style-gallery" element={<StyleGallery />} />

        {/* Split Service & Stylist pages */}
        <Route path="/services" element={<Services />} />
        <Route path="/stylists" element={<Stylists />} />

        {/* Booking */}
        <Route path="/booking/confirm" element={<ConfirmBooking />} />
        <Route path="/booking/summary" element={<BookingSummary />} />
        <Route path="/booking/waiting-lounge" element={<WaitingLounge />} />
        <Route path="/booking/live-tracking" element={<LiveTracking />} />
        <Route path="/booking/payment-success" element={<PaymentSuccess />} />

        {/* AI */}
        <Route path="/ai/style-consultant" element={<AIStyleConsultant />} />

        {/* Rewards */}
        <Route path="/rewards/glow" element={<GlowRewards />} />
        <Route path="/rewards/invite" element={<InviteAndEarn />} />
        <Route path="/rewards/gold" element={<GoldSubscription />} />

        {/* Support */}
        <Route path="/support/chat" element={<LiveChat />} />
        <Route path="/support/help" element={<HelpSupport />} />
        <Route path="/support/updates" element={<Updates />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/profile/feedback" element={<Feedback />} />
        {/* Public Info */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/careers" element={<Careers />} />
      </Route>

      {/* ── Admin ── */}
      <Route
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route
          path="/admin/shop"
          element={<RoleGuard allow={['admin']}><ShopkeeperDashboard /></RoleGuard>}
        />
        <Route
          path="/admin/global"
          element={<RoleGuard allow={['superadmin']}><GlobalDashboard /></RoleGuard>}
        />
        <Route
          path="/admin/services"
          element={<RoleGuard allow={['admin']}><ServiceMenu /></RoleGuard>}
        />
        <Route
          path="/admin/barbers"
          element={<RoleGuard allow={['admin']}><StaffManager /></RoleGuard>}
        />
        <Route
          path="/admin/booking"
          element={<RoleGuard allow={['admin']}><BookingManager /></RoleGuard>}
        />
      </Route>

      {/* ── Fallbacks / legacy redirects ── */}
      <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}