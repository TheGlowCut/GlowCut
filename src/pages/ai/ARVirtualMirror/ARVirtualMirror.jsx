import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MdAccountCircle,
  MdSettings,
  MdCompareArrows,
  MdCameraAlt,
  MdVisibility,
  MdContentCut,
  MdAutoAwesome,
  MdAutoStories,
} from 'react-icons/md';

const STYLES = [
  {
    name: 'Textured Fade',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmjhpN1EUB0JmilErngGbIbrQ3R6Hu8WKeEfWOI-L-RTifBsqvwtrsPDauhR_i5lG2RbzWpXna_ai8Y6Hq2Bkmqpm9XXAEE2VmvhCrBRySU0WdaFG1oseXapuAbvuZpDajDmSKcgWGS-NZ050wabuWSbELLmpiDckZOcwgGIj9R1OD6EYHxcHjLhauW5Z33USFBNZ56hu35RgihrSSa9lFbgWDqSe6b54ydmmLb9Z_f0iiColKGVYoazAV-E3P5JuKcpFdOumga-E',
  },
  {
    name: 'Pompadour',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCDIbSPIEdAZ3gIlxXH8xF5pef5yHJwEsiq2MF2teAuS4I3mQmmVrxrU3OwrD9sTryFf04rjE40Q0v8vC_rJOZVVAp_sCRBb0bxAFqa43vSq93jSnoiHfhUaIoU4xf8MSG0RRuzFadR5u_xlaRwBrfG9vbnUp047PXhKfJ_8FQlZZQIJLCa48H7q0qMTISpDdxD43GTgyobxF09v6DPUBd1ObOjWIacQBiQ5aSH-DiDKDBjxUlmpEfM2eDjJtLN2jEySCrJF5rYOGc',
  },
  {
    name: 'Buzz Cut',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6m3m14N8h4tEcvP22Zy6tISF-ZDVpIRsgfsV2lS6OH27wxp5bMRvpLM-8eT0cGpF3nW7ADUhmcctDWd222pbuypUcW6JxO-00XFsOFUaolwE2qqOhlirmhh6olu3_Xf51yUooV1kJtdClOpSaSywg2DqxQYKTkP_N7i-Mb14jOzF_fQuzXzxkFLBS2tWGWcX3_qJOTbAvUBhGl0_ywWKPxqcOrvmunxSkcAI4xBF_11n54CXr5mpu_lpPIMNCnKeUyZ0q5JAe6G8',
  },
  {
    name: 'Undercut',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1rw6GQdpPpEaqN-P6076tOzoDFtYA6DyKqakAvMxjkYvlfi_MmlrbcmeK3Vh4VCmKxtm0C10NbrvxJDxf0RdEkWhuU5JUMCgJXDeIECOxGrv3WCPns8-mxlEQ_46ALQLxJxWhL8lM1FDbk3GtdLy7-GazVm8IEF0OGvYdjk8AdpigcRAGQwSO1DD03ieZ5mXdfHwV0-hzwpNcYEp0fsE2mcyMnNNi272na2PV0QYsH5ezS0UEHG7_J4ux4xCz4LxRhwRYNAJ3NYw',
  },
];

const NAV_ITEMS = [
  { label: 'AR Mirror', icon: MdVisibility, active: true },
  { label: 'Stylists', icon: MdContentCut, to: '/stylists' },
  { label: 'Services', icon: MdAutoAwesome, to: '/services' },
  { label: 'Gallery', icon: MdAutoStories, to: '/salons/style-gallery' },
];

export default function ARVirtualMirror() {
  const navigate = useNavigate();
  const [activeStyle, setActiveStyle] = useState(STYLES[0].name);
  const [length, setLength] = useState(70);
  const [showBefore, setShowBefore] = useState(false);

  const handleCapture = () => {
    toast.success(`Captured "${activeStyle}" look — taking you to booking`);
    navigate('/salons/nearby');
  };

  return (
    <div className="fixed inset-0 bg-background text-on-surface font-body-md overflow-hidden h-screen w-screen flex flex-col z-[200]">
      {/* AR Viewport */}
      <div className="fixed inset-0 z-0">
        <img
          className={`w-full h-full object-cover transition-all duration-500 ${
            showBefore ? '' : 'grayscale-[0.2] brightness-75'
          }`}
          alt="AR preview"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGqWQ-yXWoOqYq-RnL1cVnjsnu5LJaWcxBnbQ5PAyN7OFyk_Itga5hXZXQI7L-w9ffEJyORyUTUpTf5J8t36JLHeQWq5hh84iYU7mRU5HKXa2dGN6Z4VlBH-f04mhVniAjsIHxJEtUjLdUZT7EEl94iil-tUU8jXBDml2VZNz1-WuZGRcLk2frluafnIjgX1uuOXAZrB1OEN7IoApas3XXMPPsv52VPOXznCfKJ5TTLJ-IPZXiCpdiKCLObfr7hPgaXGX3As6j6Q8"
        />
        {!showBefore && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-80 h-96">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-warm-sm mb-2" />
                <div className="h-16 w-[1px] bg-secondary opacity-50" />
                <span className="font-label-md text-secondary text-xs uppercase tracking-widest mt-1">
                  Precision Alignment
                </span>
              </div>
              <div className="absolute top-1/2 -right-12 flex items-center gap-4">
                <div className="text-right">
                  <span className="font-label-md text-secondary text-xs uppercase tracking-widest">
                    Face Tracking
                  </span>
                  <div className="text-[10px] text-secondary opacity-70">X: 142.4 | Y: 88.1</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-secondary shadow-warm-sm" />
                <div className="w-12 h-[1px] bg-secondary opacity-30" />
              </div>
              <div className="absolute inset-0 border border-white/10 rounded-3xl" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary/60 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary/60 rounded-br-3xl" />
            </div>
          </div>
        )}
      </div>

      {/* Top Nav */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile py-base md:px-margin-desktop backdrop-blur-xl bg-surface/30 shadow-[0px_0px_8px_rgba(255,181,156,0.15)]">
        <div className="font-display-lg text-display-lg font-bold text-primary tracking-tighter">
          NEON_GLANCE
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/profile')}>
            <MdAccountCircle className="text-primary text-3xl" />
          </button>
          <button>
            <MdSettings className="text-on-surface-variant hover:text-primary transition-colors text-3xl" />
          </button>
        </div>
      </header>

      {/* Content Overlays */}
      <main className="relative z-10 flex-1 flex flex-col justify-between p-margin-mobile pt-32 pb-40">
        {/* Recommendation */}
        <div className="self-end">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-4 max-w-[260px]">
            <div className="w-12 h-12 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Matte Styling Wax"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9tM_yjJrVx1sfvOXA-jdDQDBqXrnQVikMErFei4m9yBCxw6vP7IBkQw9d-K2BQweH3rL9Bg2obOua2FCnRzvTG9pjGGksFKqwVR4qa9fkPgbUPBBxWSGyixF96vrJ3zpW6bzIFG4Fk0FPDHaQmIUDQ80bVnb83AkB8IQDu2VXzPjjrrdKsD50Z5A7DUZ558eEfqkwXPdih5T8Zad3wTy_RgBRIj9of_cWOX-_UBsa8A1pnLMTYvbtpkHelIGLKkRBfbTU43tGTfo"
              />
            </div>
            <div>
              <h4 className="font-label-md text-on-surface text-xs mb-1">RECOMMENDED</h4>
              <p className="font-headline-md text-sm text-primary">Matte Styling Wax</p>
              <p className="text-[10px] text-on-surface-variant opacity-70">
                Perfect for the {activeStyle}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Controls */}
        <div className="flex justify-between items-center w-full mt-auto">
          <div className="flex flex-col items-center gap-6">
            <div className="h-48 w-12 glass-panel rounded-full flex flex-col items-center justify-center p-2">
              <input
                className="vertical-slider appearance-none h-32 w-1 bg-transparent -rotate-90 cursor-pointer accent-primary-container"
                max="100"
                min="1"
                type="range"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>
            <div className="text-center">
              <span className="font-label-md text-[10px] uppercase tracking-tighter text-on-surface-variant">
                Adjust Length
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => setShowBefore((v) => !v)}
              className={`glass-panel w-14 h-14 rounded-full flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 ${
                showBefore ? 'border-2 border-primary-container' : ''
              }`}
            >
              <MdCompareArrows className="text-on-surface" />
            </button>
            <div className="text-center">
              <span className="font-label-md text-[10px] uppercase tracking-tighter text-on-surface-variant">
                Before/After
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Shell */}
      <section className="fixed bottom-0 left-0 w-full z-50">
        {/* Carousel */}
        <div className="px-margin-mobile mb-6">
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {STYLES.map((style) => {
              const isActive = activeStyle === style.name;
              return (
                <button
                  key={style.name}
                  onClick={() => setActiveStyle(style.name)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 transition-opacity ${
                    isActive ? '' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-20 h-20 rounded-xl overflow-hidden p-1 ${
                      isActive
                        ? 'border-2 border-secondary shadow-warm-sm'
                        : 'border border-white/10'
                    }`}
                  >
                    <img className="w-full h-full object-cover rounded-lg" alt={style.name} src={style.image} />
                  </div>
                  <span
                    className={`font-label-md text-[10px] ${
                      isActive ? 'text-secondary' : 'text-on-surface-variant'
                    }`}
                  >
                    {style.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capture & Book */}
        <div className="flex justify-center mb-10">
          <button
            onClick={handleCapture}
            className="bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-headline-md shadow-warm flex items-center gap-3 active:scale-95 transition-transform"
          >
            <MdCameraAlt style={{ fontVariationSettings: "'FILL' 1" }} />
            Capture &amp; Book
          </button>
        </div>

        {/* Global Nav */}
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 backdrop-blur-2xl bg-surface/40 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.to && navigate(item.to)}
                className={`flex flex-col items-center justify-center transition-all duration-300 ease-out ${
                  item.active
                    ? 'text-primary drop-shadow-[0_0_4px_rgba(255,181,156,0.4)]'
                    : 'text-on-surface-variant opacity-70 hover:opacity-100 hover:text-primary'
                }`}
              >
                <Icon
                  className="text-2xl"
                  style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                />
                <span className="font-label-md text-label-md">{item.label}</span>
                {item.active && <div className="w-1 h-1 bg-primary rounded-full mt-1" />}
              </button>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
