"use client";

import { useEffect, useRef } from "react";
import { ScrollVein } from "@/components/layout/ScrollVein";

// ─── Aurora Blobs (tetap sama) ───────────────────────────────────────────────
function AuroraBlobs() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute rounded-full opacity-[0.12] blur-[120px]"
        style={{
          width: "600px", height: "600px",
          background: "radial-gradient(circle, #7d1212 0%, #3d0808 60%, transparent 100%)",
          top: "-100px", left: "-100px",
          animation: "blob1 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.09] blur-[140px]"
        style={{
          width: "700px", height: "700px",
          background: "radial-gradient(circle, #9b1515 0%, #3d0808 55%, transparent 100%)",
          bottom: "-150px", right: "-150px",
          animation: "blob2 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-[0.06] blur-[160px]"
        style={{
          width: "500px", height: "500px",
          background: "radial-gradient(circle, #c81c1c 0%, transparent 70%)",
          top: "40%", left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "blob3 28s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes blob1 {
          0%,100%{transform:translate(0,0) scale(1)}
          25%{transform:translate(80px,60px) scale(1.08)}
          50%{transform:translate(40px,120px) scale(0.95)}
          75%{transform:translate(-40px,50px) scale(1.05)}
        }
        @keyframes blob2 {
          0%,100%{transform:translate(0,0) scale(1)}
          30%{transform:translate(-90px,-70px) scale(1.1)}
          60%{transform:translate(-50px,-120px) scale(0.92)}
          80%{transform:translate(30px,-60px) scale(1.06)}
        }
        @keyframes blob3 {
          0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.06}
          40%{transform:translate(-50%,-50%) scale(1.3);opacity:0.1}
          70%{transform:translate(-50%,-50%) scale(0.85);opacity:0.05}
        }
      `}</style>
    </div>
  );
}

// ─── Blood Crack Trail ───────────────────────────────────────────────────────
interface Crack {
  x: number;
  y: number;
  branches: Branch[];
  life: number;
  maxLife: number;
}

interface Branch {
  points: { x: number; y: number }[];
  width: number;
}

function generateCrack(
  startX: number,
  startY: number,
  angle: number,
  length: number,
  depth: number
): Branch[] {
  const branches: Branch[] = [];
  const points: { x: number; y: number }[] = [];

  let x = startX;
  let y = startY;
  let currentAngle = angle;
  const segLen = 8 + Math.random() * 12;
  const segments = Math.floor(length / segLen);

  points.push({ x, y });

  for (let i = 0; i < segments; i++) {
    currentAngle += (Math.random() - 0.5) * 0.7;
    x += Math.cos(currentAngle) * segLen;
    y += Math.sin(currentAngle) * segLen;
    points.push({ x, y });

    // Random sub-branch
    if (depth > 0 && Math.random() < 0.35) {
      const branchAngle = currentAngle + (Math.random() - 0.5) * 1.8;
      const subBranches = generateCrack(x, y, branchAngle, length * 0.5, depth - 1);
      branches.push(...subBranches);
    }
  }

  branches.unshift({ points, width: 1.5 - depth * 0.4 });
  return branches;
}

function BloodCrackTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cracks: Crack[] = [];
    let lastX = -999;
    let lastY = -999;
    let rafId: number;

    const spawnCrack = (x: number, y: number) => {
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < 18) return; // throttle by distance
      lastX = x;
      lastY = y;

      const angle = Math.atan2(y - (lastY || y), x - (lastX || x));
      const numCracks = 2 + Math.floor(Math.random() * 2);

      for (let i = 0; i < numCracks; i++) {
        const spreadAngle = angle + (Math.random() - 0.5) * 2.5;
        const length = 30 + Math.random() * 50;
        const branches = generateCrack(x, y, spreadAngle, length, 2);
        cracks.push({
          x, y,
          branches,
          life: 1,
          maxLife: 0.8 + Math.random() * 0.6,
        });
      }

      // Keep max 40 crack systems
      if (cracks.length > 40) cracks.splice(0, cracks.length - 40);
    };

    const onMove = (e: MouseEvent) => spawnCrack(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) spawnCrack(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch);

    const drawBranch = (branch: Branch, alpha: number, glowAlpha: number) => {
      if (branch.points.length < 2) return;

      // Glow layer
      ctx.save();
      ctx.shadowBlur   = 8;
      ctx.shadowColor  = `rgba(220, 30, 30, ${glowAlpha})`;
      ctx.strokeStyle  = `rgba(180, 20, 20, ${alpha * 0.6})`;
      ctx.lineWidth    = branch.width + 1;
      ctx.lineCap      = "round";
      ctx.lineJoin     = "round";
      ctx.beginPath();
      ctx.moveTo(branch.points[0].x, branch.points[0].y);
      for (let i = 1; i < branch.points.length; i++) {
        ctx.lineTo(branch.points[i].x, branch.points[i].y);
      }
      ctx.stroke();
      ctx.restore();

      // Core crack line
      ctx.save();
      ctx.strokeStyle = `rgba(255, 60, 60, ${alpha})`;
      ctx.lineWidth   = branch.width * 0.5;
      ctx.lineCap     = "round";
      ctx.lineJoin    = "round";
      ctx.beginPath();
      ctx.moveTo(branch.points[0].x, branch.points[0].y);
      for (let i = 1; i < branch.points.length; i++) {
        ctx.lineTo(branch.points[i].x, branch.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = cracks.length - 1; i >= 0; i--) {
        const crack = cracks[i];
        crack.life -= 0.018;

        if (crack.life <= 0) {
          cracks.splice(i, 1);
          continue;
        }

        const alpha     = crack.life * 0.9;
        const glowAlpha = crack.life * 0.4;

        for (const branch of crack.branches) {
          drawBranch(branch, alpha, glowAlpha);
        }

        // Blood drip dot at origin
        const dotAlpha = crack.life * 0.8;
        ctx.beginPath();
        ctx.arc(crack.x, crack.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 20, 20, ${dotAlpha})`;
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

export function BackgroundEffects() {
  return (
    <>
      <AuroraBlobs />
      <ScrollVein />
      <BloodCrackTrail />
    </>
  );
}
