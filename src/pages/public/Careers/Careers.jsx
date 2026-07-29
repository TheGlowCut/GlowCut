import React from 'react';
import toast from 'react-hot-toast';
import { MdWork, MdArrowForward, MdLocationOn } from 'react-icons/md';

const JOBS = [
  {
    title: 'Senior Hair Stylist',
    department: 'Salon Operations',
    location: 'Karachi, PK (On-site)',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Manager',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Karachi, PK (Hybrid)',
    type: 'Full-time',
  },
];

export default function Careers() {
  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto font-body-md text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative h-[200px] md:h-[400px] w-full overflow-hidden rounded-2xl mb-xl">
        <img
          alt="Careers at Glow Cut"
          className="w-full h-full object-cover opacity-50"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRwgRw9rJb1df1FSV7F08Kq__Y-Ue1DsjhgrcKemEgc_vjb4IWFzXFxer3GbLgvPjO1V5xyBduOBYE53DwSuI5g0Sep320kXD2fP8VnWhnArTCNwa-lez2bUG-FWgHvL28GG1po0RfmwWTdS7vwU4bv3XcMq2gQTs-nQuncMxcLhGI83alusMA5cMbfJX9Tdvdbl59gvK3ApFD26l_s8YRteG9CGhMFOvvCPA96A24ZaKq6dDoDE6k3XZJK-qqJugKtl1zkFx8eXo"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-10 left-10 md:left-20 max-w-2xl">
          <h1 className="font-display-lg text-display-lg text-gray-900 dark:text-white mb-4">Join Our Team</h1>
          <p className="text-gray-700 dark:text-gray-300 font-body-lg">
            Help us revolutionize the grooming industry with Cyber-Chic technology and premium service.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-3xl mx-auto text-center mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-4">Why Work With Us?</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          At Glow Cut, we're building the future of salon bookings. We combine high-end aesthetics with cutting-edge technology. Our team is passionate, diverse, and dedicated to elevating the everyday grooming experience into something extraordinary.
        </p>
      </section>

      {/* Open Positions */}
      <section>
        <h2 className="font-headline-lg text-headline-lg text-gray-900 dark:text-white mb-8 flex items-center gap-2">
          <MdWork className="text-secondary" /> Open Positions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {JOBS.map((job) => (
            <div key={job.title} className="glass-panel p-lg rounded-2xl border border-white/5 hover:border-secondary transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-headline-md text-headline-md text-gray-900 dark:text-white group-hover:text-secondary transition-colors">{job.title}</h3>
                  <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{job.department}</p>
                </div>
                <span className="bg-surface-container-high px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300">
                  {job.type}
                </span>
              </div>
              
              <div className="flex justify-between items-end mt-8 pt-4 border-t border-white/5">
                <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1 text-sm">
                  <MdLocationOn /> {job.location}
                </p>
                <button 
                  onClick={() => toast('Application portal opening soon!')}
                  className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-secondary group-hover:text-on-secondary transition-all shadow-sm"
                >
                  <MdArrowForward />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
