import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../services/apiClient';
import loginShowcase from '../../../assets/auth/login-showcase.png';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.identifier.trim()) {
      nextErrors.identifier = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier)) {
      nextErrors.identifier = 'Please enter a valid email address';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await auth.login({
        email: form.identifier.trim(),
        password: form.password,
      });
      toast.success(res.message || 'Welcome back!');

      const userRole = res.user?.role;

      if (userRole === 'admin' || userRole === 'owner') {
        try {
          const { data: salonData } = await apiClient.get('/salons/my');
          const hasSalon = Boolean(salonData?.success && salonData?.data);

          if (hasSalon) {
            navigate('/admin/shop');
          } else {
            navigate('/setup-salon');
          }
        } catch (salonErr) {
          navigate('/setup-salon');
        }
      } else if (userRole === 'user' || userRole === 'customer') {
        navigate('/');
      } else {
        navigate('/role-selection');
      }
    } catch (error) {
      const message = error?.message || 'Invalid credentials';

      if (message.toLowerCase().includes('not verified')) {
        toast.error('Email not verified. Redirecting to verification page...');
        setTimeout(() => {
          navigate('/auth/verify-otp', { state: { email: form.identifier.trim() } });
        }, 1500);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    auth.loginAsGuest();
    toast('Browsing as guest - booking is disabled', { icon: '👀' });
    navigate('/');
  };

  const handleSocialClick = (provider) => {
    toast(`${provider} sign-in is coming soon. Please use email and password for now.`);
  };

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto flex w-full max-w-[1160px] flex-col items-center gap-8 lg:gap-12"
      >
        <div className="flex items-center justify-center gap-3 pt-4">
          <img src={glowcutMark} alt="GlowCut mark" className="h-11 w-11 object-contain" />
          <span
            className="text-[34px] font-medium tracking-[-0.02em] text-[#f5f1e8]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Glow&Cut
          </span>
        </div>

        <div className="grid w-full grid-cols-1 items-center gap-6 lg:items-stretch lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="order-2 mx-auto w-full max-w-[590px] overflow-hidden rounded-[34px] border border-[#2b241d] bg-[#101114] shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:order-1 lg:aspect-[584/616] lg:self-center"
          >
            <img
              src={loginShowcase}
              alt="GlowCut salon showcase"
              className="h-full w-full object-cover object-center"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-1 mx-auto w-full max-w-[532px] lg:order-2 lg:h-full"
          >
            <div className="rounded-[32px] border border-white/5 bg-[#14151b] px-6 py-6 shadow-[0_32px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-8 lg:flex lg:h-full lg:min-h-[616px] lg:flex-col lg:justify-center">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded-full bg-[#dfba69] px-5 py-2 text-sm font-medium text-[#14151b] shadow-[0_10px_30px_rgba(223,186,105,0.25)]">
                  Sign in
                </span>
                <Link
                  to="/auth/signup"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-[#efefef] transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Create account
                </Link>
              </div>

              <div className="mb-8">
                <h1
                  className="text-[44px] leading-none text-[#f7f2ea] sm:text-[56px]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Welcome back
                </h1>
                <p className="mt-3 text-base text-[#8e9097]">
                  Sign in to your salon workspace.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="identifier" className="sr-only">
                    Email
                  </label>
                  <div className="relative">
                    <MdEmail className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                    <input
                      id="identifier"
                      name="identifier"
                      type="email"
                      value={form.identifier}
                      onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                      placeholder="Email"
                      className={`h-16 w-full rounded-[22px] border bg-[#262932] pl-14 pr-5 text-lg text-[#f5f1ea] outline-none transition-all placeholder:text-[#f5f1ea] ${
                        errors.identifier
                          ? 'border-[#d76d6d] focus:border-[#d76d6d]'
                          : 'border-[#383c47] focus:border-[#dfba69] focus:bg-[#2a2d36]'
                      }`}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.identifier}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative">
                    <MdLock className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Password"
                      className={`h-16 w-full rounded-[22px] border bg-[#262932] pl-14 pr-5 text-lg text-[#f5f1ea] outline-none transition-all placeholder:text-[#f5f1ea] ${
                        errors.password
                          ? 'border-[#d76d6d] focus:border-[#d76d6d]'
                          : 'border-[#383c47] focus:border-[#dfba69] focus:bg-[#2a2d36]'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-[#dfba69] px-6 text-xl font-medium text-[#16130d] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {submitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <span>Sign in</span>
                      <MdArrowForward className="text-2xl" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4 text-sm text-[#bdb7ad]">
                <div className="h-px flex-1 bg-white/30" />
                <span>or</span>
                <div className="h-px flex-1 bg-white/30" />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleSocialClick('Google')}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-transparent px-5 text-base text-[#f5f1ea] transition-all hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <FcGoogle className="text-2xl" />
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialClick('Apple')}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-transparent px-5 text-base text-[#f5f1ea] transition-all hover:border-white/20 hover:bg-white/[0.03]"
                >
                  <FaApple className="text-xl" />
                  <span>Continue with Apple</span>
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-4 text-center">
                <button
                  type="button"
                  onClick={handleGuest}
                  className="text-sm font-medium text-[#dfba69] transition-colors hover:text-[#edd49b]"
                >
                  Continue as Guest
                </button>
                <p className="text-sm text-[#8e9097]">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/auth/signup"
                    className="font-medium text-[#f5f1ea] transition-colors hover:text-[#dfba69]"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
