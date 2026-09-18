import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface PersonalityVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export default function PersonalityVideoModal({
  isOpen,
  onClose,
  videoUrl = "https://res.cloudinary.com/si0bugwt/video/upload/v1784004809/download_lo5szd.mp4"
}: PersonalityVideoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="personality-video-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md"
      >
        {/* Modal Container */}
        <motion.div
          id="personality-video-modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15"
        >
          {/* Close button on top right */}
          <button
            id="close-personality-video-btn"
            onClick={onClose}
            aria-label="Close video trailer"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#0012ff] text-white flex items-center justify-center transition-colors duration-200 border border-white/20 hover:border-white shadow-lg cursor-pointer"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
