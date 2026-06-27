"use client";

import { useEffect, useRef } from "react";

interface ProtectionSettings {
  masterEnabled: boolean;
  disableRightClick: boolean;
  blurOnLeave: boolean;
  disableSelection: boolean;
  blockDevTools: boolean;
}

// Active cleanup functions — global so applyProtection can reset them
let activeCleanups: (() => void)[] = [];

function applyProtection(settings: ProtectionSettings) {
  // Clear all existing handlers
  activeCleanups.forEach((fn) => fn());
  activeCleanups = [];

  if (!settings.masterEnabled) return;

  // 1. Disable right click
  if (settings.disableRightClick) {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    };
    document.addEventListener("contextmenu", handler, true);
    activeCleanups.push(() =>
      document.removeEventListener("contextmenu", handler, true)
    );
  }

  // 2. Blur overlay when cursor leaves window
  if (settings.blurOnLeave) {
    let overlay = document.getElementById("__zhiyy_blur__") as HTMLDivElement | null;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "__zhiyy_blur__";
      Object.assign(overlay.style, {
        position: "fixed",
        inset: "0",
        zIndex: "999999",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(10,10,10,0.55)",
        display: "none",
        pointerEvents: "none",
      });
      document.body.appendChild(overlay);
    }
    const el = overlay;

    const onLeave = () => { el.style.display = "block"; };
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

  // 3. Disable text selection & copy/cut
  if (settings.disableSelection) {
    let style = document.getElementById("__zhiyy_nosel__") as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = "__zhiyy_nosel__";
      document.head.appendChild(style);
    }
    style.textContent =
      "* { user-select: none !important; -webkit-user-select: none !important; }";

    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    const onCut = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCut, true);

    activeCleanups.push(() => {
      const s = document.getElementById("__zhiyy_nosel__");
      if (s) s.textContent = "";
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCut, true);
    });
  } else {
    const s = document.getElementById("__zhiyy_nosel__");
    if (s) s.textContent = "";
  }

  // 4. Block DevTools shortcuts
  if (settings.blockDevTools) {
    const onKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key.toUpperCase();
      const blocked =
        e.key === "F12" ||
        (ctrl && e.shiftKey && ["I", "J", "C"].includes(key)) ||
        (ctrl && !e.shiftKey && ["U", "S", "P"].includes(key));
      if (blocked) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    document.addEventListener("keydown", onKey, true);
    activeCleanups.push(() =>
      document.removeEventListener("keydown", onKey, true)
    );
  }
}

async function fetchAndApply() {
  try {
    const res = await fetch("/api/protection-settings", { cache: "no-store" });
    const settings: ProtectionSettings = await res.json();
    applyProtection(settings);
  } catch {
    // silently fail — don't break the page
  }
}

export function useContentProtection() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Apply immediately on mount
    fetchAndApply();

    // Poll every 5 seconds to pick up changes made from dashboard
    intervalRef.current = setInterval(fetchAndApply, 5000);

    // Also re-apply when tab regains focus
    const onFocus = () => fetchAndApply();
    window.addEventListener("focus", onFocus);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("focus", onFocus);
      activeCleanups.forEach((fn) => fn());
      activeCleanups = [];
    };
  }, []);
}
