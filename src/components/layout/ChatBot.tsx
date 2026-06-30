"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const BALL_SIZE    = 48;   // px diameter
const SAFE_PADDING = 12;   // min distance from edges
const STORAGE_KEY  = "zhiyy_chatbot_pos";

function clampPos(x: number, y: number): { x: number; y: number } {
  const maxX = window.innerWidth  - BALL_SIZE - SAFE_PADDING;
  const maxY = window.innerHeight - BALL_SIZE - SAFE_PADDING;
  const minX = SAFE_PADDING;
  const minY = SAFE_PADDING;
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

function getDefaultPos(): { x: number; y: number } {
  // Default: bottom-right, above scroll-to-top (which is at bottom:88px right:20px)
  // So chatbot at bottom: 88 + 48 + 12 = 148px from bottom
  const x = window.innerWidth  - BALL_SIZE - SAFE_PADDING - 4;
  const y = window.innerHeight - BALL_SIZE - 148;
  return clampPos(x, y);
}

export function ChatBot() {
  const [pos,      setPos     ] = useState({ x: -999, y: -999 }); // offscreen until mounted
  const [tidioOpen, setTidioOpen] = useState(false);

  const posRef      = useRef({ x: 0, y: 0 });
  const isDragging  = useRef(false);
  const startTouch  = useRef({ x: 0, y: 0 });
  const movedTotal  = useRef(0);
  const dragOffset  = useRef({ x: 0, y: 0 });

  // ── Init position ──────────────────────────────────────────────────────────
  useEffect(() => {
    let initial: { x: number; y: number };
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      initial = saved ? JSON.parse(saved) : getDefaultPos();
    } catch {
      initial = getDefaultPos();
    }
    const clamped = clampPos(initial.x, initial.y);
    setPos(clamped);
    posRef.current = clamped;
  }, []);

  // ── Window resize → clamp into view ───────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const clamped = clampPos(posRef.current.x, posRef.current.y);
      posRef.current = clamped;
      setPos({ ...clamped });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Save position when done dragging ──────────────────────────────────────
  const savePos = useCallback((x: number, y: number) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y })); } catch {}
  }, []);

  // ── Global move + up/end handlers ────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const nx = e.clientX - dragOffset.current.x;
      const ny = e.clientY - dragOffset.current.y;
      movedTotal.current += Math.abs(nx - posRef.current.x) + Math.abs(ny - posRef.current.y);
      const clamped = clampPos(nx, ny);
      posRef.current = clamped;
      setPos({ ...clamped });
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const t = e.touches[0];
      const nx = t.clientX - dragOffset.current.x;
      const ny = t.clientY - dragOffset.current.y;
      movedTotal.current += Math.abs(nx - posRef.current.x) + Math.abs(ny - posRef.current.y);
      const clamped = clampPos(nx, ny);
      posRef.current = clamped;
      setPos({ ...clamped });
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      savePos(posRef.current.x, posRef.current.y);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      savePos(posRef.current.x, posRef.current.y);
      // Tap = little movement
      if (movedTotal.current < 8) {
        e.preventDefault();
        openTidio();
      }
      movedTotal.current = 0;
    };

    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseup",    onMouseUp);
    window.addEventListener("touchmove",  onTouchMove,  { passive: false });
    window.addEventListener("touchend",   onTouchEnd,   { passive: false });
    return () => {
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseup",    onMouseUp);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [savePos]);

  // ── Pointer down ──────────────────────────────────────────────────────────
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    isDragging.current = true;
    movedTotal.current = 0;
    dragOffset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
  }
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    isDragging.current = true;
    movedTotal.current = 0;
    dragOffset.current = { x: t.clientX - posRef.current.x, y: t.clientY - posRef.current.y };
    startTouch.current = { x: t.clientX, y: t.clientY };
  }

  // ── Mouse click (only if not dragged) ────────────────────────────────────
  function onMouseUp(e: React.MouseEvent) {
    if (movedTotal.current < 8) {
      e.stopPropagation();
      openTidio();
    }
    movedTotal.current = 0;
  }

  // ── Open Tidio ────────────────────────────────────────────────────────────
  function openTidio() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const api = (window as any).tidioChatApi;
    if (api) {
      // Make sure Tidio iframe is visible
      const el = document.getElementById("tidio-chat") ||
                 document.getElementById("tidio-chat-iframe");
      if (el) el.style.removeProperty("display");
      if (tidioOpen) {
        api.close?.();
        setTidioOpen(false);
      } else {
        api.open();
        setTidioOpen(true);
      }
    } else {
      // Tidio not loaded yet — wait for it
      document.addEventListener("tidioChat-ready", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).tidioChatApi?.open();
        setTidioOpen(true);
      }, { once: true });
    }
  }

  // Ball is offscreen until mounted
  const mounted = pos.x > -900;

  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      aria-label="Open chat"
      className={cn(
        "fixed z-[9990] select-none touch-none",
        "flex items-center justify-center",
        "transition-opacity duration-300",
        mounted ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      style={{
        left:   pos.x,
        top:    pos.y,
        width:  `${BALL_SIZE}px`,
        height: `${BALL_SIZE}px`,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
        border:     "2px solid rgba(220,38,38,0.45)",
        boxShadow:  "0 4px 20px rgba(153,21,21,0.55), 0 0 0 0 rgba(220,38,38,0.4)",
        cursor:     isDragging.current ? "grabbing" : "grab",
        animation:  tidioOpen ? "none" : "chatPulse 2.5s ease-in-out infinite",
      }}
    >
      {tidioOpen
        ? <X          size={20} className="text-white pointer-events-none" />
        : <MessageCircle size={20} className="text-white pointer-events-none" />
      }

      <style>{`
        @keyframes chatPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(153,21,21,0.55), 0 0 0 0 rgba(220,38,38,0.4); }
          50%       { box-shadow: 0 4px 20px rgba(153,21,21,0.55), 0 0 0 10px rgba(220,38,38,0); }
        }

        /* ── Hide Tidio's own launcher button ── */
        #tidio-chat-iframe { pointer-events: auto !important; }
        #tidio-chat > div[class*="chat-icon"],
        #tidio-chat > div[class*="launcher"],
        #tidio-chat > div[id*="launcher"],
        #tidio-chat > div:first-child:not([id*="chat-window"]) {
          display: none !important;
        }
      `}</style>
    </button>
  );
}
