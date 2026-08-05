import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowForward, MdDownload } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import '../../../pages/home/Home/Home.css';

const FOOTER_LINKS = {
  Company: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms-of-service' },
    { label: 'Contact Us', to: '/contact-us' },
    { label: 'Careers', to: '/careers' },
  ],
};

const socialLinks = [
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'X', icon: FaXTwitter },
  { label: 'LinkedIn', icon: FaLinkedinIn },
];

function Brand() {
  return (
    <Link to="/" className="home-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function GoldButton({ children, onClick, className = '' }) {
  return (
    <button type="button" onClick={onClick} className={`home-gold-button ${className}`}>
      <span>{children}</span>
      <MdArrowForward aria-hidden="true" />
    </button>
  );
}

export default function HomeFooter({ showDownload = false }) {
  const navigate = useNavigate();

  return (
    <footer className="home-footer">
      <div className="home-shell">
        <div className="home-footer-grid">
          <div className="home-footer-cta">
            <h2>Are you ready to get started?</h2>
            <GoldButton onClick={() => navigate('/auth/signup')}>Get Started for free</GoldButton>
            {showDownload && (
              <a
                href="/app-release.apk"
                download="app-release.apk"
                className="home-download-app-footer"
              >
                <MdDownload />
                <span>Download Our App</span>
              </a>
            )}
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div className="home-footer-links" key={title}>
              <h3>{title}</h3>
              {links.map((link) => (
                <Link key={link.label} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="home-footer-bottom">
          <Brand />
          <div className="home-socials">
            {socialLinks.map(({ label, icon: Icon }) => (
              <a key={label} href="#" aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="home-copyright">Copyright 2026 Glow&Cut</div>
    </footer>
  );
}
