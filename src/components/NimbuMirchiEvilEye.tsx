import React, { useState } from "react";
import { motion } from "motion/react";

interface NimbuMirchiEvilEyeProps {
  isOpen?: boolean;
}

export default function NimbuMirchiEvilEye({ isOpen }: NimbuMirchiEvilEyeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={
        isOpen
          ? { rotate: [0, 10, -10, 5, -3, 0], y: 2 }
          : isHovered
          ? {
              rotate: [0, -12, 10, -8, 6, -3, 2, 0],
            }
          : {
              rotate: [0, 2, -2, 1.5, -1.5, 0],
              y: 0,
            }
      }
      transition={
        isOpen
          ? { duration: 0.65, ease: "easeOut" }
          : isHovered
          ? {
              duration: 1.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.2,
            }
          : {
              duration: 4,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }
      }
      className="relative flex flex-col items-center select-none cursor-pointer group"
      style={{ transformOrigin: "25px -40px" }}
    >
      <svg
        width="50"
        height="125"
        viewBox="0 0 50 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible filter drop-shadow-[0_4px_12px_rgba(0,18,255,0.18)]"
      >
        {/* ========================================================= */}
        {/* 0. LONG STRING EXTENDING PAST THE TOP EDGE OF THE SCREEN  */}
        {/* ========================================================= */}
        {/* String extends from y = -60 (past the top edge of screen) down through the entire talisman */}
        <path
          d="M 25 -60 L 25.2 -30 L 24.8 0 L 25.2 25 L 24.8 55 L 25 85 L 25 110"
          stroke="#18181B"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="none"
        />

        {/* ========================================================= */}
        {/* 1. TOP: NIMBU (LEMON) IN ORGANIC SKETCH-PEN STYLE         */}
        {/* ========================================================= */}
        <g id="sketch-nimbu">
          {/* Top Thread Tie Knot */}
          <circle cx="25" cy="5" r="2" fill="#18181B" />
          <path d="M 23 4 C 21 2 20 0 19 -1" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 27 4 C 29 2 30 0 31 -1" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Lemon Body: Organic sketchy marker fill */}
          <path
            d="M 25 7 C 32 7.5 35 12 34 18 C 33 23 29 25.5 25 26 C 21 25.5 17 23 16 18 C 15 12 18 7.5 25 7 Z"
            fill="#FFE600"
          />

          {/* Lemon Sketch-Pen Ink Contour (Wobbly Hand-drawn feel) */}
          <path
            d="M 25 6.8 C 32.5 7.2 35.5 12 34.2 18.2 C 33.1 23.4 29.2 25.8 25 26.2 C 20.8 25.8 16.9 23.4 15.8 18.2 C 14.5 12 17.5 7.2 25 6.8 Z"
            stroke="#18181B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sketch Pen Hatching / Shading & Citrus Dimples */}
          <path
            d="M 18.5 14 C 18 16 18.5 19 20 21"
            stroke="#EAB308"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M 29.5 11 C 31.5 13 32 16 31.5 19"
            stroke="#18181B"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Highlight Accent */}
          <path
            d="M 22 10.5 C 24 9.5 27 9.8 28.5 11"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Lemon Bottom Tip */}
          <path
            d="M 24 26 C 25 27.5 25 27.5 26 26"
            stroke="#18181B"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="#CA8A04"
          />
          {/* Middle Thread Knot between Nimbu & Chillies */}
          <circle cx="25" cy="27.5" r="1.6" fill="#18181B" />
        </g>

        {/* ========================================================= */}
        {/* 2. MIDDLE: 5 HORIZONTAL GREEN CHILLIES (SKETCH-PEN STYLE)  */}
        {/* ========================================================= */}
        <g id="sketch-5-horizontal-chillies">
          {/* CHILLI 1 (Top Horizontal) */}
          <g id="chilli-1">
            {/* Stem Cap */}
            <path d="M 10 32 C 9 30 7 29.5 5.5 30" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="10" cy="32" rx="2" ry="3" fill="#14532D" stroke="#18181B" strokeWidth="1.5" />
            {/* Chilli Body Fill */}
            <path
              d="M 10 30.5 Q 25 28.5 40 32.5 C 42 33 42 34 39.5 34.5 Q 25 32 10 33.5 Z"
              fill="#22C55E"
            />
            {/* Hand-drawn Sketch Outline */}
            <path
              d="M 10 30.5 Q 25 28.5 40 32.5 C 42.2 33.2 41.8 34.2 39.5 34.5 Q 25 32 10 33.5 Z"
              stroke="#18181B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Sketch Highlight Streak */}
            <path d="M 13 31.5 Q 25 30 36 33" stroke="#86EFAC" strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* CHILLI 2 (Second Horizontal - facing left) */}
          <g id="chilli-2">
            {/* Stem Cap on right */}
            <path d="M 40 37.5 C 41 35.5 43 35 44.5 35.5" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="40" cy="37.5" rx="2" ry="3" fill="#166534" stroke="#18181B" strokeWidth="1.5" />
            {/* Chilli Body Fill */}
            <path
              d="M 40 36 Q 25 34 10 37.8 C 7.8 38.3 7.8 39.3 10.5 39.8 Q 25 37.5 40 39 Z"
              fill="#16A34A"
            />
            {/* Sketch Outline */}
            <path
              d="M 40 36 Q 25 34 10 37.8 C 7.8 38.3 7.8 39.3 10.5 39.8 Q 25 37.5 40 39 Z"
              stroke="#18181B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 37 37 Q 25 35.5 14 38.2" stroke="#4ADE80" strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* CHILLI 3 (Middle Horizontal - slightly longer curve) */}
          <g id="chilli-3">
            <path d="M 8 43 C 7 41 5 40.5 3.5 41" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="8" cy="43" rx="2.2" ry="3.2" fill="#14532D" stroke="#18181B" strokeWidth="1.5" />
            <path
              d="M 8 41.5 Q 25 39 42 43.5 C 44.5 44.2 44 45.2 41.5 45.8 Q 25 43 8 44.5 Z"
              fill="#22C55E"
            />
            <path
              d="M 8 41.5 Q 25 39 42 43.5 C 44.5 44.2 44 45.2 41.5 45.8 Q 25 43 8 44.5 Z"
              stroke="#18181B"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 11 42.5 Q 25 40.5 38 44" stroke="#86EFAC" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* CHILLI 4 (Fourth Horizontal - facing left) */}
          <g id="chilli-4">
            <path d="M 41 49 C 42 47 44 46.5 45.5 47" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="41" cy="49" rx="2" ry="3" fill="#166534" stroke="#18181B" strokeWidth="1.5" />
            <path
              d="M 41 47.5 Q 25 45 9 49.5 C 7 50 7 51 9.5 51.5 Q 25 49 41 50.5 Z"
              fill="#16A34A"
            />
            <path
              d="M 41 47.5 Q 25 45 9 49.5 C 7 50 7 51 9.5 51.5 Q 25 49 41 50.5 Z"
              stroke="#18181B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 38 48.5 Q 25 46.8 13 50" stroke="#4ADE80" strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* CHILLI 5 (Fifth Horizontal) */}
          <g id="chilli-5">
            <path d="M 11 55 C 10 53 8 52.5 6.5 53" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="11" cy="55" rx="2" ry="3" fill="#14532D" stroke="#18181B" strokeWidth="1.5" />
            <path
              d="M 11 53.5 Q 25 51.5 39 55.5 C 41 56 41 57 38.5 57.5 Q 25 55 11 56.5 Z"
              fill="#22C55E"
            />
            <path
              d="M 11 53.5 Q 25 51.5 39 55.5 C 41 56 41 57 38.5 57.5 Q 25 55 11 56.5 Z"
              stroke="#18181B"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 14 54.5 Q 25 53 35 56" stroke="#86EFAC" strokeWidth="1.1" strokeLinecap="round" />
          </g>

          {/* String Knot before Dreamcatcher */}
          <circle cx="25" cy="59" r="1.8" fill="#18181B" />
        </g>

        {/* ========================================================= */}
        {/* 3. BOTTOM: BLUE EVIL EYE DREAMCATCHER (SKETCH-PEN STYLE)  */}
        {/* ========================================================= */}
        <g id="sketch-evil-eye-dreamcatcher">
          {/* Dreamcatcher Loop Knot */}
          <circle cx="25" cy="65" r="1.8" fill="#0012FF" />

          {/* Outer Hand-drawn Dreamcatcher Hoop */}
          <path
            d="M 25 65.5 C 34.5 65.5 41.5 72.5 41.5 82 C 41.5 91.5 34.5 98.5 25 98.5 C 15.5 98.5 8.5 91.5 8.5 82 C 8.5 72.5 15.5 65.5 25 65.5 Z"
            fill="#FFFFFF"
            stroke="#0012FF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Sketchy Dreamcatcher Webbing (Hand-inked radial geometric lines) */}
          <path
            d="M 25 66 L 33 71 L 38 78 L 38 86 L 33 93 L 25 98 L 17 93 L 12 86 L 12 78 L 17 71 Z"
            stroke="#0012FF"
            strokeWidth="1"
            strokeOpacity="0.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 25 72 L 32 77 L 32 87 L 25 92 L 18 87 L 18 77 Z"
            stroke="#00D2FF"
            strokeWidth="0.9"
            strokeOpacity="0.7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Concentric Evil Eye Rings in Sketch-Pen Texture */}
          {/* Sky Cyan Disc */}
          <path
            d="M 25 74 C 29.5 74 33 77.5 33 82 C 33 86.5 29.5 90 25 90 C 20.5 90 17 86.5 17 82 C 17 77.5 20.5 74 25 74 Z"
            fill="#00D2FF"
            stroke="#0012FF"
            strokeWidth="1.2"
          />

          {/* White Mid Ring */}
          <path
            d="M 25 77 C 27.8 77 30 79.2 30 82 C 30 84.8 27.8 87 25 87 C 22.2 87 20 84.8 20 82 C 20 79.2 22.2 77 25 77 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="1"
          />

          {/* Black Sketch Pupil */}
          <circle cx="25" cy="82" r="2.5" fill="#09090B" stroke="#0012FF" strokeWidth="0.8" />
          {/* White Catchlight Glint */}
          <circle cx="23.8" cy="80.8" r="0.9" fill="#FFFFFF" />

          {/* 3 DANGLING SKETCH-PEN FEATHERS & BEADS */}
          {/* Center Feather */}
          <g id="feather-center">
            {/* Hanging Thread & Beads */}
            <path d="M 25 98.5 L 25 107" stroke="#18181B" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="25" cy="103" r="1.4" fill="#00D2FF" stroke="#18181B" strokeWidth="0.8" />

            {/* Sketched Feather Blade */}
            <path
              d="M 25 106 C 22 110 22 118 25 124 C 28 118 28 110 25 106 Z"
              fill="#00D2FF"
              stroke="#0012FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Feather Central Quill Spine */}
            <path d="M 25 106 L 25 123" stroke="#0012FF" strokeWidth="1" strokeLinecap="round" />
            {/* Feather Vane Lines */}
            <path d="M 23.5 111 L 25 113 M 26.5 111 L 25 113" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 23.5 116 L 25 118 M 26.5 116 L 25 118" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* Left Feather */}
          <g id="feather-left">
            <path d="M 17 94 L 14 104" stroke="#18181B" strokeWidth="1" strokeLinecap="round" />
            <circle cx="15.5" cy="99" r="1.2" fill="#FFE600" stroke="#18181B" strokeWidth="0.8" />
            <path
              d="M 14 103 C 11.5 106.5 11.5 113 14 118 C 16.5 113 16.5 106.5 14 103 Z"
              fill="#0012FF"
              stroke="#18181B"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 14 103 L 14 117" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* Right Feather */}
          <g id="feather-right">
            <path d="M 33 94 L 36 104" stroke="#18181B" strokeWidth="1" strokeLinecap="round" />
            <circle cx="34.5" cy="99" r="1.2" fill="#22C55E" stroke="#18181B" strokeWidth="0.8" />
            <path
              d="M 36 103 C 33.5 106.5 33.5 113 36 118 C 38.5 113 38.5 106.5 36 103 Z"
              fill="#0012FF"
              stroke="#18181B"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 36 103 L 36 117" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      {/* Floating Mini Close '✕' Badge when menu is active */}
      {isOpen && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-2 right-0 flex items-center justify-center font-mono font-bold text-white text-[10px] pointer-events-none select-none bg-[#0012FF] rounded-full w-5 h-5 shadow-lg border-2 border-white"
        >
          ✕
        </motion.span>
      )}
    </motion.div>
  );
}
