"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Home, User, Wrench, FolderOpen, Mail,
  Sun, Moon, Music2, Pause, Play, Volume2, VolumeX, Menu, X
} from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

const desktopLinks = [
  { href: "/#about",    label: "About"    },
  { href: "/#skills",   label: "Skills"   },
  { href: "/#projects", label: "Projects" },
  { href: "/projects",  label: "All Work" },
  { href: "/#contact",  label: "Contact"  },
];

// Mobile bottom nav — 5 tabs max
const mobileNavItems = [
  { href: "/",          label: "Home",     icon: Home       },
  { href: "/#about",    label: "About",    icon: User       },
  { href: "/#skills",   label: "Skills",   icon: Wrench     },
  { href: "/#projects", label: "Projects", icon: FolderOpen },
  { href: "/#contact",  label: "Contact",  icon: Mail       },
];

// ─── Music control (desktop only) ────────────────────────────────────────────
function MusicControl() {
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const [url,     setUrl    ] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted  ] = useState(false);
  const [prog,    setProg   ] = useState(0);

  useEffect(() => {
    fetch("/api/music").then(r => r.json()).then(d => { if (d.url) setUrl(d.url); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!url) return;
    const a = new Audio(url);
    a.loop = true;
    audioRef.current = a;
    a.addEventListener("timeupdate", () => {
      if (a.duration) setProg(a.currentTime / a.duration * 100);
    });
    return () => { a.pause(); a.src = ""; };
  }, [url]);

  if (!url) return null;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)]">
      <button
        onClick={() => {
          const a = audioRef.current; if (!a) return;
          if (playing) { a.pause(); setPlaying(false); } else { a.play(); setPlaying(true); }
        }}
        className="text-blood-400 hover:text-blood-300 transition-colors" aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={11} /> : <Play size={11} />}
      </button>
      <div className="w-12 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div className="h-full bg-blood-600 transition-all duration-300" style={{ width: `${prog}%` }} />
      </div>
      <Music2 size={9} className="text-dark-600" />
      <button
        onClick={() => {
          const a = audioRef.current; if (!a) return;
          a.muted = !muted; setMuted(!muted);
        }}
        className="text-dark-600 hover:text-dark-400 transition-colors" aria-label="Mute"
      >
        {muted ? <VolumeX size={10} /> : <Volume2 size={10} />}
      </button>
    </div>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function MobileBottomNav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Backdrop when more open */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-[45]"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[50] md:hidden border-t"
        style={{
          background: "color-mix(in srgb, var(--bg-primary) 95%, transparent)",
          borderColor: "var(--border)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href.split("#")[0]));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-xl transition-all active:scale-90"
              >
                <Icon
                  size={isActive ? 20 : 18}
                  className={cn(
                    "transition-all",
                    isActive ? "text-blood-500" : "text-dark-500"
                  )}
                />
                <span className={cn(
                  "text-[9px] font-mono transition-colors",
                  isActive ? "text-blood-500" : "text-dark-600"
                )}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute top-0 w-1 h-1 rounded-full bg-blood-500" />
                )}
              </Link>
            );
          })}

          {/* More button — theme toggle */}
          <button
            onClick={toggle}
            className="flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-xl transition-all active:scale-90"
          >
            {theme === "dark"
              ? <Sun size={18} className="text-dark-500" />
              : <Moon size={18} className="text-dark-500" />
            }
            <span className="text-[9px] font-mono text-dark-600">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}

// ─── Desktop Navbar ───────────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [isOpen,   setIsOpen  ] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isBottom = isHome && !scrolled;

  return (
    <>
      {/* ── Desktop navbar ── */}
      <header
        className={cn(
          "fixed z-50 left-0 right-0 transition-all duration-500",
          // Desktop: bottom on hero, top after scroll
          // Mobile: hidden (replaced by MobileBottomNav)
          "hidden md:block",
          isBottom
            ? "bottom-0 top-auto bg-dark-950/85 backdrop-blur-md border-t border-dark-800/60"
            : "top-0 bottom-auto backdrop-blur-md border-b border-[var(--border)]"
        )}
        style={!isBottom ? { background: "color-mix(in srgb, var(--bg-primary) 92%, transparent)" } : {}}
      >
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/"
            className="font-mono font-bold text-lg text-dark-100 hover:text-blood-500 transition-colors shrink-0">
            <span className="text-blood-600">&lt;</span>Zhiyy<span className="text-blood-600">/&gt;</span>
          </Link>

          <ul className="flex items-center gap-5 flex-1 justify-center">
            {desktopLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-xs font-mono text-dark-400 hover:text-blood-400 transition-colors tracking-wide">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <MusicControl />
            <button
              onClick={toggle}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--bg-card)] text-dark-400 hover:text-blood-400 hover:border-blood-800 transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>
            <Link href="/#contact"
              className="px-4 py-1.5 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-xs font-medium transition-colors">
              Hire Me
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Mobile top bar (logo only) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4 h-12"
        style={{
          background: "color-mix(in srgb, var(--bg-primary) 90%, transparent)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" className="font-mono font-bold text-base text-dark-100">
          <span className="text-blood-600">&lt;</span>Zhiyy<span className="text-blood-600">/&gt;</span>
        </Link>
        <Link href="/#contact"
          className="px-3 py-1 rounded-full bg-blood-700 text-white text-[10px] font-medium">
          Hire Me
        </Link>
      </header>

      {/* ── Mobile bottom nav ── */}
      <MobileBottomNav />
    </>
  );
}
