import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdArrowBackIosNew,
  MdLocationOn,
  MdAddPhotoAlternate,
  MdMood,
  MdSend,
  MdSmartToy,
} from 'react-icons/md';
import Loader from '../../../components/ui/Loader';

const BARBER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCJTPCP8O6ZtCd3_CP4o6u_gOhHKd6LSq7ubUKYs7yLC8UY-BuhjLv7vLeyWf-dBea_-eKr4cFe1AacO1BJ0UD_liWhXSnlZsY_aYpgBxSJAvYNX9iYw3y-JEZ5N3gr7Ywmon1eqljk7dJ0GSjFwK-Ot4brmHUsY085zRQxdUQ_IjtHfW_VVhcCsIeShhfXe5S4LySjV9qAoxpWvjzRrCddK6F15S4mwVtJgEoOFnd9GgXhlojRoHMBrxINkMv3dvU85uNREWOYLjk';

// NOTE: the backend has no chat/messaging model or routes at all, so this
// screen is a simulated conversation for demonstrating the UI only — not
// real prior messages with any actual stylist. Consistent with the same
// decision made for the ShopkeeperDashboard chat panel.
const INITIAL_MESSAGES = [
  {
    id: 'm1',
    sender: 'user',
    text: "Hey Usman! Thinking about a change. What do you think would suit my face shape? I'm looking for something sharp but manageable.",
    time: '2:46 PM',
  },
  {
    id: 'm2',
    sender: 'barber',
    text: "Hey! Great to hear from you. I've just run your latest profile through our GlowCut AI analyzer. Here's what we've got:",
  },
  { id: 'm3', sender: 'ai-card' },
  {
    id: 'm4',
    sender: 'barber',
    text: 'With that sharp jawline, we should definitely keep the sides tight. Want to lock in a slot for this Friday?',
    time: '2:48 PM',
  },
];

function AIAnalysisCard() {
  return (
    <div className="max-w-[320px] w-full glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl">
      <div className="p-md bg-gradient-to-br from-secondary/20 to-transparent flex items-center gap-md border-b border-white/10">
        <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
          <MdSmartToy className="text-secondary" />
        </div>
        <div>
          <h3 className="font-label-md text-label-md text-secondary uppercase tracking-widest">
            AI Analysis
          </h3>
          <p className="text-caption font-caption text-on-surface-variant">Optimal Selection Found</p>
        </div>
      </div>
      <div className="p-md space-y-md">
        {[
          ['Face Shape', 'Oval'],
          ['Hair Density', 'High'],
          ['Jawline', 'Sharp'],
        ].map(([label, value]) => (
          <div className="flex justify-between items-center" key={label}>
            <span className="text-body-md text-on-surface-variant">{label}</span>
            <span className="px-sm py-1 bg-surface-container-highest rounded text-label-md text-on-surface border border-white/10">
              {value}
            </span>
          </div>
        ))}
        <div className="pt-sm mt-sm border-t border-white/5">
          <p className="text-caption font-caption text-secondary">
            Recommended: Textured Quiff with Mid-Fade
          </p>
        </div>
      </div>
      <img
        alt="Style Recommendation"
        className="w-full h-40 object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHvDTLq3idVV5hutwNcxZ_SIerid2gDQPvqaxFVqO9axdEgnnde5S-9GNIOo1wbHoLl8k1r0YkrGeyy3iYxZL0a1aPB7cOzfWAhWMnHlPgbKKCP9ceFiD2UWQI8ekymr9mE6YsLX7qyYoGpa3XghdVeGPibn89zJJoF3qnM_8DpRgFIkRcL3X6TzKbuXrfXcLuzFREE_UoatSrELGl8iiMjndVYeNLEePpLKfWkqGgYC49de_X_-LAtasRztVrSjecy6Cw5SgORmU"
      />
    </div>
  );
}

export default function LiveChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [barberTyping, setBarberTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, barberTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setDraft('');

    setBarberTyping(true);
    setTimeout(() => {
      setBarberTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'barber',
          text: "Sounds great — I'll pencil that in. See you soon!",
          time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
      ]);
    }, 1800);
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_8px_rgba(255,181,156,0.15)]">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate(-1)}>
            <MdArrowBackIosNew className="text-primary cursor-pointer active:scale-95 transition-transform" />
          </button>
          <div className="flex items-center gap-sm">
            <div className="relative">
              <img alt="Usman" className="w-12 h-12 rounded-full border border-white/10 object-cover" src={BARBER_AVATAR} />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-secondary border-2 border-surface rounded-full shadow-[0_0_4px_rgba(102,221,139,0.4)]" />
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-sora text-on-surface tracking-tight leading-none">
                Usman
              </h1>
              <div className="flex items-center gap-xs mt-1">
                <MdLocationOn className="text-[14px] text-on-surface-variant" />
                <span className="text-caption font-caption text-on-surface-variant">
                  Modern Cuts PECHS
                </span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/booking/confirm')}
          className="bg-primary text-on-primary font-sora font-bold px-md py-sm rounded-lg shadow-warm-sm active:scale-95 transition-all"
        >
          Book Now
        </button>
      </header>

      {/* Chat Body */}
      <main className="flex-grow pt-24 pb-32 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto w-full flex flex-col gap-lg">
        <div className="flex justify-center">
          <span className="px-md py-xs bg-surface-container-high/40 rounded-full text-caption font-caption text-on-surface-variant backdrop-blur-sm border border-white/5">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          if (msg.sender === 'ai-card') {
            return (
              <div className="flex justify-start" key={msg.id}>
                <AIAnalysisCard />
              </div>
            );
          }
          const isUser = msg.sender === 'user';
          return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} key={msg.id}>
              <div
                className={`max-w-[80%] px-md py-sm rounded-2xl font-body-md ${
                  isUser
                    ? 'rounded-tr-xs glass-card border border-primary/40 text-on-surface'
                    : 'rounded-tl-xs bg-on-secondary-fixed-variant/40 border border-secondary/30 backdrop-blur-md text-on-surface'
                }`}
              >
                <p>{msg.text}</p>
                {msg.time && (
                  <span
                    className={`block text-[10px] mt-2 ${
                      isUser ? 'text-on-surface-variant text-right' : 'text-secondary/60'
                    }`}
                  >
                    {msg.time}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {barberTyping && (
          <div className="flex justify-start">
            <div className="px-md py-sm rounded-2xl rounded-tl-xs bg-on-secondary-fixed-variant/40 border border-secondary/30 backdrop-blur-md">
              <Loader variant="dots" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-16 md:bottom-0 left-0 w-full p-md z-40 bg-gradient-to-t from-background via-background to-transparent"
      >
        <div className="max-w-4xl mx-auto flex items-center gap-sm">
          <div className="flex-grow flex items-center glass-card rounded-full px-md py-xs border border-white/10 focus-within:border-primary/50 transition-all">
            <button type="button" className="text-on-surface-variant hover:text-primary transition-colors p-sm">
              <MdAddPhotoAlternate />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-on-surface w-full font-body-md px-sm py-sm placeholder-on-surface-variant/50"
              placeholder="Type your message..."
              type="text"
            />
            <button type="button" className="text-on-surface-variant hover:text-primary transition-colors p-sm">
              <MdMood />
            </button>
          </div>
          <button
            type="submit"
            className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-on-secondary shadow-warm-sm active:scale-90 transition-all flex-shrink-0"
          >
            <MdSend />
          </button>
        </div>
      </form>
    </div>
  );
}
