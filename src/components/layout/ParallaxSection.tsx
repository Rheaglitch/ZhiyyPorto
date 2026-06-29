"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  intensity?: number; // 0-1, default 0.15
  delay?: number;     // ms delay for stagger
}

export function ParallaxSection({
  children,
  className,
  direction = "up",
  intensity = 0.15,
  delay = 0,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Intersection observer for reveal animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);

    // Scroll parallax
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // -1 (above) to 1 (below) relative to viewport center
      const progress = (viewH / 2 - (rect.top + rect.height / 2)) / viewH;
      setOffset(progress * intensity * 80);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [intensity, delay]);

  const getTransform = () => {
    if (!visible) {
      // Initial hidden state — slide from direction
      switch (direction) {
        case "up":    return "translateY(40px)";
        case "down":  return "translateY(-40px)";
        case "left":  return "translateX(40px)";
        case "right": return "translateX(-40px)";
      }
    }
    // Visible + parallax offset
    switch (direction) {
      case "up":
      case "down":  return `translateY(${-offset}px)`;
      case "left":
      case "right": return `translateX(${-offset * 0.5}px) translateY(${-offset * 0.5}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={cn("will-change-transform", className)}
      style={{
        transform: getTransform(),
        opacity: visible ? 1 : 0,
        transition: visible
          ? `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease`
          : "none",
        isolation: "isolate",
        position: "relative",
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}
