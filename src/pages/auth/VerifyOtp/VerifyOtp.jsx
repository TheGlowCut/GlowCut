import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../../hooks/useAuth';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerificationOtp } = useAuth();

  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please register first to get your OTP.');
      navigate('/auth/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

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
    if (resending || countdown > 0) return;
    setResending(true);
    const toastId = toast.loading('Sending new OTP code...');

    try {
      const res = await resendVerificationOtp({ email });
      toast.success(res.message || 'A fresh OTP has been sent to your email!', { id: toastId });
      setOtp(['', '', '', '', '', '']);
      setCountdown(45);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } catch (error) {
      toast.error(error?.message || 'Failed to resend OTP.', { id: toastId });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] font-sans">
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[600px] p-8 md:p-14 rounded-[2rem] bg-[#111111] border border-white/5 shadow-2xl flex flex-col items-center"
        >
          <div className="w-20 h-20 mb-6 rounded-full border border-white/10 bg-[#161616] flex items-center justify-center relative">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="#E4B56C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
               <rect x="3" y="5" width="18" height="14" rx="2" stroke="#E4B56C" strokeWidth="1.5" strokeLinecap="round"/>
             </svg>
             <div className="absolute -bottom-1 -right-1 bg-[#161616] rounded-full p-1">
               <div className="bg-[#E4B56C] rounded-full w-6 h-6 flex items-center justify-center text-black">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </div>
             </div>
          </div>

          <h2 className="text-3xl md:text-4xl text-white mb-4 text-center tracking-tight font-medium">
            Verify your <span className="text-[#E4B56C]">email</span>
          </h2>
          
          <p className="text-[#A1A1AA] text-center mb-8 max-w-[380px] leading-relaxed text-[15px]">
            We've sent a verification code to your email address.<br />
            Please enter the code below to verify your account.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-[420px] flex flex-col">
            <div className="w-full text-left mb-3 text-[14px] text-gray-300 ml-1">
              Enter 6-digit code
            </div>
            
            <div className="flex justify-between w-full gap-2 md:gap-3 mb-8" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 md:w-[60px] md:h-[64px] bg-transparent border border-white/10 rounded-xl text-center text-white text-xl focus:outline-none focus:border-[#E4B56C] focus:ring-1 focus:ring-[#E4B56C] transition-all"
                />
              ))}
            </div>

            <div className="text-[14px] text-[#A1A1AA] mb-12 text-center">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending || countdown > 0}
                className="text-[#E4B56C] hover:text-[#cfa462] transition-colors disabled:opacity-50"
              >
                {resending ? 'Sending...' : countdown > 0 ? `Resend code (00:${countdown.toString().padStart(2, '0')})` : 'Resend code'}
              </button>
            </div>

            <div className="w-full flex items-center justify-between mt-2">
              <Link to="/auth/signup" className="text-white hover:text-gray-300 transition-colors flex items-center gap-2 text-[15px]">
                &larr; Back
              </Link>

              <button 
                type="submit" 
                disabled={submitting}
                className="bg-[#E4B56C] text-black px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-[#cfa462] transition-colors disabled:opacity-50 text-[15px]"
              >
                {submitting ? 'Verifying...' : 'Verify Email'}
                &rarr;
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
