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
const Login = React.lazy(() => import('../pages/auth/Login'));
const Signup = React.lazy(() => import('../pages/auth/Signup'));
const VerifyOtp = React.lazy(() => import('../pages/auth/VerifyOtp/VerifyOtp'));
const RoleSelection = React.lazy(() => import('../pages/RoleSelection/RoleSelection'));
const SalonSetup = React.lazy(() => import('../pages/SalonSetup/SalonSetup'));

// Home
const Home = React.lazy(() => import('../pages/home/Home'));

// Salons
const NearbySalons = React.lazy(() => import('../pages/salons/NearbySalons'));
const SalonDetail = React.lazy(() => import('../pages/salons/SalonDetail'));
const StyleGallery = React.lazy(() => import('../pages/salons/StyleGallery'));

// New split pages
const Services = React.lazy(() => import('../pages/services/Services'));
const Stylists = React.lazy(() => import('../pages/stylists/Stylists'));

// Booking
const ConfirmBooking = React.lazy(() => import('../pages/booking/ConfirmBooking'));
const BookingSummary = React.lazy(() => import('../pages/booking/BookingSummary'));
const WaitingLounge = React.lazy(() => import('../pages/booking/WaitingLounge'));
const LiveTracking = React.lazy(() => import('../pages/booking/LiveTracking'));
const PaymentSuccess = React.lazy(() => import('../pages/booking/PaymentSuccess'));
const BookingDateTime = React.lazy(() => import('../pages/booking/BookingDateTime'));
const BookingService = React.lazy(() => import('../pages/booking/BookingService'));

// AI
const AIStyleConsultant = React.lazy(() => import('../pages/ai/AIStyleConsultant'));
const ARVirtualMirror = React.lazy(() => import('../pages/ai/ARVirtualMirror'));

// Rewards
const GlowRewards = React.lazy(() => import('../pages/rewards/GlowRewards'));
const InviteAndEarn = React.lazy(() => import('../pages/rewards/InviteAndEarn'));
const GoldSubscription = React.lazy(() => import('../pages/rewards/GoldSubscription'));

// Support
const LiveChat = React.lazy(() => import('../pages/support/LiveChat'));
const HelpSupport = React.lazy(() => import('../pages/support/HelpSupport'));
const Updates = React.lazy(() => import('../pages/support/Updates'));

// Profile
const ProfileSettings = React.lazy(() => import('../pages/profile/ProfileSettings'));
const Feedback = React.lazy(() => import('../pages/profile/Feedback'));
const PrivacyCenter = React.lazy(() => import('../pages/profile/PrivacyCenter'));
const SavedSalons = React.lazy(() => import('../pages/profile/SavedSalons'));

// Public info
const PrivacyPolicy = React.lazy(() => import('../pages/public/PrivacyPolicy/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('../pages/public/TermsOfService/TermsOfService'));
const ContactUs = React.lazy(() => import('../pages/public/ContactUs/ContactUs'));
const Careers = React.lazy(() => import('../pages/public/Careers/Careers'));

// Admin
const ShopkeeperDashboard = React.lazy(() => import('../pages/admin/ShopkeeperDashboard'));
const GlobalDashboard = React.lazy(() => import('../pages/admin/GlobalDashboard'));
const ServiceMenu = React.lazy(() => import('../pages/admin/ServiceMenu/ServiceMenu'));
const StaffManager = React.lazy(() => import('../pages/admin/StaffManager/StaffManager'));
const BookingManager = React.lazy(() => import('../pages/admin/BookingManager/BookingManager'));

// Misc
const NotFound = React.lazy(() => import('../pages/NotFound'));

// Fallback loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export default function AppRoutes() {
  const { profile, isAuthenticated } = useAuthContext(); // 🔑 Checking global session attributes

  return (
    <React.Suspense fallback={<PageLoader />}>
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
          <Route path="/booking/service" element={<BookingService />} />
          <Route path="/booking/date-time" element={<BookingDateTime />} />
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
          <Route path="/profile/saved-salons" element={<SavedSalons />} />
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
    </React.Suspense>
  );
}