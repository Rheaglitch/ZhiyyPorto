"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  text: string;
}

const BOT_REPLIES: Record<string, string> = {
  default:   "Halo! Aku asisten Zhiyy. Tanya soal project, skill, atau cara kontak Reavlenia 😊",
  halo:      "Halo! Senang bisa ngobrol sama kamu 👋 Ada yang bisa aku bantu?",
  hi:        "Hi! Ada yang mau ditanyakan? 😊",
  hello:     "Hello! Aku di sini untuk membantu kamu mengenal Reavlenia!",
  project:   "Reavlenia punya project web, animasi 2D, desain UI/UX, dan ilustrasi. Cek section Projects!",
  skill:     "Skill: Next.js, TypeScript, React, Figma, After Effects, Photoshop, Illustrator, dll. Cek Skills section!",
  kontak:    "Kontak via email ohmyliinnn@gmail.com atau scroll ke section Contact 📬",
  contact:   "Scroll ke bawah ke section Let's Connect atau email ohmyliinnn@gmail.com 📬",
  hire:      "Scroll ke Contact section atau klik Hire Me! 🎉",
  price:     "Untuk info harga, hubungi via email ohmyliinnn@gmail.com atau DM Instagram.",
  harga:     "Untuk info harga, hubungi langsung via email atau Instagram ya!",
  animasi:   "Reavlenia bisa animasi 2D, motion graphics, dan character animation. Cek Projects!",
  design:    "UI/UX dengan Figma, desain logo, branding, dan ilustrasi digital.",
  web:       "Web dengan Next.js, TypeScript, Tailwind CSS, dan Supabase.",
  portfolio: "Portfolio Reavlenia Arezha — multidisciplinary creative dari Indonesia 🇮🇩",
  reavlenia: "Reavlenia Arezha: web developer, animator, illustrator, UI/UX designer dari Indonesia.",
  remote:    "Terbuka untuk kerja remote! Hubungi untuk diskusi.",
  instagram: "Instagram bisa ditemukan di footer atau Contact section.",
  github:    "GitHub: github.com/Rheaglitch",
  terima:    "Terima kasih sudah mengunjungi! 🙏",
  makasih:   "Sama-sama! Ada lagi? 😊",
  thanks:    "You're welcome! 😊",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return reply;
  }
  if (lower.includes("buat") || lower.includes("bikin")) return "Untuk request, hubungi via email ohmyliinnn@gmail.com 📩";
  if (lower.includes("berapa") || lower.includes("harga") || lower.includes("budget")) return "Untuk info harga, hubungi via email atau DM Instagram 💬";
  return BOT_REPLIES.default;
}

export function ChatBot() {
  const [pos,  setPos ] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([{ role: "bot", text: BOT_REPLIES.default }]);
  const [input, setInput] = useState("");

  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const movedDist  = useRef(0);
  const posRef     = useRef({ x: 0, y: 0 });
  const messagesRef = useRef<HTMLDivElement>(null);

  // Set initial position
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const x = window.innerWidth  - (isMobile ? 36 : 44);
    const y = window.innerHeight - (isMobile ? 150 : 136);
    setPos({ x, y });
    posRef.current = { x, y };
  }, []);

  // Drag handlers
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = Math.max(24, Math.min(window.innerWidth  - 24, cx - dragOffset.current.x));
      const y = Math.max(24, Math.min(window.innerHeight - 24, cy - dragOffset.current.y));
      movedDist.current += Math.abs(x - posRef.current.x) + Math.abs(y - posRef.current.y);
      posRef.current = { x, y };
      setPos({ x, y });
    };
    const onUp = () => { isDragging.current = false; };

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

  function onPointerDown(e: React.MouseEvent | React.TouchEvent) {
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragOffset.current = { x: cx - posRef.current.x, y: cy - posRef.current.y };
    isDragging.current = true;
    movedDist.current  = 0;
  }

  function onPointerUp() {
    isDragging.current = false;
    // Only treat as click if barely moved (< 8px total)
    if (movedDist.current < 8) {
      // Try Tidio first
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tidio = (window as any).tidioChatApi;
      if (tidio) {
        try { tidio.open(); } catch { setOpen(o => !o); }
        return;
      }
      // Fallback: local chatbot
      setOpen(o => !o);
    }
    movedDist.current = 0;
  }

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const botMsg:  Message = { role: "bot",  text: getBotReply(input) };
    setMsgs(prev => [...prev, userMsg, botMsg]);
    setInput("");
    setTimeout(() => messagesRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 50);
  }

  return (
    <>
      {/* Local chat window (fallback when Tidio not available) */}
      {open && (
        <div
          className="fixed z-[55] rounded-2xl border overflow-hidden shadow-2xl"
          style={{
            width:      "min(288px, calc(100vw - 32px))",
            left:       Math.min(Math.max(pos.x - 144, 16), window.innerWidth - Math.min(288, window.innerWidth - 32) - 16),
            top:        Math.max(pos.y - 400, 60),
            background: "var(--bg-card)",
            borderColor:"var(--border)",
            boxShadow:  "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-blood-900/80 border-b border-blood-800/60">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-blood-300" />
              <span className="text-xs font-medium text-white">Zhiyy Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div ref={messagesRef} className="flex flex-col gap-2 p-3 h-52 overflow-y-auto text-xs">
            {msgs.map((msg, i) => (
              <div key={i} className={cn(
                "max-w-[85%] px-3 py-2 rounded-xl leading-relaxed",
                msg.role === "user"
                  ? "self-end bg-blood-700 text-white"
                  : "self-start border text-xs"
              )}
              style={msg.role === "bot" ? {
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              } : {}}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 px-3 pb-2 pt-1 border-t" style={{ borderColor: "var(--border)" }}>
            {["Project", "Skill", "Kontak", "Hire"].map(q => (
              <button key={q} onClick={() => {
                const u: Message = { role: "user", text: q };
                const b: Message = { role: "bot",  text: getBotReply(q) };
                setMsgs(p => [...p, u, b]);
                setTimeout(() => messagesRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 50);
              }}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono border transition-colors hover:border-blood-600 hover:text-blood-400"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-secondary)" }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t" style={{ borderColor: "var(--border)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ketik pesan..."
              className="flex-1 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blood-700 border transition-colors"
              style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
            <button onClick={sendMessage}
              className="w-7 h-7 rounded-lg bg-blood-700 hover:bg-blood-600 flex items-center justify-center transition-colors">
              <Send size={11} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Draggable ball */}
      <button
        onMouseDown={onPointerDown}
        onTouchStart={onPointerDown}
        onMouseUp={onPointerUp}
        onTouchEnd={onPointerUp}
        className="fixed z-[56] w-12 h-12 rounded-full flex items-center justify-center select-none touch-none"
        style={{
          left:       pos.x - 24,
          top:        pos.y - 24,
          background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
          border:     "2px solid rgba(220,38,38,0.5)",
          boxShadow:  "0 4px 20px rgba(153,21,21,0.6)",
          cursor:     "grab",
        }}
        aria-label="Chat"
      >
        {open ? <X size={18} className="text-white pointer-events-none" /> : <MessageCircle size={18} className="text-white pointer-events-none" />}
        {!open && <span className="absolute inset-0 rounded-full border border-blood-400/30 animate-ping pointer-events-none" />}
      </button>
    </>
  );
}
