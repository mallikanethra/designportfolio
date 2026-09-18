import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  decay: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface MetallicBackgroundProps {
  variant?: "default" | "landing" | "white_metal" | "lighter" | "lighter_blue" | "resume";
}

export default function MetallicBackground({ variant = "default" }: MetallicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position for the background gradient shifts and blob targets
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    // Initial centering of mouse target
    const initX = window.innerWidth / 2;
    const initY = window.innerHeight / 2;
    mouseRef.current = { x: initX, y: initY, targetX: initX, targetY: initY };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;

      // Update metallic reflection coordinate in CSS variables for smooth GPU response
      if (containerRef.current) {
        const pctX = (e.clientX / window.innerWidth) * 100;
        const pctY = (e.clientY / window.innerHeight) * 100;
        containerRef.current.style.setProperty("--mx", `${pctX}%`);
        containerRef.current.style.setProperty("--my", `${pctY}%`);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current.targetX = touch.clientX;
        mouseRef.current.targetY = touch.clientY;

        if (containerRef.current) {
          const pctX = (touch.clientX / window.innerWidth) * 100;
          const pctY = (touch.clientY / window.innerHeight) * 100;
          containerRef.current.style.setProperty("--mx", `${pctX}%`);
          containerRef.current.style.setProperty("--my", `${pctY}%`);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Colors requested: #8E49FC (purple), #0012ff (fluorescent blue)
    const particleColors = ["#8E49FC", "#0012ff", "#FFFFFF", "#C3A6FF", "#808bff"];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Dynamic blob positions (easing towards mouse)
    let blobX = window.innerWidth / 2;
    let blobY = window.innerHeight / 2;

    interface TrailNode {
      x: number;
      y: number;
      size: number;
      alpha: number;
      color: string;
      decay: number;
      anglePhase: number;
      wobbleSpeed: number;
      organicScale: number;
    }

    let trail: TrailNode[] = [];
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Smooth easing of blob position
      blobX += (mouseRef.current.targetX - blobX) * 0.08;
      blobY += (mouseRef.current.targetY - blobY) * 0.08;
      mouseRef.current.x = blobX;
      mouseRef.current.y = blobY;

      // --- Draw Glowing Soft Swish Trail ---
      // Update trail node states
      trail = trail.filter((node) => {
        node.alpha -= node.decay;
        node.anglePhase += node.wobbleSpeed;
        if (node.alpha <= 0) return false;
        return true;
      });

      // If cursor is moving, spawn new swish blobs
      const speed = Math.sqrt(
        Math.pow(blobX - mouseRef.current.targetX, 2) + Math.pow(blobY - mouseRef.current.targetY, 2)
      );

      if (speed > 1.5) {
        // Add blob-like swish node with organic qualities
        trail.push({
          x: blobX + (Math.random() - 0.5) * 10,
          y: blobY + (Math.random() - 0.5) * 10,
          size: Math.random() * 60 + 130, // larger soft organic blobs: 130px to 190px
          alpha: 0.38,
          color: Math.random() > 0.45 ? "#8E49FC" : "#0012ff",
          decay: 0.006, // lingers longer and sweeps beautifully
          anglePhase: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.04 + 0.02,
          organicScale: Math.random() * 0.25 + 0.85,
        });

        // Add additional glittery particles directly along the active swish path
        const spawnCount = Math.min(5, Math.ceil(speed / 4));
        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 45; // close to swish center
          particles.push({
            x: blobX + Math.cos(angle) * dist,
            y: blobY + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 2 + (mouseRef.current.targetX - blobX) * 0.03,
            vy: (Math.random() - 0.5) * 2 + (mouseRef.current.targetY - blobY) * 0.03,
            size: Math.random() * 2 + 1,
            maxSize: Math.random() * 6 + 3,
            alpha: Math.random() * 0.6 + 0.4,
            decay: Math.random() * 0.015 + 0.008,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
          });
        }
      }

      // Draw all active trail swish nodes with soft, organic wobbles
      trail.forEach((node) => {
        // Organic wobble: swell the size and displace center slightly
        const wobbleSize = node.size * (node.organicScale + Math.sin(node.anglePhase) * 0.15);
        const offsetX = Math.cos(node.anglePhase * 0.8) * 15;
        const offsetY = Math.sin(node.anglePhase * 1.2) * 15;

        const grad = ctx.createRadialGradient(
          node.x + offsetX,
          node.y + offsetY,
          0,
          node.x + offsetX,
          node.y + offsetY,
          wobbleSize
        );

        if (node.color === "#8E49FC") {
          // Glow of light violet-purple
          grad.addColorStop(0, `rgba(142, 73, 252, ${node.alpha})`);
          grad.addColorStop(0.4, `rgba(142, 73, 252, ${node.alpha * 0.45})`);
          grad.addColorStop(1, "rgba(142, 73, 252, 0)");
        } else {
          // Glow of rich blue
          grad.addColorStop(0, `rgba(0, 119, 182, ${node.alpha})`);
          grad.addColorStop(0.4, `rgba(0, 119, 182, ${node.alpha * 0.45})`);
          grad.addColorStop(1, "rgba(0, 119, 182, 0)");
        }

        ctx.beginPath();
        ctx.arc(node.x + offsetX, node.y + offsetY, wobbleSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Always draw a bright centered source glow at current eased cursor
      const sourceGrad = ctx.createRadialGradient(blobX, blobY, 0, blobX, blobY, 80);
      sourceGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      sourceGrad.addColorStop(0.5, "rgba(0, 119, 182, 0.15)");
      sourceGrad.addColorStop(1, "rgba(0, 119, 182, 0)");

      ctx.beginPath();
      ctx.arc(blobX, blobY, 80, 0, Math.PI * 2);
      ctx.fillStyle = sourceGrad;
      ctx.fill();

      // --- Draw and Update Particles ---
      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        // Pulse size slightly to look "glittery"
        p.size = Math.min(p.maxSize, p.size + 0.1);

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw a diamond/star sparkle shape for glitter
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.6, 0);
        ctx.closePath();

        ctx.fillStyle = p.color;
        // Add a soft glow behind the white/light sparkles
        if (p.color === "#FFFFFF" || p.color === "#90E0EF") {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="metallic-bg"
      className="fixed inset-0 w-full h-full -z-20 transition-all duration-300"
      style={{
        // A luxurious metallic radial gradient reflecting light off a premium engineered metal surface
        background: variant === "resume"
          ? `
            radial-gradient(
              circle at var(--mx, 50%) var(--my, 50%),
              #2A2C34 0%,
              #21232A 20%,
              #1A1B21 45%,
              #121318 70%,
              #0B0C0E 100%
            )
          `
          : (variant === "landing" || variant === "default")
          ? `
            radial-gradient(
              circle at var(--mx, 50%) var(--my, 50%),
              #FCFCFC 0%,
              #EAEAEA 20%,
              #D4D4D4 45%,
              #B8B8B8 70%,
              #808080 100%
            )
          `
          : `
            radial-gradient(
              circle at var(--mx, 50%) var(--my, 50%),
              #FFFFFF 0%,
              #FAFAFC 25%,
              #F3F4F7 50%,
              #E9EBEF 75%,
              #DFE1E6 100%
            )
          `,
      }}
    >
      {/* Background radial lines / concentric industrial grooves to simulate machined metal */}
      <div 
        className="absolute inset-0 opacity-[0.03] -z-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%),
            radial-gradient(circle, transparent 40%, #000 40%, #000 41%, transparent 41%),
            radial-gradient(circle, transparent 60%, #000 60%, #000 61%, transparent 61%),
            radial-gradient(circle, transparent 80%, #000 80%, #000 81%, transparent 81%)
          `,
          backgroundSize: "200px 200px",
          backgroundPosition: "center",
        }}
      />
      {/* Dynamic interactive glow canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      />
    </div>
  );
}
