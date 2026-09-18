import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import { APP_ASSETS } from "../assets/assets";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Load image into an HTMLImageElement
      const img = new Image();
      img.crossOrigin = "anonymous";

      const loadImagePromise = new Promise<string>((resolve, reject) => {
        img.onload = () => {
          // Draw to high-DPI canvas to convert to PNG base64
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth || img.width || 2480;
          canvas.height = img.naturalHeight || img.height || 3508;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/png"));
          } else {
            reject(new Error("Canvas 2D context unavailable"));
          }
        };
        img.onerror = () => {
          // Fallback: fetch via blob
          fetch(APP_ASSETS.resumeImage)
            .then((res) => res.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
            .catch(reject);
        };
        img.src = APP_ASSETS.resumeImage;
      });

      const imgDataUrl = await loadImagePromise;

      // Create standard A4 PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Place image spanning full A4 page dimensions
      pdf.addImage(imgDataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      
      // Save with the exact requested filename: resume_mallikanethra.pdf
      pdf.save("resume_mallikanethra.pdf");
    } catch (error) {
      console.error("Failed to generate PDF resume:", error);
      // Fallback: download direct file
      const link = document.createElement("a");
      link.href = APP_ASSETS.resumeImage;
      link.download = "resume_mallikanethra.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        id="resume-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden"
      >
        <motion.div
          id="resume-modal-content"
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl h-[94vh] bg-[#18181B] rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex flex-col"
        >
          {/* Minimalist Top Bar: ONLY Download Button & Close (No Extra Text) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2.5">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-[#0012ff] hover:bg-[#000ec2] text-white text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-95 disabled:opacity-50"
              title="Download Resume (PDF)"
            >
              <Download size={15} />
              <span>{isDownloading ? "generating pdf..." : "download pdf"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close resume"
              className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-lg"
            >
              <X size={18} />
            </button>
          </div>

          {/* A4 Document Stage Area (No Extra Text, Just Pure Image) */}
          <div className="flex-1 overflow-auto p-2 sm:p-6 md:p-10 bg-[#18181B] flex justify-center items-start pt-14 sm:pt-16">
            <div
              className="relative bg-white rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-black/10 overflow-hidden w-full max-w-4xl"
              style={{
                aspectRatio: "1 / 1.414", // Exact standard A4 international paper proportion
              }}
            >
              <img
                src={APP_ASSETS.resumeImage}
                alt="Resume"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
