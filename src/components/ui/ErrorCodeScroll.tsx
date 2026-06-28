"use client";

import { useEffect, useRef } from "react";

const FATAL_LINES = [
  "FATAL ERROR: SYSTEM COMPROMISED",
  "ACCESS DENIED — 0x000DEAD",
  "MEMORY CORRUPTED [0xFFFFFF]",
  "KERNEL PANIC — NOT SYNCING",
  "CRITICAL: STACK OVERFLOW",
  "ERROR 404: IDENTITY NOT FOUND",
  "BREACH DETECTED — FIREWALL DOWN",
  "SEGMENTATION FAULT (core dumped)",
  "UNAUTHORIZED ACCESS DETECTED",
  "NULL POINTER DEREFERENCE",
  "SYSTEM FAILURE — REBOOT FAILED",
  "ROOT ACCESS GRANTED [HACK]",
  "DATA EXFILTRATION IN PROGRESS...",
  "ENCRYPTION KEY COMPROMISED",
  "FATAL: pid 0x1337 killed",
  "INTRUSION DETECTED — IP BLOCKED",
  "BUFFER OVERFLOW EXPLOITED",
  "CRITICAL VULNERABILITY CVE-2024",
  "CONNECTION HIJACKED",
  "CERTIFICATE INVALID — MITM ATTACK",
  "PROCESS TERMINATED: SIGKILL",
  "DATABASE CORRUPTED — 0 ROWS LEFT",
  "SSH BRUTE FORCE DETECTED",
  "MALWARE SIGNATURE FOUND",
  "SYSTEM INTEGRITY VIOLATION",
  "ROOTKIT INSTALLED — HIDING...",
  "WATCHDOG: TIMER EXPIRED",
  "HEAP CORRUPTION DETECTED",
  "0xDEADBEEF — TRACE LOST",
  "PANIC: unable to handle page",
];

export function ErrorCodeScroll() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const posRef   = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.7;
    const animate = () => {
      posRef.current -= speed;
      const halfH = track.scrollHeight / 2;
      if (Math.abs(posRef.current) >= halfH) posRef.current = 0;
      track.style.transform = `translateY(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const doubled = [...FATAL_LINES, ...FATAL_LINES];

  return (
    <div
      className="absolute z-[2] overflow-hidden pointer-events-none select-none"
      style={{
        right:  0,
        top:    0,
        bottom: 0,
        left:   "45%",  // hanya area kanan — tidak overlap konten kiri
        maskImage:       "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 100%)",
        maskComposite:        "intersect",
        WebkitMaskComposite:  "destination-in",
      }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex flex-col pt-8"
        style={{ willChange: "transform" }}
      >
        {doubled.map((line, i) => {
          const isMain    = i % 5 === 0;
          const isFatal   = line.startsWith("FATAL") || line.startsWith("CRITICAL") || line.startsWith("PANIC");
          const baseAlpha = isMain ? 0.65 : 0.22;
          const color     = isFatal
            ? `rgba(220,30,30,${baseAlpha + 0.2})`
            : isMain
            ? `rgba(185,65,65,${baseAlpha})`
            : `rgba(150,80,80,${baseAlpha * 0.75})`;

          return (
            <div
              key={i}
              className="font-mono leading-snug"
              style={{
                fontSize:    isMain ? "15px" : "12px",
                color,
                paddingLeft: `${(i % 3) * 20}px`,
                marginBottom: isMain ? "8px" : "3px",
                letterSpacing: "0.04em",
                fontWeight:  isMain ? 700 : 400,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
