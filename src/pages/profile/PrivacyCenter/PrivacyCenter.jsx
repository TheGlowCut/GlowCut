import React, { useState } from 'react';
import {
  MdGavel,
  MdSecurity,
  MdAssignmentReturn,
  MdPsychology,
  MdVerifiedUser,
  MdCheckCircle,
  MdLock,
} from 'react-icons/md';
import Modal from '../../../components/ui/Modal';

const LEGAL_SECTIONS = [
  {
    icon: MdGavel,
    title: 'Terms of Service',
    summary:
      'Comprehensive guidelines governing the use of GlowCut platforms, including user obligations, intellectual property rights, and platform conduct standards.',
    fullText:
      'By using GlowCut, you agree to book services in good faith, treat stylists and staff with respect, and provide accurate booking information. GlowCut reserves the right to suspend accounts that violate platform conduct standards, including no-shows, abusive behavior, or fraudulent payment activity. All content submitted (reviews, photos) grants GlowCut a non-exclusive license to display it within the app.',
  },
  {
    icon: MdSecurity,
    title: 'Privacy Policy',
    summary:
      'How we protect, manage, and process your personal information. We prioritize your anonymity and utilize enterprise-grade encryption protocols.',
    fullText:
      'GlowCut collects only the information needed to deliver bookings, AI style recommendations, and rewards: your name, contact details, booking history, and — if you opt in — facial mapping data for the AI Style Consultant. We never sell personal data to third parties. All data in transit and at rest is encrypted using industry-standard protocols.',
  },
  {
    icon: MdAssignmentReturn,
    title: 'Refund & Cancellation Rules',
    summary:
      'Protocol for booking modifications and transaction reversals. Clear timelines for stylist cancellations and client-side rescheduling.',
    fullText:
      'Clients may cancel or reschedule free of charge up to 4 hours before their appointment. Cancellations within 4 hours may incur a 20% service fee. If a stylist cancels, clients receive a full refund plus 100 bonus Style Points. Refunds are processed to the original payment method within 5-7 business days.',
  },
  {
    icon: MdPsychology,
    title: 'AI Data Usage Agreement',
    summary:
      'Specific protocols regarding how our style-matching AI utilizes facial mapping and preference history to curate your premium experience.',
    fullText:
      'The AI Style Consultant and AR Virtual Mirror process facial geometry locally on your device wherever possible. Aggregated, anonymized style-preference data may be used to improve recommendation accuracy across the platform. You can delete your facial mapping profile at any time from Profile Settings.',
  },
];

const TRUST_BADGES = [
  { icon: MdVerifiedUser, label: 'SSL Secured' },
  { icon: MdCheckCircle, label: 'Payment-Compliant' },
  { icon: MdLock, label: 'GDPR Aligned' },
];

export default function PrivacyCenter() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <main className="relative pt-8 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto pb-xl">
      {/* Header */}
      <div className="mb-xl text-center md:text-left">
        <h1 className="font-display-lg text-display-lg mb-sm text-on-surface">
          Legal &amp; Privacy Center
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Ensuring transparency, security, and digital integrity for every GlowCut experience.
          Review our standards of service and data governance.
        </p>
      </div>

      {/* Safe Container */}
      <div className="rounded-xl p-base md:p-md bg-surface-container-lowest/40 backdrop-blur-md border border-secondary/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {LEGAL_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="glass-panel rounded-xl p-md flex flex-col justify-between group hover:border-secondary/40 transition-all duration-300"
              >
                <div>
                  <div className="mb-md">
                    <Icon className="text-secondary text-4xl drop-shadow-[0_0_4px_rgba(102,221,139,0.25)]" />
                  </div>
                  <h2 className="font-headline-md text-headline-md mb-sm text-on-surface">
                    {section.title}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                    {section.summary}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection(section)}
                  className="w-fit font-label-md text-label-md px-md py-sm rounded-lg border border-secondary text-secondary hover:bg-secondary/10 transition-all"
                >
                  Read Full Version
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-xl pt-xl border-t border-white/5 flex flex-wrap justify-center gap-xl">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div className="flex items-center gap-sm" key={badge.label}>
                <Icon className="text-secondary" />
                <span className="font-label-md text-label-md text-on-surface uppercase tracking-widest">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!activeSection}
        onClose={() => setActiveSection(null)}
        title={activeSection?.title}
        size="lg"
      >
        <p className="text-on-surface-variant font-body-md leading-relaxed">
          {activeSection?.fullText}
        </p>
      </Modal>
    </main>
  );
}
