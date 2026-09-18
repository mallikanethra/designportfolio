import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp, ArrowDown, Upload, Trash2, ExternalLink, ArrowLeft } from "lucide-react";
import { compressImage } from "../lib/imageCompressor";
import { getAsset, setAsset } from "../lib/portfolioDb";
import { APP_ASSETS } from "../assets/assets";

const DEFAULT_SLIDES: Record<string, string[]> = APP_ASSETS.carouselSlides;
const DEFAULT_LINKS: Record<string, string[]> = APP_ASSETS.carouselLinks;

interface SlideData {
  id: number;
  image: string | null;
  link: string;
}

interface ProductSectionProps {
  sectionType: "product" | "furniture" | "transport" | "visual" | "experience";
  onBack: () => void;
  onMakeDraftEdit?: () => void;
  isEditor?: boolean;
}

export default function ProductSection({ sectionType, onBack, onMakeDraftEdit, isEditor = false }: ProductSectionProps) {
  const getSlideCount = (type: string) => {
    switch (type) {
      case "product": return 8;
      case "furniture": return 6;
      case "transport": return 2;
      case "visual": return 5;
      case "experience": return 6;
      default: return 8;
    }
  };

  const totalSlides = getSlideCount(sectionType);
  const storageKey = `vertical_carousel_slides_${sectionType}`;

  // State to hold slide thumbnails and links
  const [slides, setSlides] = useState<SlideData[]>(() => {
    const defaults = DEFAULT_SLIDES[sectionType] || [];
    const defaultLinks = DEFAULT_LINKS[sectionType] || [];
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let adjusted = [...parsed];
          if (adjusted.length !== totalSlides) {
            if (adjusted.length < totalSlides) {
              for (let i = adjusted.length; i < totalSlides; i++) {
                adjusted.push({ id: i + 1, image: defaults[i] || null, link: defaultLinks[i] || "" });
              }
            } else {
              adjusted.length = totalSlides;
            }
          }
          return adjusted.map((s, idx) => ({
            ...s,
            image: (s.image && s.image.startsWith("data:")) ? s.image : (defaults[idx] || s.image || null),
            link: (s.link && s.link.trim() !== "") ? s.link : (defaultLinks[idx] || "")
          }));
        }
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
    // Default initial template slides
    return Array.from({ length: totalSlides }, (_, i) => ({
      id: i + 1,
      image: defaults[i] || null,
      link: defaultLinks[i] || "",
    }));
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragActiveId, setDragActiveId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadIdRef = useRef<number | null>(null);

  // Sync state with sectionType changes
  useEffect(() => {
    let active = true;

    // Load asynchronously from IndexedDB
    getAsset(storageKey).then((saved) => {
      if (!active) return;
      const defaults = DEFAULT_SLIDES[sectionType] || [];
      const defaultLinks = DEFAULT_LINKS[sectionType] || [];
      if (saved && Array.isArray(saved)) {
        let adjusted = [...saved];
        if (adjusted.length !== totalSlides) {
          if (adjusted.length < totalSlides) {
            for (let i = adjusted.length; i < totalSlides; i++) {
              adjusted.push({ id: i + 1, image: null, link: "" });
            }
          } else {
            adjusted.length = totalSlides;
          }
        }
        adjusted = adjusted.map((slide, idx) => {
          const defaultImg = defaults[idx] || null;
          const defaultLnk = defaultLinks[idx] || "";
          const validImg = (slide.image && slide.image.startsWith("data:")) ? slide.image : (defaultImg || slide.image || null);
          const validLnk = (slide.link && slide.link.trim() !== "") ? slide.link : defaultLnk;
          return {
            ...slide,
            image: validImg,
            link: validLnk
          };
        });
        setSlides(adjusted);
        setActiveIndex(0);
      } else {
        // Fallback to localStorage
        try {
          const localSaved = localStorage.getItem(storageKey);
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed)) {
              let adjusted = [...parsed];
              if (adjusted.length !== totalSlides) {
                if (adjusted.length < totalSlides) {
                  for (let i = adjusted.length; i < totalSlides; i++) {
                    adjusted.push({ id: i + 1, image: null, link: "" });
                  }
                } else {
                  adjusted.length = totalSlides;
                }
              }
              adjusted = adjusted.map((slide, idx) => {
                const defaultImg = defaults[idx] || null;
                const defaultLnk = defaultLinks[idx] || "";
                const validImg = (slide.image && (slide.image.startsWith("data:") || slide.image.startsWith("http"))) ? slide.image : defaultImg;
                const validLnk = (slide.link && slide.link.trim() !== "") ? slide.link : defaultLnk;
                return {
                  ...slide,
                  image: validImg,
                  link: validLnk
                };
              });
              setSlides(adjusted);
              setActiveIndex(0);
              return;
            }
          }
        } catch (e) {
          console.error(e);
        }
        // Default initial template slides
        setSlides(Array.from({ length: totalSlides }, (_, i) => ({
          id: i + 1,
          image: defaults[i] || null,
          link: defaultLinks[i] || "",
        })));
        setActiveIndex(0);
      }
    }).catch(err => {
      console.error("Could not load from portfolioDb:", err);
    });

    return () => {
      active = false;
    };
  }, [sectionType, totalSlides, storageKey]);

  // Persist slides state
  const saveSlides = (newSlides: SlideData[]) => {
    setSlides(newSlides);

    // Save to IndexedDB
    setAsset(storageKey, newSlides).catch(err => console.error("Failed to save to IndexedDB:", err));

    // Save to localStorage as a fallback, catch quota limit error gracefully
    try {
      localStorage.setItem(storageKey, JSON.stringify(newSlides));
    } catch (e) {
      console.warn("localStorage quota exceeded for slides, saved in IndexedDB only.");
    }

    if (onMakeDraftEdit) {
      onMakeDraftEdit();
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  // Mouse wheel scroll navigation (throttled)
  const lastWheelTimeRef = useRef(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 500) return; // 500ms throttle
    if (Math.abs(e.deltaY) > 20) {
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Thumbnail File Upload handlers
  const triggerFileInput = (slideId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    activeUploadIdRef.current = slideId;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slideId = activeUploadIdRef.current;
    if (e.target.files && e.target.files[0] && slideId !== null) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawStr = event.target.result as string;
          const resultStr = await compressImage(rawStr);
          const updated = slides.map((s) =>
            s.id === slideId ? { ...s, image: resultStr } : s
          );
          saveSlides(updated);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearThumbnail = (slideId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = slides.map((s) =>
      s.id === slideId ? { ...s, image: null } : s
    );
    saveSlides(updated);
  };

  // Link input handlers
  const handleLinkChange = (slideId: number, value: string) => {
    const updated = slides.map((s) =>
      s.id === slideId ? { ...s, link: value } : s
    );
    saveSlides(updated);
  };

  const visitLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url) return;
    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent, slideId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(slideId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);
  };

  const handleDrop = (e: React.DragEvent, slideId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const rawStr = event.target.result as string;
            const resultStr = await compressImage(rawStr);
            const updated = slides.map((s) =>
              s.id === slideId ? { ...s, image: resultStr } : s
            );
            saveSlides(updated);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Circular math for 3D stack
  const getSlideOffsetAndScale = (slideIndex: number) => {
    let diff = slideIndex - activeIndex;

    // Use circular distance for smooth wrapping when total slides is greater than 2
    if (totalSlides > 2) {
      if (diff > totalSlides / 2) diff -= totalSlides;
      if (diff < -totalSlides / 2) diff += totalSlides;
    }

    const absDiff = Math.abs(diff);

    // Only render/show items close to active index to reduce clutter
    if (absDiff > 2) {
      return {
        y: diff < 0 ? (isMobile ? -200 : -400) : (isMobile ? 200 : 400),
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
        rotateX: diff < 0 ? 30 : -30,
        pointerEvents: "none" as const,
      };
    }

    // Active slide
    if (diff === 0) {
      return {
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 30,
        rotateX: 0,
        pointerEvents: "auto" as const,
      };
    }

    // One level above/below
    if (diff === -1) {
      return {
        y: isMobile ? -85 : -150,
        scale: isMobile ? 0.85 : 0.8,
        opacity: 0.6,
        zIndex: 20,
        rotateX: 12,
        pointerEvents: "auto" as const, // let them click to navigate
      };
    }
    if (diff === 1) {
      return {
        y: isMobile ? 85 : 150,
        scale: isMobile ? 0.85 : 0.8,
        opacity: 0.6,
        zIndex: 20,
        rotateX: -12,
        pointerEvents: "auto" as const,
      };
    }

    // Two levels above/below
    if (diff === -2) {
      return {
        y: isMobile ? -155 : -260,
        scale: isMobile ? 0.7 : 0.6,
        opacity: 0.25,
        zIndex: 10,
        rotateX: 20,
        pointerEvents: "none" as const,
      };
    }
    if (diff === 2) {
      return {
        y: isMobile ? 155 : 260,
        scale: isMobile ? 0.7 : 0.6,
        opacity: 0.25,
        zIndex: 10,
        rotateX: -20,
        pointerEvents: "none" as const,
      };
    }

    return {
      y: 0,
      scale: 1,
      opacity: 0,
      zIndex: 0,
      rotateX: 0,
      pointerEvents: "none" as const,
    };
  };

  return (
    <div 
      className="w-full min-h-screen relative flex flex-col justify-between items-center py-20 pointer-events-auto"
      onWheel={handleWheel}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header Bar with absolute minimal Back button */}
      <div className="w-full max-w-7xl px-6 md:px-12 flex justify-between items-center z-40">
        <button
          onClick={onBack}
          className="group w-9 h-9 flex items-center justify-center border border-[#0A0A0A]/10 hover:border-[#0012ff]/40 bg-white/40 hover:bg-white/80 transition-all rounded-sm cursor-none"
          title="Back to Studio"
          aria-label="Back to Studio"
        >
          <ArrowLeft size={14} className="text-[#0A0A0A]/60 group-hover:text-[#0012ff] transition-colors" />
        </button>
        
        {/* Sleek dot index counter */}
        <div className="flex gap-1.5 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-none ${
                i === activeIndex 
                  ? "bg-[#0012ff] w-3" 
                  : "bg-[#0A0A0A]/15 hover:bg-[#0A0A0A]/40"
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* VERTICAL CAROUSEL VIEW STAGE */}
      <div 
        className="relative w-full max-w-2xl h-[520px] md:h-[580px] flex items-center justify-center select-none overflow-visible my-auto"
        style={{ perspective: "1200px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Subtle horizontal baseline guide */}
          <div className="w-full h-[1px] border-t border-dashed border-[#0012ff]/10" />
        </div>

        {/* Dynamic 3D stack of slides */}
        <div className="relative w-full max-w-lg aspect-[16/9] flex items-center justify-center px-4 sm:px-6 md:px-0">
          {slides.map((slide, index) => {
            const transformState = getSlideOffsetAndScale(index);
            const isActive = index === activeIndex;
            const isDragging = dragActiveId === slide.id;
            const isClickableNav = Math.abs(index - activeIndex) === 1 || (totalSlides > 2 && (
              (index === 0 && activeIndex === totalSlides - 1) ||
              (index === totalSlides - 1 && activeIndex === 0)
            ));

            return (
              <motion.div
                key={slide.id}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "auto",
                  transformOrigin: "center center",
                  backfaceVisibility: "hidden",
                }}
                animate={{
                  y: transformState.y,
                  scale: transformState.scale,
                  opacity: transformState.opacity,
                  zIndex: transformState.zIndex,
                  rotateX: transformState.rotateX,
                }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                }}
                className={`rounded-2xl overflow-hidden border bg-white/70 backdrop-blur-md flex flex-col p-0 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                  ${isActive 
                    ? "border-[#0A0A0A]/15 pointer-events-auto" 
                    : "border-[#0A0A0A]/5 opacity-40 select-none scale-95 cursor-none"
                  }
                  ${isClickableNav ? "cursor-none pointer-events-auto" : ""}
                `}
                onClick={() => {
                  if (isClickableNav) {
                    setActiveIndex(index);
                  }
                }}
                onDragOver={(e) => isActive && handleDragOver(e, slide.id)}
                onDragLeave={(e) => isActive && handleDragLeave(e)}
                onDrop={(e) => isActive && handleDrop(e, slide.id)}
              >
                {/* 16:9 inner thumbnail template (clicking it opens slide link) */}
                <div 
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  className={`relative w-full aspect-[16/9] overflow-hidden flex flex-col items-center justify-center transition-all duration-500 bg-white/20 cursor-pointer
                    ${slide.image ? "" : ""}
                    ${isActive && !slide.image ? "hover:bg-[#0012ff]/5" : ""}
                    ${isActive ? "cursor-none" : "cursor-none pointer-events-none"}
                  `}
                  onClick={(e) => {
                    if (isActive) {
                      if (slide.link) {
                        visitLink(slide.link, e);
                      } else if (isEditor) {
                        triggerFileInput(slide.id, e);
                      }
                    }
                  }}
                >
                  {slide.image ? (
                    <img 
                      src={slide.image} 
                      alt={`Slide Thumbnail ${slide.id}`} 
                      className="w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const defaults = DEFAULT_SLIDES[sectionType] || [];
                        const defaultUrl = defaults[slide.id - 1];
                        if (defaultUrl) {
                          const absoluteDefault = new URL(defaultUrl, window.location.origin).href;
                          if (e.currentTarget.src !== absoluteDefault) {
                            e.currentTarget.src = absoluteDefault;
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pointer-events-none text-center p-3">
                      {isEditor ? (
                        <>
                          <Upload size={18} className="text-[#0A0A0A]/25 mb-1.5 transition-colors" />
                          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]/40">
                            {isDragging ? "drop_thumbnail_file" : "upload_thumbnail_16:9"}
                          </span>
                        </>
                      ) : (
                        <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]/20">
                          preview_unavailable
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 2 UP AND DOWN ARROWS FLOATING RESPONSIVELY */}
        {/* Desktop floating right column */}
        <div className="absolute bottom-4 right-4 sm:bottom-auto sm:right-[-65px] md:right-[-85px] sm:top-1/2 sm:-translate-y-1/2 flex flex-row sm:flex-col gap-3 z-40">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full border border-[#0A0A0A]/10 hover:border-[#0012ff]/40 bg-white/50 hover:bg-white text-[#0A0A0A] hover:text-[#0012ff] flex items-center justify-center transition-all cursor-none shadow-sm"
            aria-label="Previous slide"
            title="Slide Up"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-[#0A0A0A]/10 hover:border-[#0012ff]/40 bg-white/50 hover:bg-white text-[#0A0A0A] hover:text-[#0012ff] flex items-center justify-center transition-all cursor-none shadow-sm"
            aria-label="Next slide"
            title="Slide Down"
          >
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
