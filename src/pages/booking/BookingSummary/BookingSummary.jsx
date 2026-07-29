import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { toPng } from 'html-to-image';
import {
  MdPerson,
  MdStorefront,
  MdCalendarToday,
  MdAccountCircle,
  MdContentCut,
  MdAttachMoney,
  MdInfoOutline,
  MdWarning,
  MdSchedule,
  MdDownload,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import { useBooking } from '../../../hooks/useBooking';
import * as bookingService from '../../../services/bookingService';
import glowcutLogo from '../../../assets/logos/glowcut-logo.jpg';

export default function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking } = useBooking();
  const receiptRef = useRef(null);

  const bookingId = location.state?.bookingId || booking.createdBookings?.[0]?._id || booking.createdBookings?.[0]?.id;

  const [liveBooking, setLiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(bookingId);
        setLiveBooking(data);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary flex items-center justify-center animate-spin [animation-duration:8s]">
          <MdSchedule className="text-[32px] text-primary" />
        </div>
        <h2 className="mt-6 font-display-lg text-headline-lg text-on-surface animate-pulse">Generating Receipt...</h2>
        <p className="text-on-surface-variant font-label-md mt-2">Retrieving booking confirmation</p>
      </main>
    );
  }

  if (error || !liveBooking) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center pt-8 pb-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden bg-surface-container/60 backdrop-blur-2xl rounded-3xl p-xl md:p-2xl max-w-lg w-full text-center border border-error/20 shadow-soft"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-error/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6 border border-error/20 rotate-6">
              <MdWarning className="text-error text-5xl -rotate-6" />
            </div>
            <h2 className="font-display-lg text-display-lg text-on-surface mb-3">Receipt Not Found</h2>
            <p className="text-on-surface-variant font-body-lg leading-relaxed mb-8 max-w-sm mx-auto">
              We couldn't retrieve your booking details. The session may have expired or the booking ID is invalid.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-xl bg-primary text-on-primary font-headline-md font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-warm"
            >
              RETURN TO HOME
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const clientName = liveBooking.customerId?.userName || liveBooking.customerId?.name || 'Guest';
  const salonName = liveBooking.salonId?.name || 'GlowCut Salon';
  const salonAddress = liveBooking.salonId?.address ? `${liveBooking.salonId.address.area || ''}, ${liveBooking.salonId.address.city || ''}` : 'Location available in-app';
  const stylistName = liveBooking.barberId?.name || 'Assigned Stylist';
  const stylistImage = liveBooking.barberId?.profileImage || liveBooking.barberId?.image || '';
  const serviceName = liveBooking.serviceId?.name || 'Grooming Service';
  
  const bookingDate = new Date(liveBooking.bookingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const timeSlot = liveBooking.startTime || 'Pending';
  
  const basePrice = liveBooking.price || 0;
  const discount = liveBooking.discount || 0;
  const finalAmount = liveBooking.finalAmount || (basePrice - discount);

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    try {
      const imgs = receiptRef.current.querySelectorAll('img');
      imgs.forEach((img) => { img.crossOrigin = 'anonymous'; });
      const dataUrl = await toPng(receiptRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ECF6D8',
      });
      const link = document.createElement('a');
      link.download = `GlowCut_Receipt_${liveBooking._id?.slice(-8) || 'summary'}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 850;

      const drawReceipt = () => {
        ctx.fillStyle = '#ECF6D8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(logoImg, 40, 40, 55, 55);
        ctx.fillStyle = '#63B032';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('GlowCut', 108, 56);
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#2D2D2D80';
        ctx.fillText('Digital Receipt', 108, 77);
        ctx.strokeStyle = '#63B032';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 100);
        ctx.lineTo(560, 100);
        ctx.stroke();
        ctx.fillStyle = '#2D2D2D';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Order: ${liveBooking._id?.slice(-8) || 'N/A'}`, 40, 135);
        ctx.fillText(`Date: ${bookingDate}`, 40, 160);
        ctx.fillText(`Time: ${timeSlot}`, 40, 185);
        ctx.fillText(`Salon: ${salonName}`, 40, 225);
        ctx.fillText(`Stylist: ${stylistName}`, 40, 260);
        ctx.fillText(`Client: ${clientName}`, 40, 295);
        ctx.strokeStyle = '#63B032';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(40, 325);
        ctx.lineTo(560, 325);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#63B032';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Service', 40, 360);
        ctx.fillText('Amount', 460, 360);
        ctx.fillStyle = '#2D2D2D';
        ctx.font = '14px sans-serif';
        ctx.fillText(serviceName, 40, 390);
        ctx.fillText(`PKR ${basePrice.toLocaleString()}`, 460, 390);
        if (discount > 0) {
          ctx.fillStyle = '#63B032';
          ctx.fillText('Discount', 40, 420);
          ctx.fillText(`-PKR ${discount.toLocaleString()}`, 460, 420);
        }
        ctx.strokeStyle = '#63B032';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 445);
        ctx.lineTo(560, 445);
        ctx.stroke();
        ctx.fillStyle = '#63B032';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Total', 40, 480);
        ctx.fillText(`PKR ${finalAmount.toLocaleString()}`, 400, 480);
        ctx.fillStyle = '#2D2D2D80';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Payment: ${liveBooking.paymentMethod}`, 40, 525);
        ctx.fillText(`Status: ${liveBooking.paymentStatus}`, 40, 550);
        ctx.fillStyle = '#63B032';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Thank you for choosing GlowCut', 300, 620);
        ctx.textAlign = 'start';
        ctx.fillStyle = '#2D2D2D40';
        ctx.font = '10px sans-serif';
        ctx.fillText('Powered by GlowCut', 40, 800);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `GlowCut_Receipt_${liveBooking._id?.slice(-8) || 'summary'}.png`;
        link.href = dataUrl;
        link.click();
      };

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = drawReceipt;
      logoImg.onerror = drawReceipt;
      logoImg.src = glowcutLogo;
    }
    toast.success('Receipt downloaded as image!');
  };

  return (
    <motion.main
      className="pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className="relative h-[180px] md:h-[350px] w-full overflow-hidden">
        <img
          alt={salonName}
          className="w-full h-full object-cover opacity-60"
          src={liveBooking.salonId?.coverImage || liveBooking.salonId?.logo || "https://lh3.googleusercontent.com/aida-public/AB6AXuDs1l4S_8EO95Tp66DW511NJr98V2sN0njzQGzU4Eqf4cK8PLv3q-3qNfbEsReVRgksKeW7Yqt2sQEMwW4Y7Yl3BPHDiQd16YTFiJ_wlQdRA7-ExY8i04gt9XruVl6ZWtaakuBBUeIqiPNBymY8gp0iQBRUoLeZghPvFMUvO9zXRCp4ruJE0L-0naZRcXFiMEaTSveeAQ_0KA15k4Jsdz_JC4qMpbfJ3GR8aHAetQ7HkXVTtPzjiTNUrAnD7hjKj-Qc_kzkEuzRUH0"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-10 left-margin-mobile md:left-margin-desktop flex items-center gap-sm bg-primary/20 backdrop-blur-md px-md py-sm rounded-full border border-primary/30 shadow-warm-sm">
          <MdPerson className="text-on-surface" />
          <span className="font-label-md text-label-md text-on-surface tracking-wider uppercase">
            {liveBooking.status === 'confirmed' ? 'Booking Confirmed' : liveBooking.status}
          </span>
        </div>
      </section>

      <div className="px-margin-mobile md:px-margin-desktop -mt-10 relative z-10 max-w-4xl mx-auto pb-xl">
        <motion.div
          ref={receiptRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface-container/80 backdrop-blur-2xl p-lg md:p-xl rounded-2xl flex flex-col gap-lg shadow-soft border border-primary/20 border-t-4 border-primary"
        >
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10" />
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                  Digital Receipt
                </h2>
                <p className="text-on-surface-variant font-caption text-caption uppercase tracking-widest flex items-center gap-2">
                  Order ID: <span className="text-primary font-bold">{liveBooking._id}</span>
                </p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-on-surface font-headline-md">{bookingDate}</p>
              <p className="text-primary font-bold text-lg">{timeSlot}</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl py-4">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <span className="text-caption font-caption text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MdStorefront className="text-primary" /> Salon
                </span>
                <p className="font-headline-md text-on-surface text-lg">{salonName}</p>
                <p className="text-on-surface-variant text-sm">{salonAddress}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="text-caption font-caption text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MdAccountCircle className="text-primary" /> Stylist
                </span>
                <div className="flex items-center gap-3 bg-surface-container p-3 rounded-xl border border-white/5">
                  {stylistImage ? (
                    <img src={stylistImage} alt={stylistName} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                      <MdPerson className="text-on-surface-variant text-xl" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-on-surface">{stylistName}</p>
                    <p className="text-[10px] text-primary uppercase tracking-wider">GlowCut Specialist</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-caption font-caption text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <MdPerson className="text-primary" /> Customer
                </span>
                <p className="font-headline-md text-on-surface text-lg">{clientName}</p>
                <p className="text-on-surface-variant text-sm">{liveBooking.customerId?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-white/5 flex flex-col h-full">
              <h3 className="font-headline-md text-on-surface mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <MdContentCut className="text-primary" /> Service Ledger
              </h3>
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-on-surface font-bold">{serviceName}</p>
                    <p className="text-on-surface-variant text-sm">{liveBooking.duration} mins</p>
                  </div>
                  <p className="text-on-surface font-mono">PKR {basePrice.toLocaleString()}</p>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-primary">
                    <p className="font-bold flex items-center gap-1"><MdInfoOutline /> Discount Applied</p>
                    <p className="font-mono">- PKR {discount.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <p>Payment Method</p>
                  <p className="uppercase text-on-surface font-bold">{liveBooking.paymentMethod}</p>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant">
                  <p>Payment Status</p>
                  <p className={`uppercase font-bold ${liveBooking.paymentStatus === 'paid' ? 'text-primary' : 'text-error'}`}>
                    {liveBooking.paymentStatus}
                  </p>
                </div>
                
                <div className="flex justify-between items-end pt-4 mt-2 border-t border-white/10">
                  <p className="text-on-surface font-headline-md">Total Amount</p>
                  <p className="text-primary font-display-lg text-3xl font-bold flex items-center gap-1">
                    <MdAttachMoney className="text-xl" />
                    {finalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <button
              onClick={() => navigate('/booking/waiting-lounge', { state: { bookingId: liveBooking._id } })}
              className="w-full py-4 rounded-xl bg-primary text-on-primary font-headline-md text-headline-md font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-warm"
            >
              PROCEED TO WAITING LOUNGE
            </button>
            <button
              onClick={handleDownloadImage}
              className="w-full py-4 rounded-xl border border-primary/40 text-primary font-headline-md text-headline-md font-bold transition-all hover:bg-primary/10 active:scale-95 flex items-center justify-center gap-2"
            >
              <MdDownload /> Download Receipt as Image
            </button>
            <p className="text-center text-on-surface-variant text-xs uppercase tracking-widest flex items-center justify-center gap-1">
              <MdInfoOutline /> Proceed to the lounge to track your live queue status
            </p>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
