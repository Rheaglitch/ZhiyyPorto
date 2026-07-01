"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  RotateCcw, RotateCw, Crop, Sparkles,
  Check, X, Loader2, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  file: File;
  onDone: (result: File) => void;
  onCancel: () => void;
  /** Optional: existing URL to edit (for already-uploaded images) */
  existingUrl?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function urlToFile(url: string, name = "image.png"): Promise<File> {
  // For data URLs (base64), convert directly
  if (url.startsWith("data:")) {
    const res  = await fetch(url);
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type || "image/png" });
  }
  // For blob URLs, convert directly
  if (url.startsWith("blob:")) {
    const res  = await fetch(url);
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type || "image/png" });
  }
  // For external URLs (Supabase Storage), use canvas to avoid CORS
  return new Promise((resolve, reject) => {
    const img    = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
        resolve(new File([blob], name, { type: "image/png" }));
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src     = url;
  });
}

async function applyCrop(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob> {
  // Load image — handle both blob URLs and external URLs
  const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img   = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = imageSrc;
  });

  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const bW  = imgEl.naturalWidth * cos + imgEl.naturalHeight * sin;
  const bH  = imgEl.naturalWidth * sin + imgEl.naturalHeight * cos;

  const canvas = document.createElement("canvas");
  canvas.width  = bW;
  canvas.height = bH;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(bW / 2, bH / 2);
  ctx.rotate(rad);
  ctx.drawImage(imgEl, -imgEl.naturalWidth / 2, -imgEl.naturalHeight / 2);

  const out    = document.createElement("canvas");
  out.width    = pixelCrop.width;
  out.height   = pixelCrop.height;
  out.getContext("2d")!.drawImage(canvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

  return new Promise(resolve => out.toBlob(b => resolve(b!), "image/png", 0.95));
}

async function applyRotate(imageSrc: string, degrees: number): Promise<string> {
  const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img   = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = imageSrc;
  });

  const rad    = (degrees * Math.PI) / 180;
  const sin    = Math.abs(Math.sin(rad));
  const cos    = Math.abs(Math.cos(rad));
  const canvas = document.createElement("canvas");
  canvas.width  = imgEl.naturalHeight * sin + imgEl.naturalWidth * cos;
  canvas.height = imgEl.naturalHeight * cos + imgEl.naturalWidth * sin;
  const ctx    = canvas.getContext("2d")!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(imgEl, -imgEl.naturalWidth / 2, -imgEl.naturalHeight / 2);
  return canvas.toDataURL("image/png");
}

async function removeBgApi(srcUrl: string): Promise<string> {
  // Convert to blob first (handles CORS for external URLs via canvas)
  let blob: Blob;
  if (srcUrl.startsWith("data:") || srcUrl.startsWith("blob:")) {
    blob = await fetch(srcUrl).then(r => r.blob());
  } else {
    // External URL — draw via canvas
    const file = await urlToFile(srcUrl, "image.png");
    blob = file;
  }
  const fd = new FormData();
  fd.append("image", blob, "image.png");
  const res  = await fetch("/api/remove-bg", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error ?? "Gagal menghapus background");
  return json.result;
}

// ── Main component ────────────────────────────────────────────────────────────

export function ImageEditor({ file, onDone, onCancel, existingUrl }: ImageEditorProps) {
  // Working image — starts as existingUrl or file's object URL
  const [workingUrl, setWorkingUrl] = useState<string>(() => {
    // If existingUrl provided, use it directly (avoids CORS fetch issue)
    if (existingUrl) return existingUrl;
    // Only create object URL if file has content
    if (file.size > 0) return URL.createObjectURL(file);
    return existingUrl ?? "";
  });
  const originalUrl = useRef(workingUrl);

  useEffect(() => {
    return () => {
      // Cleanup blob URLs on unmount (but not the original existingUrl)
      if (!existingUrl && originalUrl.current.startsWith("blob:")) {
        URL.revokeObjectURL(originalUrl.current);
      }
    };
  }, [existingUrl]);

  const [activeTab, setActiveTab] = useState<"crop" | "rotate" | "removebg">("crop");

  // Crop state
  const [crop,             setCrop            ] = useState<Point>({ x: 0, y: 0 });
  const [zoom,             setZoom            ] = useState(1);
  const [rotation,         setRotation        ] = useState(0);
  const [croppedAreaPixels,setCroppedAreaPixels] = useState<Area | null>(null);
  const [applyingCrop,     setApplyingCrop    ] = useState(false);

  // Remove BG state
  const [removedBgUrl, setRemovedBgUrl] = useState<string | null>(null);
  const [removingBg,   setRemovingBg  ] = useState(false);
  const [bgError,      setBgError     ] = useState<string | null>(null);
  const [bgApplied,    setBgApplied   ] = useState(false);

  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // ── Save crop → update workingUrl ──
  async function handleSaveCrop() {
    if (!croppedAreaPixels) return;
    setApplyingCrop(true);
    try {
      const blob    = await applyCrop(workingUrl, croppedAreaPixels, rotation);
      const newUrl  = URL.createObjectURL(blob);
      setWorkingUrl(newUrl);
      setRemovedBgUrl(null);  // reset bg after crop
      setBgApplied(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    } catch (e) {
      console.error(e);
    }
    setApplyingCrop(false);
  }

  // ── Save rotate → update workingUrl ──
  async function handleSaveRotate(deg: number) {
    const newDataUrl = await applyRotate(workingUrl, deg);
    setWorkingUrl(newDataUrl);
    setRemovedBgUrl(null);
    setBgApplied(false);
  }

  // ── Remove BG ──
  async function handleRemoveBg() {
    setRemovingBg(true);
    setBgError(null);
    try {
      const result = await removeBgApi(workingUrl);
      setRemovedBgUrl(result);
      setBgApplied(false);
    } catch (e) {
      setBgError(e instanceof Error ? e.message : "Error");
    }
    setRemovingBg(false);
  }

  // ── Apply BG removal → update workingUrl ──
  function handleApplyBg() {
    if (!removedBgUrl) return;
    setWorkingUrl(removedBgUrl);
    setBgApplied(true);
    setRemovedBgUrl(null);
  }

  // ── Final: convert workingUrl → File and call onDone ──
  async function handleDone() {
    setApplying(true);
    try {
      const finalFile = await urlToFile(workingUrl, `edited-${file.name}`);
      onDone(finalFile);
    } catch (e) {
      console.error(e);
    }
    setApplying(false);
  }

  // Display image for crop tab uses workingUrl; for rotate/bg shows workingUrl
  const previewUrl = (activeTab === "removebg" && removedBgUrl) ? removedBgUrl : workingUrl;

  const tabs = [
    { id: "crop",     label: "Crop",       icon: Crop     },
    { id: "rotate",   label: "Rotate",     icon: RotateCw },
    { id: "removebg", label: "Hapus BG",   icon: Sparkles },
  ] as const;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-2xl bg-dark-950 border border-dark-800 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-800 shrink-0">
          <h3 className="font-semibold text-dark-100 text-sm">Edit Foto</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-dark-600 font-mono">
              Setiap perubahan langsung diterapkan ke gambar
            </span>
            <button onClick={onCancel} className="text-dark-600 hover:text-dark-300 transition-colors ml-2" aria-label="Tutup">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-800 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn("flex items-center gap-2 px-5 py-3 text-xs font-mono transition-colors border-b-2 -mb-px",
                activeTab === id ? "border-blood-600 text-blood-400" : "border-transparent text-dark-500 hover:text-dark-300")}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>

        {/* Preview area */}
        <div className="relative bg-[#0a0a0a] overflow-hidden shrink-0" style={{ height: 320 }}>
          {activeTab === "crop" ? (
            <Cropper
              image={workingUrl}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{ containerStyle: { background: "#0a0a0a" } }}
            />
          ) : (
            <img
              src={previewUrl}
              alt="preview"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                background: activeTab === "removebg"
                  ? "repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%) 0 0 / 16px 16px"
                  : undefined
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="px-5 py-4 border-t border-dark-800 shrink-0">

          {/* ── CROP ── */}
          {activeTab === "crop" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono text-dark-500 w-12 shrink-0">Zoom</label>
                <input type="range" min={1} max={3} step={0.05} value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="flex-1 accent-blood-600" />
                <span className="text-xs font-mono text-dark-600 w-10 text-right">{zoom.toFixed(1)}×</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono text-dark-500 w-12 shrink-0">Rotate</label>
                <input type="range" min={-180} max={180} step={1} value={rotation}
                  onChange={e => setRotation(Number(e.target.value))}
                  className="flex-1 accent-blood-600" />
                <span className="text-xs font-mono text-dark-600 w-10 text-right">{rotation}°</span>
              </div>
              <button onClick={handleSaveCrop} disabled={applyingCrop}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white text-xs font-medium transition-colors">
                {applyingCrop ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                {applyingCrop ? "Menerapkan..." : "Simpan Crop"}
              </button>
            </div>
          )}

          {/* ── ROTATE ── */}
          {activeTab === "rotate" && (
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: "90° kiri",  icon: RotateCcw, deg: -90 },
                { label: "90° kanan", icon: RotateCw,  deg:  90 },
                { label: "180°",      icon: RefreshCw, deg: 180 },
              ].map(({ label, icon: Icon, deg }) => (
                <button key={label} onClick={() => handleSaveRotate(deg)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-300 text-xs font-mono transition-colors">
                  <Icon size={13} /> {label} <span className="text-dark-600 ml-1 text-[10px]">(langsung simpan)</span>
                </button>
              ))}
            </div>
          )}

          {/* ── REMOVE BG ── */}
          {activeTab === "removebg" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={handleRemoveBg} disabled={removingBg}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white text-xs font-medium transition-colors">
                  {removingBg ? <><Loader2 size={12} className="animate-spin" /> Memproses...</> : <><Sparkles size={12} /> Hapus Background</>}
                </button>
                {removedBgUrl && !bgApplied && (
                  <button onClick={handleApplyBg}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-blood-700 text-dark-200 hover:text-blood-400 text-xs font-mono transition-colors">
                    <Check size={12} /> Terapkan ke Gambar
                  </button>
                )}
                {bgApplied && (
                  <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                    <Check size={11} /> Background dihapus
                  </span>
                )}
              </div>
              {bgError && <p className="text-xs text-blood-400 font-mono">{bgError}</p>}
              {removedBgUrl && !bgApplied && (
                <p className="text-[10px] text-dark-600 font-mono">
                  {`// Preview di atas. Klik "Terapkan ke Gambar" untuk simpan.`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-dark-800 bg-dark-900/30 shrink-0">
          <p className="text-[10px] text-dark-600 font-mono">
            {`// Selesai edit semua tab, klik "Gunakan Foto"`}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onCancel}
              className="px-5 py-2 rounded-lg border border-dark-700 hover:border-dark-600 text-dark-400 hover:text-dark-200 text-sm font-medium transition-colors">
              Batal
            </button>
            <button onClick={handleDone} disabled={applying}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {applying ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Gunakan Foto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
