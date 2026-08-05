import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MdWorkspacePremium,
  MdAddAPhoto,
  MdFavorite,
  MdCalendarMonth,
  MdSettings,
  MdChevronRight,
  MdLogout,
  MdSave,
  MdEdit,
  MdErrorOutline,
} from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import { UserContext } from '../../../context/UserContext';
import { useAuth } from '../../../hooks/useAuth';
import * as bookingService from '../../../services/bookingService';
import * as salonService from '../../../services/salonService';
import EmptyState from '../../../components/ui/EmptyState';

const CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta',
  'Multan', 'Faisalabad', 'Hyderabad', 'Sialkot', 'Gujranwala',
];

function ToggleSwitch({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input checked={checked} onChange={onChange} className="sr-only peer" type="checkbox" />
      <div className="w-11 h-6 bg-[#222222] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E4B56C]" />
    </label>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profile, updateProfile, updateProfileImage } = useContext(AuthContext);
  const { notifications, toggleNotification } = useContext(UserContext);
  const { logout } = useAuth();

  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    userName: '',
    phone: '',
    cities: 'Karachi',
  });

  const [bookingHistory, setBookingHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [savedSalonCount, setSavedSalonCount] = useState(0);

  useEffect(() => {
    if (!profile?.id) return undefined;
    let isMounted = true;
    salonService
      .getSavedSalons()
      .then((list) => {
        if (isMounted) setSavedSalonCount(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => {
        if (isMounted) setSavedSalonCount(0);
      });
    return () => {
      isMounted = false;
    };
  }, [profile?.id]);

  useEffect(() => {
    if (profile && !editing) {
      setForm({
        name: profile.name || profile.userName || '',
        userName: profile.userName || profile.name || '',
        phone: profile.phone || profile.PhoneNumber || '',
        cities: profile.cities || 'Karachi',
      });
      setErrorMessage('');
    }
  }, [profile, editing]);

  useEffect(() => {
    if (!profile?.id) {
      setLoadingHistory(false);
      return;
    }
    let isMounted = true;
    setLoadingHistory(true);
    bookingService
      .getMyBookings(profile.id, { limit: 6, status: 'completed' })
      .then((list) => {
        if (isMounted) setBookingHistory(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (isMounted) setBookingHistory([]);
      })
      .finally(() => {
        if (isMounted) setLoadingHistory(false);
      });
    return () => {
      isMounted = false;
    };
  }, [profile?.id]);

  const setField = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const payload = {
        name: form.name.trim(),
        userName: form.userName.trim(),
        phone: form.phone.trim(),
        PhoneNumber: form.phone.trim(),
        cities: form.cities,
      };
      await updateProfile(payload);
      setEditing(false);
      toast.success('Profile Updated Successfully!');
    } catch (error) {
      const backendError = error?.message || 'Failed to update profile. Please try again.';
      setErrorMessage(backendError);
      toast.error(backendError);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setErrorMessage('');
    try {
      await updateProfileImage(file);
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error(error?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <motion.main
      className="px-margin-mobile md:px-margin-desktop lg:max-w-4xl lg:mx-auto py-xl"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <motion.section
        variants={fadeUp}
        className="flex flex-col items-center mb-xl"
      >
        <div className="relative mb-md group">
          <div className="w-32 h-32 rounded-full border-2 border-[#E4B56C] p-1 shadow-[0_0_20px_rgba(228,181,108,0.2)] relative">
            <img
              className="w-full h-full rounded-full object-cover"
              alt={profile?.name || 'User Profile'}
              src={profile?.profileImage || 'https://via.placeholder.com/150'}
            />
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={uploadingImage}
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#E4B56C] shadow-[0_0_10px_rgba(228,181,108,0.2)] flex items-center justify-center border-2 border-background hover:scale-110 transition-transform disabled:opacity-50"
          >
            <MdAddAPhoto className="text-black text-base" />
          </button>
          {profile?.role === 'owner' || profile?.role === 'admin' ? (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#E4B56C]/20 text-[#E4B56C] px-sm py-1 rounded-full flex items-center gap-xs shadow-[0_0_10px_rgba(228,181,108,0.2)] whitespace-nowrap border border-[#E4B56C]/30">
              <MdWorkspacePremium className="text-[16px]" />
              <span className="text-sm font-sans font-bold capitalize">{profile.role}</span>
            </div>
          ) : null}
        </div>

        <h1 className="text-4xl font-serif mb-xs mt-6">
          {profile?.name || profile?.userName || 'GlowCut User'}
        </h1>
        <p className="text-[#A1A1AA] text-sm font-sans">{profile?.email}</p>
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="bg-[#111111] rounded-xl p-lg mb-xl border border-white/5"
      >
        <div className="flex items-center justify-between mb-lg">
          <h2 className="text-xl font-serif text-white">Personal Information</h2>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex items-center gap-xs text-[#E4B56C] font-bold hover:underline"
            >
              <MdEdit className="text-base" /> Edit
            </button>
          )}
        </div>

        {errorMessage && (
          <div className="mb-md p-md bg-red-500/10 border border-red-500/40 rounded-xl flex items-center gap-sm text-red-500 animate-fade-in">
            <MdErrorOutline className="text-xl flex-shrink-0" />
            <p className="text-sm font-sans text-sm">{errorMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="flex flex-col gap-xs">
            <label className="text-sm font-sans font-bold text-[#A1A1AA]">Full Name</label>
            {editing ? (
              <input
                value={form.name}
                onChange={setField('name')}
                className="bg-white/5 border border-[#E4B56C]/30 rounded-lg px-4 py-3 text-white text-sm font-sans focus:outline-none focus:border-[#E4B56C]"
              />
            ) : (
              <p className="text-sm font-sans text-white">{profile?.name || profile?.userName || 'N/A'}</p>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-sm font-sans font-bold text-[#A1A1AA]">Username</label>
            {editing ? (
              <input
                value={form.userName}
                onChange={setField('userName')}
                className="bg-white/5 border border-[#E4B56C]/30 rounded-lg px-4 py-3 text-white text-sm font-sans focus:outline-none focus:border-[#E4B56C]"
              />
            ) : (
              <p className="text-sm font-sans text-white">@{profile?.userName || 'username'}</p>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-sm font-sans font-bold text-[#A1A1AA]">Phone Number</label>
            {editing ? (
              <input
                value={form.phone}
                onChange={setField('phone')}
                placeholder="+923000000000"
                className="bg-white/5 border border-[#E4B56C]/30 rounded-lg px-4 py-3 text-white text-sm font-sans focus:outline-none focus:border-[#E4B56C]"
              />
            ) : (
              <p className="text-sm font-sans text-white">{profile?.phone || profile?.PhoneNumber || 'N/A'}</p>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <label className="text-sm font-sans font-bold text-[#A1A1AA]">Email</label>
            <p className="text-sm font-sans text-[#A1A1AA] italic">{profile?.email}</p>
          </div>

          <div className="flex flex-col gap-xs md:col-span-2">
            <label className="text-sm font-sans font-bold text-[#A1A1AA]">City</label>
            {editing ? (
              <select
                value={form.cities}
                onChange={setField('cities')}
                className="bg-white/5 border border-[#E4B56C]/30 rounded-lg px-4 py-3 text-white text-sm font-sans focus:outline-none focus:border-[#E4B56C] appearance-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111111] text-white">{c}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-sans text-white">{profile?.cities || 'Karachi'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="flex gap-sm mt-lg">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-sm px-xl py-md bg-[#E4B56C] text-black rounded-xl font-bold font-bold shadow-[0_0_10px_rgba(228,181,108,0.2)] active:scale-95 transition-all disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdSave />
              )}
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setErrorMessage('');
              }}
              className="px-xl py-md bg-[#111111] rounded-xl font-bold text-[#A1A1AA] hover:text-white transition-colors border border-white/5"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.section>

      <motion.section variants={fadeUp} className="mb-xl">
        <div className="flex justify-between items-end mb-md">
          <h2 className="text-xl font-serif text-white">My Booking History</h2>
          <button type="button" onClick={() => navigate('/booking/summary')} className="text-[#E4B56C] text-sm font-sans font-bold">
            View All
          </button>
        </div>
        {loadingHistory ? (
          <div className="flex gap-md overflow-x-auto pb-md">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-shrink-0 w-40 h-48 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : bookingHistory.length === 0 ? (
          <EmptyState
            icon={MdCalendarMonth}
            title="No past bookings yet"
            description="Once you complete a visit at a GlowCut salon, it will show up here."
          />
        ) : (
          <div className="flex gap-md overflow-x-auto pb-md [&::-webkit-scrollbar]:hidden">
            {bookingHistory.map((item) => (
              <div className="flex-shrink-0 w-40" key={item._id}>
                <div className="bg-[#111111] rounded-xl h-48 mb-xs group cursor-pointer overflow-hidden flex items-center justify-center bg-[#111111] border border-white/5">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt={item.serviceId?.name || 'Booking'}
                    src={item.salonId?.coverImage || item.salonId?.logo || 'https://via.placeholder.com/300x400?text=GlowCut'}
                  />
                </div>
                <p className="text-sm font-sans font-bold text-white">
                  {new Date(item.bookingDate).toLocaleDateString()}
                </p>
                <p className="text-caption text-[#A1A1AA]">
                  {item.serviceId?.name || 'Service'} @ {item.salonId?.name || 'Salon'}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section variants={fadeUp} className="space-y-md mb-xl">
        <button
          type="button"
          onClick={() => navigate('/profile/saved-salons')}
          className="w-full bg-[#111111] rounded-xl p-md flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border border-white/5"
        >
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-[#111111] flex items-center justify-center text-[#E4B56C]">
              <MdFavorite />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-serif text-white">Saved Salons</h3>
              <p className="text-caption text-[#A1A1AA]">
                {savedSalonCount} {savedSalonCount === 1 ? 'favourite location' : 'favourite locations'}
              </p>
            </div>
          </div>
          <MdChevronRight className="text-[#A1A1AA]" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/booking/summary')}
          className="w-full bg-[#111111] rounded-xl p-md flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border border-white/5"
        >
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-lg bg-[#111111] flex items-center justify-center text-[#E4B56C]">
              <MdCalendarMonth />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-serif text-white">Booking History</h3>
              <p className="text-caption text-[#A1A1AA]">Past &amp; upcoming slots</p>
            </div>
          </div>
          <MdChevronRight className="text-[#A1A1AA]" />
        </button>

        <div className="bg-[#111111] rounded-xl p-md space-y-md border border-white/5">
          <div className="flex items-center gap-md mb-xs">
            <div className="w-10 h-10 rounded-lg bg-[#111111] flex items-center justify-center text-[#E4B56C]">
              <MdSettings />
            </div>
            <h3 className="text-xl font-serif text-white">App Settings</h3>
          </div>
          <div className="pl-xl space-y-md">
            <div className="flex items-center justify-between py-xs border-b border-white/5">
              <span className="text-body-md text-white">Push Notifications</span>
              <ToggleSwitch
                checked={notifications.push}
                onChange={() => toggleNotification('push')}
              />
            </div>
            <div className="flex items-center justify-between py-xs border-b border-white/5">
              <span className="text-body-md text-white">Dark Mode</span>
              <div className="flex items-center gap-xs text-[#E4B56C]">
                <span className="text-sm font-sans font-bold">Always On</span>
                <MdLogout className="text-[#E4B56C]" />
              </div>
            </div>
            <div className="flex items-center justify-between py-xs">
              <span className="text-body-md text-white">Marketing Emails</span>
              <ToggleSwitch
                checked={notifications.marketing}
                onChange={() => toggleNotification('marketing')}
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.button
        variants={fadeUp}
        type="button"
        onClick={handleSignOut}
        className="w-full py-md rounded-xl bg-[#111111] border border-red-500/30 text-red-500 flex items-center justify-center gap-sm hover:bg-red-500/10 transition-all active:scale-[0.98]"
      >
        <MdLogout />
        <span className="font-bold">Sign Out</span>
      </motion.button>
    </motion.main>
  );
}
