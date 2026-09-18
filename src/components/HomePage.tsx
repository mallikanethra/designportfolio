import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink } from "lucide-react";
import MetallicBackground from "./MetallicBackground";
import DelhiMetroMap from "./DelhiMetroMap";
import MacExperiencesDesktop from "./MacExperiencesDesktop";
import PersonalityVideoModal from "./PersonalityVideoModal";
import ResumeModal from "./ResumeModal";
import NimbuMirchiEvilEye from "./NimbuMirchiEvilEye";
import { APP_ASSETS } from "../assets/assets";

// 15 Design and Creative Tools appearing in a circle around the flipped cartoon avatar
const PROFILE_TOOLS = [
  { id: "tool-1", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133652/images_2_svphlp.png", title: "Tool 1" },
  { id: "tool-2", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133652/images_1_hnymo6.png", title: "Tool 2" },
  { id: "tool-3", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133652/3c2f2d404a571d2c9fbca934360352698d63433a-1920x900_qtx8hm.png", title: "Tool 3" },
  { id: "tool-4", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133653/images_2_udwonw.jpg", title: "Tool 4" },
  { id: "tool-5", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133653/bambu-lab_bife5m.png", title: "Bambu Lab" },
  { id: "tool-6", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133653/images_czlhcq.png", title: "Tool 6" },
  { id: "tool-7", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133653/images_1_wwrbtx.jpg", title: "Tool 7" },
  { id: "tool-8", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133653/vecteezy_rectangle-adobe-photoshop-icon-logo-symbol_55982095_ghbprg.png", title: "Photoshop" },
  { id: "tool-9", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133653/autodesk-fusion60-logo-vector-png_jnrjqn.png", title: "Fusion 360" },
  { id: "tool-10", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133654/9921019c7072384c13f60da01d4a6ef1_ucmyuh.png", title: "Tool 10" },
  { id: "tool-11", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133654/396b23e52955bd5155e60a08e5b5ed5c_c90s5r.png", title: "Tool 11" },
  { id: "tool-12", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133655/vecteezy_adobe-illustrator-cc-icon-app-logo-editable-transparent_66118529_weeoqg.png", title: "Illustrator" },
  { id: "tool-13", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133655/clipart1005150_rd9knc.png", title: "Tool 13" },
  { id: "tool-14", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133656/a54788797acfd2be8efebfc21694d153_tgsw7l.png", title: "Tool 14" },
  { id: "tool-15", img: "https://res.cloudinary.com/e2fspk4d/image/upload/v1787133656/vecteezy_adobe-indesign-icon_46437245_pyidx4.png", title: "InDesign" },
];

interface HomePageProps {
  onBackToLanding?: () => void;
}

export default function HomePage({ onBackToLanding }: HomePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isProfileFlipped, setIsProfileFlipped] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (elementId: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <div className="relative w-full min-h-screen text-[#0A0A0A] bg-[#FAFAFC] overflow-x-hidden selection:bg-[#0012ff] selection:text-white">
      {/* 1. Dynamic Cursor-Interactive Bright Grey-White Metallic Background Layer */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10">
        <MetallicBackground variant="white_metal" />
      </div>

      {/* 2. Top Navigation Bar: Brand Logo & 3 Blue Stars Hamburger Menu */}
      <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between pointer-events-none">
        {/* Top-Left Brand Logo */}
        <div className="pointer-events-auto flex items-center">
          <button
            onClick={() => {
              if (onBackToLanding) {
                onBackToLanding();
              } else {
                scrollToSection("hero-section");
              }
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none cursor-pointer"
            aria-label="Return to landing / top"
          >
            <img
              src={APP_ASSETS.websiteLogo}
              alt="Brand Logo"
              className="w-full h-full object-contain filter drop-shadow-xs"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>

        {/* Top-Right: Nimbu Mirchi & Blue Evil Eye Dreamcatcher on a String Menu Button */}
        <div className="pointer-events-auto -mt-5 sm:-mt-6">
          <button
            id="nimbu-mirchi-hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-0 flex items-center justify-center transition-all duration-300 group bg-transparent border-none shadow-none cursor-pointer focus:outline-none overflow-visible"
            aria-label="Toggle navigation menu"
            title="Toggle Menu (Nimbu Mirchi & Evil Eye Dreamcatcher)"
          >
            <NimbuMirchiEvilEye isOpen={isMenuOpen} />
          </button>
        </div>
      </header>

      {/* 3. Hamburger Menu Fullscreen Overlay with High-Opacity Video Background */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full h-full z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/50 overflow-hidden"
          >
            {/* High-Opacity Video Background */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
              <video
                src="https://res.cloudinary.com/si0bugwt/video/upload/v1784005174/total_c3mnit.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter blur-[2px] scale-105 opacity-100 brightness-110"
              />
              <div className="absolute inset-0 bg-white/18 backdrop-blur-[1px]" />
            </div>

            {/* Close Button on Top Right */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 p-3 rounded-full bg-white/80 hover:bg-[#0012ff] hover:text-white transition-colors duration-200 cursor-pointer z-20 shadow-md"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            {/* Menu Links */}
            <div className="flex flex-col items-center justify-center gap-7 max-w-xl w-full px-6 text-center z-10">
              {[
                { label: "about", action: () => scrollToSection("hero-section") },
                { label: "work", action: () => scrollToSection("project-map") },
                { label: "experiences", action: () => scrollToSection("experiences-section") },
                { label: "resume", action: () => { setIsMenuOpen(false); setIsResumeModalOpen(true); } },
                {
                  label: "portfolio '26",
                  action: () => {
                    setIsMenuOpen(false);
                    window.open(APP_ASSETS.portfolio26Link, "_blank", "noopener,noreferrer");
                  },
                  external: true,
                },
                { label: "contact", action: () => scrollToSection("contact-dock") },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                  className="w-full flex items-center justify-center"
                >
                  <button
                    onClick={item.action}
                    className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[#0A0A0A] hover:text-[#0012ff] hover:scale-105 transition-all duration-200 lowercase tracking-tight flex items-center gap-3 cursor-pointer focus:outline-none drop-shadow-sm"
                    style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      letterSpacing: "-0.03em",
                    }}
                  >
                    <span>{item.label}</span>
                    {item.external && <ExternalLink size={24} className="text-[#0012ff]/80" />}
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MAIN HOMEPAGE CONTENT STREAM */}
      <main className="relative z-10 w-full flex flex-col items-center pt-20 sm:pt-24 md:pt-28">
        {/* ========================================================= */}
        {/* SECTION 1: HERO (FULL INITIAL VIEWPORT HEIGHT BEFORE SCROLL) */}
        {/* ========================================================= */}
        <section
          id="hero-section"
          className="relative w-full max-w-5xl min-h-[calc(100vh-7rem)] flex flex-col justify-center mx-auto px-6 sm:px-8 lg:px-10 py-10 sm:py-16 pb-20 sm:pb-28"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start justify-items-start">
            {/* Left Column: Heading & Flush-Aligned Condensed About Bio */}
            <div className="md:col-span-7 flex flex-col justify-start items-start space-y-5 sm:space-y-6">
              {/* "Hi! Im mallika nethra" */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full text-left"
              >
                <h1
                  className="font-display font-medium text-[#0A0A0A]/85 leading-[1.06] tracking-tight text-left"
                  style={{
                    fontSize: "clamp(38px, 5.5vw, 64px)",
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  }}
                >
                  Hi! I'm{" "}
                  <span className="ambient-blue-text font-bold select-text">
                    mallika nethra
                  </span>
                </h1>
              </motion.div>

              {/* Flush-Aligned Condensed Bio Block with Real-Time Left-to-Right Highlighter Animation */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="w-full flex justify-start text-left"
              >
                <div
                  id="about-condensed-text-block"
                  className="w-full max-w-[280px] sm:max-w-[320px] p-0 bg-transparent border-none shadow-none text-left"
                >
                  <p
                    className="font-sans text-[#0A0A0A] text-[12px] sm:text-[13px] leading-[1.6] tracking-tight lowercase"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    i am an indian{" "}
                    <span className="highlight-purple-draw-1 inline">
                      industrial designer
                    </span>{" "}
                    and{" "}
                    <span className="highlight-purple-draw-2 inline">
                      creative
                    </span>{" "}
                    with a{" "}
                    <span className="highlight-draw-1 inline">
                      practice rooted in the intersection of culture, craft, and contemporary life
                    </span>
                    . i began with a fascination of simple solutions that make one pause and think, "why didn't i think of that?" over time, this{" "}
                    <span className="highlight-draw-2 inline">
                      curiosity expanded into broader questions of identity, heritage, and the ways we live
                    </span>
                    . at a time when the designed world grows increasingly complex, i am interested in what endures: the human stories, wonder, imagination embedded in{" "}
                    <span className="highlight-draw-3 inline">
                      form, material, and making and how these become the very intelligence of an experience
                    </span>
                    .
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Profile Image with Wide Orbiting Tools & Personality Trailer Inside */}
            <div className="md:col-span-5 flex flex-col items-center justify-center pt-2 sm:pt-4 relative w-full overflow-visible">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="flex flex-col items-center justify-center relative w-full max-w-sm mx-auto"
              >
                {/* 3D Flipping Profile Picture Container with Wider Orbiting Design Tools */}
                <div
                  id="profile-flip-card"
                  onMouseEnter={() => setIsProfileFlipped(true)}
                  onMouseLeave={() => setIsProfileFlipped(false)}
                  onClick={() => setIsProfileFlipped((prev) => !prev)}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 perspective-1000 cursor-pointer select-none mx-auto touch-manipulation flex flex-col items-center justify-center"
                  title="Hover or tap to flip and see my tools!"
                >
                  {/* Orbiting Design Tools: Much Wider Radius & Larger Icon Sizes */}
                  <AnimatePresence>
                    {isProfileFlipped && (
                      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                        {PROFILE_TOOLS.map((tool, idx) => {
                          const angle = (idx * 360) / PROFILE_TOOLS.length;
                          const rad = (angle * Math.PI) / 180;
                          // Wide orbit radius: 235px on desktop, 195px on tablet, 155px on mobile
                          const targetX = Math.round(235 * Math.cos(rad));
                          const targetY = Math.round(235 * Math.sin(rad));

                          return (
                            <motion.div
                              key={tool.id}
                              initial={{
                                scale: 0,
                                opacity: 0,
                                x: 0,
                                y: 0,
                                rotate: -20,
                              }}
                              animate={{
                                scale: 1,
                                opacity: 1,
                                x: targetX,
                                y: targetY,
                                rotate: 0,
                              }}
                              exit={{
                                scale: 0,
                                opacity: 0,
                                x: 0,
                                y: 0,
                                rotate: 20,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: idx * 0.012,
                              }}
                              className="absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white shadow-2xl border border-black/15 p-2 sm:p-2.5 flex items-center justify-center overflow-hidden pointer-events-auto hover:scale-125 transition-transform duration-150"
                              title={tool.title}
                            >
                              <img
                                src={tool.img}
                                alt={tool.title}
                                className="w-full h-full object-contain pointer-events-none"
                                referrerPolicy="no-referrer"
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>

                  <div
                    className={`relative w-full h-full duration-700 transform-style-3d transition-transform ease-out rounded-2xl ${
                      isProfileFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front Face: Profile Picture */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                      <img
                        src="https://res.cloudinary.com/si0bugwt/image/upload/v1784004451/1779881839193_xqxckt.png"
                        alt="Mallika Nethra Profile"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Back Face: Cartoon Image of Mallika */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                      <img
                        src="https://res.cloudinary.com/si0bugwt/image/upload/v1784004339/Beige_Blue_Gradient_Motivation_Qoute_Instagram_Post_2_t3fvv6.png"
                        alt="Cartoon Mallika Nethra"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Personality Trailer Button INSIDE the orbit circle structure */}
                <div className="mt-4 flex flex-col items-center justify-center z-20">
                  <button
                    id="personality-trailer-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVideoModalOpen(true);
                    }}
                    className="sketchy-btn px-5 sm:px-6 py-2 sm:py-2.5 bg-white/95 hover:bg-[#0012ff] text-[#0012ff] hover:text-white font-display font-medium text-xs sm:text-sm tracking-tight lowercase transition-colors duration-300 flex items-center gap-2 cursor-pointer shadow-md min-h-[40px]"
                    style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span>personality trailer</span>
                  </button>

                  {/* Mobile / Desktop Hint */}
                  <span className="mt-1.5 text-[10px] text-[#0A0A0A]/50 font-mono tracking-tight text-center md:hidden">
                    (tap to flip & see tools)
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: DELHI METRO LINES PROJECT MAP */}
        {/* ========================================================= */}
        <DelhiMetroMap />

        {/* ========================================================= */}
        {/* SECTION 3: EXPERIENCES SECTION (SCATTERED DESKTOP ICONS & DOCK) */}
        {/* ========================================================= */}
        <MacExperiencesDesktop />
      </main>

      {/* 5. Personality Trailer Video Modal */}
      <PersonalityVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://res.cloudinary.com/si0bugwt/video/upload/v1784004809/download_lo5szd.mp4"
      />

      {/* 6. Resume Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
