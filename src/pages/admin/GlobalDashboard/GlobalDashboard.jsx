import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MdStorefront,
  MdAccountBalanceWallet,
  MdEventAvailable,
  MdVerifiedUser,
  MdStar,
  MdRefresh,
  MdPending,
  MdCheckCircle,
} from 'react-icons/md';
import apiClient from '../../../services/apiClient';
import EmptyState from '../../../components/ui/EmptyState';
import glowcutLogo from '../../../assets/logos/glowcut-mark-XZgku7lW.png';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function GlobalDashboard() {
  const [stats, setStats] = useState(null);
  const [salons, setSalons] = useState([]);
  const [topSalons, setTopSalons] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, salonsRes, topRes, bookingsRes] = await Promise.allSettled([
        apiClient.get('/bookings/statistics'),
        apiClient.get('/salons', { params: { limit: 6 } }),
        apiClient.get('/salons/top-rated', { params: { limit: 5 } }),
        apiClient.get('/bookings', { params: { limit: 6 } }),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }
      if (salonsRes.status === 'fulfilled' && salonsRes.value.data?.success) {
        setSalons(salonsRes.value.data.data?.salons || []);
      }
      if (topRes.status === 'fulfilled' && topRes.value.data?.success) {
        setTopSalons(topRes.value.data.data || []);
      }
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value.data?.success) {
        setRecentBookings(bookingsRes.value.data.data?.bookings || []);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load platform data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const METRICS = stats
    ? [
        { label: 'Total Bookings', value: stats.totalBookings ?? 0, icon: MdEventAvailable },
        { label: 'Gross Revenue', value: `Rs. ${(stats.totalRevenue ?? 0).toLocaleString()}`, icon: MdAccountBalanceWallet },
        { label: 'Pending Approvals', value: stats.pending ?? 0, icon: MdPending },
        { label: 'Completed Sessions', value: stats.completed ?? 0, icon: MdCheckCircle },
      ]
    : [];

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
        className="flex justify-between items-center mb-md"
      >
        <div className="flex items-center gap-4">
          <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10" />
          <div>
            <h2 className="text-3xl font-serif text-white">Platform Control Center</h2>
            <p className="text-[#A1A1AA] text-sm font-sans">Live overview across every GlowCut salon partner.</p>
          </div>
        </div>
        <button onClick={fetchAll} className="p-2 bg-[#111111] rounded-lg text-[#A1A1AA] hover:text-white transition-colors border border-white/5">
          <MdRefresh className="text-lg" />
        </button>
      </motion.div>

      <motion.section
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md"
      >
        {loading ? (
          [1, 2, 3, 4].map((n) => <div key={n} className="bg-[#111111] h-28 rounded-xl animate-pulse border border-white/5" />)
        ) : (
          METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="bg-[#111111] p-md rounded-xl space-y-md relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 bg-[#E4B56C]/10" />
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-caption text-[#A1A1AA] uppercase tracking-widest">{metric.label}</p>
                    <h3 className="font-serif text-headline-lg text-white">{metric.value}</h3>
                  </div>
                  <Icon className="p-1 rounded-lg text-xl text-[#E4B56C] bg-[#E4B56C]/10" />
                </div>
              </div>
            );
          })
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-3 gap-md pb-xl mt-md"
      >
        <div className="lg:col-span-2 bg-[#111111] rounded-2xl p-md flex flex-col border border-white/5">
          <div className="flex justify-between items-center mb-md">
            <h3 className="text-xl font-serif text-white">Recent Bookings</h3>
          </div>
          {loading ? (
            <div className="space-y-sm">
              {[1, 2, 3].map((n) => <div key={n} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <EmptyState
              icon={MdEventAvailable}
              title="No bookings yet"
              description="Once customers start booking across salons, activity will appear here in real time."
            />
          ) : (
            <div className="space-y-sm">
              {recentBookings.map((item) => (
                <div key={item._id} className="flex items-center gap-md p-sm rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 text-[#E4B56C] bg-[#E4B56C]/10 border-[#E4B56C]/20">
                    <MdEventAvailable className="text-[20px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-medium text-white">
                      {item.customerId?.userName || item.customerId?.name || 'Customer'} booked{' '}
                      {item.serviceId?.name || 'a service'} at {item.salonId?.name || 'a salon'}
                    </p>
                    <p className="text-caption text-[#A1A1AA] capitalize">
                      Status: {item.status} • {new Date(item.bookingDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#111111] rounded-2xl p-md space-y-md border border-white/5">
          <h3 className="text-xl font-serif text-label-md uppercase tracking-widest text-[#A1A1AA]">
            Top Performing Salons
          </h3>
          {loading ? (
            <div className="space-y-sm">
              {[1, 2, 3].map((n) => <div key={n} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : topSalons.length === 0 ? (
            <EmptyState
              icon={MdStar}
              title="No rated salons yet"
              className="py-md"
              description="Ratings will populate once customers start leaving reviews."
            />
          ) : (
            <div className="space-y-md">
              {topSalons.map((partner) => (
                <div className="flex items-center gap-sm" key={partner._id}>
                  <div className="w-12 h-12 rounded-lg bg-[#111111] flex items-center justify-center text-[#E4B56C] font-bold flex-shrink-0">
                    {partner.name?.[0] || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{partner.name}</p>
                    <div className="flex items-center gap-xs">
                      <MdStar className="text-[14px] text-[#E4B56C]" />
                      <span className="text-caption text-white">
                        {(partner.averageRating ?? 0).toFixed?.(1) ?? partner.averageRating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="bg-[#111111] rounded-2xl p-md mb-xl border border-white/5"
      >
        <h3 className="text-xl font-serif text-white mb-md">Salon Directory</h3>
        {loading ? (
          <div className="space-y-sm">
            {[1, 2, 3].map((n) => <div key={n} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : salons.length === 0 ? (
          <EmptyState
            icon={MdStorefront}
            title="No salons registered yet"
            description="Salon owners who complete setup will appear here for platform review."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-md">
              <thead>
                <tr className="text-caption text-[#A1A1AA] uppercase tracking-wider border-b border-white/10">
                  <th className="py-2 pr-4">Salon</th>
                  <th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Rating</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {salons.map((s) => (
                  <tr key={s._id} className="border-b border-white/5">
                    <td className="py-3 pr-4 flex items-center gap-sm">
                      <MdVerifiedUser className={s.isVerified ? 'text-[#E4B56C]' : 'text-[#A1A1AA]'} />
                      {s.name}
                    </td>
                    <td className="py-3 pr-4 text-[#A1A1AA]">{s.address?.city || '—'}</td>
                    <td className="py-3 pr-4">{(s.averageRating ?? 0).toFixed?.(1) ?? s.averageRating}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.isActive ? 'bg-[#E4B56C]/10 text-[#E4B56C] border-[#E4B56C]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
