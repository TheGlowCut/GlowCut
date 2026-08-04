import React, { useState, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdMenu,
  MdClose,
  MdPersonOutline,
  MdFileUpload,
  MdCameraAlt,
} from 'react-icons/md';
import AuthContext from '../../../context/AuthContext';
import Avatar from '../../../components/ui/Avatar';
import glowcutMark from '../../../assets/brand/glowcut-mark.png';
import '../../../pages/home/Home/Home.css';

import AIStyleScannerResults from './AIStyleScannerResults';
import { aiService } from '../../../services/aiService';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Stylists & Offers', to: '/stylists' },
  { label: 'AI Scanner', to: '/ai/style-consultant', active: true },
  { label: 'Live Queue', to: '/booking/waiting-lounge' },
];

function Brand() {
  return (
    <Link to="/" className="home-brand" aria-label="Glow and Cut home">
      <img src={glowcutMark} alt="" />
      <span>Glow&Cut</span>
    </Link>
  );
}

const LANDING_FEATURES = [
  'Face shape and symmetry analysis',
  'Skin undertone matched palettes',
  'Trend recommendations from top stylists',
  'One-tap booking with matched pros',
];

export default function AIStyleConsultant() {
  const navigate = useNavigate();
  const { userType, profile } = useContext(AuthContext);
  const profileAvatar = profile?.profileImage || profile?.avatar;

  const [mobileOpen, setMobileOpen] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [biometrics, setBiometrics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCameraClick = () => {
    if (cameraInputRef.current) cameraInputRef.current.click();
  };

  const processImage = async (file) => {
    if (!file) return;

    // Set state to trigger the transition to the scanner results page immediately
    // so the user sees the "Analyzing..." UI while the API calls happen in the background.
    setImageFile(file);
    setShowResults(true);
    setIsAnalyzing(true);

    try {
      // 1. Analyze the face & hair
      const analysisResult = await aiService.analyzeImage(file);
      setBiometrics(analysisResult);

      const faceShape = analysisResult?.face?.shape || 'oval';

      // 2. Fetch recommendations
      const recs = await aiService.getRecommendations({
        face_shape: faceShape,
        hairstyle_preference: 'no_preference',
      });

      setRecommendations(recs);
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to analyze the image. Please try again.');
      // Optional: go back to landing if hard failure
      // setShowResults(false); 
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <main className="glow-home flex flex-col min-h-screen font-sans bg-[#0a0a0a]">
      <div className="home-shell" style={{ flexShrink: 0, position: 'relative', zIndex: 50 }}>
        <header className="home-header">
          <Brand />

          <nav className="home-nav" aria-label="Main navigation">
            {NAV_LINKS.map((item) => (
              <Link key={item.label} to={item.to} className={item.active ? 'text-[#E4B56C]' : ''}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="home-header-actions">
            {userType === 'authenticated' ? (
              <button type="button" className="home-header-profile" aria-label="Profile" onClick={() => navigate('/profile')}>
                <Avatar src={profileAvatar} alt={profile?.name || 'Profile'} size="md" className="home-profile-avatar" />
              </button>
            ) : (
              <button type="button" className="home-header-profile" aria-label="Search">
                <MdPersonOutline className="text-xl text-white" />
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="home-menu-button"
            onClick={() => setMobileOpen(true)}
          >
            <MdMenu />
          </button>
        </header>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="home-mobile-nav-overlay"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="home-mobile-nav-header">
                <Brand />
                <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <MdClose />
                </button>
              </div>
              <nav className="home-mobile-nav-links">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={item.active ? 'text-[#E4B56C]' : ''}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showResults ? (
        <AIStyleScannerResults
          imageFile={imageFile}
          biometrics={biometrics}
          recommendations={recommendations}
        />
      ) : (
        <div className="flex-1 w-full max-w-[1200px] mx-auto py-16 px-4 md:px-8 relative z-10">

          {/* Hidden File Inputs */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onFileChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={onFileChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Column: Marketing Copy & Actions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="w-8 h-[1px] bg-[#E4B56C]/50 block"></span>
                <span className="text-[#E4B56C] font-mono text-[10px] tracking-[0.2em] font-bold uppercase">
                  AI STYLE STUDIO
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-serif text-white leading-[1.1] tracking-tight">
                Meet your <span className="text-[#E4B56C]">AI Stylists</span>
              </h1>

              <p className="text-[#A1A1AA] text-sm md:text-base max-w-[90%] leading-relaxed">
                Upload a portrait or snap a photo. Our AI analyzes your facial structure, skin undertone, and features to recommend cuts and colors made for you.
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={handleFileUploadClick}
                  className="bg-[#E4B56C] text-black font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#d6a55b] transition-colors"
                >
                  <MdFileUpload className="text-sm" /> Upload photo
                </button>
                <button
                  onClick={handleCameraClick}
                  className="bg-transparent border border-white/20 text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <MdCameraAlt className="text-sm" /> Use camera
                </button>
              </div>

              <ul className="flex flex-col gap-3 mt-4">
                {LANDING_FEATURES.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#A1A1AA] text-xs">
                    <span className="w-1 h-1 rounded-full bg-[#E4B56C]"></span>
                    {feat}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right Column: Hero Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative w-full"
            >
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4] lg:aspect-[4/3] border border-white/10 shadow-2xl">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAusMTS2fNKagVs6vZNPP_IHqmxOcBbf0OwOMynU1rBQy9Spp7a3ynUZr8EpoHy-7Aw579fM8mi6_mWZYr0Mhy0aTJtNIGhBsbaOJxjdXzetKelvsKAymdBmKYsTNYHTZIPgOCyuA7WSxCoN6G3BMMMgqYnLnquRJ4oxtV5r1tlJlCGYtRuqKyHk9dk4NY_4dcRUdKNYBdSuQP7O26V80OWDv0Cl3WeCExMNbZyNDlS-vUHqyMnASL0UKGBpkcWTuUt17jYeblQ_a8"
                  alt="AI Stylist Demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10">
                  <div className="w-3 h-3 rounded-full border border-white/40 flex items-center justify-center">
                    <div className="w-[3px] h-[3px] bg-white rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-[9px] text-white tracking-widest font-mono uppercase">Analyzing...</span>
                </div>
              </div>

              {/* Floating Stat Pills */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] flex justify-center gap-3">
                {[
                  { label: 'Face Shape', val: 'Oval' },
                  { label: 'Undertone', val: 'Warm' },
                  { label: 'Match', val: '94%' }
                ].map(stat => (
                  <div key={stat.label} className="bg-[#0a0a0a] border border-white/10 rounded-full px-5 py-3 flex flex-col items-center justify-center flex-1 shadow-xl">
                    <span className="text-[#A1A1AA] text-[8px] uppercase tracking-widest mb-1">{stat.label}</span>
                    <span className="text-white text-xs font-semibold">{stat.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Dummy Recommended Looks section for landing page */}
          <div className="mt-28 flex flex-col gap-8">
            <h2 className="text-3xl font-serif text-white">Recommended looks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Textured Crop', match: 92, palette: 'Warm' },
                { name: 'Warm Balayage', match: 92, palette: 'Warm' },
                { name: 'Classic Blowout', match: 92, palette: 'Warm' }
              ].map((look, i) => (
                <div key={look.name} className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                  <div className="h-48 bg-[#1a1a1a] flex items-center justify-center m-4 rounded-2xl">
                    <span className="text-4xl text-white/10 font-serif">{i + 1}</span>
                  </div>
                  <div className="p-6 pt-2 flex justify-between items-end mt-auto">
                    <div>
                      <h3 className="text-white text-sm font-semibold mb-1">{look.name}</h3>
                      <p className="text-[#A1A1AA] text-[9px]">{look.match}% match • {look.palette} palette</p>
                    </div>
                    <button className="bg-[#E4B56C] text-black text-[10px] font-bold px-4 py-2 rounded-full hover:bg-white transition-colors">
                      Book Now &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      <footer className="home-footer" style={{ marginTop: 'auto' }}>
        <div className="home-shell flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/10 mt-12 gap-6">
          <Brand />

          <div className="flex items-center gap-6 text-[#A1A1AA] text-xs">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
          </div>
        </div>
        <div className="home-shell flex justify-between items-center pb-8">
          <div className="text-[#A1A1AA] text-[10px]">© 2026 GlowCut Cyber-Chic Salons. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
