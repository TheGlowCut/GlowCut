import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdSearch,
  MdCalendarToday,
  MdCreditCard,
  MdPhotoCamera,
  MdChat,
  MdExpandMore,
  MdSupportAgent,
} from 'react-icons/md';

const ISSUE_TILES = [
  {
    icon: MdCalendarToday,
    title: 'Booking Problems',
    description: 'Reschedule, cancel, or find your appointment details.',
  },
  {
    icon: MdCreditCard,
    title: 'Payment & Refunds',
    description: 'Billing inquiries, refund status, and secure payments.',
  },
  {
    icon: MdPhotoCamera,
    title: 'AI Camera Issues',
    description: 'Troubleshoot the virtual try-on and style scanner.',
  },
  {
    icon: MdChat,
    title: 'App Feedback',
    description: 'Help us evolve the experience.',
  },
];

const FAQS = [
  {
    question: 'How does the AI Style Consultant work?',
    answer:
      "Our AI uses advanced facial recognition and hair texture analysis via your mobile camera to suggest the most flattering GlowCut styles. It cross-references your bone structure with current trends.",
  },
  {
    question: 'Can I change my stylist after booking?',
    answer:
      "Yes, you can modify your stylist up to 12 hours before your appointment. Go to 'My Bookings' and select 'Change Stylist' to view other available professionals.",
  },
  {
    question: "What is the loyalty program?",
    answer:
      'Membership benefits include priority booking, discounts on premium services, and early access to new AI style filters.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HelpSupport() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

  const filteredTiles = useMemo(() => {
    if (!query.trim()) return ISSUE_TILES;
    return ISSUE_TILES.filter((t) =>
      `${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return FAQS;
    return FAQS.filter((f) =>
      `${f.question} ${f.answer}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <motion.main
      className="py-xl px-margin-mobile md:px-margin-desktop min-h-screen"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.08 } },
      }}
    >
      <motion.header
        variants={fadeUp}
        className="max-w-3xl mx-auto text-center mb-xl"
      >
        <h1 className="font-display-lg text-display-lg mb-md text-on-surface">
          Help &amp; Support
        </h1>
        <div className="relative group">
          <div className="absolute inset-y-0 left-md flex items-center pointer-events-none">
            <MdSearch className="text-primary" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container border border-white/10 focus:border-primary focus:ring-0 rounded-xl py-lg pl-xl pr-md text-body-lg font-body-lg transition-all duration-300 placeholder:text-on-surface-variant/50 text-on-surface"
            placeholder="How can we help you?"
            type="text"
          />
        </div>
      </motion.header>

      <motion.section variants={fadeUp} className="mb-xl">
        <h2 className="font-headline-md text-headline-md mb-lg text-primary">
          Common Issues
        </h2>
        {filteredTiles.length === 0 ? (
          <p className="text-on-surface-variant text-center">No matching topics found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {filteredTiles.map((tile, i) => {
              const Icon = tile.icon;
              return (
                <motion.div
                  key={tile.title}
                  className="glass-panel p-lg rounded-xl border border-white/5 hover:bg-white/5 transition-all duration-300 cursor-pointer group active:scale-95"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center mb-md border border-primary/20">
                    <Icon className="text-3xl text-primary" />
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-xs text-on-surface">{tile.title}</h3>
                  <p className="text-on-surface-variant text-caption font-caption leading-relaxed">
                    {tile.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="max-w-4xl mx-auto mb-xl"
      >
        <h2 className="font-headline-md text-headline-md mb-lg text-primary text-center">
          Frequently Asked Questions
        </h2>
        {filteredFaqs.length === 0 ? (
          <p className="text-on-surface-variant text-center">No matching questions found.</p>
        ) : (
          <div className="space-y-md">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={faq.question} className="glass-panel rounded-xl overflow-hidden border border-white/5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="w-full flex justify-between items-center p-md cursor-pointer hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="font-semibold text-body-lg text-on-surface">
                      {faq.question}
                    </span>
                    <MdExpandMore
                      className={`text-primary transition-transform flex-shrink-0 ml-md ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-md pt-0 border-t border-white/5 text-on-surface-variant font-body-md leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.section
        variants={fadeUp}
        className="flex flex-col items-center"
      >
        <button
          onClick={() => navigate('/support/chat')}
          className="relative bg-primary text-on-primary px-xl py-lg rounded-full font-bold text-headline-md flex items-center gap-sm active:scale-95 transition-all duration-300 shadow-warm"
        >
          <MdSupportAgent className="text-3xl" />
          Chat with Live Support
        </button>
      </motion.section>
    </motion.main>
  );
}
