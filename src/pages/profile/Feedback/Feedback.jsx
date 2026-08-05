import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdStar, MdStore, MdVerified, MdPhotoCamera } from 'react-icons/md';
import { useBooking } from '../../../hooks/useBooking';
import apiClient from '../../../services/apiClient';
import * as bookingService from '../../../services/bookingService';

// The Review model only stores `rating` + `comment` (see review.model.js) —
// there's no tags field on the backend, so selected tags are folded into
// the comment text on submit rather than sent as a separate field.
const TAGS = ['Professional', 'Clean Environment', 'Great Fade', 'On Time'];

export default function Feedback() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const createdBooking = booking.createdBookings?.[0];
  const barber = createdBooking?.barberId || booking.stylist;
  const salon = createdBooking?.salonId || booking.salon;

  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (!barber?._id && !barber?.id) {
      toast.error('No completed booking found to review.');
      return;
    }
    if (!createdBooking?._id) {
      toast.error('This page only supports reviewing a booking you just completed.');
      return;
    }

    setSubmitting(true);
    try {
      // Backend only allows reviewing bookings with status === 'completed',
      // so verify the live status first for a clear error instead of a
      // confusing 403 from the API.
      const liveBooking = await bookingService.getBookingStatus(createdBooking._id);
      if (liveBooking.status !== 'completed') {
        toast.error('This booking is not marked completed by the salon yet.');
        setSubmitting(false);
        return;
      }

      const comment = [selectedTags.join(', '), reviewText].filter(Boolean).join(' — ');
      await apiClient.post('/reviews', {
        barber: barber._id || barber.id,
        booking: createdBooking._id,
        rating,
        comment,
      });
      toast.success('Thanks for your feedback!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Could not submit your review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const displayRating = hoverRating || rating;

  return (
    <main className="max-w-screen-md mx-auto px-margin-mobile py-xl md:px-lg flex flex-col items-center min-h-screen">
      {/* Celebration */}
      <section className="text-center mb-xl relative w-full flex flex-col items-center pt-10">
        <h1 className="text-4xl font-serif text-secondary mb-xs relative z-10">
          Service Completed!
        </h1>
        <p className="text-sm font-sans text-[#A1A1AA] max-w-md">
          Your fresh new look is ready. We'd love to hear how we did.
        </p>
      </section>

      {/* Barber Card */}
      <div className="glass-card w-full p-md rounded-xl flex items-center gap-md mb-lg">
        <div className="relative">
          <img
            alt={barber?.name || 'Stylist'}
            className="w-16 h-16 rounded-full object-cover border-2 border-secondary bg-[#111111]"
            src={barber?.profileImage || 'https://via.placeholder.com/150?text=?'}
          />
          <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-0.5 border-2 border-background flex items-center justify-center">
            <MdVerified className="text-[12px] text-on-secondary" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-serif text-white">{barber?.name || 'Your stylist'}</h2>
          <div className="flex items-center gap-xs">
            <MdStore className="text-secondary text-sm" />
            <p className="text-sm font-sans font-bold text-[#A1A1AA]">
              {salon?.name || 'GlowCut Salon'}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Module */}
      <section className="w-full text-center mb-lg">
        <h3 className="text-sm font-sans font-bold text-[#E4B56C] uppercase tracking-[0.2em] mb-md">
          Rate Your Experience
        </h3>
        <div className="flex justify-center gap-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`transition-transform active:scale-90 ${
                star <= displayRating ? 'text-[#E4B56C] shadow-[0_0_10px_rgba(228,181,108,0.2)]' : 'text-[#E4B56C]/30'
              }`}
            >
              <MdStar className="text-[48px]" />
            </button>
          ))}
        </div>
      </section>

      {/* Tag Selection (folded into the comment on submit) */}
      <section className="w-full mb-lg">
        <p className="text-sm font-sans font-bold text-[#A1A1AA] mb-sm text-center">
          Tag Your Experience
        </p>
        <div className="flex flex-wrap justify-center gap-sm">
          {TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-md py-sm rounded-full font-bold transition-colors border ${
                  isSelected
                    ? 'border-[#E4B56C] text-[#E4B56C] bg-[#E4B56C]/10'
                    : 'border-white/10 text-[#A1A1AA] hover:bg-white/5'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* Review Text */}
      <section className="w-full mb-lg">
        <div className="glass-card rounded-xl p-0.5 group focus-within:ring-2 ring-primary/50 transition-all">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full h-32 bg-transparent border-none focus:ring-0 text-white text-sm font-sans p-md placeholder:text-[#A1A1AA]/50 resize-none"
            placeholder="Tell others about your experience..."
          />
        </div>
      </section>

      {/* Selfie Upload — no backend support for review photos yet */}
      <section className="w-full mb-xl">
        <button
          onClick={() => toast('Photo upload coming soon!')}
          className="w-full glass-card border-dashed border-2 border-white/20 p-lg rounded-xl flex flex-col items-center gap-sm group hover:border-secondary transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-[#222222] flex items-center justify-center text-[#A1A1AA] group-hover:text-secondary group-hover:bg-secondary/10 transition-colors">
            <MdPhotoCamera className="text-[32px]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-sans font-bold text-white">Upload your New Look</p>
            <p className="font-caption text-caption text-[#A1A1AA] mt-1">
              Show off the results to the community
            </p>
          </div>
        </button>
      </section>

      {/* Primary Action */}
      <div className="w-full flex flex-col gap-md">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-secondary-container text-on-secondary-container text-xl font-serif py-md rounded-xl shadow-[0_0_10px_rgba(228,181,108,0.2)] active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            'Submit Review'
          )}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-[#A1A1AA] font-bold py-base hover:text-white transition-colors"
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}
