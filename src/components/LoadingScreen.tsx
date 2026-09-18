import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate flow progress over 3.2 seconds
    const duration = 3200;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(currentStep / steps, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        clearInterval(timer);
        // Add a slight lag for high visual payoff before revealing main app
        setTimeout(() => {
          onComplete();
        }, 600);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 w-full h-full z-40 flex flex-col justify-center items-center overflow-hidden"
      style={{
        // Match the premium metallic silver-grey radial gradient of the main application
        background: `
          radial-gradient(
            circle at 50% 50%,
            #FCFCFC 0%,
            #EAEAEA 20%,
            #D4D4D4 45%,
            #B8B8B8 70%,
            #808080 100%
          )
        `,
      }}
    >
      {/* Structural horizontal ribbon container spanning the middle-upper (1/4th vertical area) */}
      <div className="w-full relative h-[480px] flex items-center justify-center">
        <svg
          className="w-full h-full select-none pointer-events-none"
          viewBox="0 0 1000 480"
          preserveAspectRatio="none"
        >
          {/* Gradients used for the 3D metal reflection and the flowing substance */}
          <defs>
            {/* The beautiful flowing blue and purple substance gradient */}
            <linearGradient id="substanceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8E49FC" />
              <stop offset="50%" stopColor="#4160F9" />
              <stop offset="100%" stopColor="#0012ff" />
            </linearGradient>
            
            {/* Simulated specular highlights on the E8E8E8 tube to make it look 3D */}
            <linearGradient id="metalPipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D8D8D8" />
              <stop offset="40%" stopColor="#F5F5F5" />
              <stop offset="70%" stopColor="#E8E8E8" />
              <stop offset="100%" stopColor="#B0B0B0" />
            </linearGradient>

            {/* Shadow filter for 3D depth */}
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* SVG Path: Beautiful edge-to-edge line with a rollercoaster-like 3D loop in the middle */}
          {/* Path Y-coordinates scaled by 1.2 relative to baseline of 240 for 20% height expansion */}
          <g filter="url(#shadow)">
            {/* 1. Underlying Soft Glow Track */}
            <path
              d="M 0,240 C 250,240 350,336 430,264 C 475,222 450,96 500,96 C 555,96 525,222 470,288 C 420,348 550,240 700,240 L 1000,240"
              fill="none"
              stroke="#000000"
              strokeWidth="24"
              strokeOpacity="0.06"
              strokeLinecap="round"
            />

            {/* 2. Thick 3D Loop Base (#E8E8E8) */}
            <path
              d="M 0,240 C 250,240 350,336 430,264 C 475,222 450,96 500,96 C 555,96 525,222 470,288 C 420,348 550,240 700,240 L 1000,240"
              fill="none"
              stroke="url(#metalPipeGrad)"
              strokeWidth="18"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* 3. Sleek Inner White Refraction Line to finish the 3D tube effect */}
            <path
              d="M 0,240 C 250,240 350,336 430,264 C 475,222 450,96 500,96 C 555,96 525,222 470,288 C 420,348 550,240 700,240 L 1000,240"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeOpacity="0.5"
              transform="translate(0, -3)"
            />

            {/* 4. The Flowing Substance (Blue & Purple) from left to right */}
            <path
              d="M 0,240 C 250,240 350,336 430,264 C 475,222 450,96 500,96 C 555,96 525,222 470,288 C 420,348 550,240 700,240 L 1000,240"
              fill="none"
              stroke="url(#substanceGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 - progress * 100}
              style={{
                transition: "stroke-dashoffset 150ms ease-out",
              }}
            />
          </g>
        </svg>

        {/* Subtle dripping glitter particles under the loop for visual fidelity */}
        <div 
          className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible mix-blend-screen"
        >
          {progress > 0.4 && progress < 0.95 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Simulated dripping energy particles in the loop intersection area */}
              <div className="w-[4px] h-[4px] bg-[#8E49FC] rounded-full absolute animate-ping opacity-65 translate-y-12" />
              <div className="w-[3px] h-[3px] bg-[#0012ff] rounded-full absolute animate-bounce opacity-80 translate-x-4 translate-y-8" />
              <div className="w-[5px] h-[5px] bg-white rounded-full absolute animate-pulse opacity-90 -translate-x-6 translate-y-10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
