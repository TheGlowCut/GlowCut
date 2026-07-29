import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MdPersonAdd,
  MdDeleteOutline,
  MdStar,
  MdEdit,
  MdClose,
  MdBadge,
} from 'react-icons/md';
import apiClient from '../../../services/apiClient';
import EmptyState from '../../../components/ui/EmptyState';
import AuthContext from '../../../context/AuthContext';
import glowcutLogo from '../../../assets/logos/glowcut-logo.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function StaffManager() {
  const { profile } = useContext(AuthContext);
  const salonId = profile?.salon?._id || profile?.salon?.id || localStorage.getItem('salonId') || '';

  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [experience, setExperience] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('21:00');
  const [salary, setSalary] = useState('');
  const [commission, setCommission] = useState('');
  const [description, setDescription] = useState('');
  const [workingDays, setWorkingDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

  const [profileImageFile, setProfileImageFile] = useState(null);

  const fetchBarbers = async () => {
    if (!salonId) {
      toast.error('No salon linked to this account yet.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/barbers/salon/${salonId}`);
      setBarbers(data.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch barber records.');
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, [salonId]);

  const resetForm = () => {
    setName(''); setEmail(''); setPhone(''); setGender('Male');
    setExperience(''); setStartTime('09:00'); setEndTime('21:00');
    setSalary(''); setCommission(''); setDescription('');
    setWorkingDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
    setProfileImageFile(null);
  };

  const handleAddBarber = async (e) => {
    e.preventDefault();
    if (!salonId) return toast.error('No salon linked to this account yet.');
    if (!name || !email || !phone || !startTime || !endTime) {
      toast.error('Please fill all required mandatory fields.');
      return;
    }
    if (workingDays.length === 0) {
      toast.error('Please select at least one working day for the barber schedule.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await apiClient.post('/barbers', {
        salonId, name, email, phone, gender,
        experience: Number(experience) || 0,
        startTime, endTime, workingDays,
        salary: Number(salary) || 0, commission: Number(commission) || 0,
        description: description || undefined,
      });
      if (data.success) {
        if (profileImageFile) {
          const barberId = data.data._id || data.data.id;
          const formData = new FormData();
          formData.append('profileImage', profileImageFile);
          await apiClient.patch(`/barbers/${barberId}/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        toast.success('Barber registered successfully!');
        resetForm();
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBarber = async (e) => {
    e.preventDefault();
    if (!editingBarber) return;
    if (workingDays.length === 0) {
      toast.error('Please select at least one working day for the barber schedule.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await apiClient.patch(`/barbers/${editingBarber._id}`, {
        name, email, phone, gender,
        experience: Number(experience) || 0,
        startTime, endTime, workingDays,
        salary: Number(salary) || 0, commission: Number(commission) || 0, description,
      });
      if (data.success) {
        if (profileImageFile) {
          const formData = new FormData();
          formData.append('profileImage', profileImageFile);
          await apiClient.patch(`/barbers/${editingBarber._id}/profile-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        toast.success('Barber records updated!');
        closeEditMode();
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAvailability = async (id, currentVal) => {
    try {
      const { data } = await apiClient.patch(`/barbers/${id}/availability`, { isAvailable: !currentVal });
      if (data.success) {
        toast.success('Availability updated!');
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    }
  };

  const changeDutyStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const { data } = await apiClient.patch(`/barbers/${id}/status`, { status: nextStatus });
      if (data.success) {
        toast.success(`Barber set to ${nextStatus}`);
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Status toggling failed.');
    }
  };

  const handleDeleteBarber = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specialist profile?')) return;
    try {
      const { data } = await apiClient.delete(`/barbers/${id}`);
      if (data.success) {
        toast.success('Barber deleted successfully.');
        fetchBarbers();
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed.');
    }
  };

  const startEditMode = (barber) => {
    setEditingBarber(barber);
    setName(barber.name);
    setEmail(barber.email);
    setPhone(barber.phone);
    setGender(barber.gender);
    setExperience(barber.experience);
    setStartTime(barber.startTime);
    setEndTime(barber.endTime);
    setWorkingDays(barber.workingDays && barber.workingDays.length > 0 ? barber.workingDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
    setSalary(barber.salary);
    setCommission(barber.commission);
    setDescription(barber.description || '');
    setProfileImageFile(null);
  };

  const closeEditMode = () => {
    setEditingBarber(null);
    resetForm();
  };

  return (
    <motion.div
      className="max-w-full mx-auto space-y-xl text-on-surface"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10" />
        <div className="flex flex-col gap-1">
          <h2 className="font-display-lg text-display-lg text-on-surface">Staff Management</h2>
          <p className="text-on-surface-variant text-headline-sm">Manage the specialists working at your salon — schedules, pay, and live availability.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-12 gap-10">
        <motion.section variants={fadeUp} className="lg:col-span-6">
          <div className="bg-surface-container/60 backdrop-blur-2xl rounded-3xl p-2xl space-y-xl sticky top-6 max-h-[90vh] overflow-y-auto border border-primary/10 shadow-soft">
            <div className="flex justify-between items-center border-b border-primary/10 pb-5">
              <h3 className="font-headline-md text-headline-sm text-on-surface flex items-center gap-2">
                {editingBarber ? <><MdEdit className="text-primary text-xl" /> Edit Staff</> : <><MdPersonAdd className="text-primary text-xl" /> Register Staff</>}
              </h3>
              {editingBarber && (
                <button onClick={closeEditMode} className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 hover:bg-white/5 rounded-xl">
                  <MdClose className="text-xl" />
                </button>
              )}
            </div>

            <form onSubmit={editingBarber ? handleUpdateBarber : handleAddBarber} className="space-y-5">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm">Profile Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file" accept="image/png, image/jpeg"
                    onChange={(e) => setProfileImageFile(e.target.files[0])}
                    className="flex-1 bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  {editingBarber && editingBarber.profileImage && !profileImageFile && (
                    <img src={editingBarber.profileImage} alt="Current" className="w-14 h-14 rounded-2xl object-cover border border-primary/30" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm">Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Email *</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@glowcut.com" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Phone *</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+923001234567" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Experience (Yrs)</label>
                  <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="3" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Start Time *</label>
                  <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="09:00" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">End Time *</label>
                  <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="21:00" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm">Working Days *</label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center gap-2 bg-surface/40 px-3 py-2 rounded-xl border border-white/10 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all">
                      <input type="checkbox" className="accent-primary w-4 h-4" checked={workingDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) setWorkingDays([...workingDays, day]);
                          else setWorkingDays(workingDays.filter(d => d !== day));
                        }}
                      />
                      <span className="text-sm text-on-surface-variant font-medium">{day.slice(0, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Base Salary</label>
                  <input type="number" value={salary} onChange={e => setSalary(e.target.value)} placeholder="250" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Commission %</label>
                  <input type="number" value={commission} onChange={e => setCommission(e.target.value)} placeholder="10" className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm">Bio</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="Brief expert review..." className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl text-headline-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 shadow-warm"
              >
                {submitting && <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                {editingBarber ? 'Update Staff' : 'Register Staff'}
              </button>
            </form>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="lg:col-span-5 space-y-lg">
          <div className="grid grid-cols-1 gap-xl">
            {loading ? (
              [1, 2].map(n => <div key={n} className="h-52 bg-surface/40 animate-pulse rounded-3xl" />)
            ) : barbers.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={MdBadge}
                  title="No staff registered yet"
                  description="Register your first specialist using the form on the left to start accepting bookings."
                />
              </div>
            ) : (
              barbers.map(barber => (
                <div key={barber._id} className="bg-surface-container/60 backdrop-blur-2xl rounded-3xl p-2xl border border-primary/10 shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col justify-between relative overflow-hidden w-full">
                  <div>
                    <div className="flex items-start gap-5 w-full">
                      <img
                        src={barber.profileImage || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=150&h=150&fit=crop&q=80'}
                        alt={barber.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-surface-container shrink-0 border border-primary/20"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline-md text-headline-md text-on-surface truncate">{barber.name}</h4>
                        <p className="text-headline-sm text-on-surface-variant truncate mt-1">{barber.email} • {barber.phone}</p>
                        <p className="text-sm text-primary font-semibold mt-2">{barber.gender} • {barber.experience} Yrs Exp • {barber.startTime}-{barber.endTime}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => startEditMode(barber)} className="text-on-surface-variant hover:text-primary p-2 hover:bg-primary/10 rounded-xl transition-colors"><MdEdit className="text-lg" /></button>
                        <button onClick={() => handleDeleteBarber(barber._id)} className="text-on-surface-variant hover:text-error p-2 hover:bg-error/10 rounded-xl transition-colors"><MdDeleteOutline className="text-lg" /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-5 pt-5 border-t border-primary/10 items-center">
                    <button
                      onClick={() => toggleAvailability(barber._id, barber.isAvailable)}
                      className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${barber.isAvailable ? 'bg-primary/10 text-primary border-primary/20' : 'bg-error/10 text-error border-error/20'}`}
                    >
                      {barber.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <button
                      onClick={() => changeDutyStatus(barber._id, barber.status)}
                      className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${barber.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-on-surface-variant border-white/10'}`}
                    >
                      {barber.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                    <span className="text-sm text-primary font-bold ml-auto flex items-center gap-1"><MdStar /> {barber.rating ?? 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
