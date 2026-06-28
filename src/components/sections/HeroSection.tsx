"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ErrorCodeScroll } from "@/components/ui/ErrorCodeScroll";

// ─── Hero Photo — grayscale+blur default, color+sharp on hover ───────────────
function HeroPhoto({ src }: { src: string }) {
  const [hovered,  setHovered ] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.round(((e.clientX - rect.left) / rect.width)  * 100);
    const y = Math.round(((e.clientY - rect.top)  / rect.height) * 100);
    setMousePos({ x, y });
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ cursor: "crosshair" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Base — grayscale + blur */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Reavlenia Arezha"
        className="absolute inset-0 h-full w-full object-contain object-bottom object-right"
        style={{
          filter:     "grayscale(100%) blur(2.5px) brightness(0.85)",
          transition: "filter 0.5s ease",
        }}
      />

      {/* Hover layer — full color, sharp, clipped to circle around cursor */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain object-bottom object-right"
        style={{
          filter:     "grayscale(0%) blur(0px) brightness(1)",
          clipPath:   hovered
            ? `circle(85px at ${mousePos.x}% ${mousePos.y}%)`
            : "circle(0px at 50% 50%)",
          transition: "clip-path 0.15s ease",
          pointerEvents: "none",
        }}
      />

      {/* Focus box — follows cursor */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            left:      `calc(${mousePos.x}% - 80px)`,
            top:       `calc(${mousePos.y}% - 50px)`,
            width:     "160px",
            height:    "100px",
            border:    "1px solid rgba(255,255,255,0.35)",
            boxShadow: "inset 0 0 20px rgba(155,21,21,0.15)",
            transition: "left 0.08s ease, top 0.08s ease",
          }}
        >
          {/* Corner TL */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/70" />
          {/* Corner TR */}
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/70" />
          {/* Corner BL */}
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/70" />
          {/* Corner BR */}
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/70" />
          {/* FOCUS label */}
          <span className="absolute -top-5 left-0 text-[9px] font-mono tracking-[0.3em] text-white/50 uppercase">
            Focus
          </span>
          {/* Crosshair center */}
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 border border-blood-500/60 rounded-full" />
        </div>
      )}
    </div>
  );
}

// ─── Crescent Moon ────────────────────────────────────────────────────────────
function Crescent() {
  return (
    <div
      className="absolute pointer-events-none select-none z-[2]"
      style={{ right: "3%", top: "50%", transform: "translateY(-50%)" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 400" width="480" height="480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cg1" cx="40%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#c81c1c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3d0808" stopOpacity="0"   />
          </radialGradient>
          <filter id="cglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="csoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <ellipse cx="210" cy="200" rx="160" ry="155" fill="url(#cg1)" />
        {/* Soft outer glow */}
        <path d="M 200,45 A 155,155 0 1 1 200,355 A 108,108 0 1 0 200,45 Z"
          fill="#300505" filter="url(#csoft)" opacity="0.6" />
        {/* Dark base */}
        <path d="M 200,55 A 145,145 0 1 1 200,345 A 100,100 0 1 0 200,55 Z"
          fill="#1a0303" filter="url(#cglow)" />
        {/* Deep red */}
        <path d="M 200,65 A 135,135 0 1 1 200,335 A 92,92 0 1 0 200,65 Z" fill="#5a0d0d" />
        {/* Blood red */}
        <path d="M 200,72 A 128,128 0 1 1 200,328 A 87,87 0 1 0 200,72 Z"
          fill="#8b1010" opacity="0.92" />
        {/* Inner highlight */}
        <path d="M 200,80 A 120,120 0 1 1 200,320 A 82,82 0 1 0 200,80 Z"
          fill="none" stroke="#d42020" strokeWidth="1.5" opacity="0.4" />
        {/* Rim */}
        <path d="M 200,55 A 145,145 0 1 1 200,345 A 100,100 0 1 0 200,55 Z"
          fill="none" stroke="#ff4040" strokeWidth="1" opacity="0.15" />
      </svg>
    </div>
  );
}

// ─── Role Ticker ──────────────────────────────────────────────────────────────
function RoleTicker({ roles }: { roles: string[] }) {
  const [index,   setIndex  ] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (roles.length <= 1) return;
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIndex((p) => (p + 1) % roles.length); setVisible(true); }, 350);
    }, 2800);
    return () => clearInterval(id);
  }, [roles]);

  return (
    <div className="overflow-hidden" style={{ minHeight: "2.4em" }}>
      <span
        className="block font-black uppercase leading-tight text-dark-100"
        style={{
          fontSize:   "clamp(1.6rem, 3.5vw, 2.8rem)",
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
          wordBreak:  "break-word",
          maxWidth:   "100%",
        }}
      >
        {roles[index] ?? ""}
      </span>
    </div>
  );
}

// ─── Decorative stat pill ─────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-3 rounded-xl border border-blood-900/40 bg-blood-950/20">
      <span className="text-xl font-black text-gradient-blood leading-none">{value}</span>
      <span className="text-[10px] font-mono text-dark-500 mt-1 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
interface HeroSectionProps {
  heroImageUrl?: string;
  roles?: string[];
}

const FALLBACK_IMAGE = "https://zljhjdhknybktcvtdutz.supabase.co/storage/v1/object/public/hero/ab9e4d158163df3ee068613735669b04-removebg-preview.png";
const FALLBACK_ROLES = ["Web Developer", "Animator", "UI/UX Designer", "Illustrator"];

export function HeroSection({ heroImageUrl, roles }: HeroSectionProps) {
  const imageUrl     = heroImageUrl || FALLBACK_IMAGE;
  const displayRoles = roles && roles.length > 0 ? roles : FALLBACK_ROLES;

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden animated-gradient-bg"
    >
      {/* ── Error code scroll — behind crescent, right side only ── */}
      <ErrorCodeScroll />

      {/* ── Crescent — behind photo ── */}
      <Crescent />

      {/* ── Photo — right side ── */}
      <div
        className="absolute z-[3] select-none"
        style={{ right: 0, bottom: 0, height: "100%", width: "48%", cursor: "none" }}
      >
        <HeroPhoto src={imageUrl} />
      </div>

      {/* ── UI layer ── */}
      <div className="relative z-[4] min-h-screen flex flex-col justify-between px-8 md:px-14 pb-20 pt-8">

        {/* ── TOP: name + badge ── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] text-blood-600 tracking-[0.3em] uppercase mb-2">
              Creative Portfolio
            </p>
            <h1 className="font-black leading-none tracking-tight">
              <span className="block text-3xl md:text-4xl text-dark-100">REAVLENIA</span>
              <span className="block text-3xl md:text-4xl text-dark-500 font-bold mt-0.5">AREZHA</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-full border border-blood-800/50 bg-blood-950/30 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse shrink-0" />
            <span className="text-[10px] font-mono text-blood-400 tracking-widest whitespace-nowrap">
              OPEN TO WORK
            </span>
          </div>
        </div>

        {/* ── MIDDLE: role + stats + CTA ── */}
        <div className="flex flex-col gap-6 max-w-md pr-4">
          {/* Role */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-blood-700" />
              <span className="text-[10px] font-mono text-blood-600 tracking-[0.2em] uppercase">I am a</span>
            </div>
            <RoleTicker roles={displayRoles} />
          </div>

          {/* Short bio */}
          <p className="text-dark-400 text-sm leading-relaxed max-w-[300px]">
            Menciptakan karya yang{" "}
            <span className="text-dark-200 font-medium">fungsional sekaligus indah</span>
            {" "}— dari kode sampai kanvas.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3">
            <StatPill value="10+" label="Projects"    />
            <StatPill value="3+"  label="Years"       />
            <StatPill value="5+"  label="Disciplines" />
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/#projects"
              className="px-6 py-2.5 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-blood-900/50 hover:scale-105 active:scale-95"
            >
              Lihat Karya →
            </Link>
            <Link
              href="/#contact"
              className="px-6 py-2.5 rounded-full border border-dark-700 hover:border-blood-600 text-dark-400 hover:text-blood-400 text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Kontak
            </Link>
          </div>
        </div>

        {/* ── BOTTOM: social links ── */}
        <div className="flex items-center gap-5">
          {[
            { label: "GitHub",    href: "https://github.com/Rheaglitch" },
            { label: "Instagram", href: "https://instagram.com/"        },
            { label: "LinkedIn",  href: "https://linkedin.com/"         },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
            >
              <span className="w-4 h-px bg-dark-700 group-hover:bg-blood-600 group-hover:w-6 transition-all duration-300" />
              <span className="text-xs text-dark-500 group-hover:text-dark-200 font-mono transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
