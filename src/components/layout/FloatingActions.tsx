"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sun, Moon, Music2, Pause, Play,
  Volume2, VolumeX, Github, Instagram, Linkedin,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { cn } from "@/lib/utils";

// ─── Music Player ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [playing,  setPlaying ] = useState(false);
  const [muted,    setMuted   ] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch music URL from API
  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then((d) => { if (d.url) setMusicUrl(d.url); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!musicUrl) return;
    const audio = new Audio(musicUrl);
    audio.loop  = true;
    audioRef.current = audio;
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    });
    return () => { audio.pause(); audio.src = ""; };
  }, [musicUrl]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { audio.play();  setPlaying(true);  }
  }

  function toggleMute() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  }

  if (!musicUrl) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)]">
      <button
        onClick={togglePlay}
        className="text-blood-400 hover:text-blood-300 transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={13} /> : <Play size={13} />}
      </button>
      <div className="w-14 h-0.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-blood-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <Music2 size={10} className="text-dark-600" />
      <button
        onClick={toggleMute}
        className="text-dark-600 hover:text-dark-400 transition-colors"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX size={11} /> : <Volume2 size={11} />}
      </button>
    </div>
  );
}

// ─── Floating Actions ─────────────────────────────────────────────────────────
const socials = [
  { icon: Github,    href: "https://github.com/Rheaglitch", label: "GitHub"    },
  { icon: Instagram, href: "https://instagram.com/",        label: "Instagram" },
  { icon: Linkedin,  href: "https://linkedin.com/",         label: "LinkedIn"  },
];

export function FloatingActions() {
  const { theme, toggle } = useTheme();
  const [socialsOpen, setSocialsOpen] = useState(false);

  return (
    <>
      {/* ── Right side — theme + music ── */}
      <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2">
        <MusicPlayer />
        <button
          onClick={toggle}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
            "bg-[var(--bg-card)] border-[var(--border)] text-dark-400 hover:text-blood-400 hover:border-blood-800"
          )}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      {/* ── Left side — social links ── */}
      <div className="fixed left-4 bottom-20 z-40 flex flex-col items-start gap-2">
        <button
          onClick={() => setSocialsOpen(!socialsOpen)}
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
            "bg-[var(--bg-card)] border-[var(--border)] text-dark-400 hover:text-blood-400 hover:border-blood-800"
          )}
          style={{ transform: socialsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
          aria-label="Social links"
        >
          <ChevronDown size={14} />
        </button>
        <div
          className="flex flex-col gap-2 overflow-hidden transition-all duration-300"
          style={{ maxHeight: socialsOpen ? "200px" : "0px", opacity: socialsOpen ? 1 : 0 }}
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
                "bg-[var(--bg-card)] border-[var(--border)] text-dark-500 hover:text-blood-400 hover:border-blood-800"
              )}
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
