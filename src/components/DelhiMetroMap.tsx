import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { METRO_STATIONS_DATA, MetroStationAsset, getCircleThumbnailUrl, getFullPreviewUrl } from "../assets/assets";

export type MetroStation = MetroStationAsset;

export interface MetroLine {
  id: "product" | "furniture" | "transport" | "experience" | "visual";
  name: string;
  colorName: string;
  colorHex: string;
  pathD: string;
}

// 5 Highly Stylized Sketch-like Designer Vector Hats (No container, authentic hand-drawn ink & crosshatch feel)
const HATS = [
  {
    id: "top-hat",
    name: "top hat",
    svg: (
      <svg viewBox="0 0 54 54" className="w-full h-full overflow-visible">
        {/* Hand-drawn Sketchy Brim with double contour */}
        <path
          d="M 5 40 Q 27 45 49 40 Q 27 36 5 40 Z"
          fill="#0A0A0A"
          stroke="#0012FF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 7 39.5 Q 27 43.5 47 39.5"
          fill="none"
          stroke="#0012FF"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        
        {/* Cylinder Body with sketch contours & pencil hatch lines */}
        <path
          d="M 13 38.5 Q 12 25 14 13 Q 27 15 40 13 Q 42 25 41 38.5 Z"
          fill="#0A0A0A"
          stroke="#0012FF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Sketched Top Oval */}
        <ellipse
          cx="27"
          cy="13"
          rx="13"
          ry="3.5"
          fill="#1E293B"
          stroke="#0012FF"
          strokeWidth="1.4"
        />
        
        {/* Sketch Cross-hatch Shading Lines on side */}
        <line x1="16" y1="16" x2="21" y2="36" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <line x1="19" y1="17" x2="24" y2="35" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <line x1="22" y1="18" x2="26" y2="33" stroke="#3B82F6" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

        {/* Vibrant Blue Designer Ribbon Band with Hand-drawn Edge */}
        <path
          d="M 13.5 35.5 Q 27 38.5 40.5 35.5 L 40.8 30 Q 27 33 13.2 30 Z"
          fill="#0012FF"
          stroke="#0012FF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Ribbon Highlight Sketch Line */}
        <path d="M 15 32 Q 27 34.5 39 32" stroke="#93C5FD" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "beach-hat",
    name: "beach hat",
    svg: (
      <svg viewBox="0 0 54 54" className="w-full h-full overflow-visible">
        {/* Wide Floppy Hand-Sketched Straw Brim with Organic Undulations */}
        <path
          d="M 3 39 C 14 32 27 35 40 33 C 48 31 52 38 46 42 C 34 46 16 46 4 43 C 1 42 1 40 3 39 Z"
          fill="#FDE68A"
          stroke="#0012FF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Hand-drawn Straw Weave Hatch Lines */}
        <path d="M 8 40 Q 18 36 28 38" stroke="#D97706" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        <path d="M 28 38 Q 38 35 46 38" stroke="#D97706" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        <path d="M 12 42 Q 27 44 42 41" stroke="#D97706" strokeWidth="1" fill="none" strokeDasharray="2 2" />

        {/* Rounded Straw Crown with Hand-Sketched Contour */}
        <path
          d="M 16 35 C 15 18 39 18 38 35 Z"
          fill="#FBBF24"
          stroke="#0012FF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Crown Vertical Weave Shading */}
        <path d="M 22 23 Q 22 34 22 35" stroke="#B45309" strokeWidth="1" fill="none" />
        <path d="M 27 21 Q 27 34 27 35" stroke="#B45309" strokeWidth="1" fill="none" />
        <path d="M 32 23 Q 32 34 32 35" stroke="#B45309" strokeWidth="1" fill="none" />

        {/* Flowing Sketched Blue Ribbon with Floating Bow Ties */}
        <path
          d="M 16.5 33 Q 27 31 37.5 33 Q 37.5 36 27 34 Q 16.5 36 16.5 33 Z"
          fill="#0012FF"
          stroke="#0012FF"
          strokeWidth="1.4"
        />
        {/* Sketched Bow Knot & Fluttering Ribbons */}
        <circle cx="36" cy="34" r="2.5" fill="#0012FF" stroke="#0012FF" strokeWidth="1" />
        <path d="M 36 34 Q 45 37 43 45" stroke="#0012FF" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 36 34 Q 41 42 38 48" stroke="#0012FF" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 36 34 Q 46 33 48 37" stroke="#0012FF" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "beret",
    name: "barret",
    svg: (
      <svg viewBox="0 0 54 54" className="w-full h-full overflow-visible">
        {/* Sketchy Artist Beret Fitted Base Band */}
        <ellipse cx="24" cy="37" rx="14" ry="4" fill="#0F172A" stroke="#0012FF" strokeWidth="1.5" />
        
        {/* French Beret Slanted Oversized Artistic Crown with Dramatic Hand-drawn Fold */}
        <path
          d="M 5 32 C 4 16 41 12 49 26 C 50 36 14 41 5 32 Z"
          fill="#0012FF"
          stroke="#0A0A0A"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Hand-drawn Charcoal Fold Creases */}
        <path
          d="M 12 28 C 17 20 37 19 44 26"
          stroke="#93C5FD"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 15 31 C 22 25 35 25 41 30"
          stroke="#BFDBFE"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Center Stalk (Choupette) with Pen Sketch lines */}
        <path d="M 28 17 L 29 11" stroke="#0012FF" strokeWidth="3" strokeLinecap="round" />
        <path d="M 28 17 L 29 11" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        {/* Creative Sparkle Star */}
        <path d="M 45 14 L 46 17 L 49 18 L 46 19 L 45 22 L 44 19 L 41 18 L 44 17 Z" fill="#0012FF" />
      </svg>
    ),
  },
  {
    id: "beanie",
    name: "beanie",
    svg: (
      <svg viewBox="0 0 54 54" className="w-full h-full overflow-visible">
        {/* Hand-sketched Ribbed Knit Beanie Cap */}
        <path
          d="M 12 35 C 11 15 41 15 40 35 Z"
          fill="#1E293B"
          stroke="#0012FF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Sketched Knit Seams and Rib Texture */}
        <path d="M 18 22 Q 18 35 18 35" stroke="#0012FF" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
        <path d="M 26 17 Q 26 35 26 35" stroke="#0012FF" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
        <path d="M 34 22 Q 34 35 34 35" stroke="#0012FF" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />

        {/* Hand-drawn Folded Blue Knit Cuff with Sketch Stitching */}
        <path
          d="M 9 33 Q 26 35 43 33 Q 44 42 42 42 Q 26 44 10 42 Q 8 42 9 33 Z"
          fill="#0012FF"
          stroke="#0A0A0A"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        {/* Cuff Vertical Knit Stitches */}
        <line x1="15" y1="35" x2="15" y2="41" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="21" y1="35" x2="21" y2="42" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="26" y1="36" x2="26" y2="42" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="31" y1="35" x2="31" y2="42" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="37" y1="35" x2="37" y2="41" stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" />

        {/* Fluffy Sketched Pom-pom on Top */}
        <circle cx="26" cy="15" r="5" fill="#3B82F6" stroke="#0012FF" strokeWidth="1.5" />
        <path d="M 23 12 L 29 18 M 29 12 L 23 18 M 26 10 L 26 20 M 21 15 L 31 15" stroke="#0012FF" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "cowboy-hat",
    name: "cowboy hat",
    svg: (
      <svg viewBox="0 0 54 54" className="w-full h-full overflow-visible">
        {/* Dynamic Hand-Sketched Upturned Curled Cowboy Brim */}
        <path
          d="M 3 34 C 7 44 45 44 49 34 C 43 40 9 40 3 34 Z"
          fill="#D97706"
          stroke="#0012FF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M 5 35 Q 26 44 47 35 Q 26 39 5 35 Z"
          fill="#92400E"
          stroke="#0012FF"
          strokeWidth="1.2"
        />
        
        {/* Pinched Creased Cowboy Crown with Dramatic Indent */}
        <path
          d="M 15 35 L 16 21 C 20 26 32 26 36 21 L 37 35 Z"
          fill="#B45309"
          stroke="#0012FF"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Center Crease Dip Shading */}
        <path
          d="M 21 21 Q 26 27 31 21"
          stroke="#0012FF"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 23 23 Q 26 27 29 23"
          stroke="#78350F"
          strokeWidth="2"
          fill="none"
        />

        {/* Hand-drawn Leather Band with Buckle & Stitch Marks */}
        <path
          d="M 15.5 33 Q 26 36 36.5 33 L 36.8 35.5 Q 26 38.5 15.2 35.5 Z"
          fill="#0A0A0A"
          stroke="#0012FF"
          strokeWidth="1.3"
        />
        <rect x="24.5" y="33" width="3" height="4" fill="#F59E0B" stroke="#0012FF" strokeWidth="0.8" rx="0.5" />
      </svg>
    ),
  },
];

// 5 Interconnected Network Lines inspired by Delhi Metro topology (radial corridors, 45° bends, interchange transfer hubs)
const METRO_LINES: MetroLine[] = [
  // 1. Product Line (Navy Blue, 8 stations): Diagonal corridor angled below visual line
  {
    id: "product",
    name: "product",
    colorName: "navy blue",
    colorHex: "#0B2545",
    pathD: "M 130 220 L 290 290 L 460 360 L 620 470 L 800 470 L 970 570 L 1140 680 L 1290 800",
  },
  // 2. Furniture Line (Electric Purple, 6 stations): Lower Loop & Eastern Connector
  {
    id: "furniture",
    name: "furniture",
    colorName: "electric purple",
    colorHex: "#8B00FF",
    pathD: "M 180 780 L 380 670 L 580 670 L 800 670 L 940 670 L 1030 540 L 1030 440 L 1240 440",
  },
  // 3. Transport Line (Emerald Green, 2 stations): Central North-South Spine
  {
    id: "transport",
    name: "transport",
    colorName: "emerald green",
    colorHex: "#059669",
    pathD: "M 660 60 L 660 210 L 660 330 L 660 470 L 660 670 L 660 850",
  },
  // 4. Experience Line (Teal, 6 stations): South-West to North-East Transversal Corridor
  {
    id: "experience",
    name: "experience",
    colorName: "teal",
    colorHex: "#0D9488",
    pathD: "M 120 520 L 280 520 L 440 470 L 550 400 L 660 330 L 880 330 L 1030 330 L 1180 240 L 1280 240",
  },
  // 5. Visual Line (Sky Blue, 5 stations): Northern Arc & East Radial
  {
    id: "visual",
    name: "visual",
    colorName: "skyblue",
    colorHex: "#0284C7",
    pathD: "M 100 100 L 240 100 L 440 100 L 550 100 L 660 210 L 780 210 L 900 100 L 1120 100 L 1280 100",
  },
];

const STATIONS_DATA = METRO_STATIONS_DATA;

// Major Interchange Transfer Hubs where lines cross
const INTERCHANGE_HUBS = [
  { cx: 660, cy: 210, lines: ["transport", "visual"] },
  { cx: 660, cy: 330, lines: ["transport", "experience"] },
  { cx: 620, cy: 470, lines: ["transport", "product"] },
  { cx: 660, cy: 670, lines: ["transport", "furniture"] },
  { cx: 1030, cy: 440, lines: ["furniture", "experience"] },
];

export default function DelhiMetroMap() {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<MetroStation | null>(null);
  const [currentHatIndex, setCurrentHatIndex] = useState(0);

  // Auto-cycle through the 5 sketch hats every 2.2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHatIndex((prev) => (prev + 1) % HATS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const getLine = (lineId: string) => METRO_LINES.find((l) => l.id === lineId);

  // Position calculation for 16:9 preview tooltip
  const getPreviewPosition = (st: MetroStation) => {
    const leftPercent = (st.cx / 1400) * 100;
    const topPercent = (st.cy / 940) * 100;
    const isRightSide = st.cx > 820;
    const isBottomSide = st.cy > 580;

    return {
      left: isRightSide ? undefined : `calc(${leftPercent}% + 20px)`,
      right: isRightSide ? `calc(${100 - leftPercent}% + 20px)` : undefined,
      top: isBottomSide ? undefined : `calc(${topPercent}% - 60px)`,
      bottom: isBottomSide ? `calc(${100 - topPercent}% - 60px)` : undefined,
    };
  };

  return (
    <div id="project-map" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header Row: Main Heading "All aboard!" + "I wear many hats" below it + Line Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 select-none">
        
        {/* Left Side: Bold Black Serif Main Heading with "I wear many hats" positioned directly below */}
        <div className="flex flex-col items-start gap-2 sm:gap-2.5 self-start md:self-end">
          {/* Main Heading: Bold Black Serif */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0A0A0A] tracking-tight leading-none"
            style={{ fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif' }}
          >
            All aboard!
          </h2>

          {/* Sub-Group directly below Heading: Freestanding Bopping Hand-Sketched Hat + Scrapbook Chips */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div 
              onClick={() => setCurrentHatIndex((prev) => (prev + 1) % HATS.length)}
              className="animate-card-bop origin-bottom cursor-pointer select-none relative flex items-center justify-center p-0"
              title="Click to cycle hats!"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={HATS[currentHatIndex].id}
                    initial={{ opacity: 0, scale: 0.7, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 4 }}
                    transition={{ duration: 0.22 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {HATS[currentHatIndex].svg}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Colourful Scrapbook Style Typography: Tactile cut-out paper sticker chips */}
            <div className="flex items-center gap-1 select-none">
              {/* "I" */}
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#FFE600] text-[#0A0A0A] font-black text-xs sm:text-sm rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.12)] transform -rotate-4 border border-black/15 font-mono tracking-tight"
              >
                I
              </span>
              {/* "wear" */}
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#FF477E] text-white font-black text-xs sm:text-sm rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.12)] transform rotate-3 border border-black/15 font-sans tracking-tight"
              >
                wear
              </span>
              {/* "many" */}
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#00D2FF] text-[#0A0A0A] font-black text-xs sm:text-sm rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.12)] transform -rotate-2 border border-black/15 font-mono tracking-tight"
              >
                many
              </span>
              {/* "hats" */}
              <span
                className="inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#4ADE80] text-[#0A0A0A] font-black text-xs sm:text-sm rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.12)] transform rotate-4 border border-black/15 font-sans tracking-tight"
              >
                hats
              </span>
            </div>
          </div>
        </div>

        {/* Elective Line Navigation Filter: Clean text-only buttons without dots */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-2.5">
          <button
            onClick={() => setSelectedLine(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-200 cursor-pointer ${
              selectedLine === null
                ? "bg-[#0A0A0A] text-white shadow-sm scale-105"
                : "bg-white/80 hover:bg-white text-[#0A0A0A]/70 hover:text-[#0A0A0A] border border-black/5"
            }`}
            style={{ fontFamily: '"Inter", "Neue Haas Grotesk", sans-serif' }}
          >
            all lines
          </button>

          {METRO_LINES.map((line) => {
            const isSelected = selectedLine === line.id;
            return (
              <button
                key={line.id}
                onClick={() => setSelectedLine(isSelected ? null : line.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer border"
                style={{
                  fontFamily: '"Inter", "Neue Haas Grotesk", sans-serif',
                  backgroundColor: isSelected ? line.colorHex : "rgba(255, 255, 255, 0.85)",
                  borderColor: isSelected ? line.colorHex : "rgba(0, 0, 0, 0.08)",
                  color: isSelected ? "#FFFFFF" : line.colorHex,
                  boxShadow: isSelected ? `0 2px 10px ${line.colorHex}45` : "none",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="capitalize">{line.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network Transit Map Canvas: Realistic Delhi Metro geometric topology */}
      <div className="relative w-full aspect-[1400/940] overflow-visible">
        {/* 1. Underlying SVG Vector Tracks & Transit Grid */}
        <svg
          className="absolute inset-0 w-full h-full select-none"
          viewBox="0 0 1400 940"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Metro Grid Background Pattern */}
            <pattern id="transit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Faint Architectural Grid Backdrop */}
          <rect width="1400" height="940" fill="url(#transit-grid)" />

          {/* Metro Network Connecting Tracks */}
          {METRO_LINES.map((line) => {
            const isLineActive = selectedLine === null || selectedLine === line.id;
            const opacity = isLineActive ? 1 : 0.12;

            return (
              <g key={line.id} style={{ opacity, transition: "opacity 0.35s ease" }}>
                {/* White casing track */}
                <path
                  d={line.pathD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Colored Transit Track */}
                <path
                  d={line.pathD}
                  fill="none"
                  stroke={line.colorHex}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Interchange Junction Rings at Line Crossings */}
          {INTERCHANGE_HUBS.map((hub, idx) => {
            const isAnyLineActive =
              selectedLine === null || hub.lines.includes(selectedLine);
            return (
              <circle
                key={`hub-${idx}`}
                cx={hub.cx}
                cy={hub.cy}
                r={32}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeDasharray="4 3"
                opacity={isAnyLineActive ? 0.6 : 0.1}
                className="pointer-events-none"
              />
            );
          })}
        </svg>

        {/* 2. Absolute HTML Station Nodes: 100% guaranteed image rendering & native clickability */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {STATIONS_DATA.map((st) => {
            const line = getLine(st.lineId);
            const isLineActive = selectedLine === null || selectedLine === st.lineId;
            const isHovered = hoveredStation?.id === st.id;
            const strokeColor = line ? line.colorHex : "#000";
            const opacity = isLineActive ? 1 : 0.12;
            const leftPercent = (st.cx / 1400) * 100;
            const topPercent = (st.cy / 940) * 100;

            return (
              <div
                key={st.id}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  opacity,
                  transition: "opacity 0.35s ease",
                  pointerEvents: isLineActive ? "auto" : "none",
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group z-20"
                onMouseEnter={() => setHoveredStation(st)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Station Anchor Link to Behance */}
                <a
                  href={st.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex flex-col items-center justify-center group focus:outline-none"
                  aria-label={`Open ${st.name} project on Behance`}
                >
                  {/* Outer Glow Ring on Hover */}
                  {isHovered && (
                    <div
                      className="absolute w-[68px] h-[68px] rounded-full border-2 animate-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-6"
                      style={{ borderColor: strokeColor, opacity: 0.8 }}
                    />
                  )}

                  {/* Circular Station Thumbnail Node */}
                  <div
                    className="w-[52px] h-[52px] rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md transition-all duration-200 group-hover:scale-110 relative shrink-0"
                    style={{
                      border: `3.5px solid ${strokeColor}`,
                      boxShadow: isHovered
                        ? `0 0 16px ${strokeColor}66, 0 4px 12px rgba(0,0,0,0.15)`
                        : "0 2px 6px rgba(0,0,0,0.12)",
                    }}
                  >
                    <img
                      src={getCircleThumbnailUrl(st.thumbnail, 240)}
                      alt={st.name}
                      className="w-full h-full object-cover rounded-full select-none"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      onError={(e) => {
                        // Fallback to direct URL if transformation fails
                        if (e.currentTarget.src !== st.thumbnail) {
                          e.currentTarget.src = st.thumbnail;
                        }
                      }}
                    />

                    {/* Subtle hover overlay tint */}
                    <div className="absolute inset-0 bg-[#0012ff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-full" />
                  </div>

                  {/* Station Name Label */}
                  <span
                    className="mt-1.5 text-[11px] sm:text-[12.5px] font-bold text-center capitalize tracking-tight whitespace-nowrap select-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] transition-colors duration-200 px-1"
                    style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", "Inter", sans-serif',
                      color: isHovered ? "#0012FF" : "#0A0A0A",
                    }}
                  >
                    {st.name}
                  </span>
                </a>
              </div>
            );
          })}
        </div>

        {/* 3. Rich Large Project Thumbnail Hover Preview Card (100% visible, completely uncropped) */}
        <AnimatePresence>
          {hoveredStation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                ...getPreviewPosition(hoveredStation),
                zIndex: 50,
              }}
              className="pointer-events-none w-80 sm:w-96 md:w-[420px] p-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.28)] border border-black/10 flex flex-col gap-2.5"
            >
              {/* Aspect Ratio Container with object-contain to ensure the full image is completely visible without any cropping */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0D0D11] shadow-inner flex items-center justify-center border border-black/10">
                <img
                  src={getFullPreviewUrl(hoveredStation.thumbnail, 1000)}
                  alt={hoveredStation.name}
                  className="w-full h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (e.currentTarget.src !== hoveredStation.thumbnail) {
                      e.currentTarget.src = hoveredStation.thumbnail;
                    }
                  }}
                />
                
                {/* Metro Line Badge Overlay */}
                <div
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white uppercase tracking-wider backdrop-blur-md shadow-md border border-white/20"
                  style={{ backgroundColor: getLine(hoveredStation.lineId)?.colorHex }}
                >
                  {getLine(hoveredStation.lineId)?.name} line
                </div>
              </div>

              {/* Station Info & Behance Callout */}
              <div className="flex items-center justify-between px-1">
                <span
                  className="font-display font-bold text-sm sm:text-base capitalize text-[#0A0A0A] tracking-tight"
                  style={{ fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", sans-serif' }}
                >
                  {hoveredStation.name}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-[#0012ff] flex items-center gap-1 font-mono">
                  click to view ↗
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom of the Delhi Metro Map: Bottom-Right small blue text note */}
      <div className="w-full flex justify-end items-center mt-4 pr-2 select-none">
        <span
          className="text-[10px] sm:text-[11px] text-[#0012FF] font-semibold tracking-tight opacity-90 hover:opacity-100 transition-opacity"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          * map reference by avid delhi metro user
        </span>
      </div>
    </div>
  );
}
