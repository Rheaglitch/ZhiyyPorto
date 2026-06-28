"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Crescent Moon SVG yang mengecil saat scroll ──────────────────────────
function ScrollCrescent() {
  const [scale, setScale]     = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [cracked, setCracked] = useState(false);
  const crackedRef            = useRef(false);
  const canvasRef             = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
      const newScale = 1 - progress * 0.75;
      setScale(newScale);
      setOpacity(1 - progress * 1.2);

      // Trigger crack at 70% scroll
      if (progress > 0.7 && !crackedRef.current) {
        crackedRef.current = true;
        setCracked(true);
        spawnVeins();
      }
      if (progress < 0.1 && crackedRef.current) {
        crackedRef.current = false;
        setCracked(false);
        clearVeins();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Spawn vein effect on canvas when crescent "cracks"
  function spawnVeins() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Center of crescent (approx center of hero)
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight * 0.45;

    let progress = 0;
    const branches: { x: number; y: number; angle: number; len: number; width: number; life: number }[] = [];

    // Generate random vein branches from center
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
      branches.push({
        x: cx, y: cy,
        angle,
        len: 80 + Math.random() * 200,
        width: 1 + Math.random() * 2.5,
        life: 1,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress = Math.min(progress + 0.03, 1);

      for (const b of branches) {
        const drawn = progress;
        const ex = b.x + Math.cos(b.angle) * b.len * drawn;
        const ey = b.y + Math.sin(b.angle) * b.len * drawn;

        // Sub branches
        if (drawn > 0.5 && b.len > 100) {
          for (let s = 0; s < 2; s++) {
            const sa = b.angle + (Math.random() - 0.5) * 1.4;
            const sl = b.len * 0.4;
            const sx = b.x + Math.cos(b.angle) * b.len * 0.5;
            const sy = b.y + Math.sin(b.angle) * b.len * 0.5;
            const sub_progress = (drawn - 0.5) * 2;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(sa) * sl * sub_progress, sy + Math.sin(sa) * sl * sub_progress);
            ctx.strokeStyle = `rgba(120, 8, 8, ${b.life * 0.5})`;
            ctx.lineWidth   = b.width * 0.4;
            ctx.lineCap     = "round";
            ctx.stroke();
          }
        }

        // Dark base
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(20, 0, 0, ${b.life * 0.8})`;
        ctx.lineWidth   = b.width * 1.6;
        ctx.lineCap     = "round";
        ctx.stroke();

        // Red main
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(160, 12, 12, ${b.life * 0.85})`;
        ctx.lineWidth   = b.width;
        ctx.lineCap     = "round";
        ctx.stroke();

        // Glow core
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(220, 40, 40, ${b.life * 0.4})`;
        ctx.lineWidth   = b.width * 0.3;
        ctx.lineCap     = "round";
        ctx.stroke();
      }

      if (progress < 1) requestAnimationFrame(draw);
    }
    draw();
  }

  function clearVeins() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <>
      {/* Vein canvas — appears on crack */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        aria-hidden="true"
      />

      {/* Crescent moon */}
      <div
        className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-[2] pointer-events-none select-none"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity:    Math.max(0, opacity),
          transition: "none",
          filter:     cracked ? "blur(2px)" : "none",
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 200"
          width="320"
          height="320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="crescent-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#c81c1c" stopOpacity="0.9" />
              <stop offset="60%"  stopColor="#7d1212" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3d0808" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow halo */}
          <circle cx="105" cy="100" r="90" fill="url(#crescent-glow)" opacity="0.3" />

          {/* Crescent shape — outer minus inner circle offset */}
          <path
            d="M 100,20
               A 80,80 0 1 1 100,180
               A 55,55 0 1 0 100,20 Z"
            fill="#8b1010"
            filter="url(#glow)"
            opacity="0.95"
          />
          {/* Brighter inner edge */}
          <path
            d="M 100,30
               A 70,70 0 1 1 100,170
               A 48,48 0 1 0 100,30 Z"
            fill="none"
            stroke="#c82020"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>
      </div>
    </>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
interface HeroSectionProps {
  heroImageUrl?: string;
}

// Fallback jika Supabase belum ada data hero_image
const HERO_IMAGE_URL = "https://zljhjdhknybktcvtdutz.supabase.co/storage/v1/object/public/hero/ab9e4d158163df3ee068613735669b04-removebg-preview.png";

export function HeroSection({ heroImageUrl }: HeroSectionProps) {
  const imageUrl = heroImageUrl || HERO_IMAGE_URL;

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-dark-950"
    >
      {/* ── Magazine text layer (behind photo) ── */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-black uppercase leading-none tracking-tighter text-[18vw] text-blood-950/40"
          style={{ letterSpacing: "-0.04em" }}
          aria-hidden="true"
        >
          Portfolio
        </span>
      </div>

      {/* ── Crescent + vein canvas ── */}
      <ScrollCrescent />

      {/* ── Photo layer (above background text, below UI) ── */}
      <div className="absolute inset-0 z-[4] flex items-end justify-center pointer-events-none">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Reavlenia Arezha"
            className="h-[90%] w-auto object-contain object-bottom"
            style={{ maxWidth: "480px" }}
          />
        ) : (
          /* Placeholder outline when no photo */
          <div className="h-[85%] w-[320px] border border-dashed border-dark-700 rounded-t-full flex items-center justify-center">
            <span className="text-dark-700 font-mono text-xs">upload foto</span>
          </div>
        )}
      </div>

      {/* ── UI layer — role labels & CTA ── */}
      <div className="relative z-[5] min-h-screen flex flex-col justify-between px-8 md:px-16 py-8 pointer-events-none">
        {/* Top — role left + name right */}
        <div className="flex items-start justify-between w-full pt-20">
          {/* Left roles */}
          <div className="flex flex-col gap-1 pointer-events-auto">
            {["Web Dev", "Animator", "Designer"].map((role) => (
              <span
                key={role}
                className="font-black uppercase text-2xl md:text-3xl leading-none text-dark-100"
              >
                {role}
              </span>
            ))}
          </div>

          {/* Right — name */}
          <div className="text-right pointer-events-auto">
            <p className="font-mono text-xs text-blood-600 tracking-widest uppercase mb-1">
              Reavlenia
            </p>
            <p className="font-black text-2xl md:text-3xl text-dark-100 leading-none">
              AREZHA
            </p>
          </div>
        </div>

        {/* Bottom — social + CTA */}
        <div className="flex items-end justify-between w-full pb-4">
          {/* Social links */}
          <div className="flex flex-col gap-1 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="text-dark-600 font-mono text-[10px]">Inst.</span>
              <span className="text-dark-400 text-xs font-mono">@reavlenia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-dark-600 font-mono text-[10px]">Git.</span>
              <span className="text-dark-400 text-xs font-mono">Rheaglitch</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-end gap-3 pointer-events-auto">
            <div className="flex items-center gap-1 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse" />
              <span className="text-[10px] font-mono text-blood-500">Available</span>
            </div>
            <Link
              href="/#contact"
              className="px-6 py-2.5 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-blood-900/40"
            >
              Hire Me
            </Link>
            <Link
              href="/#projects"
              className="text-xs font-mono text-dark-500 hover:text-dark-300 transition-colors"
            >
              lihat karya ↓
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
