"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={cn(
        "fixed z-[45] w-10 h-10 rounded-full",
        "bg-blood-700 hover:bg-blood-600 text-white",
        "flex items-center justify-center",
        "shadow-lg shadow-blood-900/40",
        "transition-all duration-300",
        // Mobile (<768): above bottom nav 64px + gap → bottom-20 (80px), left side to avoid Tidio (right)
        // Tablet (768-1024): Tidio is bottom-right, put scroll-to-top on left
        // Desktop (>1024): right side is fine, Tidio doesn't overlap much
        "bottom-[88px] right-16 md:bottom-24 md:right-4",
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp size={16} />
    </button>
  );
}
