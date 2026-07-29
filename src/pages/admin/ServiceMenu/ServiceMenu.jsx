import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  MdContentCut,
  MdAttachMoney,
  MdAccessTime,
  MdDeleteOutline,
  MdEdit,
  MdAdd,
  MdClose,
} from 'react-icons/md';
import apiClient from '../../../services/apiClient';
import EmptyState from '../../../components/ui/EmptyState';
import AuthContext from '../../../context/AuthContext';
import glowcutLogo from '../../../assets/logos/glowcut-logo.jpg';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ServiceMenu() {
  const { profile } = useContext(AuthContext);
  const salonId = profile?.salon?._id || profile?.salon?.id || localStorage.getItem('salonId') || '';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');

  const fetchSalonServices = async () => {
    if (!salonId) {
      toast.error('No salon linked to this account yet.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/services/salon/${salonId}`);
      setServices(data.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch services.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalonServices();
  }, [salonId]);

  const resetForm = () => {
    setName(''); setPrice(''); setDuration(''); setDescription(''); setCategory('General');
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!salonId) return toast.error('No salon linked to this account yet.');
    if (!name.trim() || !price || !duration) {
      toast.error('Name, Price, and Duration are required.');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await apiClient.post('/services', {
        salon: salonId,
        name: name.trim(),
        price: Number(price),
        duration: Number(duration),
        description: description.trim() || undefined,
        category: category.trim() || 'General',
      });
      if (data.success) {
        toast.success('Service added successfully!');
        resetForm();
        fetchSalonServices();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editingService) return;
    setSubmitting(true);
    try {
      const { data } = await apiClient.patch(`/services/${editingService._id}`, {
        name: name.trim(),
        price: Number(price),
        duration: Number(duration),
        description: description.trim() || '',
        category: category.trim() || 'General',
      });
      if (data.success) {
        toast.success('Service updated successfully!');
        closeEditMode();
        fetchSalonServices();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service permanently?')) return;
    try {
      const { data } = await apiClient.delete(`/services/${id}`);
      if (data.success) {
        toast.success('Service deleted successfully.');
        fetchSalonServices();
      }
    } catch (err) {
      toast.error(err.message || 'Could not complete deletion.');
    }
  };

  const startEditMode = (service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price);
    setDuration(service.duration);
    setDescription(service.description || '');
    setCategory(service.category || 'General');
  };

  const closeEditMode = () => {
    setEditingService(null);
    resetForm();
  };

  return (
    <motion.div
      className="max-w-full mx-auto space-y-lg text-on-surface"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <img src={glowcutLogo} alt="GlowCut" className="w-10 h-10" />
        <div className="flex flex-col gap-1">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Service Catalog</h2>
          <p className="text-on-surface-variant text-body-md">Live-synced with your salon's service records — add, edit, or retire menu items.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        <motion.section variants={fadeUp} className="lg:col-span-7">
          <div className="bg-surface-container/60 backdrop-blur-2xl rounded-2xl p-lg space-y-md sticky top-6 border border-primary/10 shadow-soft">
            <div className="flex justify-between items-center border-b border-primary/10 pb-4">
              <h3 className="font-headline-md text-headline-sm text-on-surface flex items-center gap-2">
                {editingService ? <><MdEdit className="text-primary" /> Edit Service</> : <><MdAdd className="text-primary" /> New Service</>}
              </h3>
              {editingService && (
                <button onClick={closeEditMode} className="text-on-surface-variant hover:text-on-surface transition-colors p-1 hover:bg-white/5 rounded-lg">
                  <MdClose className="text-lg" />
                </button>
              )}
            </div>

            <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-5">
              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm flex items-center gap-2"><MdContentCut className="text-primary text-xl" /> Service Name *</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Skin Fade & Lineup"
                  className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Price (PKR) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-on-surface-variant text-xl"><MdAttachMoney /></span>
                    <input
                      type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                      placeholder="1500"
                      className="w-full bg-surface/40 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-on-surface-variant font-headline-sm">Duration (Mins) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-on-surface-variant text-xl"><MdAccessTime /></span>
                    <input
                      type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                      placeholder="45"
                      className="w-full bg-surface/40 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm">Category</label>
                <input
                  type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                  placeholder="Hair, Grooming, Color..."
                  className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-on-surface-variant font-headline-sm">Description</label>
                <textarea
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Outline the detailed parameters of the styling method..."
                  className="w-full bg-surface/40 border border-white/10 rounded-xl px-5 py-4 text-headline-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl text-headline-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 shadow-warm"
              >
                {submitting && <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </form>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="lg:col-span-5 space-y-md">
          <div className="grid grid-cols-1 gap-md">
            {loading ? (
              [1, 2, 3, 4].map(n => <div key={n} className="h-32 bg-surface/40 animate-pulse rounded-xl border border-white/5" />)
            ) : services.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={MdContentCut}
                  title="No services on your menu yet"
                  description="Add your first haircut, color, or grooming service to start accepting bookings."
                />
              </div>
            ) : (
              services.map((service) => (
                <div key={service._id} className="bg-surface-container/60 backdrop-blur-2xl rounded-2xl p-xl border border-primary/10 shadow-soft hover:shadow-warm transition-all duration-300 flex flex-col justify-between overflow-hidden w-full">
                  <div>
                    <div className="flex justify-between items-start gap-3 w-full">
                      <h4 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><MdContentCut className="text-primary text-xl" /></span>
                        <span className="truncate">{service.name}</span>
                      </h4>
                      {!service.isActive && (
                        <span className="text-xs bg-white/5 text-on-surface-variant border border-white/10 px-3 py-1 rounded-full font-semibold shrink-0">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-headline-sm text-on-surface-variant mt-4 line-clamp-3 leading-relaxed">
                      {service.description || 'No description added for this service yet.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-5 border-t border-primary/10">
                    <div className="flex gap-5">
                      <span className="flex items-center gap-1.5 font-bold text-primary text-headline-sm">
                        <MdAttachMoney className="text-xl" />{service.price}
                      </span>
                      <span className="flex items-center gap-1.5 text-headline-sm text-on-surface-variant">
                        <MdAccessTime className="text-xl" /> {service.duration}m
                      </span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => startEditMode(service)}
                        className="text-on-surface-variant hover:text-primary p-2.5 hover:bg-primary/10 rounded-xl transition-colors"
                        title="Edit service"
                      >
                        <MdEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="text-on-surface-variant hover:text-error p-2.5 hover:bg-error/10 rounded-xl transition-colors"
                        title="Delete service"
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    </div>
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
