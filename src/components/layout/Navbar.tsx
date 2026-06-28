"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon, Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#about",    label: "About"    },
  { href: "/#skills",   label: "Skills"   },
  { href: "/#projects", label: "Projects" },
  { href: "/projects",  label: "All Work" },
  { href: "/#contact",  label: "Contact"  },
];

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
    a.addEventListener("timeupdate", () => { if (a.duration) setProg(a.currentTime / a.duration * 100); });
    return () => { a.pause(); a.src = ""; };
  }, [url]);

  if (!url) return null;

  const toggle = () => {
    const a = audioRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else { a.play(); setPlaying(true); }
  };
  const toggleMute = () => {
    const a = audioRef.current; if (!a) return;
    a.muted = !muted; setMuted(!muted);
  };

  return (
    <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)]">
      <button onClick={toggle} className="text-blood-400 hover:text-blood-300 transition-colors" aria-label={playing ? "Pause" : "Play"}>
        {playing ? <Pause size={11} /> : <Play size={11} />}
      </button>
      <div className="w-12 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div className="h-full bg-blood-600 transition-all duration-300" style={{ width: `${prog}%` }} />
      </div>
      <Music2 size={9} className="text-dark-600" />
      <button onClick={toggleMute} className="text-dark-600 hover:text-dark-400 transition-colors" aria-label="Mute">
        {muted ? <VolumeX size={10} /> : <Volume2 size={10} />}
      </button>
    </div>
  );
}

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
    <header
      className={cn(
        "fixed z-50 left-0 right-0 transition-all duration-500",
        isBottom
          ? "bottom-0 top-auto bg-dark-950/85 backdrop-blur-md border-t border-dark-800/60"
          : "top-0 bottom-auto backdrop-blur-md border-b border-[var(--border)]"
      )}
      style={!isBottom ? { background: "color-mix(in srgb, var(--bg-primary) 92%, transparent)" } : {}}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="font-mono font-bold text-lg text-dark-100 hover:text-blood-500 transition-colors shrink-0">
          <span className="text-blood-600">&lt;</span>Zhiyy<span className="text-blood-600">/&gt;</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-5 flex-1 justify-center">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="text-xs font-mono text-dark-400 hover:text-blood-400 transition-colors tracking-wide">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-2">
          <MusicControl />

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--bg-card)] text-dark-400 hover:text-blood-400 hover:border-blood-800 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <Link href="/#contact" className="px-4 py-1.5 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-xs font-medium transition-colors">
            Hire Me
          </Link>
        </div>

        {/* Mobile */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-dark-400 hover:text-blood-400 transition-colors" aria-label="Menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden backdrop-blur-md border-t border-[var(--border)] px-6 pb-5 pt-3"
          style={{ background: "var(--bg-primary)" }}>
          <ul className="flex flex-col gap-3">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setIsOpen(false)}
                  className="block text-sm font-mono py-1.5 text-dark-400 hover:text-blood-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <button onClick={toggle} className="flex items-center gap-2 text-xs text-dark-400 hover:text-blood-400 transition-colors">
                {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <Link href="/#contact" onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-colors">
                Hire Me
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
