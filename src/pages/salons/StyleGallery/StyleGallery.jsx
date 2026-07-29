import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CATEGORIES = ['Trending', 'Classic', 'Beard Styles', 'Fade Cuts', 'Cyberpunk', 'Long Hair'];

const STYLES = [
  {
    id: 1,
    salon: 'Modern Cuts PECHS',
    title: 'Neon Taper Fade',
    stylist: 'Alex Rivera',
    category: 'Fade Cuts',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHrXR65JUP7rGSUUOzK0GTsxjHuBZ5V-vPL4hhCXDKYg14H2657nPBe48XCaQubUy71eTfOBidRKc1MF-Q69h0vrsdGRqwYR2a8J2_hndmljAXaIxCv-zjA0NpyTfPPiRKoijf-lQnSxG-Kwi0ONjHZFBhzu8Yls06NvPLjB-0PSJjZC-pfqY2eByDfu8XLQPSnYt8PNJ3ZT41QXs6LrQwhJjv8QoU0tifbNuzxCzoIMQsR-YKP-zA7ERZcwCleHRYwgelkOty5OU',
  },
  {
    id: 2,
    salon: 'Urban Edge Studio',
    title: 'Cyber Pompadour',
    stylist: 'Marcus Chen',
    category: 'Trending',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5Z33tmwn2mqgP0DvEDBKhrl7XbfYooSiJNLfrmk22-QjZMwXDyfD3SC20LmDkKt7nea6r0NVivcSlv3qlCIM9t3YxxkOFU1lHht3nNk1uDw9uYtw8Pyn1JZGcRfcbN7GtZrRmw4PWEE8RmUU1GeLP7zjJjdaqbELvlda47kHAsBj831VVwd2NqePdxKLrzio6_oohK_j7h31N8v0IpV75YXyAhSmFO5V36YmCDAolsdIMAjiQtTNsunlAw7B0ifGaWvYZv5HYco4',
  },
  {
    id: 3,
    salon: 'The Chrome Lounge',
    title: 'Precision Edge Beard',
    stylist: 'Sarah Vance',
    category: 'Beard Styles',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD90wDO9-CdsYtOFlBv-4Fy-rSDsLjNRfijrlQ4VOxA4BbwHtTjH_6gZWCyZppCjUrHZD9j5_6uQ3XXnIPhbe9w1dyWuCy7z8D9fvQ_eCR3SdwDbLBuh8rzySgNuaeObI33UbKyhmcgM8-ER5iOYaz6rBd1cQGTW91uI9oVqeItUxaJ-uhYLGyttdEpQTIH08u84DagxSgxfbnPB3rel1YCPWuQWPNyPzt2CQ-OsR-wgIBxkEhqpCjl14EFM3I8oWyzGIgom19bBH4',
  },
  {
    id: 4,
    salon: 'Vivid Styles Lab',
    title: 'Geometric Buzz',
    stylist: 'Kai Suzuki',
    category: 'Cyberpunk',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-A1fs5YqOPogANpX1d3rz5nKCXSgefrlKkY_4nEm2no5XS9pnH1qJVU82jZlxaI-Mu5kDVzg6uFqZZzck_I9E_O4prS1NZOB_JBDr9R1_sGSN_cyoU3MZckTMfH2KtPHQiT0AZN1WBQmtByFLlpbbQ3juclnGzhgWNlc-5diY4sZEOp33cqwmS1TZ56mF65vrnSc3E4PSlXrR47i6k8352lN5-3y1zr_i_ekxf1PKpR1SPtajh7RCrtYOSg_EPgaj9sRpqqbrFq0',
  },
  {
    id: 5,
    salon: 'Natural Flow Salon',
    title: 'Fluid Wave Taper',
    stylist: 'Jordan Smith',
    category: 'Long Hair',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaqOjWf5b4QpBsyDiqCJuHnm7XhcNfVKLvzIm2HRtdPN_0-i8Ll1RXNTg_Av5G7rAvHCv5COZZutrcEl73wyJGbqTd31w-V0KkQtSpog3QqudXhxAzpJO5WuFn8TQgaPHTOfALvMA94lxJUfp723Js_RjjU0KZFJahfj9F2XtpN8_yBdJmytW6bTuG5CPfmtnZXjJZT77oRjyRPYJZdVDlpbxOAqWvBEjD6E1wlughf2HTj-Hzz40bdi1v-FKJI0ZKiE5_7CV46Ac',
  },
];

export default function StyleGallery() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Trending');

  const filteredStyles = useMemo(() => {
    if (activeCategory === 'Trending') return STYLES;
    return STYLES.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const handleRecreate = (style) => {
    toast.success(`Booking "${style.title}" at ${style.salon}`);
    navigate('/salons/nearby');
  };

  return (
    <main className="px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto py-md">
      <section className="mb-lg">
        <h1 className="font-display-lg text-display-lg mb-sm">Style Gallery</h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg max-w-2xl">
          Discover the future of grooming. Explore trending cuts curated by the GlowCut
          community and book your next transformation.
        </p>
      </section>

      <section className="mb-md overflow-x-auto flex gap-sm pb-2 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-md py-sm rounded-full font-label-md text-label-md transition-all ${
              activeCategory === cat
                ? 'bg-primary-container text-on-primary shadow-warm-sm'
                : 'glass-card text-on-surface-variant hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-gutter space-y-gutter">
        {filteredStyles.map((style) => (
          <div
            key={style.id}
            className="relative group rounded-xl overflow-hidden glass-card break-inside-avoid"
          >
            <img
              alt={style.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              src={style.image}
            />
            <div className="absolute inset-x-0 bottom-0 p-md bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-base">
              <div>
                <p className="font-label-md text-label-md text-primary">{style.salon}</p>
                <h3 className="font-headline-md text-headline-md text-on-surface">{style.title}</h3>
                <p className="font-caption text-caption text-on-surface-variant">
                  by {style.stylist}
                </p>
              </div>
              <button
                onClick={() => handleRecreate(style)}
                className="w-full py-sm bg-secondary-container text-on-secondary-container font-label-md text-label-md rounded-lg shadow-warm-sm active:scale-95 transition-all"
              >
                Recreate this Style
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
