import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Linkedin, Instagram } from "lucide-react";
import { compressImage } from "../lib/imageCompressor";
import { getAsset, setAsset, deleteAsset } from "../lib/portfolioDb";
import { getVideo, saveVideo, deleteVideo } from "../lib/videoDb";
import { APP_ASSETS } from "../assets/assets";

const BehanceIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block"
  >
    {/* B letterform */}
    <path d="M6 10v8" />
    <path d="M6 14.2h2.8a2.1 2.1 0 1 0 0-4.2H6" />
    <path d="M6 14.2h3.2a2.1 2.1 0 1 1 0 4.2H6" />
    
    {/* E letterform */}
    <path d="M14 14h7.5a3.8 3.8 0 1 0-7.6 0 3.8 3.8 0 0 0 6.5 2.7" />
    
    {/* Accent bar above E */}
    <path d="M15 7.5h5.5" strokeWidth={2} />
  </svg>
);

const PurpleHighlight = ({ children, delay = 0.5 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0.8 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ delay: delay, duration: 1.0 }}
      className="inline px-1.5 py-0.5 font-semibold text-[#0A0A0A] bg-[#0012ff]/[0.06] border-b-2 border-[#0012ff]/60 rounded-[2px]"
    >
      {children}
    </motion.span>
  );
};

function getVideoEmbedInfo(url: string | null): { isEmbed: boolean; embedUrl: string } {
  if (!url) return { isEmbed: false, embedUrl: "" };

  // YouTube matchers
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isEmbed: true,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&playsinline=1&rel=0&modestbranding=1`
    };
  }

  // Vimeo matchers
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      isEmbed: true,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&autopause=0&badge=0&byline=0&portrait=0&title=0`
    };
  }

  // Auto-compress Cloudinary videos for ultra-fast loading if not already transformed
  if (url.includes("res.cloudinary.com") && url.includes("/video/upload/") && !url.includes("q_auto")) {
    const compressedUrl = url.replace("/video/upload/", "/video/upload/q_auto,f_auto,w_1080/");
    return { isEmbed: false, embedUrl: compressedUrl };
  }

  return { isEmbed: false, embedUrl: url };
}

interface PartnerLogo {
  id: number;
  logo: string | null;
  url: string;
  name: string;
}

const MALLIKA_FONT_STYLES = [
  {
    type: "cursive",
    fontFamily: "'Dancing Script', cursive",
    fontWeight: "700",
    letterSpacing: "0.01em",
    textTransform: "none" as const,
    text: "Mallika"
  },
  {
    type: "bold",
    fontFamily: "'Syne', 'Neue Haas Grotesk', sans-serif",
    fontWeight: "900",
    letterSpacing: "-0.02em",
    textTransform: "uppercase" as const,
    text: "MALLIKA"
  },
  {
    type: "futuristic",
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: "800",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    text: "MALLIKA"
  },
  {
    type: "blob-like",
    fontFamily: "'Fredoka', cursive, sans-serif",
    fontWeight: "700",
    letterSpacing: "0.03em",
    textTransform: "none" as const,
    text: "Mallika"
  },
  {
    type: "editorial",
    fontFamily: "'Playfair Display', Georgia, serif",
    fontWeight: "700",
    fontStyle: "italic",
    letterSpacing: "0.02em",
    textTransform: "none" as const,
    text: "Mallika"
  }
];

interface AboutSectionProps {
  onNavigateToProduct?: () => void;
  onNavigateToSection?: (section: string) => void;
  onMakeDraftEdit?: () => void;
  isEditor?: boolean;
}

export default function AboutSection({ onNavigateToProduct, onNavigateToSection, onMakeDraftEdit, isEditor = false }: AboutSectionProps) {
  const [mallikaFontIndex, setMallikaFontIndex] = useState(0);
  const [typedCharsCount, setTypedCharsCount] = useState(0);

  // Switch font style every 1.5s (1500ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setMallikaFontIndex((prev) => (prev + 1) % MALLIKA_FONT_STYLES.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Left-to-right typewriter typing effect whenever the font style changes
  useEffect(() => {
    setTypedCharsCount(0);
    const targetText = MALLIKA_FONT_STYLES[mallikaFontIndex].text;
    let count = 0;
    const typeSpeed = 35; // 35ms per character -> 7 characters = ~245ms
    const typeTimer = setInterval(() => {
      count += 1;
      setTypedCharsCount(count);
      if (count >= targetText.length) {
        clearInterval(typeTimer);
      }
    }, typeSpeed);

    return () => clearInterval(typeTimer);
  }, [mallikaFontIndex]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Retrieve profile image from localStorage as fallback
  const [aboutImage, setAboutImage] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem("about_uploaded_image");
      if (saved && !saved.includes("/assets/")) {
        return saved;
      }
      return APP_ASSETS.profileImage;
    } catch (e) {
      return APP_ASSETS.profileImage;
    }
  });

  // Keep track of the video URL (either paste URL or object URL fallback)
  const [videoUrl, setVideoUrl] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem("about_uploaded_video");
      if (saved && (saved.startsWith("http") || saved.startsWith("/")) && !saved.includes("/assets/")) {
        return saved;
      }
      if (saved === "indexeddb_fallback") {
        return null;
      }
    } catch (e) {
      console.error(e);
    }
    return APP_ASSETS.profileVideoBanner;
  });

  const [tempVideoUrl, setTempVideoUrl] = useState(() => {
    try {
      const saved = localStorage.getItem("about_uploaded_video");
      if (saved && (saved.startsWith("http") || saved.startsWith("/")) && !saved.includes("/assets/")) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return APP_ASSETS.profileVideoBanner;
  });

  // Keep track of the contact section background video
  const [contactVideoUrl, setContactVideoUrl] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem("contact_uploaded_video");
      if (saved && (saved.startsWith("http") || saved.startsWith("/")) && !saved.includes("/assets/")) {
        return saved;
      }
      if (saved === "indexeddb_fallback") {
        return null;
      }
    } catch (e) {
      console.error(e);
    }
    return APP_ASSETS.contactVideoBanner;
  });

  const [tempContactVideoUrl, setTempContactVideoUrl] = useState(() => {
    try {
      const saved = localStorage.getItem("contact_uploaded_video");
      if (saved && (saved.startsWith("http") || saved.startsWith("/")) && !saved.includes("/assets/")) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return APP_ASSETS.contactVideoBanner;
  });

  // Async load all assets from IndexedDB on mount
  useEffect(() => {
    let active = true;
    
    getAsset("about_uploaded_image").then(img => {
      if (active && img && typeof img === "string" && (img.startsWith("data:") || img.startsWith("http"))) {
        setAboutImage(img);
      }
    });

    getAsset("about_product_banner").then(banner => {
      if (active && banner && typeof banner === "string" && (banner.startsWith("data:") || banner.startsWith("http"))) {
        setProductBanner(banner);
      }
    });

    getAsset("about_furniture_banner").then(banner => {
      if (active && banner && typeof banner === "string" && (banner.startsWith("data:") || banner.startsWith("http"))) {
        setFurnitureBanner(banner);
      }
    });

    getAsset("about_transport_banner").then(banner => {
      if (active && banner && typeof banner === "string" && (banner.startsWith("data:") || banner.startsWith("http"))) {
        setTransportBanner(banner);
      }
    });

    getAsset("about_visual_banner").then(banner => {
      if (active && banner && typeof banner === "string" && (banner.startsWith("data:") || banner.startsWith("http"))) {
        setVisualBanner(banner);
      }
    });

    getAsset("about_experience_banner").then(banner => {
      if (active && banner && typeof banner === "string" && (banner.startsWith("data:") || banner.startsWith("http"))) {
        setExperienceBanner(banner);
      }
    });

    getAsset("about_uploaded_video").then(video => {
      if (active && video && typeof video === "string" && (video.startsWith("data:") || video.startsWith("http"))) {
        setVideoUrl(video);
        setTempVideoUrl(video);
      } else if (active) {
        setVideoUrl(APP_ASSETS.profileVideoBanner);
        setTempVideoUrl(APP_ASSETS.profileVideoBanner);
      }
    });

    getAsset("contact_uploaded_video").then(video => {
      if (active && video && typeof video === "string" && (video.startsWith("data:") || video.startsWith("http"))) {
        setContactVideoUrl(video);
        setTempContactVideoUrl(video);
      } else if (active) {
        setContactVideoUrl(APP_ASSETS.contactVideoBanner);
        setTempContactVideoUrl(APP_ASSETS.contactVideoBanner);
      }
    });

    // Load partner logos
    const loadPartners = async () => {
      const loadedList = [];
      for (let i = 0; i < APP_ASSETS.experienceLogos.length; i++) {
        const item = APP_ASSETS.experienceLogos[i];
        const rawLogo = await getAsset(`about_partner_logo_${i}`);
        const logo = (rawLogo && typeof rawLogo === "string" && (rawLogo.startsWith("data:") || rawLogo.startsWith("http")))
          ? rawLogo
          : ((localStorage.getItem(`about_partner_logo_${i}`) && localStorage.getItem(`about_partner_logo_${i}`)!.startsWith("http"))
            ? localStorage.getItem(`about_partner_logo_${i}`)!
            : item.logo);
        const url = localStorage.getItem(`about_partner_url_${i}`) ?? item.url;
        const name = localStorage.getItem(`about_partner_name_${i}`) || item.name;
        loadedList.push({
          id: i,
          logo,
          url,
          name
        });
      }
      if (active) {
        setPartners(loadedList);
      }
    };
    loadPartners();

    return () => {
      active = false;
    };
  }, []);

  // Async load video from IndexedDB for permanence fallback (if no direct URL exists)
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("about_uploaded_video");
    } catch (e) {
      console.error(e);
    }
    if (saved && saved.startsWith("http") && !saved.includes("uploaded_video")) return;

    let active = true;
    let objectUrlToCleanup: string | null = null;
    
    getVideo("about_uploaded_video").then((storedBlob) => {
      if (active && storedBlob) {
        if (typeof storedBlob === "string") {
          setVideoUrl(storedBlob);
        } else if (storedBlob instanceof Blob) {
          const url = URL.createObjectURL(storedBlob);
          objectUrlToCleanup = url;
          setVideoUrl(url);
        }
      }
    }).catch(err => console.error("Could not load videoDb:", err));

    return () => {
      active = false;
      if (objectUrlToCleanup) {
        URL.revokeObjectURL(objectUrlToCleanup);
      }
    };
  }, []);

  // Async load contact video from IndexedDB for permanence fallback (if no direct URL exists)
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("contact_uploaded_video");
    } catch (e) {
      console.error(e);
    }
    if (saved && saved.startsWith("http") && !saved.includes("uploaded_video")) return;

    let active = true;
    let objectUrlToCleanup: string | null = null;
    
    getVideo("contact_uploaded_video").then((storedBlob) => {
      if (active && storedBlob) {
        if (typeof storedBlob === "string") {
          setContactVideoUrl(storedBlob);
        } else if (storedBlob instanceof Blob) {
          const url = URL.createObjectURL(storedBlob);
          objectUrlToCleanup = url;
          setContactVideoUrl(url);
        }
      }
    }).catch(err => console.error("Could not load videoDb for contact:", err));

    return () => {
      active = false;
      if (objectUrlToCleanup) {
        URL.revokeObjectURL(objectUrlToCleanup);
      }
    };
  }, []);

  // 6 partners for the moving logo carousel
  const [partners, setPartners] = useState<PartnerLogo[]>(() => {
    const list: PartnerLogo[] = [];
    for (let i = 0; i < APP_ASSETS.experienceLogos.length; i++) {
      const item = APP_ASSETS.experienceLogos[i];
      try {
        const savedLogo = localStorage.getItem(`about_partner_logo_${i}`);
        const savedUrl = localStorage.getItem(`about_partner_url_${i}`);
        const savedName = localStorage.getItem(`about_partner_name_${i}`) || item.name;
        list.push({
          id: i,
          logo: savedLogo || item.logo,
          url: savedUrl !== null ? savedUrl : item.url,
          name: savedName,
        });
      } catch (e) {
        list.push({
          id: i,
          logo: item.logo,
          url: item.url,
          name: item.name,
        });
      }
    }
    return list;
  });

  const [isProfileDragActive, setIsProfileDragActive] = useState(false);
  const [isVideoDragActive, setIsVideoDragActive] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activePartnerUploadIndex, setActivePartnerUploadIndex] = useState<number | null>(null);
  const [videoSourceTab, setVideoSourceTab] = useState<"file" | "link">("file");
  const [isVideoCompressing, setIsVideoCompressing] = useState(false);
  const [videoCompressingProgress, setVideoCompressingProgress] = useState(0);
  const [videoCompressingStatus, setVideoCompressingStatus] = useState("");

  const [isContactVideoDragActive, setIsContactVideoDragActive] = useState(false);
  const [isContactVideoHovered, setIsContactVideoHovered] = useState(false);
  const [contactVideoSourceTab, setContactVideoSourceTab] = useState<"file" | "link">("file");
  const [isContactVideoCompressing, setIsContactVideoCompressing] = useState(false);
  const [contactVideoCompressingProgress, setContactVideoCompressingProgress] = useState(0);
  const [contactVideoCompressingStatus, setContactVideoCompressingStatus] = useState("");
  const [showContactVideoConfig, setShowContactVideoConfig] = useState(false);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const contactVideoInputRef = useRef<HTMLInputElement>(null);
  const partnerFileInputRef = useRef<HTMLInputElement>(null);
  const portalInputRef = useRef<HTMLInputElement>(null);

  const [activePortalType, setActivePortalType] = useState<string | null>(null);

  const [productBanner, setProductBanner] = useState<string | null>(() => {
    try { return localStorage.getItem("about_product_banner") || APP_ASSETS.categoryTemplates.product; } catch (e) { return APP_ASSETS.categoryTemplates.product; }
  });
  const [furnitureBanner, setFurnitureBanner] = useState<string | null>(() => {
    try { return localStorage.getItem("about_furniture_banner") || APP_ASSETS.categoryTemplates.furniture; } catch (e) { return APP_ASSETS.categoryTemplates.furniture; }
  });
  const [transportBanner, setTransportBanner] = useState<string | null>(() => {
    try { return localStorage.getItem("about_transport_banner") || APP_ASSETS.categoryTemplates.transport; } catch (e) { return APP_ASSETS.categoryTemplates.transport; }
  });
  const [visualBanner, setVisualBanner] = useState<string | null>(() => {
    try { return localStorage.getItem("about_visual_banner") || APP_ASSETS.categoryTemplates.visual; } catch (e) { return APP_ASSETS.categoryTemplates.visual; }
  });
  const [experienceBanner, setExperienceBanner] = useState<string | null>(() => {
    try { return localStorage.getItem("about_experience_banner") || APP_ASSETS.categoryTemplates.experience; } catch (e) { return APP_ASSETS.categoryTemplates.experience; }
  });

  const [dragActivePortal, setDragActivePortal] = useState<string | null>(null);

  const handlePortalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activePortalType) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawStr = event.target.result as string;
          const resultStr = await compressImage(rawStr);
          if (activePortalType === "product") setProductBanner(resultStr);
          else if (activePortalType === "furniture") setFurnitureBanner(resultStr);
          else if (activePortalType === "transport") setTransportBanner(resultStr);
          else if (activePortalType === "visual") setVisualBanner(resultStr);
          else if (activePortalType === "experience") setExperienceBanner(resultStr);

          // Save to IndexedDB
          setAsset(`about_${activePortalType}_banner`, resultStr).catch(err => console.error(err));

          try {
            localStorage.setItem(`about_${activePortalType}_banner`, resultStr);
          } catch (err) {
            console.warn("Storage quota exceeded, saved in IndexedDB only.");
          }

          if (onMakeDraftEdit) {
            onMakeDraftEdit();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Profile upload handlers
  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawStr = event.target.result as string;
          const resultStr = await compressImage(rawStr);
          setAboutImage(resultStr);

          // Save to IndexedDB
          setAsset("about_uploaded_image", resultStr).catch(err => console.error(err));

          try {
            localStorage.setItem("about_uploaded_image", resultStr);
          } catch (err) {
            console.warn("Storage quota exceeded, saved in IndexedDB only.");
          }

          if (onMakeDraftEdit) {
            onMakeDraftEdit();
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsProfileDragActive(true);
    } else if (e.type === "dragleave") {
      setIsProfileDragActive(false);
    }
  };

  const handleProfileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const rawStr = event.target.result as string;
            const resultStr = await compressImage(rawStr);
            setAboutImage(resultStr);

            // Save to IndexedDB
            setAsset("about_uploaded_image", resultStr).catch(err => console.error(err));

            try {
              localStorage.setItem("about_uploaded_image", resultStr);
            } catch (err) {
              console.warn("Storage quota exceeded, saved in IndexedDB only.");
            }

            if (onMakeDraftEdit) {
              onMakeDraftEdit();
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerProfileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    profileInputRef.current?.click();
  };

  const clearProfileImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAboutImage(null);

    // Delete from IndexedDB
    deleteAsset("about_uploaded_image").catch(err => console.error(err));

    try {
      localStorage.removeItem("about_uploaded_image");
    } catch (err) {
      console.error(err);
    }
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }

    if (onMakeDraftEdit) {
      onMakeDraftEdit();
    }
  };

  // Video link handlers (with high performance direct storage in localStorage)
  const handleSaveVideoUrl = () => {
    if (!tempVideoUrl.trim()) return;
    const trimmed = tempVideoUrl.trim();
    setVideoUrl(trimmed);
    try {
      localStorage.setItem("about_uploaded_video", trimmed);
    } catch (err) {
      console.error("Failed to save video link to localStorage:", err);
    }

    if (onMakeDraftEdit) {
      onMakeDraftEdit();
    }
  };

  const clearVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoUrl && videoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoUrl(null);
    setTempVideoUrl("");
    try {
      localStorage.removeItem("about_uploaded_video");
      await deleteVideo("about_uploaded_video");
    } catch (err) {
      console.error(err);
    }

    if (onMakeDraftEdit) {
      onMakeDraftEdit();
    }
  };

  const handleVideoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsVideoDragActive(true);
    } else if (e.type === "dragleave") {
      setIsVideoDragActive(false);
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processAndSetVideoFile(file);
    }
  };

  const handleVideoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processAndSetVideoFile(file);
    }
  };

  const processAndSetVideoFile = async (file: File) => {
    if (videoUrl && videoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoUrl);
    }

    setIsVideoCompressing(true);
    setVideoCompressingProgress(0);
    setVideoCompressingStatus("initiating_compressor");

    try {
      const { compressVideo } = await import("../lib/videoCompressor");
      const optimizedBlob = await compressVideo(file, (progress, status) => {
        setVideoCompressingProgress(progress);
        setVideoCompressingStatus(status);
      });

      const objectUrl = URL.createObjectURL(optimizedBlob);
      setVideoUrl(objectUrl);

      localStorage.setItem("about_uploaded_video", "indexeddb_fallback");
      await saveVideo("about_uploaded_video", optimizedBlob);
    } catch (err) {
      console.error("Failed to compress video, falling back to original:", err);
      const objectUrl = URL.createObjectURL(file);
      setVideoUrl(objectUrl);

      try {
        localStorage.setItem("about_uploaded_video", "indexeddb_fallback");
        await saveVideo("about_uploaded_video", file);
      } catch (saveErr) {
        console.error("Failed to save fallback video to IndexedDB:", saveErr);
      }
    } finally {
      setIsVideoCompressing(false);
      if (onMakeDraftEdit) {
        onMakeDraftEdit();
      }
    }
  };

  const triggerVideoInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    videoInputRef.current?.click();
  };

  // Contact Video handlers (with high performance direct storage in localStorage / IndexedDB)
  const handleSaveContactVideoUrl = () => {
    if (!tempContactVideoUrl.trim()) return;
    const trimmed = tempContactVideoUrl.trim();
    setContactVideoUrl(trimmed);
    try {
      localStorage.setItem("contact_uploaded_video", trimmed);
    } catch (err) {
      console.error("Failed to save contact video link to localStorage:", err);
    }

    if (onMakeDraftEdit) {
      onMakeDraftEdit();
    }
  };

  const clearContactVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contactVideoUrl && contactVideoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(contactVideoUrl);
    }
    setContactVideoUrl(null);
    setTempContactVideoUrl("");
    try {
      localStorage.removeItem("contact_uploaded_video");
      await deleteVideo("contact_uploaded_video");
    } catch (err) {
      console.error(err);
    }

    if (onMakeDraftEdit) {
      onMakeDraftEdit();
    }
  };

  const handleContactVideoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsContactVideoDragActive(true);
    } else if (e.type === "dragleave") {
      setIsContactVideoDragActive(false);
    }
  };

  const handleContactVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processAndSetContactVideoFile(file);
    }
  };

  const handleContactVideoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsContactVideoDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processAndSetContactVideoFile(file);
    }
  };

  const processAndSetContactVideoFile = async (file: File) => {
    if (contactVideoUrl && contactVideoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(contactVideoUrl);
    }

    setIsContactVideoCompressing(true);
    setContactVideoCompressingProgress(0);
    setContactVideoCompressingStatus("initiating_compressor");

    try {
      const { compressVideo } = await import("../lib/videoCompressor");
      const optimizedBlob = await compressVideo(file, (progress, status) => {
        setContactVideoCompressingProgress(progress);
        setContactVideoCompressingStatus(status);
      });

      const objectUrl = URL.createObjectURL(optimizedBlob);
      setContactVideoUrl(objectUrl);

      localStorage.setItem("contact_uploaded_video", "indexeddb_fallback");
      await saveVideo("contact_uploaded_video", optimizedBlob);
    } catch (err) {
      console.error("Failed to compress contact video, falling back to original:", err);
      const objectUrl = URL.createObjectURL(file);
      setContactVideoUrl(objectUrl);

      try {
        localStorage.setItem("contact_uploaded_video", "indexeddb_fallback");
        await saveVideo("contact_uploaded_video", file);
      } catch (saveErr) {
        console.error("Failed to save contact fallback video to IndexedDB:", saveErr);
      }
    } finally {
      setIsContactVideoCompressing(false);
      if (onMakeDraftEdit) {
        onMakeDraftEdit();
      }
    }
  };

  const triggerContactVideoInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    contactVideoInputRef.current?.click();
  };

  // Partner Carousel handlers
  const triggerPartnerFileInput = (index: number) => {
    setActivePartnerUploadIndex(index);
    partnerFileInputRef.current?.click();
  };

  const handlePartnerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activePartnerUploadIndex !== null) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawStr = event.target.result as string;
          const resultStr = await compressImage(rawStr, 250, 250, 0.55); // Brand logos can be even smaller
          updatePartnerLogo(activePartnerUploadIndex, resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePartnerLogo = (id: number, logoBase64: string | null) => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, logo: logoBase64 };
        
        // Save to IndexedDB
        if (logoBase64) {
          setAsset(`about_partner_logo_${id}`, logoBase64).catch(err => console.error(err));
        } else {
          deleteAsset(`about_partner_logo_${id}`).catch(err => console.error(err));
        }

        try {
          if (logoBase64) {
            localStorage.setItem(`about_partner_logo_${id}`, logoBase64);
          } else {
            localStorage.removeItem(`about_partner_logo_${id}`);
          }
        } catch (err) {
          console.warn("Storage quota exceeded, saved in IndexedDB only.");
        }

        if (onMakeDraftEdit) {
          onMakeDraftEdit();
        }
        return updated;
      }
      return p;
    }));
  };

  const updatePartnerUrl = (id: number, url: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, url };
        try {
          localStorage.setItem(`about_partner_url_${id}`, url);
        } catch (err) {
          console.error("Storage error:", err);
        }

        if (onMakeDraftEdit) {
          onMakeDraftEdit();
        }
        return updated;
      }
      return p;
    }));
  };

  const updatePartnerName = (id: number, name: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, name };
        try {
          localStorage.setItem(`about_partner_name_${id}`, name);
        } catch (err) {
          console.error("Storage error:", err);
        }

        if (onMakeDraftEdit) {
          onMakeDraftEdit();
        }
        return updated;
      }
      return p;
    }));
  };

  const clearPartnerSlot = (id: number) => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, logo: null, url: "", name: `Company ${id + 1}` };
        
        // Delete from IndexedDB
        deleteAsset(`about_partner_logo_${id}`).catch(err => console.error(err));

        try {
          localStorage.removeItem(`about_partner_logo_${id}`);
          localStorage.removeItem(`about_partner_url_${id}`);
          localStorage.removeItem(`about_partner_name_${id}`);
        } catch (err) {
          console.error(err);
        }

        if (onMakeDraftEdit) {
          onMakeDraftEdit();
        }
        return updated;
      }
      return p;
    }));
  };

  const handleClickCircle = (url: string) => {
    if (url) {
      const formattedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(formattedUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Duplicate items 3 times for continuous, seamless marquee animation
  const marqueeItems = [...partners, ...partners, ...partners];

  return (
    <div className="w-full flex flex-col justify-between z-0 pt-16 md:pt-20 lg:pt-[96px]">
      
      {/* Inline styles for continuous moving carousel marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
      `}} />

      {/* Hidden file inputs */}
      <input 
        ref={profileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleProfileFileChange}
        className="hidden"
      />
      <input 
        ref={videoInputRef}
        type="file" 
        accept="video/mp4,video/webm" 
        onChange={handleVideoFileChange}
        className="hidden"
      />
      <input 
        ref={contactVideoInputRef}
        type="file" 
        accept="video/mp4,video/webm" 
        onChange={handleContactVideoFileChange}
        className="hidden"
      />
      <input 
        ref={partnerFileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handlePartnerFileChange}
        className="hidden"
      />
      <input 
        ref={portalInputRef}
        type="file" 
        accept="image/*" 
        onChange={handlePortalFileChange}
        className="hidden"
      />

      {/* 2. MAIN CONTENT LAYOUT - Centered, gallery-like spacing */}
      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col justify-between z-10 pt-20 sm:pt-24 lg:pt-28 pb-20 pointer-events-none">
        
        {/* PRIMARY FOCAL POINT HEADER: "HI! I'M Mallika" */}
        <div className="w-full mb-10 sm:mb-14 pointer-events-auto border-b border-[#0A0A0A]/10 pb-8 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0012ff]" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#0A0A0A]/80 uppercase">
                BANGALORE / NEW DELHI
              </span>
            </div>

            <h1 className="font-display font-black uppercase text-[#0A0A0A] leading-[1.0] tracking-tight flex items-center flex-wrap gap-x-3 sm:gap-x-4 text-4xl sm:text-6xl lg:text-7xl">
              <span>HI! I'M</span>
              <span className="inline-flex items-center relative">
                <span
                  className="inline-block text-[#0012ff] select-none whitespace-nowrap"
                  style={{
                    fontFamily: MALLIKA_FONT_STYLES[mallikaFontIndex].fontFamily,
                    fontWeight: MALLIKA_FONT_STYLES[mallikaFontIndex].fontWeight,
                    letterSpacing: MALLIKA_FONT_STYLES[mallikaFontIndex].letterSpacing,
                    textTransform: MALLIKA_FONT_STYLES[mallikaFontIndex].textTransform,
                    fontStyle: MALLIKA_FONT_STYLES[mallikaFontIndex].fontStyle || "normal",
                    color: "#0012ff"
                  }}
                >
                  {MALLIKA_FONT_STYLES[mallikaFontIndex].text.split("").map((char, idx) => (
                    <span
                      key={idx}
                      className={idx < typedCharsCount ? "inline-block opacity-100 transition-opacity duration-75" : "inline-block opacity-0"}
                    >
                      {char}
                    </span>
                  ))}
                  {typedCharsCount < MALLIKA_FONT_STYLES[mallikaFontIndex].text.length && (
                    <span className="inline-block ml-[2px] w-[3px] h-[0.85em] bg-[#0012ff] animate-pulse align-middle" />
                  )}
                </span>
              </span>
            </h1>
          </motion.div>
        </div>

        {/* REBALANCED GALLERY GRID: MEDIA + EDITORIAL BIO */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* COLUMN 1: INTERACTIVE MEDIA COMPOSITION - LARGER 16:9 VIDEO WITH OVERLAPPING PROFILE IMAGE */}
          <div className="col-span-1 lg:col-span-6 relative w-full flex items-center my-2 pr-12 sm:pr-16 lg:pr-20 pointer-events-auto">
            
            {/* THE VIDEO BANNER (16:9 ratio, expands smoothly on hover in place, no fullscreen overlay) */}
            <motion.div
              id="about-video-16-9-container"
              onMouseEnter={() => setIsVideoHovered(true)}
              onMouseLeave={() => setIsVideoHovered(false)}
              onDragEnter={handleVideoDrag}
              onDragOver={handleVideoDrag}
              onDragLeave={handleVideoDrag}
              onDrop={handleVideoDrop}
              className={`group/video relative w-full aspect-[16/9] flex flex-col items-center justify-center transition-all duration-500 ease-out pointer-events-auto rounded-xl border overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.1)]
                ${isVideoHovered ? "z-30 shadow-[0_20px_50px_rgba(0,18,255,0.2)]" : "z-10"}
                ${videoUrl 
                  ? "border-[#0A0A0A]/10 bg-black/90" 
                  : isVideoDragActive 
                    ? "border-2 border-solid border-[#0012ff] bg-[#0012ff]/10 shadow-[0_0_20px_rgba(0,18,255,0.25)]" 
                    : "border-[#0A0A0A]/15 bg-white/70 hover:border-[#0012ff]/50"
                }
              `}
              animate={{
                scale: isVideoHovered ? 1.15 : 1.0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
              }}
            >
              {/* Draft-mark brackets around the container */}
              {!videoUrl && (
                <>
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#0A0A0A]/20 group-hover/video:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#0A0A0A]/20 group-hover/video:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#0A0A0A]/20 group-hover/video:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#0A0A0A]/20 group-hover/video:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                </>
              )}

              {isVideoCompressing ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative p-4 bg-white/95 pointer-events-auto z-30">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#0012ff" strokeWidth="0.5" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="#0012ff" strokeWidth="0.5" />
                  </svg>
                  
                  <div className="relative z-10 w-full max-w-[85%] flex flex-col items-center text-center">
                    <div className="relative flex items-center justify-center mb-3">
                      <svg className="w-10 h-10 rotate-[-90deg]">
                        <circle cx="20" cy="20" r="16" stroke="rgba(0,18,255,0.1)" strokeWidth="2.5" fill="none" />
                        <circle 
                          cx="20" 
                          cy="20" 
                          r="16" 
                          stroke="#0012ff" 
                          strokeWidth="2.5" 
                          fill="none" 
                          strokeDasharray={100}
                          strokeDashoffset={100 - videoCompressingProgress}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <span className="absolute text-[8px] font-mono font-bold text-[#0012ff]">
                        {videoCompressingProgress}%
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-bold tracking-widest text-[#0012ff] uppercase">
                      {videoCompressingStatus}
                    </span>
                    <span className="text-[5px] font-mono text-[#0A0A0A]/40 mt-1 uppercase tracking-[0.15em]">
                      compressing_and_stripping_audio
                    </span>
                  </div>
                </div>
              ) : videoUrl ? (() => {
                const embedInfo = getVideoEmbedInfo(videoUrl);
                return (
                  <div className="w-full h-full relative aspect-[16/9] flex items-center justify-center">
                    {embedInfo.isEmbed ? (
                      <iframe
                        key={embedInfo.embedUrl}
                        src={embedInfo.embedUrl}
                        className="w-full h-full absolute inset-0 pointer-events-auto border-none"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        title="Uploaded video embed"
                      />
                    ) : (
                      <video 
                        key={embedInfo.embedUrl}
                        src={embedInfo.embedUrl} 
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover pointer-events-auto"
                      />
                    )}
                  </div>
                );
              })() : (
                <div className="w-full h-full flex flex-col items-center justify-center relative p-3 sm:p-4 pointer-events-auto">
                  {/* Drafting grid inside video player container */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="0.5" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="0.5" />
                    <rect x="5" y="5" width="90" height="90" rx="1" stroke="black" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                  </svg>

                  {isEditor ? (
                    <>
                      {/* Mode Selector Tabs */}
                      <div className="flex gap-1.5 mb-2 sm:mb-3 z-10">
                        <button
                          onClick={(e) => { e.stopPropagation(); setVideoSourceTab("file"); }}
                          className={`px-2 py-0.5 sm:px-3 sm:py-1 font-mono text-[6px] sm:text-[8px] font-bold tracking-wider uppercase border transition-all rounded-sm cursor-pointer ${
                            videoSourceTab === "file"
                              ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                              : "bg-white/40 text-[#0A0A0A]/50 border-[#0A0A0A]/5 hover:bg-white/60"
                          }`}
                        >
                          local_file
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setVideoSourceTab("link"); }}
                          className={`px-2 py-0.5 sm:px-3 sm:py-1 font-mono text-[6px] sm:text-[8px] font-bold tracking-wider uppercase border transition-all rounded-sm cursor-pointer ${
                            videoSourceTab === "link"
                              ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                              : "bg-white/40 text-[#0A0A0A]/50 border-[#0A0A0A]/5 hover:bg-white/60"
                          }`}
                        >
                          url_link
                        </button>
                      </div>

                      {videoSourceTab === "file" ? (
                        <div 
                          onClick={triggerVideoInput}
                          onDragEnter={handleVideoDrag}
                          onDragOver={handleVideoDrag}
                          onDragLeave={handleVideoDrag}
                          onDrop={handleVideoDrop}
                          className={`w-full max-w-[85%] flex-grow max-h-[180px] flex flex-col items-center justify-center border border-dashed rounded-sm p-3 transition-all duration-300 cursor-pointer ${
                            isVideoDragActive
                              ? "border-solid border-[#0012ff] bg-[#0012ff]/10 shadow-[0_0_20px_rgba(0,18,255,0.25)]"
                              : "border-[#0A0A0A]/15 hover:border-[#0012ff]/40 bg-white/20 hover:bg-white/45"
                          }`}
                        >
                          <svg 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.2" 
                            className={`text-[#0A0A0A]/35 transition-colors duration-300 ${
                              isVideoDragActive ? "text-[#0012ff] scale-110" : "group-hover/video:text-[#0012ff]"
                            }`}
                          >
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                          <span className="mt-2 text-[7px] sm:text-[8px] font-mono font-bold tracking-[0.2em] text-[#0A0A0A]/50 uppercase">
                            {isVideoDragActive ? "drop_video_here" : "drag_video_or_click"}
                          </span>
                          <span className="mt-0.5 text-[6px] font-mono text-[#0A0A0A]/35 lowercase tracking-wider">
                            supports mp4, webm
                          </span>
                        </div>
                      ) : (
                        <div className="relative z-10 w-full max-w-[85%] flex-grow max-h-[180px] flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 border border-[#0A0A0A]/5 bg-white/25 rounded-sm">
                          <div className="flex items-center gap-1 text-[#0012ff]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            <span className="text-[7px] sm:text-[8px] font-mono font-bold tracking-widest uppercase">
                              video_url_link
                            </span>
                          </div>

                          <div className="flex w-full gap-1">
                            <input
                              type="text"
                              placeholder="Paste mp4, youtube, or vimeo url..."
                              value={tempVideoUrl}
                              onChange={(e) => setTempVideoUrl(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveVideoUrl();
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-grow px-2 py-1 text-[8px] font-mono bg-white/80 border border-[#0A0A0A]/15 focus:border-[#0012ff] focus:ring-1 focus:ring-[#0012ff] outline-none rounded-sm text-[#0A0A0A] placeholder-[#0A0A0A]/30 cursor-text"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveVideoUrl();
                              }}
                              className="px-2.5 py-1 bg-[#0012ff] hover:bg-[#000edb] text-white font-mono text-[8px] font-bold tracking-wider uppercase transition-all rounded-sm flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
                            >
                              apply
                            </button>
                          </div>
                          
                          <span className="text-[6px] font-mono text-[#0A0A0A]/40 lowercase tracking-wider text-center">
                            supports direct video urls, youtube, and vimeo links (looped)
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A]/20">
                        presentation_slot
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* PROFILE IMAGE CONTAINER (Shifted 15% to the left, deeply overlapping the video) */}
            <motion.div
              id="about-image-square-container"
              onDragEnter={handleProfileDrag}
              onDragOver={handleProfileDrag}
              onDragLeave={handleProfileDrag}
              onDrop={handleProfileDrop}
              onClick={triggerProfileInput}
              className={`absolute right-[-2%] sm:right-[2%] lg:right-[4%] top-1/2 -translate-y-1/2 z-20 w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] lg:w-[180px] lg:h-[180px] shrink-0 cursor-none group/profile pointer-events-auto overflow-hidden flex flex-col items-center justify-center transition-all duration-500 ease-out rounded-2xl border-4 border-white bg-white shadow-[0_20px_50px_rgba(0,0,0,0.22)]
                ${aboutImage 
                  ? "border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.22)] hover:scale-105" 
                  : isProfileDragActive 
                    ? "border-4 border-solid border-[#0012ff] bg-[#0012ff]/10 shadow-[0_0_25px_rgba(0,18,255,0.3)]" 
                    : "border-4 border-dashed border-[#0A0A0A]/20 hover:border-[#0012ff]/60 bg-white/90"
                }
              `}
              animate={{
                opacity: isVideoHovered ? 0.7 : 1,
                scale: isVideoHovered ? 0.95 : 1,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              {/* Draft-mark brackets around the container */}
              {!aboutImage && (
                <>
                  <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#0A0A0A]/20 group-hover/profile:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                  <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[#0A0A0A]/20 group-hover/profile:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[#0A0A0A]/20 group-hover/profile:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#0A0A0A]/20 group-hover/profile:border-[#0A0A0A]/40 transition-colors pointer-events-none" />
                </>
              )}

              {aboutImage ? (
                <img 
                  src={aboutImage} 
                  alt="Mallika Sreenivasan" 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/profile:scale-[1.03]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const defaultUrl = "/assets/about_uploaded_image.png";
                    const absoluteDefault = new URL(defaultUrl, window.location.origin).href;
                    if (e.currentTarget.src !== absoluteDefault) {
                      e.currentTarget.src = absoluteDefault;
                    }
                  }}
                />
              ) : (
                <div className="w-full aspect-square flex flex-col items-center justify-center p-2 text-center select-none pointer-events-none">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] group-hover/profile:opacity-[0.10] transition-opacity" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="black" strokeWidth="0.5" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="black" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="48" stroke="black" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                  </svg>

                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.2" 
                    className="text-[#0A0A0A]/40 group-hover/profile:text-[#0012ff] transition-colors duration-300 transform group-hover/profile:scale-105"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                  </svg>
                  
                  <span className="mt-1.5 text-[7px] font-mono font-bold tracking-[0.15em] text-[#0A0A0A]/40 group-hover/profile:text-[#0012ff] uppercase">
                    {isProfileDragActive ? "drop_img" : "profile_img"}
                  </span>
                </div>
              )}
            </motion.div>

          </div>

          {/* COLUMN 2: EDITORIAL BIOGRAPHY WRITING (6 COLS - CLEAN VISUAL HIERARCHY WITH ZERO OVERLAP) */}
          <div className="col-span-1 lg:col-span-6 pl-0 lg:pl-6 flex flex-col justify-center text-left pointer-events-auto">
            <motion.div
              className="space-y-6 max-w-[65ch]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Subheading in clean, bold display hierarchy */}
              <h3 className="font-display font-extrabold text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-[#0A0A0A] leading-tight">
                Creative and Designer
              </h3>

              {/* Body text with optimized measure (60-75ch), line height ~1.7, and crisp contrast */}
              <div className="font-sans text-[15px] sm:text-[16px] text-[#0A0A0A]/90 leading-[1.7] tracking-[-0.01em] space-y-5">
                <p className="text-left font-normal">
                  I am an <PurpleHighlight delay={0.4}>Indian industrial designer</PurpleHighlight> with a practice rooted in the intersection of <PurpleHighlight delay={0.6}>culture, craft, and contemporary life</PurpleHighlight>. I began with a fascination of simple solutions that make one pause and think, "Why didn't I think of that?"
                </p>
                
                <p className="text-left font-normal">
                  Over time, this curiosity expanded into broader questions of identity, heritage, and the ways we live.
                </p>
                
                <p className="text-left font-normal">
                  At a time when the designed world grows increasingly complex, I am interested in what endures: the human stories, wonder, <PurpleHighlight delay={0.8}>imagination embedded in form, material, and making and how these become the very intelligence of an experience</PurpleHighlight>.
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* 3. ROW FOR LOGO CAROUSEL - Full screen width edge-to-edge */}
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-14 pt-8 border-t border-[#0A0A0A]/5 pointer-events-auto overflow-hidden">
          
          {/* Header for Carousel Row */}
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-[#0012ff]">Experiences and Collaborations</h3>
            </div>
            
            {/* Elegant Blueprint Toggle Button is hidden */}
          </div>

          {isEditMode ? (
            /* CONFIGURATION PANEL (EDIT MODE) */
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-white/40 border border-[#0A0A0A]/10 p-5 rounded-sm shadow-[inset_0_1px_3px_rgba(255,255,255,0.6)]"
            >
              {partners.map((p, idx) => (
                <div key={p.id} className="border border-[#0A0A0A]/10 bg-white/60 p-3.5 rounded-sm flex flex-col items-center gap-3 relative group/slot">
                  
                  {/* Slot identifier badge */}
                  <div className="absolute top-1 left-1.5 text-[8px] font-sans text-[#0A0A0A]/40">
                    0{idx + 1}
                  </div>

                  {/* Circle Logo Preview / Upload Trigger */}
                  <button
                    onClick={() => triggerPartnerFileInput(p.id)}
                    className={`w-14 h-14 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-300 cursor-none relative group/pimg
                      ${p.logo 
                        ? "border-[#0A0A0A]/10 hover:border-[#0012ff]/50 bg-transparent shadow-sm" 
                        : "border-dashed border-[#0A0A0A]/20 hover:border-[#0012ff]/50 bg-white/50 hover:bg-[#0012ff]/5"
                      }
                    `}
                    title="Click to upload/update logo icon"
                  >
                    {p.logo ? (
                      <>
                        <img 
                          src={p.logo} 
                          alt={p.name} 
                          className="w-full h-full object-contain p-1.5" 
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/pimg:opacity-100 transition-opacity flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pointer-events-none">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#0A0A0A]/30">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        <span className="text-[6px] font-sans text-[#0A0A0A]/45 mt-1">UPLOAD</span>
                      </div>
                    )}
                  </button>

                  {/* Input Fields */}
                  <div className="w-full space-y-1.5">
                    <div>
                      <label className="block text-[7px] font-sans uppercase text-[#0A0A0A]/45 mb-0.5">name</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => updatePartnerName(p.id, e.target.value)}
                        placeholder="Company Name"
                        className="w-full bg-white/70 border border-[#0A0A0A]/10 rounded-sm p-1 text-[9px] font-sans text-[#0A0A0A] outline-none focus:border-[#0012ff]"
                      />
                    </div>

                    <div>
                      <label className="block text-[7px] font-sans uppercase text-[#0A0A0A]/45 mb-0.5">url / link</label>
                      <input
                        type="text"
                        value={p.url}
                        onChange={(e) => updatePartnerUrl(p.id, e.target.value)}
                        placeholder="https://company.com"
                        className="w-full bg-white/70 border border-[#0A0A0A]/10 rounded-sm p-1 text-[9px] font-sans text-[#0A0A0A] outline-none focus:border-[#0012ff]"
                      />
                    </div>
                  </div>

                  {/* Reset/Clear button for this slot */}
                  <button
                    onClick={() => clearPartnerSlot(p.id)}
                    className="w-full mt-1 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-sans text-[7px] font-bold tracking-wider uppercase border border-red-200 transition-colors cursor-none"
                    title="Clear logo and link for this slot"
                  >
                    reset_slot
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            /* ACTIVE INFINITE MARQUEE VIEW (INTERACTIVE MOVEMENT - EDGE TO EDGE) */
            <div className="relative w-full overflow-hidden bg-transparent py-4 sm:py-6 flex items-center">
              
              {/* Fade overlays on left/right margins for premium depth */}
              <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#F2F2F2] to-transparent pointer-events-none z-10" />
              <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#F2F2F2] to-transparent pointer-events-none z-10" />

              <div 
                className="flex items-center gap-12 sm:gap-20 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap cursor-none"
                style={{ width: "fit-content" }}
              >
                {marqueeItems.map((p, idx) => {
                  const hasLink = !!p.url;
                  return (
                    <div
                      key={`${p.id}-${idx}`}
                      onClick={() => hasLink && handleClickCircle(p.url)}
                      className={`inline-flex flex-col items-center justify-center text-center transition-all duration-300 select-none group/item
                        ${hasLink ? "cursor-none hover:scale-105" : ""}
                      `}
                    >
                      {/* Logo circle */}
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center overflow-hidden border relative transition-all duration-300
                        ${p.logo 
                          ? "bg-transparent border-[#0A0A0A]/10 hover:border-[#0012ff]/50" 
                          : "bg-transparent border-dashed border-[#0A0A0A]/20 hover:border-[#0012ff]/40"
                        }
                      `}>
                        {p.logo ? (
                          <>
                            <img 
                              src={p.logo} 
                              alt={p.name} 
                              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover/item:scale-110" 
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                const defaultUrl = `/assets/about_partner_logo_${p.id}.png`;
                                const absoluteDefault = new URL(defaultUrl, window.location.origin).href;
                                if (e.currentTarget.src !== absoluteDefault) {
                                  e.currentTarget.src = absoluteDefault;
                                }
                              }}
                            />
                            {/* Interactive hover indicator inside circle */}
                            {hasLink && (
                              <div className="absolute inset-0 bg-[#0012ff]/5 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0012ff]" />
                              </div>
                            )}
                          </>
                        ) : (
                          /* Architect blueprint drafting placeholder */
                          <div className="relative flex flex-col items-center justify-center text-center p-1 font-sans pointer-events-none">
                            {/* Small dotted coordinate ring inside placeholder */}
                            <div className="absolute inset-1 rounded-full border border-dotted border-[#0A0A0A]/10" />
                            <span className="text-[10px] font-bold text-[#0A0A0A]/40 group-hover/item:text-[#0012ff]/70 transition-colors">
                              C0{p.id + 1}
                            </span>
                            <span className="text-[6px] text-[#0A0A0A]/35 lowercase mt-0.5 tracking-tight truncate max-w-[40px]">
                              empty_slot
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Label under circle */}
                      <span className="text-[8px] font-sans font-semibold text-[#0A0A0A]/40 group-hover/item:text-[#0012ff] mt-2 tracking-wider transition-colors">
                        {p.name || `COMPANY_0${p.id + 1}`}
                      </span>

                      {/* Link indicator */}
                      {hasLink && (
                        <span className="text-[6px] font-sans text-[#0012ff]/60 mt-0.5 lowercase group-hover/item:underline opacity-0 group-hover/item:opacity-100 transition-opacity">
                          visit_website
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* NEXT SECTION PORTALS: 5 DISCIPLINES - BLACK BACKGROUND EDGE-TO-EDGE FULL-WIDTH CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-24 mb-16 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 bg-[#0A0A0A] border-y border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] pointer-events-auto flex flex-col gap-12 sm:gap-16 overflow-hidden z-10"
        >
          {[
            {
              key: "product",
              label: "product design.",
              prefix: "PROD",
              suffix: "UCT.",
              banner: productBanner,
              setBanner: setProductBanner,
              fontSize: "clamp(2rem, 13vw, 14.5rem)"
            },
            {
              key: "furniture",
              label: "furniture design.",
              prefix: "FURNIT",
              suffix: "URE.",
              banner: furnitureBanner,
              setBanner: setFurnitureBanner,
              fontSize: "clamp(1.8rem, 11vw, 12rem)"
            },
            {
              key: "transport",
              label: "transport design.",
              prefix: "TRANS",
              suffix: "PORT.",
              banner: transportBanner,
              setBanner: setTransportBanner,
              fontSize: "clamp(1.8rem, 11vw, 12rem)"
            },
            {
              key: "visual",
              label: "visual design.",
              prefix: "VISU",
              suffix: "AL.",
              banner: visualBanner,
              setBanner: setVisualBanner,
              fontSize: "clamp(2rem, 13.5vw, 14.5rem)"
            },
            {
              key: "experience",
              label: "experience design.",
              prefix: "EXPERIE",
              suffix: "NCE.",
              banner: experienceBanner,
              setBanner: setExperienceBanner,
              fontSize: "clamp(1.5rem, 9.8vw, 10.5rem)"
            }
          ].map((p) => {
            const isDragActive = dragActivePortal === p.key;
            return (
              <div 
                key={p.key} 
                id={p.key === "product" ? "home-product-title" : undefined}
                className="flex flex-col items-center w-full group/portal-wrapper"
              >
                
                {/* Massive Interactive Heading */}
                <div 
                  onClick={() => {
                    if (onNavigateToSection) {
                      onNavigateToSection(p.key);
                    } else if (p.key === "product" && onNavigateToProduct) {
                      onNavigateToProduct();
                    }
                  }}
                  className="group/portal relative flex items-center justify-center cursor-none select-none w-full"
                >
                  {/* Prefix Letters - Naturally White, #0012ff on Hover */}
                  <span 
                    className="font-sans font-black text-white leading-none uppercase transition-all duration-500 ease-out group-hover/portal:text-[#0012ff] group-hover/portal:scale-[1.01] select-none relative z-0"
                    style={{ 
                      fontSize: p.fontSize,
                      letterSpacing: "-0.08em"
                    }}
                  >
                    {p.prefix}
                  </span>

                  {/* 16:9 Overlapping Image Template Slot */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigateToSection) {
                        onNavigateToSection(p.key);
                      } else if (p.key === "product" && onNavigateToProduct) {
                        onNavigateToProduct();
                      }
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActivePortal(p.key);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActivePortal(p.key);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActivePortal(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActivePortal(null);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        if (file.type.startsWith("image/")) {
                          const reader = new FileReader();
                          reader.onload = async (event) => {
                            if (event.target?.result) {
                              const resultStr = event.target.result as string;
                              const compressedStr = await compressImage(resultStr);
                              p.setBanner(compressedStr);

                              setAsset(`about_${p.key}_banner`, compressedStr).catch(err => console.error(err));

                              try {
                                localStorage.setItem(`about_${p.key}_banner`, compressedStr);
                              } catch (err) {
                                console.warn("Storage quota exceeded, saved in IndexedDB only.");
                              }

                              if (onMakeDraftEdit) {
                                onMakeDraftEdit();
                              }
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                    className={`relative aspect-[16/9] rounded-sm overflow-hidden flex flex-col items-center justify-center transition-all duration-500 ease-out group/img border mx-[-2vw] md:mx-[-3vw] z-10 shadow-lg
                      ${p.banner 
                        ? "border-white/20 group-hover/portal:border-[#0012ff]" 
                        : isDragActive 
                          ? "border-2 border-solid border-[#0012ff] bg-[#0012ff]/20 scale-105" 
                          : "border-dashed border-white/20 hover:border-[#0012ff]/60 bg-white/10 hover:bg-white/20"
                      }
                    `}
                    style={{
                      height: "clamp(1.5rem, 6vw, 7.2vw)", 
                      width: "clamp(2.6rem, 10.6vw, 12.8vw)", 
                    }}
                  >
                    {p.banner ? (
                      <>
                        <img 
                           src={p.banner} 
                          alt={`${p.label} Showcase`} 
                          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover/img:scale-105"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const defaultBanners: Record<string, string> = APP_ASSETS.categoryTemplates;
                            const defaultUrl = defaultBanners[p.key] || `/assets/about_${p.key}_banner.png`;
                            const absoluteDefault = defaultUrl.startsWith("http") ? defaultUrl : new URL(defaultUrl, window.location.origin).href;
                            if (e.currentTarget.src !== absoluteDefault) {
                              e.currentTarget.src = absoluteDefault;
                            }
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.1] group-hover/img:opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="0.5" />
                          <line x1="100" y1="0" x2="0" y2="100" stroke="white" strokeWidth="0.5" />
                        </svg>
                        <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none p-0.5">
                          <svg 
                            width="10" 
                            height="10" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            className="text-white/40 group-hover/portal:text-[#0012ff] transition-colors"
                          >
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          <span className="text-[5px] font-sans font-bold text-white/50 group-hover/portal:text-[#0012ff] mt-0.5 tracking-wider uppercase">
                            Upload
                          </span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePortalType(p.key);
                            portalInputRef.current?.click();
                          }}
                          className="absolute inset-0 bg-transparent cursor-none border-none outline-none focus:outline-none focus:ring-0 z-20"
                        />
                      </>
                    )}
                  </div>

                  {/* Suffix Letters - Naturally White, #0012ff on Hover */}
                  <span 
                    className="font-sans font-black text-white leading-none uppercase transition-all duration-500 ease-out group-hover/portal:text-[#0012ff] group-hover/portal:scale-[1.01] select-none relative z-0"
                    style={{ 
                      fontSize: p.fontSize,
                      letterSpacing: "-0.08em"
                    }}
                  >
                    {p.suffix}
                  </span>

                  {/* Blueprint background grid lines when hovered */}
                  <div className="absolute -inset-x-4 -inset-y-2 border border-dashed border-[#0012ff]/0 group-hover/portal:border-[#0012ff]/30 transition-all duration-500 rounded-lg pointer-events-none" />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CONTACT SECTION */}
        <div 
          id="contact-section" 
          onDragEnter={handleContactVideoDrag}
          onDragOver={handleContactVideoDrag}
          onDragLeave={handleContactVideoDrag}
          onDrop={handleContactVideoDrop}
          className="w-full max-w-4xl aspect-auto py-12 sm:py-16 md:py-0 md:aspect-[16/9] mx-auto mt-24 relative overflow-hidden rounded-sm border border-[#0A0A0A]/10 shadow-sm flex flex-col items-center justify-center pointer-events-auto group animate-fade-in"
        >
          {/* Background Elements */}
          {contactVideoUrl ? (
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              {(() => {
                const embedInfo = getVideoEmbedInfo(contactVideoUrl);
                return (
                  <>
                    {embedInfo.isEmbed ? (
                      <iframe
                        key={embedInfo.embedUrl}
                        src={embedInfo.embedUrl}
                        className="w-full h-full absolute inset-0 pointer-events-none border-none scale-105"
                        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                        title="Contact background video embed"
                      />
                    ) : (
                      <video 
                        key={embedInfo.embedUrl}
                        src={embedInfo.embedUrl} 
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Semi-transparent overlay to ensure extreme legibility on any custom video */}
                    <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px] z-10" />
                  </>
                );
              })()}
            </div>
          ) : (
            // A dynamic metallic silver-grey radial gradient reflecting light off a premium engineered metal surface
            <div 
              className="absolute inset-0 w-full h-full z-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(
                    circle at 50% 50%,
                    #FCFCFC 0%,
                    #EAEAEA 50%,
                    #D4D4D4 100%
                  )
                `,
              }}
            >
              {/* Background grid lines */}
              <div 
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                  backgroundImage: `
                    radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%),
                    radial-gradient(circle, transparent 40%, #000 40%, #000 41%, transparent 41%)
                  `,
                  backgroundSize: "160px 160px",
                  backgroundPosition: "center",
                }}
              />
            </div>
          )}

          {/* Drag and Drop Hover State */}
          {isContactVideoDragActive && (
            <div className="absolute inset-0 bg-[#0012ff]/15 backdrop-blur-sm border-2 border-solid border-[#0012ff] flex flex-col items-center justify-center z-25 transition-all">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#0012ff] uppercase">
                drop_video_here
              </span>
            </div>
          )}

          {/* Unobtrusive, Hover-only Video Settings Trigger is hidden */}

          {/* Content Overlay - Clickable Mail and Social Buttons centered with NO other text */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 w-full max-w-lg">
            {/* Clickable Email address */}
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=mallikanethrasreenivasan@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-[11px] min-[375px]:text-sm sm:text-xl md:text-2xl text-[#0A0A0A] hover:text-[#0012ff] tracking-tight transition-colors cursor-none block break-all sm:whitespace-nowrap lowercase px-2"
              title="Compose in Gmail"
            >
              mallikanethrasreenivasan@gmail.com
            </a>

            {/* Subtle Divider */}
            <div className="w-16 h-[2px] bg-[#0A0A0A]/10 rounded-full my-6" />

            {/* Social Network Buttons */}
            <div className="flex items-center justify-center gap-8">
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/mallika-nethra-sreenivasan-4a9031262/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#0A0A0A]/5 border border-[#0A0A0A]/10 flex items-center justify-center text-[#0A0A0A]/70 hover:text-[#0012ff] hover:bg-white/40 hover:border-[#0012ff]/30 hover:scale-105 transition-all duration-300 cursor-none shadow-sm"
                title="LinkedIn"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>

              {/* Behance */}
              <a 
                href="https://www.behance.net/mallikanethra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#0A0A0A]/5 border border-[#0A0A0A]/10 flex items-center justify-center text-[#0A0A0A]/70 hover:text-[#0012ff] hover:bg-white/40 hover:border-[#0012ff]/30 hover:scale-105 transition-all duration-300 cursor-none shadow-sm"
                title="Behance"
              >
                <BehanceIcon size={20} />
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/trinaethra/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-[#0A0A0A]/5 border border-[#0A0A0A]/10 flex items-center justify-center text-[#0A0A0A]/70 hover:text-[#0012ff] hover:bg-white/40 hover:border-[#0012ff]/30 hover:scale-105 transition-all duration-300 cursor-none shadow-sm"
                title="Instagram"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Hidden Glassmorphic Video Config Panel */}
          {showContactVideoConfig && (
            <div className="absolute inset-0 bg-[#FCFCFC]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 transition-all duration-300">
              <div className="w-full max-w-sm flex flex-col items-center gap-4 border border-[#0A0A0A]/10 p-5 rounded bg-white shadow-lg relative">
                <button 
                  onClick={() => setShowContactVideoConfig(false)}
                  className="absolute top-3 right-3 text-[#0A0A0A]/40 hover:text-[#0A0A0A] font-bold font-mono text-[10px] uppercase tracking-wider"
                >
                  [x]
                </button>
                
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-[#0A0A0A]/60">
                  bg_video_configuration
                </span>

                {/* Tabs for source */}
                <div className="flex gap-1.5 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); setContactVideoSourceTab("file"); }}
                    className={`px-3 py-1 font-mono text-[8px] font-bold tracking-wider uppercase border transition-all rounded-sm cursor-pointer ${
                      contactVideoSourceTab === "file"
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                        : "bg-white/40 text-[#0A0A0A]/50 border-[#0A0A0A]/5 hover:bg-white/60"
                    }`}
                  >
                    file
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setContactVideoSourceTab("link"); }}
                    className={`px-3 py-1 font-mono text-[8px] font-bold tracking-wider uppercase border transition-all rounded-sm cursor-pointer ${
                      contactVideoSourceTab === "link"
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                        : "bg-white/40 text-[#0A0A0A]/50 border-[#0A0A0A]/5 hover:bg-white/60"
                    }`}
                  >
                    link
                  </button>
                </div>

                {isContactVideoCompressing ? (
                  <div className="flex flex-col items-center justify-center text-center py-2">
                    <span className="text-[10px] font-mono font-bold text-[#0012ff] animate-pulse">
                      compressing_video_{contactVideoCompressingProgress}%
                    </span>
                    <span className="text-[7px] font-mono text-[#0A0A0A]/45 mt-1 tracking-widest uppercase">
                      {contactVideoCompressingStatus}
                    </span>
                  </div>
                ) : contactVideoSourceTab === "file" ? (
                  <div 
                    onClick={triggerContactVideoInput}
                    className="w-full flex flex-col items-center justify-center py-6 px-4 border border-dashed border-[#0012ff]/20 bg-white hover:bg-[#0012ff]/5 transition-all rounded-sm cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#0A0A0A]/35">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <span className="mt-2 text-[8px] font-mono font-bold tracking-widest text-[#0A0A0A]/50 uppercase text-center">
                      upload_bg_video
                    </span>
                    <span className="mt-0.5 text-[6px] font-mono text-[#0A0A0A]/35 text-center">
                      drag & drop onto banner or click here
                    </span>
                  </div>
                ) : (
                  <div className="w-full flex flex-col gap-2 bg-white rounded-sm">
                    <input
                      type="text"
                      placeholder="Paste YouTube, Vimeo or MP4 URL..."
                      value={tempContactVideoUrl}
                      onChange={(e) => setTempContactVideoUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveContactVideoUrl();
                          setShowContactVideoConfig(false);
                        }
                      }}
                      className="w-full px-2 py-1.5 text-[9px] font-mono bg-white border border-[#0A0A0A]/15 focus:border-[#0012ff] outline-none rounded-sm"
                    />
                    <button
                      onClick={() => {
                        handleSaveContactVideoUrl();
                        setShowContactVideoConfig(false);
                      }}
                      className="w-full py-1.5 bg-[#0012ff] hover:bg-[#000edb] text-white font-mono text-[8px] font-bold tracking-wider uppercase transition-all rounded-sm"
                    >
                      apply video URL
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
