import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MdEventAvailable,
  MdCheckCircleOutline,
  MdHighlightOff,
  MdDoneAll,
  MdContentPaste,
  MdAttachMoney,
  MdTrendingUp,
  MdAccessTime,
  MdRefresh,
} from 'react-icons/md';
import apiClient from '../../../services/apiClient';
import EmptyState from '../../../components/ui/EmptyState';
import AuthContext from '../../../context/AuthContext';
import glowcutLogo from '../../../assets/logos/glowcut-mark-XZgku7lW.png';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function BookingManager() {
  const { profile } = useContext(AuthContext);
  const salonId = profile?.salon?._id || profile?.salon?.id || localStorage.getItem('salonId') || '';

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actioningId, setActioningId] = useState(null);

  const fetchBookings = async () => {
    if (!salonId) {
      toast.error('No salon linked to this account yet.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const url = filterStatus === 'all'
        ? `/bookings/salon/${salonId}`
        : `/bookings/filter?salonId=${salonId}&status=${filterStatus}`;

      const { data } = await apiClient.get(url);
      setBookings(data.data?.bookings || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch bookings.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await apiClient.get('/bookings/statistics');
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filterStatus, salonId]);

  const handleStatusChange = async (id, action) => {
    if (actioningId) return;
    setActioningId(id);
    try {
      const { data } = await apiClient.patch(
        `/bookings/${id}/${action}`,
        action === 'reject' ? { cancelReason: 'Rejected by salon manager' } : undefined
      );
      if (data.success) {
        toast.success(`Booking status updated to ${action}!`);
        fetchBookings();
        fetchStats();
      } else {
        toast.error(data.message || 'Operation rejected.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update booking status.');
    } finally {
      setActioningId(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-[#E4B56C]/10 text-[#E4B56C] border-[#E4B56C]/20',
      confirmed: 'bg-[#E4B56C]/20 text-[#E4B56C] border-[#E4B56C]/30',
      completed: 'bg-[#E4B56C]/15 text-[#E4B56C] border-[#E4B56C]/25',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
      rejected: 'bg-red-500/15 text-red-500 border-red-500/25',
    };
    return styles[status] || 'bg-white/5 text-[#A1A1AA] border-white/10';
  };

  return (
    <motion.div
      className="px-margin-mobile md:px-lg max-w-full space-y-lg text-white text-sm font-sans"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <motion.div
        variants={fadeUp}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10" />
          <div>
            <h2 className="text-3xl font-serif text-white">Live Booking Board</h2>
            <p className="text-[#A1A1AA] text-body-md">Manage real-time walk-ins, online appointments, and client workflows.</p>
          </div>
        </div>
        <button
          onClick={() => { fetchBookings(); fetchStats(); }}
          className="p-2 bg-white/5 border border-white/5 rounded-lg text-[#A1A1AA] hover:text-white transition-colors"
        >
          <MdRefresh className="text-lg" />
        </button>
      </motion.div>

      <motion.section
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md"
      >
        {[
          { label: 'Total Bookings', value: stats.totalBookings, icon: MdContentPaste, color: 'primary' },
          { label: 'Gross Revenue', value: `Rs. ${stats.totalRevenue}`, icon: MdAttachMoney, color: 'primary' },
          { label: 'Pending Approvals', value: stats.pending, icon: MdAccessTime, color: 'primary' },
          { label: 'Completed Sessions', value: stats.completed, icon: MdTrendingUp, color: 'primary' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="bg-[#111111] p-md rounded-xl flex items-center justify-between border border-white/5">
              <div>
                <p className="text-xs text-[#A1A1AA] font-medium">{metric.label}</p>
                <h3 className="text-xl font-bold mt-1 text-white">{metric.value}</h3>
              </div>
              <div className="p-3 bg-[#E4B56C]/10 text-[#E4B56C] rounded-lg"><Icon className="text-xl" /></div>
            </div>
          );
        })}
      </motion.section>

      <motion.div
        variants={fadeUp}
        className="flex gap-2 border-b border-white/5 pb-3 overflow-x-auto text-xs font-semibold"
      >
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-4 py-2 rounded-lg transition-all capitalize border ${
              filterStatus === tab
                ? 'bg-[#E4B56C] border-[#E4B56C]/60 text-black shadow-[0_0_10px_rgba(228,181,108,0.2)]'
                : 'bg-white/5 border-white/5 text-[#A1A1AA] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      <motion.section
        variants={fadeUp}
        className="space-y-3"
      >
        {loading ? (
          [1, 2, 3].map(n => <div key={n} className="h-24 bg-white/5 animate-pulse rounded-xl" />)
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={MdEventAvailable}
            title="No bookings match this filter"
            description="Try a different status tab, or check back once customers start booking appointments."
          />
        ) : (
          bookings.map((item) => (
            <div
              key={item._id}
              className="p-md bg-[#111111] border border-white/5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#E4B56C]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#E4B56C]/10 border border-[#E4B56C]/20 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-[#E4B56C] uppercase font-bold tracking-tight">Queue</span>
                  <span className="text-lg font-extrabold text-white leading-none mt-0.5">#{item.queueNumber}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{item.customerId?.userName || "Walk-In Client"}</h4>
                    <span className="text-[10px] bg-white/5 text-[#A1A1AA] px-2 py-0.5 rounded border border-white/5 uppercase tracking-wide font-medium">{item.bookingType}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>{item.status}</span>
                  </div>
                  <div className="text-xs text-[#A1A1AA] flex flex-wrap gap-x-3 gap-y-1">
                    <span><strong>Barber:</strong> {item.barberId?.name || 'Any'}</span>
                    <span><strong>Service:</strong> {item.serviceId?.name || 'Haircut'}</span>
                    <span><strong>Timing:</strong> {new Date(item.bookingDate).toLocaleDateString()} • {item.startTime} - {item.endTime}</span>
                  </div>
                  {item.notes && <p className="text-xs text-[#E4B56C]/90 italic">Notes: &quot;{item.notes}&quot;</p>}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="text-right">
                  <p className="text-[10px] text-[#A1A1AA]">Final Amount</p>
                  <p className="text-sm font-black text-[#E4B56C]">Rs. {item.finalAmount}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${item.paymentStatus === 'paid' ? 'text-[#E4B56C]' : 'text-[#E4B56C]'}`}>
                    [{item.paymentStatus}] via {item.paymentMethod}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(item._id, 'confirm')}
                        disabled={actioningId === item._id}
                        className="p-2 bg-[#E4B56C]/10 hover:bg-[#E4B56C] text-[#E4B56C] hover:text-black border border-[#E4B56C]/20 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                        title="Confirm Booking"
                      >
                        <MdCheckCircleOutline className="text-base" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(item._id, 'reject')}
                        disabled={actioningId === item._id}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-on-error border border-red-500/20 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                        title="Reject Booking"
                      >
                        <MdHighlightOff className="text-base" />
                      </button>
                    </>
                  )}

                  {item.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(item._id, 'complete')}
                      disabled={actioningId === item._id}
                      className="px-3 py-2 bg-[#E4B56C]/10 hover:bg-[#E4B56C] text-[#E4B56C] hover:text-black border border-[#E4B56C]/20 rounded-lg transition-all text-xs font-bold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                      title="Mark Completed"
                    >
                      <MdDoneAll className="text-sm" /> Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </motion.section>
    </motion.div>
  );
}
