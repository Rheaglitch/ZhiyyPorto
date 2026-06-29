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
  "FIREWALL BYPASSED",
  "PAYLOAD INJECTED — ROOTSHELL",
  "EXPLOIT SUCCESSFUL: CVE-0xDEAD",
  "REMOTE CODE EXECUTION DETECTED",
  "BACKDOOR ESTABLISHED",
  "PRIVILEGE ESCALATION: root",
  "ARP POISONING ACTIVE",
  "DNS HIJACK IN PROGRESS",
  "KERNEL MODULE LOADED: HIDDEN",
  "PROCESS HOLLOW: PID 0x0",
];

// Single scrolling column component
function ScrollColumn({
  lines,
  speed,
  startOffset,
  fontSize,
  opacityBase,
}: {
  lines: string[];
  speed: number;
  startOffset: number;
  fontSize: number;
  opacityBase: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef   = useRef(startOffset);
  const rafRef   = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    posRef.current = startOffset;

    const animate = () => {
      posRef.current -= speed;
      const halfH = track.scrollHeight / 2;
      if (Math.abs(posRef.current) >= halfH) posRef.current += halfH;
      track.style.transform = `translateY(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, startOffset]);

  const doubled = [...lines, ...lines];

  return (
    <div ref={trackRef} className="flex flex-col" style={{ willChange: "transform" }}>
      {doubled.map((line, i) => {
        const isMain  = i % 4 === 0;
        const isFatal = line.startsWith("FATAL") || line.startsWith("CRITICAL") || line.startsWith("PANIC") || line.startsWith("ROOTKIT") || line.startsWith("SYSTEM F");
        const alpha   = isMain
          ? opacityBase + 0.25
          : opacityBase * 0.55;
        const color   = isFatal
          ? `rgba(220,30,30,${alpha + 0.15})`
          : isMain
          ? `rgba(185,60,60,${alpha})`
          : `rgba(130,70,70,${alpha * 0.8})`;

        return (
          <div key={i} className="font-mono leading-snug whitespace-nowrap"
            style={{
              fontSize:     `${fontSize}px`,
              color,
              marginBottom: isMain ? "7px" : "2px",
              letterSpacing: "0.035em",
              fontWeight:   isMain ? 700 : 400,
            }}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

interface ErrorCodeScrollProps {
  side?: "left" | "right";
}

export function ErrorCodeScroll({ side = "right" }: ErrorCodeScrollProps) {
  if (side === "left") return null; // left side removed, handled by dark overlay

  // Shuffle lines differently per column for variety
  const col1 = FATAL_LINES.slice(0);
  const col2 = [...FATAL_LINES.slice(15), ...FATAL_LINES.slice(0, 15)];
  const col3 = [...FATAL_LINES.slice(8),  ...FATAL_LINES.slice(0, 8)];
  const col4 = [...FATAL_LINES.slice(22), ...FATAL_LINES.slice(0, 22)];

  const columns = [
    { lines: col1, speed: 0.75, startOffset: 0,    fontSize: 13, opacity: 0.52, flex: 27 },
    { lines: col2, speed: 0.55, startOffset: -120, fontSize: 11, opacity: 0.35, flex: 23 },
    { lines: col3, speed: 0.90, startOffset: -60,  fontSize: 14, opacity: 0.48, flex: 28 },
    { lines: col4, speed: 0.45, startOffset: -200, fontSize: 10, opacity: 0.28, flex: 22 },
  ];

  return (
    <div
      className="absolute z-[2] overflow-hidden pointer-events-none select-none"
      style={{
        right:  0,
        top:    0,
        bottom: 0,
        width:  "56%",
        // Fade from left (smooth transition), keep full on right
        maskImage:       "linear-gradient(to right, transparent 0%, black 12%, black 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 100%), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
        maskComposite:       "intersect",
        WebkitMaskComposite: "destination-in",
      }}
      aria-hidden="true"
    >
      {/* 4 columns side by side */}
      <div className="flex h-full gap-0 pt-4">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="overflow-hidden relative"
            style={{ flex: col.flex, paddingLeft: "6px", paddingRight: "2px" }}
          >
            <ScrollColumn
              lines={col.lines}
              speed={col.speed}
              startOffset={col.startOffset}
              fontSize={col.fontSize}
              opacityBase={col.opacity}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
