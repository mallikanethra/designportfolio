import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Instagram } from "lucide-react";

interface DesktopIcon {
  id: string;
  title: string;
  thumbnail: string;
  link: string;
  initialX: number; // percentage from left
  initialY: number; // percentage from top
}

// 6 macOS Desktop Icons scattered organically across the creative desktop canvas
const SCATTERED_ICONS: DesktopIcon[] = [
  {
    id: "param",
    title: "param",
    thumbnail: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178445/param_foundation_wstibb.png",
    link: "https://paramfoundation.org/",
    initialX: 6,
    initialY: 10,
  },
  {
    id: "wipro",
    title: "wipro",
    thumbnail: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178443/wipro_tp4f8j.png",
    link: "https://wipropari.com/",
    initialX: 34,
    initialY: 8,
  },
  {
    id: "gkp",
    title: "gkp",
    thumbnail: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178443/gkp_ztpaty.png",
    link: "https://gkpublications.com/?srsltid=AfmBOookSXHU1R6Yy6UJa8pkK-MzNuHp1YPigFCTAZiUM08ZPjdUcg6p",
    initialX: 76,
    initialY: 12,
  },
  {
    id: "havells",
    title: "havells",
    thumbnail: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178443/havells_qhkkfy.png",
    link: "https://havells.com/",
    initialX: 16,
    initialY: 46,
  },
  {
    id: "desmania",
    title: "desmania",
    thumbnail: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178393/desmania_ltfpz7.png",
    link: "https://www.desmania.com/",
    initialX: 32,
    initialY: 44,
  },
  {
    id: "kaboom",
    title: "kaboom",
    thumbnail: "https://res.cloudinary.com/jbc9dxsc/image/upload/v1784178444/kaboom_sc_u9uyck.png",
    link: "https://www.kaboomsocialchange.com/",
    initialX: 82,
    initialY: 48,
  },
];

export default function MacExperiencesDesktop() {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  return (
    <div id="experiences-section" className="relative w-full max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
      {/* Section Heading: Same Bold Serif Font as "All aboard!" */}
      <div className="mb-5 sm:mb-6 px-1 flex items-center justify-between">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0A0A0A] tracking-tight leading-none select-none"
          style={{
            fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
          }}
        >
          previously, on my resume...
        </h2>
      </div>

      {/* Ambient background glow behind the desktop stage */}
      <div className="absolute inset-0 max-w-6xl mx-auto rounded-3xl overflow-hidden pointer-events-none opacity-25 filter blur-xl">
        <img
          src="https://res.cloudinary.com/jbc9dxsc/image/upload/v1786948343/2b450abfb3acce41f10e3ea19b0e391c_q6gdnd.jpg"
          alt="Ambient Background Desk"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* MacBook Desktop Stage: Slightly reduced size with scattered desktop icons */}
      <div className="relative w-full h-[500px] sm:h-[560px] md:h-[620px] rounded-2xl overflow-hidden shadow-2xl bg-[#1A1A1A] select-none border border-black/10">
        
        {/* Background Image: Zoomed out and repositioned for full scene balance and visibility */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="https://res.cloudinary.com/jbc9dxsc/image/upload/v1786948343/2b450abfb3acce41f10e3ea19b0e391c_q6gdnd.jpg"
            alt="MacBook Desk Background"
            className="w-full h-full object-cover object-[50%_18%] filter blur-[2px] opacity-90 scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        </div>

        {/* macOS Style Top Menu Bar */}
        <div className="absolute top-0 left-0 w-full h-7 px-4 bg-white/25 backdrop-blur-md flex items-center justify-between text-xs text-white/95 z-20 pointer-events-none border-b border-white/10">
          <div className="flex items-center gap-3 font-medium">
            <span className="font-semibold text-sm"></span>
            <span className="font-sans text-[11px] font-semibold">Finder</span>
            <span className="font-sans text-[11px] opacity-80 hidden sm:inline">File</span>
            <span className="font-sans text-[11px] opacity-80 hidden sm:inline">Edit</span>
            <span className="font-sans text-[11px] opacity-80 hidden sm:inline">View</span>
            <span className="font-sans text-[11px] opacity-80 hidden sm:inline">Go</span>
            <span className="font-sans text-[11px] opacity-80 hidden sm:inline">Window</span>
            <span className="font-sans text-[11px] opacity-80 hidden sm:inline">Help</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] opacity-90">
            <span>Tue 10:42 AM</span>
          </div>
        </div>

        {/* 6 Scattered Desktop Icons with Fluid Drag-and-Drop Interaction */}
        <div className="relative w-full h-full p-4 sm:p-6 pt-8 sm:pt-10 pb-20 sm:pb-24 overflow-hidden">
          {SCATTERED_ICONS.map((item) => (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveIcon(item.id);
                window.open(item.link, "_blank", "noopener,noreferrer");
              }}
              style={{
                position: "absolute",
                left: `${item.initialX}%`,
                top: `${item.initialY}%`,
              }}
              className="flex flex-col items-center gap-1 sm:gap-1.5 cursor-pointer z-10 group touch-manipulation"
            >
              {/* Squircle Desktop Icon */}
              <div
                className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-white/95 p-1.5 sm:p-2 shadow-lg border transition-all duration-200 ${
                  activeIcon === item.id
                    ? "border-[#0012ff] ring-2 ring-[#0012ff]/50 scale-105"
                    : "border-white/60 group-hover:border-[#0012ff]/80 group-hover:shadow-2xl"
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-contain pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title Label Pill */}
              <span
                className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium text-white bg-black/70 backdrop-blur-md tracking-tight lowercase text-center shadow-sm select-none border border-white/10"
                style={{
                  fontFamily: '"Inter", "Neue Haas Grotesk", sans-serif',
                }}
              >
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Centre: Light Grey macOS Dock Bar with Square Icons */}
        <div
          id="contact-dock"
          className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-[95%] sm:max-w-none"
        >
          <div className="flex items-center gap-2.5 sm:gap-4 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#E5E5EA]/90 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            
            {/* 1. Email Icon */}
            <a
              href="mailto:mallikanethrasreenivasan@gmail.com"
              onClick={(e) => {
                e.preventDefault();
                // Opens Gmail web compose directly in the browser with recipient pre-filled
                const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=mallikanethrasreenivasan@gmail.com";
                window.open(gmailUrl, "_blank", "noopener,noreferrer");
              }}
              className="flex flex-col items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl group transition-transform duration-200 hover:-translate-y-2 cursor-pointer"
              title="Send Email to mallikanethrasreenivasan@gmail.com"
              aria-label="Email mallikanethrasreenivasan@gmail.com"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-tr from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                <Mail size={20} className="stroke-[1.8] sm:w-[22px] sm:h-[22px]" />
              </div>
              <span className="text-[9px] font-medium text-[#1C1C1E] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline">
                Email
              </span>
            </a>

            {/* 2. Instagram Icon */}
            <a
              href="https://www.instagram.com/trinaethra?igsh=NjB4djdqYzh6Nndk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl group transition-transform duration-200 hover:-translate-y-2 cursor-pointer"
              title="Instagram @trinaethra"
              aria-label="Instagram"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-tr from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                <Instagram size={20} className="stroke-[1.8] sm:w-[22px] sm:h-[22px]" />
              </div>
              <span className="text-[9px] font-medium text-[#1C1C1E] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline">
                Instagram
              </span>
            </a>

            {/* 3. Behance Icon */}
            <a
              href="https://www.behance.net/mallikanethra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl group transition-transform duration-200 hover:-translate-y-2 cursor-pointer"
              title="Behance @mallikanethra"
              aria-label="Behance"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0057FF] flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow font-extrabold text-sm sm:text-base tracking-tighter">
                Bē
              </div>
              <span className="text-[9px] font-medium text-[#1C1C1E] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline">
                Behance
              </span>
            </a>

          </div>
        </div>

      </div>
    </div>
  );
}
