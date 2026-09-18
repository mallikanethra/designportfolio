/**
 * High-craft client-side video compressor utilizing HTML5 Canvas, HTML5 Video,
 * and MediaRecorder. It scales high-resolution videos (e.g. 4K, 1080p) down to
 * an optimized banner resolution (max width/height 640px), enforces 24 FPS,
 * sets a highly compressed web-optimal bitrate (~800kbps), and strips audio
 * to drastically reduce file sizes.
 */
export function compressVideo(
  file: File,
  onProgress?: (progress: number, status: string) => void
): Promise<Blob | File> {
  return new Promise((resolve) => {
    const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    onProgress?.(0, `reading_video (${originalSizeMB} MB)`);

    // Create a video element to load the file
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");

    // Timeout guard to prevent hanging (e.g. if codec is not supported)
    const timeoutId = setTimeout(() => {
      console.warn("Video compression timed out during metadata load. Falling back.");
      cleanup();
      resolve(file);
    }, 12000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      try {
        video.pause();
        video.src = "";
        URL.revokeObjectURL(objectUrl);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    };

    video.onloadedmetadata = () => {
      clearTimeout(timeoutId);

      let width = video.videoWidth;
      let height = video.videoHeight;
      const duration = video.duration || 0;

      if (!width || !height || duration <= 0) {
        console.warn("Invalid video dimensions or duration. Falling back.");
        cleanup();
        resolve(file);
        return;
      }

      onProgress?.(5, "analyzing_tracks");

      // Cap dimensions to standard banner sizes (max 640px)
      const maxDim = 640;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      // Ensure dimensions are even numbers (required by some encoders)
      width = Math.floor(width / 2) * 2;
      height = Math.floor(height / 2) * 2;

      // Setup Canvas
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.warn("Could not obtain 2D canvas context. Falling back.");
        cleanup();
        resolve(file);
        return;
      }

      // Capture Stream from Canvas
      let stream: MediaStream | null = null;
      try {
        if (canvas.captureStream) {
          stream = canvas.captureStream(24); // 24 FPS target
        } else if ((canvas as any).mozCaptureStream) {
          stream = (canvas as any).mozCaptureStream(24);
        }
      } catch (e) {
        console.error("Canvas stream capture not supported:", e);
      }

      if (!stream) {
        console.warn("Canvas stream capture not supported on this browser. Falling back.");
        cleanup();
        resolve(file);
        return;
      }

      // Choose supported MIME type and container
      const candidateTypes = [
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4"
      ];
      let selectedMime = "";
      for (const mime of candidateTypes) {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      onProgress?.(10, "initializing_encoder");

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, {
          mimeType: selectedMime || undefined,
          videoBitsPerSecond: 800000 // Target 800 kbps for high compression
        });
      } catch (e) {
        console.warn("MediaRecorder initialization failed. Falling back.", e);
        cleanup();
        resolve(file);
        return;
      }

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      let isFinished = false;
      let animationId: number;

      const finishCompression = () => {
        if (isFinished) return;
        isFinished = true;
        cancelAnimationFrame(animationId);
        
        try {
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        } catch (e) {
          console.error("Error stopping recorder:", e);
          cleanup();
          resolve(file);
        }
      };

      recorder.onstop = () => {
        cleanup();
        const compressedBlob = new Blob(chunks, { type: selectedMime || "video/webm" });
        const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);
        onProgress?.(100, `optimized_ready (${compressedSizeMB} MB)`);
        resolve(compressedBlob);
      };

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        cleanup();
        resolve(file);
      };

      // Set playback rate to compress faster than real-time if supported
      video.playbackRate = 1.5;

      // Handle play trigger
      video.play()
        .then(() => {
          try {
            recorder.start();
          } catch (e) {
            console.error("Failed to start recorder:", e);
            cleanup();
            resolve(file);
            return;
          }

          const drawLoop = () => {
            if (isFinished) return;

            if (video.paused || video.ended) {
              finishCompression();
              return;
            }

            // Draw current frame to canvas
            ctx.drawImage(video, 0, 0, width, height);

            // Calculate progress (map 10% to 95%)
            const currentRatio = video.currentTime / duration;
            const progress = Math.min(Math.round(10 + currentRatio * 85), 98);
            onProgress?.(progress, `compressing_frames (${progress}%)`);

            animationId = requestAnimationFrame(drawLoop);
          };

          drawLoop();
        })
        .catch((err) => {
          console.error("Failed to play video for canvas rendering:", err);
          cleanup();
          resolve(file);
        });

      // Backup end event
      video.onended = () => {
        finishCompression();
      };
    };

    video.onerror = (e) => {
      console.error("Video load error during compression:", e);
      cleanup();
      resolve(file);
    };
  });
}
