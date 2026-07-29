import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MdCalendarToday, MdVisibility, MdSmartToy } from 'react-icons/md';
import Loader from '../../../components/ui/Loader';

const BIOMETRICS = [
  { label: 'Face Shape', value: 'OVAL' },
  { label: 'Hair Density', value: 'HIGH' },
  { label: 'Jawline', value: 'SHARP' },
];

const RECOMMENDED_STYLES = [
  {
    name: 'Textured Modern Crop',
    match: 95,
    description: 'Perfect for high density hair & oval face shapes.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ4__pm4z0S7_NucTvG-Fz0NFG-Tg6eFsEmnp5uX0uHK4MJAOMORFuuAW9UXP8MKtNlXO7WH01F-qMroDVORxx18r845FzvtGmqtRvd4fVFOl1TEeq6am7t4WVaJKe88A_KogCMoZVVlBRqJpqPsXutBjvsNYblmfA5O2UdMIRALKShpOVeWy9RcrAYXSOhzh8xzXNrNQ7RBj5R8H5gFNkKqPv9J8BsaPy3ZKyNKjVYXVc5MBRIe0xNQxa7-zjL1OZ4vIp2WN1Bbg',
  },
  {
    name: 'Side-Part Pompadour',
    match: 88,
    description: 'A sophisticated taper with a sharp surgical line detail.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC5kpt86Whe1mDgVn5F-44rUDsvJ5jMbJcKba0060Hnt5aqhCZAPCZeoTyXIr-v1agjPjTaedffSEEmC4qX_Ea5ffzeD2FwYken6hHgLm1mVy3ACqoW6KcG_jfp0zAfPI78ACoW020V280D67RuBvxI7WLVOn1b5-vV3xZCYuNeapbAix1Gx6BmGLAhLUvZhlmJjgQdHyIxAE4QjFP2HXFXKVBnlmJ8EuXCVMXpnlg2vmNyDN8ET8lG3SqifhCsbAvsdeb_QFg488g',
  },
  {
    name: 'Cyber Buzz Cut',
    match: 81,
    description: 'Low-maintenance precision cut with geometric edges.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-A1fs5YqOPogANpX1d3rz5nKCXSgefrlKkY_4nEm2no5XS9pnH1qJVU82jZlxaI-Mu5kDVzg6uFqZZzck_I9E_O4prS1NZOB_JBDr9R1_sGSN_cyoU3MZckTMfH2KtPHQiT0AZN1WBQmtByFLlpbbQ3juclnGzhgWNlc-5diY4sZEOp33cqwmS1TZ56mF65vrnSc3E4PSlXrR47i6k8352lN5-3y1zr_i_ekxf1PKpR1SPtajh7RCrtYOSg_EPgaj9sRpqqbrFq0',
  },
];

const AI_LINES = [
  'Analyzing bone structure...',
  'Calculating optimal fade ratios...',
  'Cross-referencing 12,000+ style profiles...',
  'Recommendation set updated for Faizan.',
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AIStyleConsultant() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setScanning(false), 2800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % AI_LINES.length);
    }, 900);
    return () => clearInterval(interval);
  }, [scanning]);

  const handleTryOn = (style) => {
    toast.success(`Loading virtual try-on for "${style.name}"`);
    navigate('/ai/ar-mirror');
  };

  return (
    <motion.main
      className="py-xl min-h-screen px-margin-mobile md:px-margin-desktop"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <motion.div
          variants={fadeUp}
          className="lg:col-span-8 flex flex-col gap-md"
        >
          <div className="relative w-full aspect-[4/5] md:aspect-[16/10] bg-surface-container rounded-2xl overflow-hidden border border-white/10 group">
            {scanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-primary shadow-warm-sm animate-scan" />
            )}
            <img
              alt="User Portrait"
              className="w-full h-full object-cover grayscale-[0.2] brightness-90 group-hover:brightness-100 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAusMTS2fNKagVs6vZNPP_IHqmxOcBbf0OwOMynU1rBQy9Spp7a3ynUZr8EpoHy-7Aw579fM8mi6_mWZYr0Mhy0aTJtNIGhBsbaOJxjdXzetKelvsKAymdBmKYsTNYHTZIPgOCyuA7WSxCoN6G3BMMMgqYnLnquRJ4oxtV5r1tlJlCGYtRuqKyHk9dk4NY_4dcRUdKNYBdSuQP7O26V80OWDv0Cl3WeCExMNbZyNDlS-vUHqyMnASL0UKGBpkcWTuUt17jYeblQ_a8"
            />

            <div className="absolute inset-0 pointer-events-none p-md">
              <div className="w-full h-full border-2 border-primary/20 rounded-xl relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />
              </div>
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-sm">
              {BIOMETRICS.map((b) => (
                <div
                  key={b.label}
                  className={`backdrop-blur-xl bg-surface/60 border border-white/10 p-sm rounded-lg shadow-2xl transition-opacity duration-500 ${
                    scanning ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <p className="font-mono text-primary text-caption uppercase tracking-widest">
                    {b.label}
                  </p>
                  <p className="font-headline-md text-on-surface">
                    {scanning ? '···' : b.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] backdrop-blur-2xl bg-black/60 border border-primary/30 p-md rounded-xl flex items-center gap-md">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center shadow-warm flex-shrink-0">
                <MdSmartToy className="text-primary" />
              </div>
              <div>
                <p className="font-mono text-primary text-[10px] uppercase">AI Stylist Active</p>
                <p className="text-on-surface text-body-md font-semibold italic">
                  &quot;{scanning ? AI_LINES[lineIndex] : 'Analysis complete. Here are your top matches.'}&quot;
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <button
              onClick={() => navigate('/ai/ar-mirror')}
              className="w-full bg-primary text-on-primary py-md rounded-xl font-bold text-headline-md shadow-warm flex items-center justify-center gap-md active:scale-[0.98] transition-all"
            >
              <MdCalendarToday />
              Book a Barber for this Style
            </button>
            <p className="text-center text-on-surface-variant font-caption">
              Recommended based on your unique biometric analysis.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="lg:col-span-4 flex flex-col gap-md h-full"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recommended Styles</h2>
            <span className="font-mono text-primary text-caption bg-primary/10 px-sm py-1 rounded-full">
              v2.4 AI Engine
            </span>
          </div>

          <div className="flex flex-col gap-md overflow-y-auto pr-2 custom-scrollbar max-h-[800px]">
            {scanning ? (
              <div className="flex justify-center py-xl">
                <Loader variant="scan" label="Generating Matches..." />
              </div>
            ) : (
              RECOMMENDED_STYLES.map((style) => (
                <motion.div
                  key={style.name}
                  className="bg-surface-container-high rounded-xl p-sm border border-white/5 hover:border-primary/50 transition-colors group"
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-sm">
                    <img
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={style.image}
                    />
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-sm py-1 rounded-md border border-primary/40">
                      <p className="text-primary font-mono font-bold text-caption">
                        {style.match}% MATCH
                      </p>
                    </div>
                  </div>
                  <div className="px-xs">
                    <h3 className="font-headline-md text-headline-md mb-1 text-on-surface">{style.name}</h3>
                    <p className="text-on-surface-variant text-caption mb-md leading-relaxed">{style.description}</p>
                    <button
                      onClick={() => handleTryOn(style)}
                      className="w-full py-sm rounded-lg border border-primary/30 text-primary font-label-md text-label-md flex items-center justify-center gap-sm hover:bg-primary/10 transition-all"
                    >
                      <MdVisibility className="text-[18px]" />
                      Virtual Try-On
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
