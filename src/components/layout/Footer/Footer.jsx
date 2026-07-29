import React from 'react';
import { Link } from 'react-router-dom';
import { MdLanguage, MdShare } from 'react-icons/md';

const FOOTER_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Contact Us', to: '/contact-us' },
  { label: 'Careers', to: '/careers' },
];

export default function Footer() {
  return (
    <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop bg-[#FFF4EE] border-t border-primary/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-lg items-start">
        <div className="flex flex-col items-center md:items-start gap-base">
          <div className="flex items-center gap-base">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full" />
              <div className="absolute inset-0 border border-primary/40 rounded-full" />
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary">
              GlowCut
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant opacity-80 max-w-xs text-center md:text-left">
            © 2024 GlowCut Premium Salons. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-xl">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center md:justify-end gap-md">
          <button
            aria-label="Language"
            className="text-on-surface-variant hover:text-primary transition-all"
          >
            <MdLanguage className="text-xl" />
          </button>
          <button
            aria-label="Share"
            className="text-on-surface-variant hover:text-primary transition-all"
          >
            <MdShare className="text-xl" />
          </button>
        </div>
      </div>
    </footer>
  );
}
