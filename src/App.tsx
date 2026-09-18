import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MetallicBackground from "./components/MetallicBackground";
import PixelText from "./components/PixelText";
import CustomCursor from "./components/CustomCursor";
import HomePage from "./components/HomePage";
import { APP_ASSETS, METRO_STATIONS_DATA, getCircleThumbnailUrl } from "./assets/assets";

export default function App() {
  const [hasBegun, setHasBegun] = useState(false);

  // Background non-blocking asset pre-warmer for instant metro map responsiveness
  useEffect(() => {
    const preloadAssets = () => {
      // Preload critical icons and top station thumbnails silently into browser image cache
      const urlsToPreload = [
        APP_ASSETS.websiteLogo,
        ...METRO_STATIONS_DATA.slice(0, 10).map((st) => getCircleThumbnailUrl(st.thumbnail, 240)),
      ];

      urlsToPreload.forEach((src) => {
        if (!src) return;
        const img = new Image();
        img.src = src;
      });
    };

    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preloadAssets);
    } else {
      setTimeout(preloadAssets, 50);
    }
  }, []);

  // Dynamically load and update favicon
  useEffect(() => {
    let active = true;
    import("./lib/portfolioDb")
      .then(({ getAsset }) => {
        getAsset("homepage_uploaded_image").then((img) => {
          if (!active) return;
          const faviconSrc = img || APP_ASSETS.websiteLogo || APP_ASSETS.favicon;
          const linkIco = document.querySelector("link[rel='icon']");
          const linkPng = document.querySelector("link[rel='shortcut icon']");
          if (linkIco) linkIco.setAttribute("href", faviconSrc);
          if (linkPng) linkPng.setAttribute("href", faviconSrc);
        });
      })
      .catch((err) => {
        console.warn("Could not load logo from db for favicon:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen text-[#0A0A0A] select-none bg-[#F7F7F8] overflow-x-hidden font-sans">
      {/* 1. Custom Interactive Cursor */}
      <CustomCursor />

      {/* 2. Main Landing Screen with "trinaethra" & Interactive Cursor Eye */}
      {!hasBegun && (
        <div className="relative w-full min-h-screen flex flex-col justify-between items-center py-8 z-10">
          
          {/* Dynamic Metallic Interactive Background Layer */}
          <MetallicBackground variant="landing" />

          {/* Content Container - Instant snappy presentation */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto px-6 h-full flex flex-col justify-between items-center"
          >
            {/* Top Section: Pixel Logo ("trinaethra") with Interactive Eye */}
            <div id="logo-container" className="mt-16 md:mt-24 flex flex-col items-center">
              <PixelText />
            </div>

            {/* Middle Section: Chunky Heading & Designer Subtitle in Haas Neue Grotesk */}
            <div id="main-hero" className="flex flex-col items-center text-center justify-center flex-grow py-6 max-w-5xl">
              
              {/* Heading: "Design Portfolio" */}
              <h1 
                className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#0A0A0A] uppercase leading-[0.85] tracking-tight text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto whitespace-normal"
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  letterSpacing: "-0.045em",
                  textShadow: "1px 1px 0px #fff, 2px 2px 0px rgba(0,0,0,0.05), 3px 3px 12px rgba(0,0,0,0.1)"
                }}
              >
                Design Portfolio
              </h1>

              {/* Subtitle: "by mallika nethra sreenivasan" */}
              <p 
                className="mt-6 md:mt-8 font-sans font-bold text-sm md:text-base lg:text-lg text-[#0012ff] tracking-widest uppercase"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                by mallika nethra sreenivasan
              </p>

              {/* "begin now" Interactive Button */}
              <div className="mt-6 md:mt-8">
                <button
                  onClick={() => setHasBegun(true)}
                  className="relative overflow-hidden group border-2 border-[#0012ff] text-[#0012ff] hover:text-white rounded-[4px] px-12 py-4 font-sans font-bold text-xs md:text-sm tracking-[0.25em] uppercase transition-colors duration-500 ease-out shadow-[0_4px_20px_-2px_rgba(0,18,255,0.3)] cursor-pointer"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    boxShadow: "0 4px 20px -2px rgba(0, 18, 255, 0.3)"
                  }}
                >
                  {/* Sliding background fill on hover */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-0 bg-[#0012ff] transition-all duration-500 ease-out group-hover:h-full -z-10 origin-bottom"
                  />
                  
                  {/* Button Text */}
                  <span className="relative z-10 block transition-transform duration-300 group-hover:scale-105">
                    begin now
                  </span>
                </button>
              </div>

            </div>

            {/* Bottom spacing */}
            <div className="h-8" />

          </motion.div>
        </div>
      )}

      {/* 3. Full Homepage Experience (Opened upon clicking "Begin Now") */}
      <AnimatePresence>
        {hasBegun && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-30 overflow-y-auto overflow-x-hidden bg-[#F7F7F8]"
          >
            <HomePage onBackToLanding={() => setHasBegun(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
