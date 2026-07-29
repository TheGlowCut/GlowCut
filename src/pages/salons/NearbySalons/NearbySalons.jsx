import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MdMyLocation,
  MdAdd,
  MdRemove,
  MdGridView,
  MdFormatListBulleted,
  MdLocationOn,
  MdExpandMore,
  MdStar,
} from 'react-icons/md';
import { motion } from 'framer-motion';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import { getNearbySalons, getTopRatedSalons } from '../../../services/salonService';

const AVAILABILITY_OPTIONS = ['Next 2 hours', 'Today', 'Tomorrow'];
const RATING_OPTIONS = ['Any Rating', '4.0+ Stars', '4.5+ Stars'];

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function NearbySalons() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get('area') || '';

  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [view, setView] = useState('list');
  const [availability, setAvailability] = useState('Next 2 hours');
  const [minRating, setMinRating] = useState('4.0+ Stars');

  React.useEffect(() => {
    let mounted = true;

    const fetchSalons = async (lat, lng) => {
      try {
        setIsLoading(true);
        let data = [];
        if (lat && lng) {
          data = await getNearbySalons({ lat, lng, maxDistance: 50000 });
        }
        if (!data || data.length === 0) {
          // Fallback to top rated if no nearby found or location missing
          data = await getTopRatedSalons(10);
        }
        if (mounted) setSalons(data);
      } catch (err) {
        console.error('Error fetching salons:', err);
        if (mounted) {
          try {
            const fallback = await getTopRatedSalons(10);
            setSalons(fallback);
          } catch (e) {
            setSalons([]);
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchSalons(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation error or denied, using fallback', error);
          fetchSalons(null, null);
        },
        { timeout: 5000 }
      );
    } else {
      fetchSalons(null, null);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const filteredSalons = useMemo(() => {
    if (minRating === 'Any Rating') return salons;
    const threshold = parseFloat(minRating);
    return salons.filter((s) => (s.averageRating ?? s.rating ?? 0) >= threshold);
  }, [salons, minRating]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Map Section */}
      <section className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover grayscale opacity-60"
            alt="Map of salons near PECHS, Karachi"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_iLKBN1_usPfjJgFVSsazCMUP89fE4aHeqjxJKwh82zN4ZUo_xI064OKS4oF8okDtgq7BxA1iGyOVUfDP6S0L5b3hklhpBRE21zs0xZx0oz_3J71RlrtoiCod3SXnWdltrEHPvUffv9YXPbH0_hlq8D6lmJdzuva4MU-Lr2GeFR46_huGhoBt1be4fiwWQqB10SZfDuSF9w_VsOc1L9j9RbtPi5PHsLPMMFWhX6uuFMxIYnwr4FDyDxphXzGczC7wBfH99o4iEjk"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-surface/40" />

          <div className="absolute top-1/2 left-1/3 group cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-on-primary text-xs font-bold px-2 py-1 rounded-md mb-1 shadow-warm-sm">
                4.8 ★
              </div>
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-warm-sm animate-pulse" />
            </div>
          </div>
          <div className="absolute top-1/4 right-1/4 group cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-1 rounded-md mb-1 shadow-warm-sm">
                4.6 ★
              </div>
              <div className="w-4 h-4 bg-primary-container rounded-full border-2 border-white shadow-warm-sm" />
            </div>
          </div>
          <div className="absolute bottom-1/3 right-1/2 group cursor-pointer">
            <div className="w-6 h-6 bg-primary/60 rounded-full border-4 border-white/20 shadow-lg animate-ping" />
            <div className="absolute inset-0 w-6 h-6 bg-primary rounded-full border-2 border-white" />
          </div>
        </div>

        <div className="absolute bottom-4 md:bottom-10 left-margin-mobile md:left-margin-desktop z-10 flex flex-row md:flex-col gap-sm">
          <button className="w-12 h-12 bg-surface-container/80 backdrop-blur-xl rounded-xl flex items-center justify-center text-primary hover:bg-white/10 transition-all border border-primary/20">
            <MdMyLocation className="text-xl" />
          </button>
          <button className="w-12 h-12 bg-surface-container/80 backdrop-blur-xl rounded-xl flex items-center justify-center text-on-surface hover:bg-white/10 transition-all border border-white/10">
            <MdAdd className="text-xl" />
          </button>
          <button className="w-12 h-12 bg-surface-container/80 backdrop-blur-xl rounded-xl flex items-center justify-center text-on-surface hover:bg-white/10 transition-all border border-white/10">
            <MdRemove className="text-xl" />
          </button>
        </div>
      </section>

      {/* Filters */}
      <motion.section variants={itemVariants} className="px-margin-mobile md:px-margin-desktop -mt-16 relative z-20">
        <div className="bg-surface-container/80 backdrop-blur-2xl p-md rounded-2xl flex flex-wrap items-center gap-md border border-primary/10 shadow-soft">
          <div className="flex-1 min-w-[200px]">
            <p className="font-label-md text-label-md text-on-surface-variant mb-3">
              Price Range (PKR)
            </p>
            <div className="relative h-2 bg-white/10 rounded-full">
              <div className="absolute h-full w-2/3 bg-primary rounded-full left-0 shadow-warm-sm" />
              <div className="absolute top-1/2 -translate-y-1/2 left-2/3 w-4 h-4 bg-white rounded-full border-2 border-primary cursor-pointer shadow-md" />
            </div>
            <div className="flex justify-between mt-2 text-caption text-on-surface-variant">
              <span>500</span>
              <span>5000+</span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden lg:block" />

          <div className="min-w-[140px]">
            <p className="font-label-md text-label-md text-on-surface-variant mb-2">Rating</p>
            <div className="relative">
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full bg-surface-container-high border-none text-on-surface rounded-lg py-2 px-3 font-body-md focus:ring-1 focus:ring-primary appearance-none"
              >
                {RATING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <MdExpandMore className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden lg:block" />

          <div className="flex-grow">
            <p className="font-label-md text-label-md text-on-surface-variant mb-2">Availability</p>
            <div className="flex flex-wrap gap-xs">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAvailability(opt)}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md border transition-all ${
                    availability === opt
                      ? 'bg-primary text-on-primary border-primary shadow-warm-sm'
                      : 'bg-white/5 text-on-surface-variant border-white/10 hover:border-primary'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Results */}
      <motion.section variants={itemVariants} className="px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary">
              Salons Near {initialArea || 'PECHS'}
            </h2>
            <p className="text-on-surface-variant font-body-md">
              {filteredSalons.length} premium grooming spots found in your area
            </p>
          </div>
          <div className="flex gap-sm">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl ${
                view === 'grid'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container border border-white/10 text-primary'
              }`}
            >
              <MdGridView className="text-xl" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-xl ${
                view === 'list'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container border border-white/10 text-primary'
              }`}
            >
              <MdFormatListBulleted className="text-xl" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-xl">
            <Loader variant="spinner" className="text-primary w-8 h-8" />
          </div>
        ) : filteredSalons.length === 0 ? (
          <EmptyState
            icon={MdLocationOn}
            title="No salons found nearby"
            description="Try widening your search area, clearing filters, or checking back later as more salons join GlowCut."
          />
        ) : (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-lg' : 'space-y-lg'}>
            {filteredSalons.map((salon) => {
              const id = salon._id || salon.id;
              const areaLabel = salon.address
                ? [salon.address.area, salon.address.city].filter(Boolean).join(', ')
                : salon.area || 'Location unavailable';
              const rating = salon.averageRating ?? salon.rating ?? 0;
              const image = salon.coverImage || salon.logo || salon.image || 'https://via.placeholder.com/600x400?text=GlowCut';
              return (
              <motion.div
                key={id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="bg-surface-container border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row group hover:border-primary/40 transition-all duration-500"
              >
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={salon.name}
                    src={image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20" />
                  {salon.isActive && (
                    <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md text-on-surface px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-primary/30">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Open Now
                    </div>
                  )}
                </div>

                <div className="md:w-2/3 p-lg flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-base">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                          {salon.name}
                        </h3>
                        <p className="flex items-center gap-xs text-on-surface-variant font-body-md">
                          <MdLocationOn className="text-primary text-lg" /> {areaLabel}
                        </p>
                      </div>
                      <div className="bg-primary/15 border border-primary/30 p-2 rounded-xl text-center">
                        <div className="text-primary font-bold text-headline-md leading-tight">
                          {rating.toFixed ? rating.toFixed(1) : rating}
                        </div>
                        <div className="text-[10px] text-primary uppercase tracking-widest font-bold">
                          Rating
                        </div>
                      </div>
                    </div>

                    {Array.isArray(salon.barbers) && salon.barbers.length > 0 && (
                      <div className="mt-lg">
                        <h4 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-md">
                          Top Stylists Available Today
                        </h4>
                        <div className="flex flex-wrap gap-md">
                          {salon.barbers.slice(0, 4).map((stylist) => (
                            <div
                              key={stylist._id}
                              className="flex items-center gap-sm bg-white/5 p-2 pr-4 rounded-full border border-white/5 hover:border-primary transition-all cursor-pointer"
                            >
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                                  {stylist.name?.[0] || '?'}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface" />
                              </div>
                              <div>
                                <p className="text-on-surface font-bold text-xs">{stylist.name}</p>
                                <p className="text-primary text-[10px] font-medium">
                                  {stylist.status === 'active' ? 'Available' : stylist.status}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-lg pt-lg border-t border-white/5">
                    <div className="flex gap-lg">
                      <div className="flex flex-col">
                        <span className="text-caption text-on-surface-variant">
                          Services listed
                        </span>
                        <span className="text-on-surface font-bold text-lg">
                          {salon.servicesCount ?? (salon.services?.length ?? 0)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-caption text-on-surface-variant">Barbers</span>
                        <span className="text-on-surface font-bold text-lg">
                          {salon.barbersCount ?? (salon.barbers?.length ?? 0)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/salons/${id}`)}
                      className="bg-primary text-on-primary font-headline-md text-label-md px-xl py-4 rounded-xl font-extrabold active:scale-95 transition-all shadow-warm uppercase tracking-tight"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </motion.div>
            );})}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
