"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  RotateCcw,
  RotateCw,
  Crop,
  Sparkles,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  file: File;
  onDone: (result: File) => void;
  onCancel: () => void;
}

// Helper: crop canvas dari image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> {
  const image = await createImageBitmap(
    await fetch(imageSrc).then((r) => r.blob())
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bBoxW = image.width * cos + image.height * sin;
  const bBoxH = image.width * sin + image.height * cos;

  canvas.width = bBoxW;
  canvas.height = bBoxH;

  ctx.translate(bBoxW / 2, bBoxH / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d")!;
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => resolve(blob!), "image/png", 0.95);
  });
}

// Helper: rotate image 90 derajat
async function rotateImage(
  imageSrc: string,
  degrees: number
): Promise<string> {
  const image = await createImageBitmap(
    await fetch(imageSrc).then((r) => r.blob())
  );
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  canvas.width = image.height * sin + image.width * cos;
  canvas.height = image.height * cos + image.width * sin;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  return canvas.toDataURL("image/png");
}

export function ImageEditor({ file, onDone, onCancel }: ImageEditorProps) {
  const [imageSrc, setImageSrc] = useState<string>(() =>
    URL.createObjectURL(file)
  );
  const [activeTab, setActiveTab] = useState<"crop" | "rotate" | "removebg">(
    "crop"
  );

  // Crop state
  const [crop, setCrop]       = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom]       = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Remove BG state
  const [removedBgSrc, setRemovedBgSrc] = useState<string | null>(null);
  const [removingBg, setRemovingBg]     = useState(false);
  const [bgError, setBgError]           = useState<string | null>(null);
  const [useBgRemoved, setUseBgRemoved] = useState(false);

  const [applying, setApplying] = useState(false);
  const objectUrlRef = useRef<string>(imageSrc);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function handleRotate(deg: number) {
    const rotated = await rotateImage(imageSrc, deg);
    // revoke old if object URL
    if (imageSrc.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
    setImageSrc(rotated);
    setRemovedBgSrc(null); // reset bg removal after rotate
    setUseBgRemoved(false);
  }

  async function handleRemoveBg() {
    setRemovingBg(true);
    setBgError(null);
    try {
      // Gunakan imageSrc saat ini (sudah kena crop/rotate jika ada)
      const sourceUrl = useBgRemoved && removedBgSrc ? removedBgSrc : imageSrc;
      const blob = await fetch(sourceUrl).then((r) => r.blob());
      const fd = new FormData();
      fd.append("image", blob, "image.png");

      const res = await fetch("/api/remove-bg", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || json.error) {
        setBgError(json.error ?? "Gagal menghapus background");
        return;
      }

      setRemovedBgSrc(json.result);
      setUseBgRemoved(true);
    } catch {
      setBgError("Terjadi kesalahan saat menghubungi API");
    } finally {
      setRemovingBg(false);
    }
  }

  async function handleApply() {
    setApplying(true);
    try {
      let finalSrc = useBgRemoved && removedBgSrc ? removedBgSrc : imageSrc;

      // Apply crop jika ada
      if (croppedAreaPixels && activeTab === "crop") {
        const blob = await getCroppedImg(finalSrc, croppedAreaPixels, 0);
        finalSrc = URL.createObjectURL(blob);
      }

      // Convert ke File
      const blob = await fetch(finalSrc).then((r) => r.blob());
      const ext = useBgRemoved ? "png" : file.name.split(".").pop() ?? "jpg";
      const name = file.name.replace(/\.[^.]+$/, "") + "_edited." + ext;
      const resultFile = new File([blob], name, { type: blob.type });

      // Cleanup URLs
      if (objectUrlRef.current.startsWith("blob:"))
        URL.revokeObjectURL(objectUrlRef.current);

      onDone(resultFile);
    } finally {
      setApplying(false);
    }
  }

  const displaySrc =
    activeTab === "removebg" && useBgRemoved && removedBgSrc
      ? removedBgSrc
      : imageSrc;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-2xl bg-dark-950 border border-dark-800 rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-800">
          <h3 className="font-semibold text-dark-100 text-sm">Edit Foto</h3>
          <button
            onClick={onCancel}
            className="text-dark-600 hover:text-dark-300 transition-colors"
            aria-label="Tutup editor"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-dark-800">
          {[
            { id: "crop",     label: "Crop",          icon: Crop      },
            { id: "rotate",   label: "Rotate",         icon: RotateCw  },
            { id: "removebg", label: "Hapus BG",       icon: Sparkles  },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-xs font-mono transition-colors border-b-2 -mb-px",
                activeTab === id
                  ? "border-blood-600 text-blood-400"
                  : "border-transparent text-dark-500 hover:text-dark-300"
              )}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Preview area */}
        <div className="relative bg-[#0a0a0a] flex items-center justify-center"
             style={{ height: 340 }}>

          {activeTab === "crop" ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: "#0a0a0a" },
              }}
            />
          ) : (
            <img
              src={displaySrc}
              alt="preview"
              className="max-h-full max-w-full object-contain"
              style={{ background: activeTab === "removebg" ? "repeating-conic-gradient(#1a1a1a 0% 25%, #111 0% 50%) 0 0 / 16px 16px" : undefined }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="px-5 py-4 border-t border-dark-800 min-h-[80px]">
          {activeTab === "crop" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono text-dark-500 w-12 shrink-0">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-blood-600"
                />
                <span className="text-xs font-mono text-dark-600 w-10 text-right">
                  {zoom.toFixed(1)}×
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono text-dark-500 w-12 shrink-0">Rotate</label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 accent-blood-600"
                />
                <span className="text-xs font-mono text-dark-600 w-10 text-right">
                  {rotation}°
                </span>
              </div>
            </div>
          )}

          {activeTab === "rotate" && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRotate(-90)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-300 text-xs font-mono transition-colors"
              >
                <RotateCcw size={14} /> 90° kiri
              </button>
              <button
                onClick={() => handleRotate(90)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-300 text-xs font-mono transition-colors"
              >
                <RotateCw size={14} /> 90° kanan
              </button>
              <button
                onClick={() => handleRotate(180)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-300 text-xs font-mono transition-colors"
              >
                180° balik
              </button>
            </div>
          )}

          {activeTab === "removebg" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRemoveBg}
                  disabled={removingBg}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white text-xs font-medium transition-colors"
                >
                  {removingBg ? (
                    <><Loader2 size={13} className="animate-spin" /> Memproses...</>
                  ) : (
                    <><Sparkles size={13} /> Hapus Background</>
                  )}
                </button>
                {removedBgSrc && (
                  <button
                    onClick={() => { setUseBgRemoved(!useBgRemoved); }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-mono transition-colors",
                      useBgRemoved
                        ? "border-blood-700 bg-blood-950 text-blood-400"
                        : "border-dark-700 text-dark-400 hover:border-dark-600"
                    )}
                  >
                    {useBgRemoved ? "✓ BG dihapus" : "Lihat original"}
                  </button>
                )}
              </div>
              {bgError && (
                <p className="text-xs text-blood-400 font-mono">{bgError}</p>
              )}
              {removedBgSrc && !bgError && (
                <p className="text-xs text-dark-600 font-mono">
                  {`// Background berhasil dihapus — toggle tombol di atas untuk perbandingan`}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-dark-800">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-dark-700 hover:border-dark-600 text-dark-400 hover:text-dark-200 text-sm font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            disabled={applying}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {applying ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Gunakan Foto
          </button>
        </div>
      </div>
    </div>
  );
}
