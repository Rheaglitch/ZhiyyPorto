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

function getSettings(): ProtectionSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    masterEnabled: false,
    disableRightClick: false,
    blurOnLeave: false,
    disableSelection: false,
    blockDevTools: false,
  };
}

// Simpan semua cleanup handlers secara global supaya bisa di-reset
let activeCleanups: (() => void)[] = [];

function applyProtection(settings: ProtectionSettings) {
  // Bersihkan semua handler lama dulu
  activeCleanups.forEach((fn) => fn());
  activeCleanups = [];

  if (!settings.masterEnabled) return;

  // 1. Disable right click
  if (settings.disableRightClick) {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    document.addEventListener("contextmenu", handler, true);
    window.addEventListener("contextmenu", handler, true);
    activeCleanups.push(() => {
      document.removeEventListener("contextmenu", handler, true);
      window.removeEventListener("contextmenu", handler, true);
    });
  }

  // 2. Blur on cursor leave
  if (settings.blurOnLeave) {
    let overlay = document.getElementById("__zhiyy_blur__");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "__zhiyy_blur__";
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:99999;
        backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
        background:rgba(10,10,10,0.6);
        display:none;pointer-events:none;transition:opacity 0.2s;
      `;
      document.body.appendChild(overlay);
    }
    const el = overlay;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        el.style.display = "block";
      }
    };
    const onEnter = () => { el.style.display = "none"; };
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    activeCleanups.push(() => {
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      el.style.display = "none";
    });
  } else {
    const el = document.getElementById("__zhiyy_blur__");
    if (el) el.style.display = "none";
  }

  // 3. Disable text selection + copy/cut
  if (settings.disableSelection) {
    let styleEl = document.getElementById("__zhiyy_noselect__");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "__zhiyy_noselect__";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `*{user-select:none!important;-webkit-user-select:none!important;-moz-user-select:none!important;}`;

    const handler = (e: ClipboardEvent) => { e.preventDefault(); };
    document.addEventListener("copy", handler, true);
    document.addEventListener("cut", handler, true);
    activeCleanups.push(() => {
      const el = document.getElementById("__zhiyy_noselect__");
      if (el) el.textContent = "";
      document.removeEventListener("copy", handler, true);
      document.removeEventListener("cut", handler, true);
    });
  } else {
    const el = document.getElementById("__zhiyy_noselect__");
    if (el) el.textContent = "";
  }

  // 4. Block DevTools shortcuts
  if (settings.blockDevTools) {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const blocked =
        e.key === "F12" ||
        (ctrl && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) ||
        (ctrl && ["U", "S", "P", "u", "s", "p"].includes(e.key));
      if (blocked) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    };
    document.addEventListener("keydown", handler, true);
    window.addEventListener("keydown", handler, true);
    activeCleanups.push(() => {
      document.removeEventListener("keydown", handler, true);
      window.removeEventListener("keydown", handler, true);
    });
  }
}

export function useContentProtection() {
  useEffect(() => {
    // Apply saat pertama kali
    applyProtection(getSettings());

    // Re-apply setiap ada perubahan localStorage dari tab lain (dashboard)
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        applyProtection(getSettings());
      }
    };
    window.addEventListener("storage", onStorage);

    // Re-apply setiap tab jadi fokus (kembali dari tab dashboard)
    const onFocus = () => {
      applyProtection(getSettings());
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      activeCleanups.forEach((fn) => fn());
      activeCleanups = [];
    };
  }, []);
}
