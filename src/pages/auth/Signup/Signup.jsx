import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdMail,
  MdLock,
  MdPerson,
  MdPhone,
  MdLocationCity,
  MdAssignmentInd,
  MdArrowForward,
} from 'react-icons/md';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';
import loginShowcase from '../../../assets/auth/login-showcase.png';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Hyderabad', 'Sialkot', 'Gujranwala'];

export default function Signup() {
  const navigate = useNavigate();
  const { loginAsGuest, register } = useAuth();

  const [form, setForm] = useState({
    userName: '',
    PhoneNumber: '',
    email: '',
    password: '',
    cities: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const nextErrors = {};

    if (!form.userName.trim()) {
      nextErrors.userName = 'Full name is required';
    }

    if (!form.PhoneNumber.trim()) {
      nextErrors.PhoneNumber = 'Phone number is required';
    } else if (!/^0\d{10}$/.test(form.PhoneNumber.replace(/\s/g, ''))) {
      nextErrors.PhoneNumber = 'Enter a valid Pakistani number (e.g. 03001234567)';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email';
    }

    if (!form.password || form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.cities) {
      nextErrors.cities = 'Please select your city';
    }

    if (!form.role) {
      nextErrors.role = 'Please select an account type';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const email = form.email.trim().toLowerCase();
      const backendRole = form.role === 'owner' ? 'admin' : form.role;

      const res = await register({
        userName: form.userName.trim(),
        phone: form.PhoneNumber.trim(),
        email,
        password: form.password,
        cities: form.cities,
        role: backendRole,
      });

      toast.success(res.message || 'User registered successfully. OTP sent!');
      navigate('/auth/verify-otp', { state: { email } });
    } catch (error) {
      const backendError =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown Error';
      toast.error(`Validation Failed: ${backendError}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    toast('Browsing as guest - booking is disabled', { icon: '👀' });
    navigate('/');
  };

  const handleSocialClick = (provider) => {
    toast(`${provider} sign-up is coming soon. Please use the form for now.`);
  };

  const inputClass =
    'h-14 w-full rounded-[20px] border border-[#383c47] bg-[#262932] px-5 text-base text-[#f5f1ea] outline-none transition-all placeholder:text-[#d3d3d7] focus:border-[#dfba69] focus:bg-[#2a2d36]';

  const iconInputClass =
    'h-14 w-full rounded-[20px] border border-[#383c47] bg-[#262932] pl-14 pr-5 text-base text-[#f5f1ea] outline-none transition-all placeholder:text-[#d3d3d7] focus:border-[#dfba69] focus:bg-[#2a2d36]';

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
                <Link
                  to="/auth/login"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-[#efefef] transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Sign in
                </Link>
                <span className="rounded-full bg-[#dfba69] px-5 py-2 text-sm font-medium text-[#14151b] shadow-[0_10px_30px_rgba(223,186,105,0.25)]">
                  Create account
                </span>
              </div>

              <div className="mb-8">
                <h1
                  className="text-[40px] leading-none text-[#f7f2ea] sm:text-[54px]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Create your account
                </h1>
                <p className="mt-3 text-base text-[#8e9097]">
                  Get started with your GlowCut workspace.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="sr-only">
                    Full name
                  </label>
                  <div className="relative">
                    <MdPerson className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      value={form.userName}
                      onChange={setField('userName')}
                      placeholder="Full name"
                      className={`${iconInputClass} ${errors.userName ? 'border-[#d76d6d] focus:border-[#d76d6d]' : ''}`}
                    />
                  </div>
                  {errors.userName && <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.userName}</p>}
                </div>

                <div>
                  <label htmlFor="PhoneNumber" className="sr-only">
                    Phone number
                  </label>
                  <div className="relative">
                    <MdPhone className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                    <input
                      id="PhoneNumber"
                      name="PhoneNumber"
                      type="tel"
                      value={form.PhoneNumber}
                      onChange={setField('PhoneNumber')}
                      placeholder="Phone number"
                      className={`${iconInputClass} ${errors.PhoneNumber ? 'border-[#d76d6d] focus:border-[#d76d6d]' : ''}`}
                    />
                  </div>
                  {errors.PhoneNumber && <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.PhoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <div className="relative">
                    <MdMail className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="Email"
                      className={`${iconInputClass} ${errors.email ? 'border-[#d76d6d] focus:border-[#d76d6d]' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.email}</p>}
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
                      onChange={setField('password')}
                      placeholder="Password"
                      className={`${iconInputClass} ${errors.password ? 'border-[#d76d6d] focus:border-[#d76d6d]' : ''}`}
                    />
                  </div>
                  {errors.password && <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.password}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cities" className="sr-only">
                      City
                    </label>
                    <div className="relative">
                      <MdLocationCity className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                      <select
                        id="cities"
                        value={form.cities}
                        onChange={setField('cities')}
                        className={`${iconInputClass} appearance-none ${errors.cities ? 'border-[#d76d6d] focus:border-[#d76d6d]' : ''}`}
                      >
                        <option value="" disabled className="bg-[#262932] text-[#c6c8cf]">
                          Select city
                        </option>
                        {CITIES.map((city) => (
                          <option key={city} value={city} className="bg-[#262932] text-[#f5f1ea]">
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.cities && <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.cities}</p>}
                  </div>

                  <div>
                    <label htmlFor="role" className="sr-only">
                      Account type
                    </label>
                    <div className="relative">
                      <MdAssignmentInd className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#737680]" />
                      <select
                        id="role"
                        value={form.role}
                        onChange={setField('role')}
                        className={`${iconInputClass} appearance-none ${errors.role ? 'border-[#d76d6d] focus:border-[#d76d6d]' : ''}`}
                      >
                        <option value="user" className="bg-[#262932] text-[#f5f1ea]">
                          Customer
                        </option>
                        <option value="owner" className="bg-[#262932] text-[#f5f1ea]">
                          Salon Owner
                        </option>
                      </select>
                    </div>
                    {errors.role && <p className="mt-2 pl-2 text-sm text-[#ff9c9c]">{errors.role}</p>}
                  </div>
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
                      <span>Create account</span>
                      <MdArrowForward className="text-2xl" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4 text-sm text-[#bdb7ad]">
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
                  Already have an account?{' '}
                  <Link
                    to="/auth/login"
                    className="font-medium text-[#f5f1ea] transition-colors hover:text-[#dfba69]"
                  >
                    Sign in
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
