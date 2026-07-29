import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdMail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all required fields.');
      return;
    }
    // Dummy submit
    toast.success('Message sent! Our support team will get back to you shortly.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto font-body-md text-gray-900 dark:text-white">
      <header className="mb-xl text-center max-w-2xl mx-auto">
        <h1 className="font-display-lg text-display-lg text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-gray-700 dark:text-gray-300 font-body-lg">
          Need help with your booking or have a question about Glow Cut? We're here to assist you 24/7.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Contact Info */}
        <aside className="lg:col-span-5 space-y-md">
          <div className="glass-panel p-lg rounded-2xl border-t-4 border-secondary hover:shadow-warm-sm transition-all">
            <h3 className="font-headline-md text-headline-md text-gray-900 dark:text-white mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                  <MdMail className="text-secondary text-xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Email Support</p>
                  <p className="text-gray-700 dark:text-gray-300">support@glowcut.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                  <MdPhone className="text-secondary text-xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Phone</p>
                  <p className="text-gray-700 dark:text-gray-300">+92 (300) 123-4567</p>
                  <p className="text-caption text-secondary">Mon-Fri, 9am - 6pm PKT</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                  <MdLocationOn className="text-secondary text-xl" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Headquarters</p>
                  <p className="text-gray-700 dark:text-gray-300">Glow Cut Tower, Main Boulevard<br/>PECHS, Karachi</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="glass-panel p-lg md:p-xl rounded-2xl space-y-6 border border-white/5">
            <h3 className="font-headline-md text-headline-md text-gray-900 dark:text-white mb-2">Send us a Message</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-caption uppercase tracking-widest text-gray-700 dark:text-gray-300">Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-caption uppercase tracking-widest text-gray-700 dark:text-gray-300">Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption uppercase tracking-widest text-gray-700 dark:text-gray-300">Subject</label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption uppercase tracking-widest text-gray-700 dark:text-gray-300">Message *</label>
              <textarea 
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-secondary transition-colors resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-secondary text-on-secondary font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-warm-sm"
            >
              <MdSend /> SEND MESSAGE
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
