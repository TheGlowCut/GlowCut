import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdRocketLaunch, MdBugReport, MdLightbulb } from 'react-icons/md';

const UPDATES = [
  {
    tag: 'Latest Release',
    tagColor: 'secondary',
    dotColor: 'bg-primary shadow-warm-sm',
    title: 'Version 2.1: New AR Hair Filters Added',
    timeAgo: '2 days ago',
    description:
      'Experience the future of grooming with our enhanced facial mapping technology. Visualize thousands of hairstyles in real-time before you even sit in the chair.',
    cta: { label: 'Try Now', variant: 'primary', to: '/ai/ar-mirror' },
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCE-pcOsfvHYnw8olxJzxluyN3xGRwCIMNpHAyBFQ_8GWYtKSNOROXRZmuquLk6qD-YXOWCtAq7TD6URdKYnoVgfzYLTVGXIjOGNXxOU4oTwhRDlXPTSZT6fdNLQ6_jzsjEsiv-642LXz7hvygDe8toK5EHdNXHTmFyh3UkQjxa-m0y5R9Vh7P0kgQ6WRCq6cv_7fTMgv80lSdp9aCzbdB_9RGKJk4nojYIrDC2RgbNEqjOwIYLxhfbtXZJUM41cC-wTdA3QwCyORY',
  },
  {
    tag: 'City Expansion',
    tagColor: 'primary',
    dotColor: 'bg-secondary shadow-warm-sm',
    title: 'Version 2.0: Now live in North Nazimabad & Korangi',
    timeAgo: '1 week ago',
    description:
      "We've expanded our premium grooming fleet into North Nazimabad and Korangi. Karachi's finest stylists are now just a tap away in your neighborhood.",
    cta: { label: 'Book a Stylist', variant: 'secondary', to: '/salons/nearby' },
    cityImages: [
      {
        label: 'North Nazimabad',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA4L89jw2Mh8M5y_us79uHSiUugnPZmcsN8iVayFj0XJ0pdz0Psh8PWGXjNsrCJFx9AQ005Owk1nFkVxcW75EwiWTnRNXrvcIBA5WBTpuMS-Cvh6UoqxIMqVDCcpvGd8hBvP1S0z8_zyF16fcdSJqLRc7HmuRHkqnlnMrvwMWvaOuYQWTAxsHmzLCjGD8em7ZTSQkP7yIgh-HcLUTDEmLPD4hzWBPcEFcLDUSQMdk1BBmzaXJUIp_IM1IxM-0FrUzzY9knhH3iwihk',
      },
      {
        label: 'Korangi',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA-mRRIoLNr9HuvpdoTHOEm-77h7agNR-9Rs-hHXfbQjGPfmpCm6OGrRaO6IGyW2sp5z4hET7XeJTa69SsEEefaUAH4yDUISqOTSIYPnhFyUTwKsRQfpOGyigTDqBNhuUO8TjgGMGsM3fOBqPAl3E51bWGSvWLLCxeIr2LB3glIviAc_CqhtebRa5f6wXRhPX3p0_WkC2_I55zqBTd5l0JIttah6rXPclMIpt6paTdKx166Iye7AwQzsTnPBZFFgNzsdoB2eVAvIpc',
      },
    ],
  },
  {
    tag: 'Optimization',
    tagColor: 'tertiary',
    dotColor: 'bg-surface-variant',
    title: 'Version 1.9: Faster Booking Logic',
    timeAgo: '2 weeks ago',
    description:
      'Our scheduling engine has been completely rebuilt. Bookings are now 40% faster with intelligent stylist matching based on your location and hair profile.',
    cta: { label: 'Learn More', variant: 'outline' },
  },
];

export default function Updates() {
  const navigate = useNavigate();

  const handleCta = (cta) => {
    if (cta.to) {
      navigate(cta.to);
    } else {
      toast('More details coming soon!');
    }
  };

  return (
    <main className="pt-24 px-margin-mobile max-w-7xl mx-auto lg:px-margin-desktop pb-32">
      {/* Hero */}
      <section className="flex flex-col items-center text-center mb-xl">
        <div className="relative w-32 h-32 mb-md">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative z-10 flex items-center justify-center h-full w-full">
            <MdRocketLaunch className="text-[40px] md:text-[64px] text-primary drop-shadow-[0_0_6px_rgba(255,181,156,0.3)]" />
          </div>
        </div>
        <h1 className="font-display-lg text-display-lg text-primary mb-xs">What's New</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          Fresh updates to keep your style ahead of the curve.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative">
        {/* Timeline */}
        <div className="lg:col-span-8 relative">
          <div className="absolute left-6 top-4 bottom-0 w-px bg-white/10 opacity-30 hidden md:block" />

          {UPDATES.map((update, i) => (
            <div
              className={`relative pl-0 md:pl-16 group ${
                i === UPDATES.length - 1 ? 'mb-xl' : 'mb-lg'
              }`}
              key={update.title}
            >
              <div
                className={`absolute left-4 top-4 w-4 h-4 rounded-full hidden md:block z-10 ${update.dotColor}`}
              />
              <div className="glass-card rounded-xl p-md transition-all duration-300 hover:translate-x-1">
                <div className="flex justify-between items-start mb-sm gap-md">
                  <div>
                    <span
                      className={`font-label-md text-label-md uppercase tracking-widest mb-1 block ${
                        update.tagColor === 'secondary'
                          ? 'text-secondary'
                          : update.tagColor === 'primary'
                          ? 'text-primary'
                          : 'text-tertiary'
                      }`}
                    >
                      {update.tag}
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-background mb-1">
                      {update.title}
                    </h2>
                  </div>
                  <span className="bg-surface-container px-3 py-1 rounded-full text-caption border border-white/5 whitespace-nowrap">
                    {update.timeAgo}
                  </span>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant mb-md leading-relaxed">
                  {update.description}
                </p>

                {update.cityImages && (
                  <div className="grid grid-cols-2 gap-sm mb-md">
                    {update.cityImages.map((city) => (
                      <div
                        key={city.label}
                        className="relative h-24 rounded-lg overflow-hidden border border-white/5"
                      >
                        <img
                          className="w-full h-full object-cover grayscale opacity-50"
                          alt={city.label}
                          src={city.image}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                          <span className="text-caption font-bold">{city.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleCta(update.cta)}
                    className={`px-6 py-2 rounded-full font-label-md text-label-md font-bold active:scale-95 transition-transform ${
                      update.cta.variant === 'primary'
                        ? 'bg-primary text-on-primary-container shadow-warm'
                        : update.cta.variant === 'secondary'
                        ? 'bg-secondary text-on-secondary-fixed shadow-warm'
                        : 'border border-secondary text-secondary hover:bg-secondary/10'
                    }`}
                  >
                    {update.cta.label}
                  </button>
                  {update.thumbnail && (
                    <img
                      className="w-12 h-12 rounded-lg object-cover border border-white/10"
                      alt="Preview"
                      src={update.thumbnail}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="glass-card rounded-2xl p-md mb-md border border-primary/20 bg-gradient-to-br from-surface-container-high/40 to-surface-container/20">
              <div className="flex items-center gap-3 mb-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background">
                  Developer's Note
                </h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md italic">
                "Our vision for GlowCut has always been about more than just a haircut. It's
                about the intersection of human artistry and futuristic technology."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/40">
                  <img
                    className="w-full h-full object-cover"
                    alt="GlowCut Team"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7aIu0ucqK3FO14bgRCT-PFvgTKNw5oRvF9gtmz2de0gwzaDtTAuyUYCWjG1MMJTvia5pcIp32WZHcamsJOo3dHyAeglvtYY4TNKiCniSMzkSOkskSJ_-uT-BYqL7BrX6OOQoI32pmiorLg51mBp8x-IM0cAymYgb_VLLo5znaixxgn1xM2NHWWebaSaWejuiPPExa_8_8GfE4fm7DmzWI7F_Zw9LxiVoY1ViRSHkLbdy6UXGlkdrEBUKXQ4vogatUPMEiQbZGB2M"
                  />
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-background">
                    The GlowCut Team
                  </p>
                  <p className="text-caption text-primary">Core Engineering</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-sm">
              <button
                onClick={() => toast('Bug report form coming soon')}
                className="glass-card rounded-xl p-sm flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <MdBugReport className="text-secondary mb-2 text-2xl" />
                <p className="font-label-md text-label-md">Report Bug</p>
              </button>
              <button
                onClick={() => toast('Feature suggestion form coming soon')}
                className="glass-card rounded-xl p-sm flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <MdLightbulb className="text-primary mb-2 text-2xl" />
                <p className="font-label-md text-label-md">Suggest Feature</p>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
