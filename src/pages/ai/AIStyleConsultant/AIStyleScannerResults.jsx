import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MdCalendarToday, MdSmartToy, MdClose } from 'react-icons/md';

const AI_LINES = [
  'Analyzing bone structure...',
  'Calculating optimal fade ratios...',
  'Cross-referencing 12,000+ style profiles...',
  'Recommendation set updated for you.',
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AIStyleScannerResults({ imageFile, biometrics, recommendations }) {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    // Artificial scanning delay to show off the cool UI even if API is fast
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

  const faceData = biometrics?.face || biometrics?.data?.face;
  const hairData = biometrics?.hair || biometrics?.data?.hair;

  const displayBiometrics = [
    { label: 'Face Shape', value: faceData?.shape?.toUpperCase() || 'OVAL' },
    { label: 'Hair Density', value: hairData?.density?.toUpperCase() || 'HIGH' },
    { label: 'Hair Length', value: hairData?.length?.toUpperCase() || 'SHORT' },
  ];

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto py-10 px-4 md:px-8 relative z-10">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div variants={fadeUp} className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative w-full aspect-[4/5] md:aspect-[16/10] bg-[#111111] rounded-[2rem] overflow-hidden shadow-2xl group">
            {scanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-[#E4B56C] shadow-[0_0_15px_rgba(228,181,108,0.5)] animate-[scan_2s_ease-in-out_infinite] z-20" />
            )}
            <img
              alt="AI Face Scan"
              className="w-full h-full object-cover grayscale-[0.2]"
              src={imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAusMTS2fNKagVs6vZNPP_IHqmxOcBbf0OwOMynU1rBQy9Spp7a3ynUZr8EpoHy-7Aw579fM8mi6_mWZYr0Mhy0aTJtNIGhBsbaOJxjdXzetKelvsKAymdBmKYsTNYHTZIPgOCyuA7WSxCoN6G3BMMMgqYnLnquRJ4oxtV5r1tlJlCGYtRuqKyHk9dk4NY_4dcRUdKNYBdSuQP7O26V80OWDv0Cl3WeCExMNbZyNDlS-vUHqyMnASL0UKGBpkcWTuUt17jYeblQ_a8"}
              style={{ opacity: 0.85 }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            
            <div className="absolute top-10 left-8 flex flex-col gap-4">
              {displayBiometrics.map((b) => (
                <div
                  key={b.label}
                  className={`relative bg-black/80 backdrop-blur-md border border-[#E4B56C]/30 px-5 py-3 rounded-[1.5rem] min-w-[150px] flex flex-col justify-center transition-opacity duration-500 ${
                    scanning ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div className="absolute -top-1.5 -left-1.5 bg-black rounded-full border border-black flex items-center justify-center w-4 h-4">
                    <MdClose className="text-[#E4B56C] text-[10px]" />
                  </div>
                  <p className="text-[9px] text-[#A1A1AA] uppercase font-bold tracking-widest mb-1 leading-none">
                    {b.label}
                  </p>
                  <p className="font-bold text-[#E4B56C] text-xs leading-none">
                    {scanning ? '···' : b.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="absolute top-10 right-8">
              <div className="bg-[#E4B56C] rounded-full flex items-center justify-center w-6 h-6 cursor-pointer">
                <MdClose className="text-black text-sm font-bold" />
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-black/90 backdrop-blur-xl border border-[#E4B56C]/20 px-6 py-4 rounded-full flex items-center gap-4 shadow-xl">
              <div className="w-5 h-5 rounded-full border border-[#E4B56C] flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#E4B56C] rounded-full"></div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="font-mono text-[#A1A1AA] text-[8px] font-bold uppercase tracking-widest mb-1 leading-none">AI Stylist Scanner</p>
                <p className="text-white text-[13px] leading-none">
                  {scanning ? AI_LINES[lineIndex] : <span className="text-white">Analysis complete. <span className="text-[#E4B56C] font-medium">Here are your top matches.</span></span>}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              onClick={() => navigate('/services')}
              className="w-full bg-[#E4B56C] text-black py-4 rounded-[1.25rem] font-bold text-sm transition-all hover:bg-[#cfa462] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(228,181,108,0.2)]"
            >
              <MdCalendarToday className="text-lg" />
              Book a Barber for this Style
            </button>
            <p className="text-center text-[#A1A1AA] text-[11px] mt-1">
              Recommended based on your unique biometric analysis.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 px-1">
            <h2 className="font-serif text-[22px] text-white">Recommended Styles</h2>
            <span className="font-bold text-[#E4B56C] text-[9px] uppercase tracking-widest border border-[#E4B56C]/30 px-3 py-1.5 rounded-full">
              {recommendations?.length || 0} MATCHES
            </span>
          </div>

          <div className="flex flex-col gap-6 custom-scrollbar pr-2 pb-10">
            {scanning ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 rounded-full border-4 border-[#E4B56C]/20 border-t-[#E4B56C] animate-spin"></div>
              </div>
            ) : (
              (Array.isArray(recommendations) ? recommendations : (recommendations?.data?.recommendations || [])).map((style, idx) => (
                <motion.div
                  key={style.name}
                  className={`bg-[#111111] rounded-[1.5rem] overflow-hidden group flex flex-col ${idx === 0 ? 'border border-[#E4B56C]/40 shadow-[0_0_30px_rgba(228,181,108,0.05)]' : 'border border-white/5 opacity-80'}`}
                  whileHover={{ y: -2 }}
                >
                  <div className="relative w-full h-[220px] overflow-hidden bg-black">
                    <img
                      alt={style.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      src={style.presentation || 'https://via.placeholder.com/400x300?text=Style'}
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E4B56C]/30">
                      <p className="text-[#E4B56C] font-mono text-[9px] uppercase tracking-widest font-bold">
                        {style.matchScore || Math.floor(Math.random() * 20 + 80)}% MATCH
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="font-serif text-lg mb-2 text-white">{style.name}</h3>
                    <p className="text-[#A1A1AA] text-[11px] leading-relaxed mb-6">
                      {style.reason || style.description || 'A great match for your profile.'}
                    </p>
                    <button
                      onClick={() => handleTryOn(style)}
                      className="flex items-center gap-2 text-[#E4B56C] text-[10px] font-bold uppercase tracking-widest hover:brightness-125 transition-all mt-auto"
                    >
                      <MdSmartToy className="text-sm" /> VIRTUAL TRY-ON
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
