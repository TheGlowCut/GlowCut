import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdCheckCircle, MdDownload, MdHome, MdStar } from 'react-icons/md';
import { motion } from 'framer-motion';
import { useBooking } from '../../../hooks/useBooking';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { booking, totalPrice, resetBooking } = useBooking();

  const createdBookings = booking.createdBookings || [];
  const firstBooking = createdBookings[0];

  const invoiceNumber = firstBooking?._id ? firstBooking._id.slice(-8).toUpperCase() : 'PENDING';
  const createdAt = firstBooking?.createdAt ? new Date(firstBooking.createdAt) : new Date();
  const dateLabel = createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeLabel = createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const lineItems = createdBookings.length
    ? createdBookings.map((b) => ({
        id: b._id,
        name: b.serviceId?.name || 'Service',
        price: b.finalAmount ?? 0,
      }))
    : booking.services.map((s) => ({ id: s._id || s.id, name: s.name, price: s.price || 0 }));

  const grandTotal = createdBookings.length
    ? createdBookings.reduce((sum, b) => sum + (b.finalAmount ?? 0), 0)
    : totalPrice;

  const paymentStatus = firstBooking?.paymentStatus || 'pending';
  const paymentMethod = firstBooking?.paymentMethod || booking.paymentMethod || 'cash';

  const handleDownload = () => {
    toast.success('Receipt downloaded (simulated)');
  };

  const handleBackHome = () => {
    resetBooking();
    navigate('/');
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-margin-mobile text-on-surface antialiased"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center mb-lg">
        <div className="relative mb-md">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shadow-warm border border-primary/30">
            <MdCheckCircle className="text-primary text-[48px]" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-primary/10 opacity-30" />
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface text-center">
          Payment Successful
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant/80 mt-xs">
          Your transformation is confirmed.
        </p>
      </div>

      <main className="w-full max-w-md bg-surface-container/80 backdrop-blur-2xl rounded-xl overflow-hidden relative mb-xl border border-primary/20 shadow-soft">
        <div className="p-md space-y-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-label-md text-label-md text-primary tracking-widest uppercase mb-xs block">
                Invoice
              </span>
              <p className="font-headline-md text-headline-md text-on-surface">#{invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-body-md text-body-md text-on-surface-variant">{dateLabel}</p>
              <p className="font-body-md text-body-md text-on-surface-variant">{timeLabel}</p>
              <p className="font-caption text-caption text-primary uppercase mt-xs">
                {paymentStatus} · {paymentMethod}
              </p>
            </div>
          </div>

          <div className="space-y-sm pt-sm border-t border-white/5">
            {lineItems.map((item) => (
              <div className="flex justify-between items-center" key={item.id}>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.name}</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {item.price.toLocaleString()} PKR
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-md border-t border-white/5">
            <p className="font-headline-md text-headline-md text-on-surface-variant">Total Amount</p>
            <p className="font-headline-md text-headline-md text-primary font-bold">
              {grandTotal.toLocaleString()} PKR
            </p>
          </div>
        </div>

        <div className="relative h-6 flex items-center">
          <div className="absolute left-[-12px] w-6 h-6 rounded-full bg-background" />
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute right-[-12px] w-6 h-6 rounded-full bg-background" />
        </div>

        <div className="p-md bg-white/5 flex flex-col items-center">
          <div className="p-base bg-white rounded-lg mb-sm">
            <img
              alt="Verification QR Code"
              className="w-24 h-24"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsJtQQXKIb5BNsaP8oMmWBPUKior9Rh67rr2uGdxAuOi6rmuhID6U8PEH4-xr0OGSNGQlyvcX_LJn_ocviiJSRNXRDFuSBNh0w0XvSxPlt74dNyfXl2YJyul4F-WQLQUyWSwXn8HXOYZWmeQbjKqzDqCw_d6MF_GYtPgo5aKHY43fZeAjElDrn9SA-ru05veyq-8xfHQW77L09MrQw-xXZrFqfrCbdlXW0Cpx3Nf3Wls33X-LBDxhgyuWJc_8Bj65w58HB34_Pkg0"
            />
          </div>
          <p className="font-caption text-caption text-on-surface-variant tracking-wider uppercase">
            Scan for verification
          </p>
        </div>
      </main>

      <footer className="w-full max-w-md flex flex-col gap-md">
        <button
          onClick={handleDownload}
          className="w-full h-14 bg-primary text-on-primary font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-sm active:scale-95 transition-all shadow-warm"
        >
          <MdDownload />
          Download PDF Receipt
        </button>
        <button
          onClick={() => navigate('/profile/feedback')}
          className="w-full h-14 border border-primary/40 text-primary font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-sm active:scale-95 transition-all hover:bg-primary/5"
        >
          <MdStar />
          Rate Your Experience
        </button>
        <button
          onClick={handleBackHome}
          className="w-full h-14 text-on-surface-variant font-label-md rounded-xl flex items-center justify-center gap-sm active:scale-95 transition-all hover:text-on-surface"
        >
          <MdHome />
          Back to Home
        </button>
      </footer>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>
    </motion.div>
  );
}
