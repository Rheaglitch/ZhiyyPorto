"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "bot";
  text: string;
}

const BOT_REPLIES: Record<string, string> = {
  default:      "Halo! Aku asisten Zhiyy. Tanya apa saja soal portfolio ini — project, skill, kontak, atau cara hire Reavlenia 😊",
  halo:         "Halo! Senang bisa ngobrol sama kamu 👋 Ada yang bisa aku bantu?",
  hi:           "Hi! Ada yang mau ditanyakan? 😊",
  hello:        "Hello! Aku di sini untuk membantu kamu mengenal Reavlenia lebih jauh!",
  project:      "Reavlenia punya berbagai project — web development, animasi 2D, desain UI/UX, dan ilustrasi. Scroll ke section Projects atau klik 'All Work' di navbar!",
  skill:        "Reavlenia menguasai Next.js, TypeScript, React, Figma, After Effects, Photoshop, Illustrator, dan banyak lagi. Cek section Skills untuk detail!",
  kontak:       "Kamu bisa kontak Reavlenia via email ohmyliinnn@gmail.com atau scroll ke section Contact di bawah halaman ini 📬",
  contact:      "Untuk kontak, scroll ke bawah ke section Let's Connect atau email ke ohmyliinnn@gmail.com 📬",
  hire:         "Tertarik hire Reavlenia? Klik tombol 'Hire Me' di navbar atau scroll ke Contact section! 🎉",
  price:        "Untuk informasi harga/rate, langsung hubungi Reavlenia via email ohmyliinnn@gmail.com atau DM Instagram.",
  harga:        "Untuk informasi harga, hubungi langsung via email atau Instagram ya!",
  animasi:      "Reavlenia bisa bikin animasi 2D, motion graphics, dan character animation. Cek portfolio di section Projects!",
  animation:    "Reavlenia handles 2D animation, motion graphics, and character animation. Check the Projects section!",
  design:       "Reavlenia juga seorang designer — UI/UX dengan Figma, desain logo, branding, dan ilustrasi digital.",
  logo:         "Ya, Reavlenia juga bikin desain logo dan branding! Hubungi langsung untuk request.",
  web:          "Reavlenia membangun web dengan Next.js, TypeScript, Tailwind CSS, dan Supabase sebagai backend.",
  website:      "Web development menggunakan Next.js 15, TypeScript, Tailwind CSS, dan Supabase. Cek Projects untuk contoh!",
  portfolio:    "Ini adalah portfolio Reavlenia Arezha — seorang multidisciplinary creative dari Indonesia 🇮🇩",
  reavlenia:    "Reavlenia Arezha adalah seorang creative multidisciplinary — web developer, animator, illustrator, dan UI/UX designer dari Indonesia.",
  indonesia:    "Reavlenia berbasis di Indonesia 🇮🇩 dan terbuka untuk project remote dari mana saja!",
  remote:       "Reavlenia terbuka untuk kerja remote! Hubungi untuk diskusi lebih lanjut.",
  available:    "Reavlenia currently available for work! Klik Hire Me di navbar atau scroll ke Contact 🟢",
  instagram:    "Instagram Reavlenia bisa ditemukan di footer atau Contact section halaman ini.",
  github:       "GitHub Reavlenia: github.com/Rheaglitch — bisa cek repo public di sana!",
  figma:        "Reavlenia menggunakan Figma untuk semua pekerjaan UI/UX design. Mau lihat hasil desainnya? Cek Projects!",
  photoshop:    "Ya, Reavlenia menggunakan Adobe Photoshop dan Illustrator untuk ilustrasi dan editing foto.",
  terima:       "Terima kasih sudah mengunjungi portfolio ini! 🙏",
  makasih:      "Sama-sama! Ada lagi yang mau ditanyakan? 😊",
  thanks:       "You're welcome! Feel free to ask anything else 😊",
  bagus:        "Terima kasih! Reavlenia selalu berusaha memberikan yang terbaik 💪",
};

function getBotReply(input: string): string {
  const lower = input.toLowerCase().trim();
  // Check exact keyword matches first
  for (const [key, reply] of Object.entries(BOT_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return reply;
  }
  // Partial match fallback
  if (lower.includes("buat") || lower.includes("bikin") || lower.includes("minta")) {
    return "Untuk request project atau karya, hubungi Reavlenia langsung via email ohmyliinnn@gmail.com atau scroll ke Contact section! 📩";
  }
  if (lower.includes("berapa") || lower.includes("cost") || lower.includes("budget")) {
    return "Untuk informasi biaya/rate, langsung hubungi Reavlenia via email atau DM Instagram ya! 💬";
  }
  if (lower.includes("lama") || lower.includes("waktu") || lower.includes("deadline")) {
    return "Durasi project tergantung scope-nya. Diskusikan langsung dengan Reavlenia untuk estimasi waktu yang akurat!";
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

  // Init position — bottom right, above mobile nav
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const bottomOffset = isMobile ? 80 : 64; // above mobile bottom nav (64px) + gap
    setPos({
      x: window.innerWidth  - 64,
      y: window.innerHeight - bottomOffset,
    });
  }, []);

  // Drag logic
  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      setPos({
        x: Math.max(24, Math.min(window.innerWidth  - 24, cx - dragOffset.current.x)),
        y: Math.max(24, Math.min(window.innerHeight - (window.innerWidth < 768 ? 80 : 32), cy - dragOffset.current.y)),
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
          className="fixed z-[55] rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/50"
          style={{
            width:  "min(288px, calc(100vw - 32px))",
            left:   Math.min(Math.max(pos.x - 144, 16), window.innerWidth - Math.min(288, window.innerWidth - 32) - 16),
            top:    Math.max(pos.y - 400, 60),
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

          {/* Quick replies */}
          <div className="flex flex-wrap gap-1.5 px-3 pt-1 pb-2 border-t border-[var(--border)]">
            {["Project", "Hire Me", "Skill", "Kontak"].map(q => (
              <button key={q} onClick={() => {
                const msg: Message = { role: "user", text: q };
                const bot: Message = { role: "bot",  text: getBotReply(q) };
                setMsgs(prev => [...prev, msg, bot]);
                setTimeout(() => messagesRef.current?.scrollTo({ top: 999999, behavior: "smooth" }), 50);
              }}
                className="px-2.5 py-1 rounded-full text-[10px] font-mono border border-[var(--border)] bg-[var(--bg-secondary)] text-dark-400 hover:border-blood-700 hover:text-blood-400 transition-colors">
                {q}
              </button>
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
