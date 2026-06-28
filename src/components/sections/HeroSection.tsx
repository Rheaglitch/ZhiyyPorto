"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ─── Crescent Moon (static, behind photo) ────────────────────────────────────
function Crescent() {
  return (
    <div
      className="absolute right-[5%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-[2]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        width="520"
        height="520"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="cg1" cx="40%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#c81c1c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3d0808" stopOpacity="0"    />
          </radialGradient>
          <filter id="cglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="csoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Soft glow halo behind crescent */}
        <ellipse cx="210" cy="200" rx="160" ry="155" fill="url(#cg1)" />

        {/* Outer soft glow */}
        <path
          d="M 200,30 A 170,170 0 1 1 200,370 A 120,120 0 1 0 200,30 Z"
          fill="#4a0808"
          filter="url(#csoft)"
          opacity="0.5"
        />

        {/* Main crescent — dark base */}
        <path
          d="M 200,45 A 155,155 0 1 1 200,355 A 108,108 0 1 0 200,45 Z"
          fill="#1a0303"
          filter="url(#cglow)"
        />

        {/* Mid layer — deep red */}
        <path
          d="M 200,55 A 145,145 0 1 1 200,345 A 100,100 0 1 0 200,55 Z"
          fill="#5a0d0d"
        />

        {/* Top layer — blood red */}
        <path
          d="M 200,65 A 135,135 0 1 1 200,335 A 92,92 0 1 0 200,65 Z"
          fill="#8b1010"
          opacity="0.9"
        />

        {/* Bright inner edge highlight */}
        <path
          d="M 200,75 A 125,125 0 1 1 200,325 A 86,86 0 1 0 200,75 Z"
          fill="none"
          stroke="#c82020"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Rim glow — outermost */}
        <path
          d="M 200,45 A 155,155 0 1 1 200,355 A 108,108 0 1 0 200,45 Z"
          fill="none"
          stroke="#ff3030"
          strokeWidth="1.5"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}

// ─── Role Ticker ──────────────────────────────────────────────────────────────
function RoleTicker({ roles }: { roles: string[] }) {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (roles.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles]);

  const current = roles[index] ?? "";

  return (
    <div className="overflow-hidden">
      <span
        className="block font-black uppercase text-4xl md:text-5xl lg:text-6xl leading-none text-dark-100 transition-all duration-400"
        style={{
          opacity:   visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {current}
      </span>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
interface HeroSectionProps {
  heroImageUrl?: string;
  roles?: string[];
}

const FALLBACK_IMAGE = "https://zljhjdhknybktcvtdutz.supabase.co/storage/v1/object/public/hero/ab9e4d158163df3ee068613735669b04-removebg-preview.png";
const FALLBACK_ROLES = ["Web Dev", "Animator", "Designer", "Illustrator"];

export function HeroSection({ heroImageUrl, roles }: HeroSectionProps) {
  const imageUrl    = heroImageUrl || FALLBACK_IMAGE;
  const displayRoles = (roles && roles.length > 0) ? roles : FALLBACK_ROLES;

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* ── "Portfolio" big text — layer 1 ── */}
      <div
        className="absolute inset-0 z-[1] flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-black leading-none whitespace-nowrap text-[22vw]"
          style={{
            color: "rgba(155,21,21,0.045)",
            letterSpacing: "-0.04em",
            transform: "translateX(-2%)",
          }}
        >
          Portfolio
        </span>
      </div>

      {/* ── Crescent — layer 2, behind photo ── */}
      <Crescent />

      {/* ── Photo — layer 3 ── */}
      <div
        className="absolute z-[3] pointer-events-none"
        style={{
          right: "4%",
          bottom: 0,
          height: "92%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Reavlenia Arezha"
          className="h-full w-auto object-contain object-bottom"
          style={{ maxWidth: "460px" }}
        />
      </div>

      {/* ── UI layer — layer 4 ── */}
      <div className="relative z-[4] min-h-screen flex flex-col justify-between pb-16 pt-6 px-8 md:px-14">

        {/* Top row — name */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="font-mono text-[10px] text-blood-600 tracking-[0.3em] uppercase mb-1">
              Creative Portfolio
            </p>
            <p className="font-black text-2xl md:text-3xl text-dark-100 leading-none tracking-widest">
              REAVLENIA
              <span className="text-blood-600 ml-1">·</span>
              <span className="text-dark-400 font-bold"> AREZHA</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blood-900/40 bg-blood-950/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse" />
            <span className="text-[10px] font-mono text-blood-400 tracking-widest">
              OPEN TO WORK
            </span>
          </div>
        </div>

        {/* Middle — roles on left side */}
        <div className="flex flex-col gap-0 max-w-xs">
          {/* Decorative line */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-blood-700" />
            <span className="text-[10px] font-mono text-blood-600 tracking-[0.2em] uppercase">
              I am a
            </span>
          </div>

          <RoleTicker roles={displayRoles} />

          <p className="mt-5 text-dark-400 text-sm leading-relaxed max-w-[280px]">
            Menciptakan karya yang{" "}
            <span className="text-dark-200 font-medium">fungsional sekaligus indah</span>
            {" "}— dari kode sampai kanvas.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <Link
              href="/#projects"
              className="group relative px-6 py-2.5 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-xs font-semibold tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-blood-900/50 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Lihat Karya →</span>
            </Link>
            <Link
              href="/#contact"
              className="px-6 py-2.5 rounded-full border border-dark-700 hover:border-blood-600 text-dark-400 hover:text-blood-400 text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Kontak
            </Link>
          </div>
        </div>

        {/* Bottom row — social */}
        <div className="flex items-center gap-5">
          {[
            { label: "GitHub",    href: "https://github.com/Rheaglitch", short: "GitHub"    },
            { label: "Instagram", href: "https://instagram.com/",         short: "Instagram" },
            { label: "LinkedIn",  href: "https://linkedin.com/",           short: "LinkedIn"  },
          ].map(({ label, href, short }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 py-1"
            >
              <span className="w-3 h-px bg-dark-700 group-hover:bg-blood-600 group-hover:w-5 transition-all duration-300" />
              <span className="text-[11px] text-dark-500 group-hover:text-dark-100 font-mono transition-colors duration-200">
                {short}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
