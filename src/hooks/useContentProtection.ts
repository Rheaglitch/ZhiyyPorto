"use client";

import { useEffect } from "react";

const STORAGE_KEY = "zhiyy_content_protection";

interface ProtectionSettings {
  masterEnabled: boolean;
  disableRightClick: boolean;
  blurOnLeave: boolean;
  disableSelection: boolean;
  blockDevTools: boolean;
}

export function useContentProtection() {
  useEffect(() => {
    let settings: ProtectionSettings = {
      masterEnabled: false,
      disableRightClick: false,
      blurOnLeave: false,
      disableSelection: false,
      blockDevTools: false,
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) settings = JSON.parse(saved);
    } catch {}

    if (!settings.masterEnabled) return;

    const cleanups: (() => void)[] = [];

    // 1. Disable right click
    if (settings.disableRightClick) {
      const handler = (e: MouseEvent) => e.preventDefault();
      document.addEventListener("contextmenu", handler);
      cleanups.push(() => document.removeEventListener("contextmenu", handler));
    }

    // 2. Blur on cursor leave
    if (settings.blurOnLeave) {
      const overlay = document.createElement("div");
      overlay.id = "__zhiyy_blur_overlay__";
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        background: rgba(10,10,10,0.5);
        display: none; pointer-events: none;
      `;
      document.body.appendChild(overlay);

      const onLeave = () => { overlay.style.display = "block"; };
      const onEnter = () => { overlay.style.display = "none"; };
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("mouseenter", onEnter);

      cleanups.push(() => {
        document.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("mouseenter", onEnter);
        overlay.remove();
      });
    }

    // 3. Disable text selection
    if (settings.disableSelection) {
      const style = document.createElement("style");
      style.id = "__zhiyy_no_select__";
      style.textContent = `* { user-select: none !important; -webkit-user-select: none !important; }`;
      document.head.appendChild(style);

      const handler = (e: ClipboardEvent) => e.preventDefault();
      document.addEventListener("copy", handler);
      document.addEventListener("cut", handler);
      cleanups.push(() => {
        style.remove();
        document.removeEventListener("copy", handler);
        document.removeEventListener("cut", handler);
      });
    }

    // 4. Block DevTools shortcuts
    if (settings.blockDevTools) {
      const handler = (e: KeyboardEvent) => {
        const blocked =
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
          (e.ctrlKey && ["U", "S", "P"].includes(e.key)) ||
          (e.ctrlKey && e.key === "u");
        if (blocked) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener("keydown", handler, true);
      cleanups.push(() => document.removeEventListener("keydown", handler, true));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
