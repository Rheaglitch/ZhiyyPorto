"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  text: string;
}

const BOT_REPLIES: Record<string, string> = {
  default:     "Halo! Ada yang bisa aku bantu? Kamu bisa tanya soal project, skill, atau cara kontak Reavlenia 😊",
  halo:        "Halo! Senang bisa ngobrol sama kamu 👋",
  hi:          "Hi! Ada yang mau ditanyakan? 😊",
  project:     "Reavlenia punya berbagai project — web development, animasi 2D, desain UI/UX, dan ilustrasi. Cek section Projects di atas!",
  skill:       "Skill Reavlenia meliputi Next.js, TypeScript, React, Figma, After Effects, Photoshop, dan banyak lagi. Cek section Skills!",
  kontak:      "Kamu bisa kontak Reavlenia via email ohmyliinnn@gmail.com atau scroll ke bawah ke section Contact 📬",
  hire:        "Tertarik hire Reavlenia? Scroll ke section Contact atau klik tombol Hire Me di navbar! 🎉",
  animasi:     "Reavlenia bisa bikin animasi 2D, motion graphics, dan character animation. Cek portfolio untuk contoh karyanya!",
  design:      "Reavlenia juga seorang designer — UI/UX dengan Figma, desain logo, dan branding. Lihat project untuk detailnya!",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return reply;
  }
  return BOT_REPLIES.default;
}

export function ChatBot() {
  const [pos,     setPos    ] = useState({ x: 0, y: 0 });
  const [open,    setOpen   ] = useState(false);
  const [msgs,    setMsgs   ] = useState<Message[]>([
    { role: "bot", text: BOT_REPLIES.default },
  ]);
  const [input,   setInput  ] = useState("");
  const [dragging,setDragging] = useState(false);

  const ballRef    = useRef<HTMLButtonElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Init position — bottom right
  useEffect(() => {
    setPos({ x: window.innerWidth - 64, y: window.innerHeight - 80 });
  }, []);

  // Drag logic
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      setPos({
        x: Math.max(24, Math.min(window.innerWidth  - 24, cx - dragOffset.current.x)),
        y: Math.max(24, Math.min(window.innerHeight - 24, cy - dragOffset.current.y)),
      });
    };
    const onUp = () => {
      isDragging.current = false;
      setDragging(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
  }, []);

  function startDrag(e: React.MouseEvent | React.TouchEvent) {
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: cx - pos.x, y: cy - pos.y };
    isDragging.current = true;
    setDragging(true);
  }

  function handleClick() {
    if (!dragging) setOpen(!open);
  }

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const botMsg:  Message = { role: "bot",  text: getBotReply(input) };
    setMsgs((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    setTimeout(() => {
      messagesRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
    }, 50);
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed z-[55] w-72 rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/50"
          style={{
            left:   Math.min(pos.x + 16, window.innerWidth  - 300),
            top:    Math.max(pos.y - 380, 16),
            background: "var(--bg-card)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blood-900/80 border-b border-blood-800/60">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-blood-300" />
              <span className="text-xs font-medium text-dark-200">Zhiyy Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-dark-500 hover:text-dark-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex flex-col gap-2 p-3 h-52 overflow-y-auto text-xs"
          >
            {msgs.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] px-3 py-2 rounded-xl leading-relaxed",
                  msg.role === "user"
                    ? "self-end bg-blood-800/80 text-white"
                    : "self-start bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-[var(--border)]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ketik pesan..."
              className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blood-700"
            />
            <button
              onClick={sendMessage}
              className="w-7 h-7 rounded-lg bg-blood-700 hover:bg-blood-600 flex items-center justify-center transition-colors"
            >
              <Send size={11} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Draggable ball */}
      <button
        ref={ballRef}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
        onClick={handleClick}
        className={cn(
          "fixed z-[56] w-12 h-12 rounded-full",
          "bg-gradient-to-br from-blood-700 to-blood-900",
          "border-2 border-blood-600/60",
          "flex items-center justify-center",
          "shadow-lg shadow-blood-900/60",
          "transition-shadow hover:shadow-xl hover:shadow-blood-800/70",
          dragging ? "cursor-grabbing scale-95" : "cursor-grab"
        )}
        style={{
          left:      pos.x - 24,
          top:       pos.y - 24,
          transition: dragging ? "none" : "box-shadow 0.2s, transform 0.1s",
        }}
        aria-label="Open chat assistant"
      >
        {open
          ? <X size={18} className="text-white" />
          : <MessageCircle size={18} className="text-white" />
        }
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full border border-blood-500/40 animate-ping" />
        )}
      </button>
    </>
  );
}
