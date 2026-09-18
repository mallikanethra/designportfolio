import React, { useEffect, useRef, useState } from "react";

// Pixel matrices (5x7) for the letters: t, r, i, n, a, e, h
const LETTER_MATRICES: Record<string, number[][]> = {
  t: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  r: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  i: [
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  n: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  a: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  e: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  h: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
};

// Word spelling: "trinaethra" (indices 0 to 9)
const WORD_SPELLING = ["t", "r", "i", "n", "a", "e", "t", "h", "r", "a"];

export default function PixelText() {
  const [logoState, setLogoState] = useState<"stable" | "glitch" | "eye">("stable");
  const [glitchedGrid, setGlitchedGrid] = useState<number[][]>(LETTER_MATRICES.a);
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  // Track cursor position globally and update pupil directly (no re-renders, high-performance)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (logoState !== "eye" || !eyeRef.current || !pupilRef.current) return;

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - eyeCenterX;
      const dy = e.clientY - eyeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
        pupilRef.current.style.transform = "translate3d(0px, 0px, 0px)";
        return;
      }

      // Limit eyeball movement to keep it within the vertical eye sclera bounds
      const maxOffset = 6; // relative to SVG viewport coordinate system (viewBox is 0 0 29 41)
      const scale = Math.min(maxOffset, distance * 0.04);
      const offsetX = (dx / distance) * scale;
      const offsetY = (dy / distance) * Math.min(10, distance * 0.06);

      pupilRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && logoState === "eye" && eyeRef.current && pupilRef.current) {
        const touch = e.touches[0];
        const rect = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = touch.clientX - eyeCenterX;
        const dy = touch.clientY - eyeCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
          pupilRef.current.style.transform = "translate3d(0px, 0px, 0px)";
          return;
        }

        const maxOffset = 6;
        const scale = Math.min(maxOffset, distance * 0.04);
        const offsetX = (dx / distance) * scale;
        const offsetY = (dy / distance) * Math.min(10, distance * 0.06);

        pupilRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [logoState]);

  // Handle the glitch sequence on load (stable -> glitch -> eye)
  useEffect(() => {
    let glitchInterval: number;
    let transitionToGlitch: number;
    let transitionToEye: number;

    // Start as stable
    setLogoState("stable");

    // After 1000ms, start glitching
    transitionToGlitch = window.setTimeout(() => {
      setLogoState("glitch");

      glitchInterval = window.setInterval(() => {
        const randomized: number[][] = Array(7)
          .fill(0)
          .map(() =>
            Array(5)
              .fill(0)
              .map(() => (Math.random() > 0.5 ? 1 : 0))
          );
        setGlitchedGrid(randomized);
      }, 70);
    }, 1000);

    // After another 1200ms (total 2200ms), transition to eye
    transitionToEye = window.setTimeout(() => {
      clearInterval(glitchInterval);
      setLogoState("eye");
    }, 2200);

    return () => {
      clearTimeout(transitionToGlitch);
      clearTimeout(transitionToEye);
      clearInterval(glitchInterval);
    };
  }, []);

  // Periodic blinking cycle for the eye
  useEffect(() => {
    if (logoState !== "eye") return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150); // fast blink duration
    }, 3800 + Math.random() * 2000); // blink every 3.8 to 5.8 seconds

    return () => clearInterval(blinkInterval);
  }, [logoState]);

  // Helper to render static pixelated letter with thick blocks (original size)
  const renderPixelLetter = (letter: string) => {
    const matrix = LETTER_MATRICES[letter] || LETTER_MATRICES.t;
    return (
      <div className="grid grid-cols-5 gap-[1px] w-[29px] h-[41px]" aria-label={letter}>
        {matrix.flat().map((pixel, i) => (
          <div
            key={i}
            className={`w-[5px] h-[5px] rounded-none transition-all duration-300 ${
              pixel === 1 ? "bg-[#0A0A0A] shadow-[0_0_1px_rgba(0,0,0,0.2)]" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center select-none pt-4">
      {/* Container holding the letters of trinaethra - original gap sizes */}
      <div className="flex items-center gap-[6px] md:gap-[9px]">
        {WORD_SPELLING.map((letter, idx) => {
          const isTheSpecialLetterA = idx === 4; // 5th letter 'a' (index 4)

          if (isTheSpecialLetterA) {
            return (
              <div
                key={idx}
                ref={eyeRef}
                className="relative w-[29px] h-[41px] flex items-center justify-center overflow-visible"
              >
                {logoState === "stable" ? (
                  // Stable Pixelated Grid State with thick blocks
                  <div className="grid grid-cols-5 gap-[1px] w-[29px] h-[41px]">
                    {LETTER_MATRICES.a.flat().map((pixel, i) => (
                      <div
                        key={i}
                        className={`w-[5px] h-[5px] rounded-none ${
                          pixel === 1
                            ? "bg-[#0A0A0A] shadow-[0_0_1px_rgba(0,0,0,0.2)]"
                            : "bg-transparent"
                        } transition-all duration-300`}
                      />
                    ))}
                  </div>
                ) : logoState === "glitch" ? (
                  // Glitching Pixelated Grid State with thick blocks
                  <div className="grid grid-cols-5 gap-[1px] w-[29px] h-[41px]">
                    {glitchedGrid.flat().map((pixel, i) => (
                      <div
                        key={i}
                        className={`w-[5px] h-[5px] rounded-none ${
                          pixel === 1
                            ? "bg-[#0A0A0A] scale-105 shadow-[0_0_2px_#0012ff]"
                            : "bg-transparent"
                        } transition-transform duration-70`}
                      />
                    ))}
                  </div>
                ) : (
                  // Streamline, Vertical (Top-to-Down) Blinking Eye State with Eyelashes
                  <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                    <svg
                      width="29"
                      height="41"
                      viewBox="0 0 29 41"
                      className="absolute overflow-visible"
                    >
                      <defs>
                        {/* Clip-path for the sclera of the vertical streamline eye */}
                        <clipPath id="vertical-sclera-clip">
                          <path
                            d="M 14.5,4 C 23,12 23,29 14.5,37 C 6,29 6,12 14.5,4 Z"
                          />
                        </clipPath>
                      </defs>

                      {/* --- Eyelashes --- */}
                      {/* Left Eyelashes */}
                      <line
                        x1="8"
                        y1="12"
                        x2="2"
                        y2="8"
                        stroke="#0A0A0A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="6"
                        y1="20.5"
                        x2="0"
                        y2="20.5"
                        stroke="#0A0A0A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="8"
                        y1="29"
                        x2="2"
                        y2="33"
                        stroke="#0A0A0A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      {/* Right Eyelashes */}
                      <line
                        x1="21"
                        y1="12"
                        x2="27"
                        y2="8"
                        stroke="#0A0A0A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="23"
                        y1="20.5"
                        x2="29"
                        y2="20.5"
                        stroke="#0A0A0A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="21"
                        y1="29"
                        x2="27"
                        y2="33"
                        stroke="#0A0A0A"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      {/* --- Eye Sclera (White base) --- */}
                      <path
                        d="M 14.5,4 C 23,12 23,29 14.5,37 C 6,29 6,12 14.5,4 Z"
                        fill="#FFFFFF"
                        stroke="#0A0A0A"
                        strokeWidth="1.5"
                      />

                      {/* --- Eyeball & Lids Clipped Content --- */}
                      <g clipPath="url(#vertical-sclera-clip)">
                        {/* Brown iris that tracks the mouse - update style transform for high performance */}
                        <g ref={pupilRef} style={{ transformOrigin: "14.5px 20.5px", transition: "transform 0.05s ease-out", willChange: "transform" }}>
                          {/* Iris */}
                          <circle cx="14.5" cy="20.5" r="5.5" fill="#613613" />
                          {/* Pupil */}
                          <circle cx="14.5" cy="20.5" r="2.8" fill="#0A0A0A" />
                          {/* Highlight */}
                          <circle cx="13" cy="19" r="1" fill="#FFFFFF" />
                        </g>

                        {/* Top and Bottom eyelids for blinking animation */}
                        <rect
                          x="0"
                          y="0"
                          width="29"
                          height="20.5"
                          fill="#0A0A0A"
                          style={{
                            transform: isBlinking ? "translateY(0)" : "translateY(-21px)",
                            transition: "transform 0.1s ease-in-out",
                          }}
                        />
                        <rect
                          x="0"
                          y="20.5"
                          width="29"
                          height="20.5"
                          fill="#0A0A0A"
                          style={{
                            transform: isBlinking ? "translateY(0)" : "translateY(21px)",
                            transition: "transform 0.1s ease-in-out",
                          }}
                        />
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            );
          }

          // Static standard pixel letters
          return <React.Fragment key={idx}>{renderPixelLetter(letter)}</React.Fragment>;
        })}
      </div>
    </div>
  );
}

