"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
const BALL_SIZE    = 48;  // px diameter
const BALL_RADIUS  = BALL_SIZE / 2;
const EDGE_PADDING = 16;  // min distance from screen edge

function getDefaultPos() {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const isMobile = window.innerWidth < 768;
  return {
    x: window.innerWidth  - BALL_RADIUS - EDGE_PADDING,
    y: window.innerHeight - (isMobile ? 152 : 96) - BALL_RADIUS,
  };
}

function clampPos(x: number, y: number) {
  const maxX = window.innerWidth  - BALL_RADIUS - EDGE_PADDING;
  const maxY = window.innerHeight - BALL_RADIUS - EDGE_PADDING;
  const minX = BALL_RADIUS + EDGE_PADDING;
  const minY = BALL_RADIUS + EDGE_PADDING;
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

// ─── ChatBot ─────────────────────────────────────────────────────────────────
export function ChatBot() {
  const [pos,   setPos  ] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [pulse, setPulse] = useState(true);

  const posRef      = useRef({ x: 0, y: 0 });
  const dragOffset  = useRef({ x: 0, y: 0 });
  const isDragging  = useRef(false);
  const totalMoved  = useRef(0);
  const animFrameRef = useRef<number>(0);

  // ── Init position after mount ──
  useEffect(() => {
    const p = getDefaultPos();
    setPos(p);
    posRef.current = p;
    setReady(true);

    // Pulse animation — stop after 3 seconds
    const t = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // ── Clamp position on window resize ──
  const handleResize = useCallback(() => {
    const clamped = clampPos(posRef.current.x, posRef.current.y);
    posRef.current = clamped;
    setPos(clamped);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // ── Drag event handlers ──
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;

      // Prevent scroll while dragging on mobile
      if ("touches" in e) e.preventDefault();

      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;

      const rawX = cx - dragOffset.current.x;
      const rawY = cy - dragOffset.current.y;
      const clamped = clampPos(rawX, rawY);

      totalMoved.current +=
        Math.abs(clamped.x - posRef.current.x) +
        Math.abs(clamped.y - posRef.current.y);

      posRef.current = clamped;

      // RAF for smooth rendering
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        setPos({ ...posRef.current });
      });
    };

    const onEnd = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove",  onMove, { passive: false });
    window.addEventListener("mouseup",    onEnd);
    window.addEventListener("touchmove",  onMove, { passive: false });
    window.addEventListener("touchend",   onEnd);
    window.addEventListener("touchcancel",onEnd);

    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseup",    onEnd);
      window.removeEventListener("touchmove",  onMove);
      window.removeEventListener("touchend",   onEnd);
      window.removeEventListener("touchcancel",onEnd);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  function onPointerDown(e: React.MouseEvent | React.TouchEvent) {
    // Prevent ghost click on mobile
    if ("touches" in e) e.preventDefault();

    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e ? e.touches[0].clientY : e.clientY;

    dragOffset.current = {
      x: cx - posRef.current.x,
      y: cy - posRef.current.y,
    };
    isDragging.current = true;
    totalMoved.current = 0;
  }

  function onPointerUp(e: React.MouseEvent | React.TouchEvent) {
    if ("touches" in e) e.preventDefault();
    isDragging.current = false;

    // Only treat as tap/click if barely moved (< 10px cumulative)
    if (totalMoved.current < 10) {
      openTidio();
    }
    totalMoved.current = 0;
  }

  function openTidio() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tidio = (window as any).tidioChatApi;
    if (tidio) {
      try {
        // Tidio may have hidden its widget — show and open
        const tidioContainer =
          document.getElementById("tidio-chat") ||
          document.getElementById("tidio-chat-code") ||
          document.querySelector("#tidio-chat-iframe")?.parentElement;

        if (tidioContainer) {
          (tidioContainer as HTMLElement).style.display = "";
          (tidioContainer as HTMLElement).style.visibility = "";
        }
        tidio.open();
      } catch (err) {
        console.warn("Tidio open failed:", err);
      }
    } else {
      // Tidio not loaded yet — wait and retry once
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t = (window as any).tidioChatApi;
        if (t) try { t.open(); } catch { /* ignore */ }
      }, 1500);
    }
  }

  if (!ready) return null;

  return (
    <button
      onMouseDown={onPointerDown}
      onMouseUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchEnd={onPointerUp}
      aria-label="Chat with us"
      className={cn(
        "fixed z-[9990]",
        "flex items-center justify-center",
        "select-none touch-none",
        "transition-shadow duration-200",
        "hover:shadow-xl hover:shadow-blood-900/60",
        "active:scale-95",
      )}
      style={{
        width:     `${BALL_SIZE}px`,
        height:    `${BALL_SIZE}px`,
        borderRadius: "50%",
        left:      `${pos.x - BALL_RADIUS}px`,
        top:       `${pos.y - BALL_RADIUS}px`,
        background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
        border:    "2px solid rgba(220,38,38,0.45)",
        boxShadow: "0 4px 20px rgba(153,21,21,0.55)",
        cursor:    "grab",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <MessageCircle size={20} className="text-white pointer-events-none" />

      {/* Pulse ring — shows on load */}
      {pulse && (
        <span
          className="absolute inset-0 rounded-full border-2 border-blood-400/50 animate-ping pointer-events-none"
        />
      )}
    </button>
  );
}
