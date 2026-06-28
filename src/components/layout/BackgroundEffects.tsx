"use client";

import { useEffect, useRef } from "react";

// ─── Aurora Blobs ───────────────────────────────────────────────────────────
function AuroraBlobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Blob 1 — top left, slow drift */}
      <div
        className="absolute rounded-full opacity-[0.12] blur-[120px]"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, #7d1212 0%, #3d0808 60%, transparent 100%)",
          top: "-100px",
          left: "-100px",
          animation: "blob1 18s ease-in-out infinite",
        }}
      />

      {/* Blob 2 — bottom right, medium drift */}
      <div
        className="absolute rounded-full opacity-[0.09] blur-[140px]"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, #9b1515 0%, #3d0808 55%, transparent 100%)",
          bottom: "-150px",
          right: "-150px",
          animation: "blob2 22s ease-in-out infinite",
        }}
      />

      {/* Blob 3 — center, slow pulse */}
      <div
        className="absolute rounded-full opacity-[0.06] blur-[160px]"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #c81c1c 0%, transparent 70%)",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "blob3 28s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes blob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25%       { transform: translate(80px, 60px) scale(1.08); }
          50%       { transform: translate(40px, 120px) scale(0.95); }
          75%       { transform: translate(-40px, 50px) scale(1.05); }
        }
        @keyframes blob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          30%       { transform: translate(-90px, -70px) scale(1.1); }
          60%       { transform: translate(-50px, -120px) scale(0.92); }
          80%       { transform: translate(30px, -60px) scale(1.06); }
        }
        @keyframes blob3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.06; }
          40%       { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
          70%       { transform: translate(-50%, -50%) scale(0.85); opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}

// ─── Cursor Trail ────────────────────────────────────────────────────────────
function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to window
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }

    const particles: Particle[] = [];
    let mouseX = -999;
    let mouseY = -999;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn 2-3 particles per move
      for (let i = 0; i < 3; i++) {
        particles.push({
          x:       mouseX + (Math.random() - 0.5) * 10,
          y:       mouseY + (Math.random() - 0.5) * 10,
          vx:      (Math.random() - 0.5) * 1.2,
          vy:      (Math.random() - 0.5) * 1.2 - 0.4,
          life:    1,
          maxLife: 0.6 + Math.random() * 0.6,
          size:    2 + Math.random() * 3,
        });
      }
    };
    window.addEventListener("mousemove", onMove);

    // Touch support
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouseX = t.clientX;
      mouseY = t.clientY;
    };
    window.addEventListener("touchmove", onTouch);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x    += p.vx;
        p.y    += p.vy;
        p.life -= 0.025;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha   = p.life * 0.7;
        const radius  = p.size * p.life;
        const grad    = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.5);
        grad.addColorStop(0, `rgba(200, 28, 28, ${alpha})`);
        grad.addColorStop(0.5, `rgba(155, 21, 21, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(61, 8, 8, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export function BackgroundEffects() {
  return (
    <>
      <AuroraBlobs />
      <CursorTrail />
    </>
  );
}
