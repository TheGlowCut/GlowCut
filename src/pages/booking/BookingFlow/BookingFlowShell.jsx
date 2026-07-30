import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowForward, MdCalendarToday, MdCreditCard, MdPersonOutline } from 'react-icons/md';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import { FOOTER_LINKS, NAV_LINKS, SOCIAL_LINKS } from './bookingFlowUtils';
import './BookingFlow.css';

const STEP_ICONS = {
  service: MdPersonOutline,
  datetime: MdCalendarToday,
  confirm: MdCreditCard,
};

const STEP_LABELS = {
  service: 'Service',
  datetime: 'Date & Time',
  confirm: 'Confirm',
};

function Brand() {
  return (
    <Link to="/" className="booking-flow-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

function BookingFooter() {
  return (
    <footer className="booking-flow-footer">
      <div className="booking-flow-footer-surface">
        <div className="booking-flow-shell booking-flow-footer-grid">
          <div className="booking-flow-footer-cta">
            <h2>Are you ready to<br />get started?</h2>
            <Link to="/auth/signup">
              Get Started for free <MdArrowForward />
            </Link>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div className="booking-flow-footer-links" key={title}>
              <h3>{title}</h3>
              {links.map((link) => (
                <Link key={link.label} to={link.to}>{link.label}</Link>
              ))}
            </div>
          ))}

          <div className="booking-flow-footer-brand"><Brand /></div>
          <div className="booking-flow-socials">
            {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
              <a href="#" aria-label={label} key={label} onClick={(event) => event.preventDefault()}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div className="booking-flow-copyright">2026 Glow&Cut</div>
      </div>
    </footer>
  );
}

function Stepper({ currentStep }) {
  const steps = ['service', 'datetime', 'confirm'];

  return (
    <div className="booking-flow-stepper" aria-label="Booking progress">
      {steps.map((step, index) => {
        const state =
          steps.indexOf(currentStep) > index ? 'complete' : step === currentStep ? 'active' : 'idle';
        const Icon = STEP_ICONS[step];
        return (
          <React.Fragment key={step}>
            <div className={`booking-flow-step booking-flow-step-${state}`}>
              <span className="booking-flow-step-icon"><Icon /></span>
              <span>{STEP_LABELS[step]}</span>
            </div>
            {index < steps.length - 1 && <i className={state !== 'idle' ? 'active' : ''} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function BookingFlowShell({ currentStep, title, children }) {
  const navigate = useNavigate();

  return (
    <div className="booking-flow-page">
      <header className="booking-flow-shell booking-flow-header">
        <Brand />
        <nav className="booking-flow-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className={link.label === 'Stylists & Offers' ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="booking-flow-header-cta" onClick={() => navigate('/services')}>
          Book Now <MdArrowForward />
        </button>
      </header>

      <main className="booking-flow-shell booking-flow-main">
        <section className="booking-flow-hero">
          <span className="booking-flow-eyebrow">- BOOKING</span>
          <h1>
            Reserve your <em>visit</em>
          </h1>
          <p>Complete your booking in three simple steps.</p>
        </section>

        <Stepper currentStep={currentStep} />

        <section className="booking-flow-card-wrap">
          <article className="booking-flow-card">
            <h2>{title}</h2>
            {children}
          </article>
        </section>
      </main>

      <BookingFooter />
    </div>
  );
}
