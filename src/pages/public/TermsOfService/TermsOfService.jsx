import React from 'react';
import { MdGavel, MdRule } from 'react-icons/md';

export default function TermsOfService() {
  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto font-body-md text-gray-900 dark:text-white">
      <header className="mb-xl text-center">
        <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mx-auto mb-6 border border-primary-container">
          <MdGavel className="text-3xl text-primary-container" />
        </div>
        <h1 className="font-display-lg text-display-lg text-gray-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-gray-700 dark:text-gray-300 font-label-md">Effective Date: July 28, 2026</p>
      </header>

      <article className="glass-panel p-lg md:p-xl rounded-2xl space-y-lg border-t-4 border-primary-container">
        <section>
          <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <MdRule className="text-primary-container" /> 1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            By accessing or using the Glow Cut platform (including our mobile app and website), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
          </p>
        </section>

        <section>
          <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-4">2. User Accounts</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            To use most features of Glow Cut, you must register for an account. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-4">3. Booking & Cancellations</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            When you book a service through Glow Cut, you enter into a direct agreement with the respective salon. Cancellations or rescheduling must be done in accordance with the specific salon's cancellation policy. Glow Cut reserves the right to suspend users who repeatedly no-show without prior notice.
          </p>
        </section>

        <section>
          <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-4">4. Payments</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            All payments made through the Glow Cut platform are securely processed. Prices for services are set by the individual salons and are subject to change. Any applicable tech fees or platform charges will be clearly displayed before you confirm your booking.
          </p>
        </section>
        
        <section>
          <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-4">5. Modifications to Service</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
          </p>
        </section>
      </article>
    </main>
  );
}
