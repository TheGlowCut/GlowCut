import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MdVerifiedUser } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import { useAuth } from '../../../hooks/useAuth';

const BENEFITS = [
  'Secure 2-factor authentication',
  'Instant account activation',
  'Access to all premium features',
];

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationOtp } = useAuth();

  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please register first to get your OTP.');
      navigate('/auth/signup');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length < 6) {
      toast.error('Please enter all 6 digits of the OTP');
      return;
    }

    setSubmitting(true);

    try {
      const res = await verifyEmail({ email, otp: otpString });
      toast.success(res.message || 'Email verified successfully!');
      navigate('/auth/login');
    } catch (error) {
      toast.error(error?.message || 'Invalid OTP code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resending) return;
    setResending(true);
    const toastId = toast.loading('Sending new OTP code...');

    try {
      const res = await resendVerificationOtp({ email });
      toast.success(res.message || 'A fresh OTP has been sent to your email!', { id: toastId });
      setOtp(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (error) {
      toast.error(error?.message || 'Failed to resend OTP.', { id: toastId });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-xl w-full max-w-6xl items-center">
      {/* Left: Visual + Benefits */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-lg"
      >
        <div className="relative w-full aspect-square max-w-md flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="relative z-10 flex flex-col items-center">
            <span
              className="material-symbols-outlined text-[70px] md:text-[120px] text-primary drop-shadow-[0_0_6px_rgba(124,140,61,0.25)]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_person
            </span>
            <div className="absolute top-1/2 left-[-10%] w-[120%] h-[2px] bg-primary shadow-warm opacity-60" />
            <Loader variant="scan" className="mt-md" />
          </div>
        </div>
        <div className="text-center w-full">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Secure Verification
          </h2>
          <p className="font-body-md text-on-surface-variant max-w-sm mx-auto">
            We have sent a 6-digit verification code to your registered email address.
          </p>
          <div className="mt-md space-y-sm">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-sm justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-on-surface-variant text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right: OTP Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        <div className="w-full max-w-md p-lg rounded-2xl bg-surface-container/80 backdrop-blur-2xl border border-primary/20 shadow-soft">
          <div className="mb-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
              Verify Your Email
            </h3>
            <p className="font-body-md text-on-surface-variant break-all">
              Enter the OTP code sent to <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="flex justify-between gap-xs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 bg-surface border border-white/10 rounded-xl text-center text-on-surface text-xl font-bold font-sora focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              ))}
            </div>

            <Button type="submit" variant="primary" size="full" loading={submitting} disabled={submitting}>
              Verify &amp; Activate Account
            </Button>
          </form>

          <div className="mt-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              Didn't get the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-primary font-bold hover:text-primary-fixed transition-colors underline underline-offset-4 disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </p>
            <p className="mt-md">
              <Link to="/auth/signup" className="text-caption font-caption text-outline hover:text-on-surface transition-colors">
                ← Back to Registration
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
