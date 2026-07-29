import React from 'react';
import { MdShield, MdOutlineSecurity, MdOutlineShare, MdOutlineManageAccounts } from 'react-icons/md';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    icon: MdShield,
    title: '1. Information We Collect',
    text: 'At Glow Cut, we prioritize the protection of your personal data. We collect information you provide directly to us when you create an account, book a service, or communicate with us. This includes your name, email address, phone number, payment details, and any stylistic preferences or appointment history you choose to save in your profile.',
  },
  {
    icon: MdOutlineSecurity,
    title: '2. How We Use Your Data',
    text: 'We use the information we collect to process and manage your salon bookings and transactions, provide personalized styling recommendations via our AI Consultant, communicate with you regarding updates, promotions, and scheduling changes, and improve the functionality and security of the Glow Cut platform.',
    list: [
      'Process and manage your salon bookings and transactions.',
      'Provide personalized styling recommendations via our AI Consultant.',
      'Communicate with you regarding updates, promotions, and scheduling changes.',
      'Improve the functionality and security of the Glow Cut platform.',
    ],
  },
  {
    icon: MdOutlineShare,
    title: '3. Data Sharing & Security',
    text: 'We do not sell your personal information. We share your booking details only with the specific salons and stylists you choose to book with. All data is encrypted at rest and in transit using industry-standard security protocols to ensure your Cyber-Chic grooming experience remains entirely confidential.',
  },
  {
    icon: MdOutlineManageAccounts,
    title: '4. Your Privacy Rights',
    text: 'You have the right to access, correct, or delete your personal data at any time. You can manage your preferences directly through your Profile Settings or by contacting our data protection officer at privacy@glowcut.com.',
    email: 'privacy@glowcut.com',
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 border border-primary/30">
          <MdShield className="text-3xl text-primary" />
        </div>
        <h1 className="font-display-lg text-display-lg text-gray-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-700 dark:text-gray-300 font-label-md">Last Updated: July 28, 2026</p>
      </motion.header>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-surface-container/60 backdrop-blur-2xl p-lg md:p-xl rounded-2xl border border-primary/10 border-t-4 border-t-primary shadow-soft hover:shadow-warm transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="text-2xl text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {section.text}
                  </p>
                  {section.list && (
                    <ul className="space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.email && (
                    <span className="inline-block mt-2 text-primary font-bold">
                      {section.email}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
