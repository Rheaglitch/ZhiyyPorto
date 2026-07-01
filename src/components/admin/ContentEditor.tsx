"use client";

import { useState, useRef } from "react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { Plus, X, Upload, Loader2, Check } from "lucide-react";
import Image from "next/image";
import { ImageEditor } from "@/components/admin/ImageEditor";

interface ContentEditorProps {
  initialSettings: Record<string, Record<string, unknown>>;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// ─── Reusable field components ────────────────────────────────────────────────
const inputCls = "w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-700 transition-colors";
const labelCls = "block text-xs font-mono text-dark-500 mb-1.5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-dark rounded-xl border border-dark-800 overflow-hidden mb-6">
      <div className="px-5 py-3 border-b border-dark-800 bg-dark-900/40">
        <h2 className="text-xs font-mono text-blood-600 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ContentEditor({ initialSettings }: ContentEditorProps) {
  const s = initialSettings;

  // ── Hero name ──
  const [heroFirst, setHeroFirst] = useState<string>((s.hero_name?.first as string) ?? "REAVLENIA");
  const [heroLast,  setHeroLast ] = useState<string>((s.hero_name?.last  as string) ?? "AREZHA");

  // ── Hero roles ──
  const [roles, setRoles] = useState<string[]>(
    (s.hero_roles?.roles as string[]) ?? ["Web Developer","Animator","UI/UX Designer","Illustrator"]
  );

  // ── Hero bio ──
  const [heroBio, setHeroBio] = useState<string>((s.hero_bio?.text as string) ?? "");

  // ── Hero stats ──
  const [stats, setStats] = useState<{ value: string; label: string }[]>(
    (s.hero_stats?.items as { value: string; label: string }[]) ??
    [{ value: "10+", label: "Projects" }, { value: "3+", label: "Years" }, { value: "5+", label: "Disciplines" }]
  );

  // ── Hero image ──
  const [heroImgUrl,    setHeroImgUrl  ] = useState<string>((s.hero_image?.url as string) ?? "");
  const [uploadingImg,  setUploadingImg] = useState(false);
  const [editingHero,   setEditingHero ] = useState<File | null>(null);
  const [editingHeroUrl,setEditingHeroUrl] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Site logo ──
  const [logoUrl,       setLogoUrl     ] = useState<string>((s.site_logo?.url as string) ?? "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [editingLogo,   setEditingLogo ] = useState<File | null>(null);
  const [editingLogoUrl,setEditingLogoUrl] = useState<string | undefined>(undefined);
  const logoRef = useRef<HTMLInputElement>(null);

  // ── About stats ──
  const [aboutStats, setAboutStats] = useState<{ value: string; label: string }[]>(
    (s.about_stats?.items as { value: string; label: string }[]) ??
    [{ value: "10+", label: "Projects" }, { value: "15+", label: "Technologies" },
     { value: "5+",  label: "Design Tools" }, { value: "3+", label: "Years Active" }]
  );

  // ── About traits ──
  const [aboutTraits, setAboutTraits] = useState<{ icon: string; title: string; desc: string }[]>(
    (s.about_traits?.items as { icon: string; title: string; desc: string }[]) ??
    [
      { icon: "Code2",     title: "Web Development",      desc: "Next.js, TypeScript, Supabase — bikin web yang cepat, clean, dan beneran jalan." },
      { icon: "Palette",   title: "Design & Illustration", desc: "UI/UX dengan Figma, ilustrasi digital & tradisional, desain logo dan branding."  },
      { icon: "Camera",    title: "Visual Creative",       desc: "Animasi 2D, motion graphics, fotografi — storytelling lewat visual."             },
      { icon: "Lightbulb", title: "Problem Solver",        desc: "Senang ngulik masalah kompleks dan nyari solusi yang paling elegan."             },
    ]
  );
  const [aboutParas, setAboutParas] = useState<string[]>(
    (s.about_bio?.paragraphs as string[]) ??
    ["Halo! Aku Reavlenia Arezha, seorang creative multidisiplin yang bergerak di dunia digital."]
  );

  // ── Contact ──
  const ci = s.contact_info as Record<string, string> ?? {};
  const [email,     setEmail    ] = useState(ci.email     ?? "");
  const [github,    setGithub   ] = useState(ci.github    ?? "");
  const [instagram, setInstagram] = useState(ci.instagram ?? "");
  const [linkedin,  setLinkedin ] = useState(ci.linkedin  ?? "");
  const [location,  setLocation ] = useState(ci.location  ?? "Indonesia");

  const [status, setStatus] = useState<SaveStatus>("idle");

  // ── Upload helper via server API ──
  async function uploadViaServer(file: File, bucket: string, oldUrl?: string): Promise<string> {
    const oldPath = oldUrl ? oldUrl.split(`/${bucket}/`)[1] : undefined;
    const fd = new FormData();
    fd.append("file",   file);
    fd.append("bucket", bucket);
    if (oldPath) fd.append("oldPath", oldPath);

    const res  = await fetch("/api/upload-asset", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error ?? "Upload gagal");
    return json.url as string;
  }

  // ── Upload hero image ──
  function handleHeroFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert("Maks 10MB"); return; }
    setEditingHero(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleHeroEditorDone(editedFile: File) {
    setEditingHero(null);
    setUploadingImg(true);
    try {
      const url = await uploadViaServer(editedFile, "hero", heroImgUrl || undefined);
      setHeroImgUrl(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload gagal");
    }
    setUploadingImg(false);
  }

  // ── Upload site logo ──
  function handleLogoFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Maks 5MB"); return; }
    setEditingLogo(file);
    if (logoRef.current) logoRef.current.value = "";
  }

  async function handleLogoEditorDone(editedFile: File) {
    setEditingLogo(null);
    setUploadingLogo(true);
    try {
      const url = await uploadViaServer(editedFile, "logos", logoUrl || undefined);
      setLogoUrl(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload logo gagal");
    }
    setUploadingLogo(false);
  }

  // ── Save all ──
  async function handleSave() {
    setStatus("saving");
    const supabase = createAdminClient();

    const updates = [
      { key: "hero_name",   value: { first: heroFirst, last: heroLast } },
      { key: "hero_roles",  value: { roles } },
      { key: "hero_bio",    value: { text: heroBio } },
      { key: "hero_stats",  value: { items: stats } },
      { key: "hero_image",    value: { url: heroImgUrl } },
      { key: "site_logo",     value: { url: logoUrl } },
      { key: "about_bio",     value: { paragraphs: aboutParas } },
      { key: "about_stats",   value: { items: aboutStats } },
      { key: "about_traits",  value: { items: aboutTraits } },
      { key: "contact_info",  value: { email, github, instagram, linkedin, location } },
    ];

    for (const u of updates) {
      await supabase.from("site_settings").upsert({ key: u.key, value: u.value }, { onConflict: "key" });
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div className="max-w-2xl space-y-0">
      {/* ── Image Editor Modals ── */}
      {editingHero && (
        <ImageEditor
          file={editingHero}
          existingUrl={editingHeroUrl}
          onDone={(f) => { setEditingHero(null); setEditingHeroUrl(undefined); handleHeroEditorDone(f); }}
          onCancel={() => { setEditingHero(null); setEditingHeroUrl(undefined); }}
        />
      )}
      {editingLogo && (
        <ImageEditor
          file={editingLogo}
          existingUrl={editingLogoUrl}
          onDone={(f) => { setEditingLogo(null); setEditingLogoUrl(undefined); handleLogoEditorDone(f); }}
          onCancel={() => { setEditingLogo(null); setEditingLogoUrl(undefined); }}
        />
      )}

      {/* ── Site Logo ── */}
      <Section title="Site Logo (Navbar & Footer)">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-dark-900 border border-dark-800 shrink-0 flex items-center justify-center">
              <Image src={logoUrl} alt="Logo" width={48} height={48} className="w-12 h-12 object-contain" unoptimized />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-dark-900 border border-dashed border-dark-700 flex items-center justify-center shrink-0">
              <span className="text-dark-700 font-mono text-xs text-center">no logo</span>
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className={labelCls}>Upload logo (PNG/SVG, maks 2MB)</label>
            <p className="text-[10px] text-dark-600 font-mono">
              Logo ini akan tampil di navbar dan footer. Gunakan format PNG transparan atau SVG.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 w-fit px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-400 text-xs font-mono cursor-pointer transition-colors">
                {uploadingLogo ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploadingLogo ? "Uploading..." : "Pilih logo"}
                <input ref={logoRef} type="file" accept="image/png,image/svg+xml,image/webp"
                  onChange={handleLogoFileSelect} className="hidden" />
              </label>
              {logoUrl && (
                <button type="button"
                  onClick={() => {
                    setEditingLogo(new File([], "logo-edit.png", { type: "image/png" }));
                    setEditingLogoUrl(logoUrl);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-blood-900/60 hover:border-blood-700 text-blood-500 hover:text-blood-400 text-xs font-mono transition-colors">
                  ✏️ Edit logo
                </button>
              )}
            </div>
            {logoUrl && (
              <button onClick={() => setLogoUrl("")}
                className="text-[10px] text-dark-600 hover:text-blood-400 font-mono transition-colors">
                Hapus logo (kembali ke teks)
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* ── Hero Section ── */}
      <Section title="Hero — Nama">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nama Depan</label>
            <input value={heroFirst} onChange={e => setHeroFirst(e.target.value)} className={inputCls} placeholder="REAVLENIA" />
          </div>
          <div>
            <label className={labelCls}>Nama Belakang</label>
            <input value={heroLast} onChange={e => setHeroLast(e.target.value)} className={inputCls} placeholder="AREZHA" />
          </div>
        </div>
      </Section>

      <Section title="Hero — Role Ticker">
        <div className="space-y-2">
          {roles.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={r}
                onChange={e => setRoles(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                className={`${inputCls} flex-1`}
                placeholder={`Role ${i + 1}`}
              />
              <button type="button"
                onClick={() => setRoles(prev => prev.filter((_, idx) => idx !== i))}
                className="text-dark-600 hover:text-blood-400 p-1.5 rounded hover:bg-blood-950/50 transition-colors">
                <X size={13} />
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => setRoles(prev => [...prev, ""])}
            className="flex items-center gap-2 text-xs text-dark-500 hover:text-blood-400 font-mono transition-colors">
            <Plus size={12} /> Tambah role
          </button>
        </div>
      </Section>

      <Section title="Hero — Bio">
        <div>
          <label className={labelCls}>Teks bio singkat</label>
          <textarea value={heroBio} onChange={e => setHeroBio(e.target.value)} rows={2}
            className={`${inputCls} resize-none`} placeholder="Menciptakan karya yang fungsional sekaligus indah..." />
        </div>
      </Section>

      <Section title="Hero — Stats (Angka di hero section)">
        <p className="text-[10px] text-dark-600 font-mono mb-3">
          {`// Contoh: Value = "10+" | Label = "Projects" → tampil sebagai "10+ / PROJECTS" di hero`}
        </p>
        <div className="space-y-3">
          {stats.map((st, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-none w-28">
                {i === 0 && <label className={labelCls}>Angka / Value</label>}
                <input value={st.value}
                  onChange={e => setStats(prev => prev.map((v, idx) => idx === i ? { ...v, value: e.target.value } : v))}
                  className={inputCls} placeholder='mis: "10+" atau "3 Tahun"' />
              </div>
              <div className="flex-1">
                {i === 0 && <label className={labelCls}>Label / Keterangan</label>}
                <input value={st.label}
                  onChange={e => setStats(prev => prev.map((v, idx) => idx === i ? { ...v, label: e.target.value } : v))}
                  className={inputCls} placeholder='mis: "Projects", "Years", "Skills"' />
              </div>
              <button type="button" onClick={() => setStats(prev => prev.filter((_, idx) => idx !== i))}
                className="text-dark-600 hover:text-blood-400 p-2 rounded hover:bg-blood-950/50 transition-colors mb-0.5">
                <X size={13} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setStats(prev => [...prev, { value: "", label: "" }])}
            className="flex items-center gap-2 text-xs text-dark-500 hover:text-blood-400 font-mono transition-colors">
            <Plus size={12} /> Tambah stat baru
          </button>
        </div>
      </Section>

      <Section title="Hero — Foto">
        <div className="flex items-center gap-4">
          {heroImgUrl ? (
            <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-dark-900 shrink-0">
              <Image src={heroImgUrl} alt="Hero" fill className="object-cover object-top" unoptimized />
            </div>
          ) : (
            <div className="w-20 h-24 rounded-lg bg-dark-900 border border-dashed border-dark-700 flex items-center justify-center shrink-0">
              <span className="text-dark-700 text-xs font-mono">no img</span>
            </div>
          )}
          <div className="flex-1 space-y-2">
            <label className={labelCls}>Upload foto baru (PNG tanpa bg, maks 10MB)</label>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-2 w-fit px-4 py-2 rounded-lg bg-dark-900 border border-dark-800 hover:border-dark-700 text-dark-400 text-xs font-mono cursor-pointer transition-colors">
                {uploadingImg ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploadingImg ? "Uploading..." : "Pilih foto"}
                <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg"
                  onChange={handleHeroFileSelect} className="hidden" />
              </label>
              {heroImgUrl && (
                <button type="button"
                  onClick={() => {
                    // Pass URL directly — ImageEditor will use it as workingUrl
                    setEditingHero(new File([], "hero-edit.png", { type: "image/png" }));
                    setEditingHeroUrl(heroImgUrl);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-900 border border-blood-900/60 hover:border-blood-700 text-blood-500 hover:text-blood-400 text-xs font-mono transition-colors">
                  ✏️ Edit foto
                </button>
              )}
            </div>
            {heroImgUrl && (
              <p className="text-[10px] text-dark-700 font-mono break-all">{heroImgUrl.split("/").pop()}</p>
            )}
          </div>
        </div>
      </Section>

      <Section title="About — Stats (Angka di section Siapa Aku)">
        <p className="text-[10px] text-dark-600 font-mono mb-3">
          {`// Contoh: Value = "15+" | Label = "Technologies" → tampil sebagai kotak stat di About section`}
        </p>
        <div className="space-y-3">
          {aboutStats.map((st, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-none w-28">
                {i === 0 && <label className={labelCls}>Angka / Value</label>}
                <input value={st.value}
                  onChange={e => setAboutStats(prev => prev.map((v, idx) => idx === i ? { ...v, value: e.target.value } : v))}
                  className={inputCls} placeholder='mis: "15+" atau "5 Tools"' />
              </div>
              <div className="flex-1">
                {i === 0 && <label className={labelCls}>Label / Keterangan</label>}
                <input value={st.label}
                  onChange={e => setAboutStats(prev => prev.map((v, idx) => idx === i ? { ...v, label: e.target.value } : v))}
                  className={inputCls} placeholder='mis: "Technologies", "Design Tools"' />
              </div>
              <button type="button" onClick={() => setAboutStats(prev => prev.filter((_, idx) => idx !== i))}
                className="text-dark-600 hover:text-blood-400 p-2 rounded hover:bg-blood-950/50 transition-colors mb-0.5">
                <X size={13} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setAboutStats(prev => [...prev, { value: "", label: "" }])}
            className="flex items-center gap-2 text-xs text-dark-500 hover:text-blood-400 font-mono transition-colors">
            <Plus size={12} /> Tambah stat baru
          </button>
        </div>
      </Section>

      <Section title="About — Keahlian (Trait Cards)">
        <p className="text-[10px] text-dark-600 font-mono mb-2">
          {`// Card keahlian yang tampil di section "Siapa Aku?" — icon, judul, deskripsi`}
        </p>
        <p className="text-[10px] text-dark-600 font-mono mb-3">
          {`// Icon tersedia: Code2, Palette, Camera, Lightbulb, Brush, Music, Film, Globe, Cpu, Star, Heart, Zap, BookOpen, Layers, Monitor, Smartphone, Package, Pen`}
        </p>
        <div className="space-y-4">
          {aboutTraits.map((tr, i) => (
            <div key={i} className="card-dark rounded-xl p-4 border border-dark-800 space-y-2">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[10px] font-mono text-dark-600">Trait #{i + 1}</span>
                <button type="button" onClick={() => setAboutTraits(prev => prev.filter((_, idx) => idx !== i))}
                  className="text-dark-600 hover:text-blood-400 p-1 rounded transition-colors">
                  <X size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls}>Icon Name</label>
                  <input value={tr.icon}
                    onChange={e => setAboutTraits(prev => prev.map((v, idx) => idx === i ? { ...v, icon: e.target.value } : v))}
                    className={inputCls} placeholder="Code2" />
                </div>
                <div>
                  <label className={labelCls}>Judul</label>
                  <input value={tr.title}
                    onChange={e => setAboutTraits(prev => prev.map((v, idx) => idx === i ? { ...v, title: e.target.value } : v))}
                    className={inputCls} placeholder="Web Development" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Deskripsi</label>
                <textarea value={tr.desc} rows={2}
                  onChange={e => setAboutTraits(prev => prev.map((v, idx) => idx === i ? { ...v, desc: e.target.value } : v))}
                  className={`${inputCls} resize-none`} placeholder="Deskripsi singkat keahlian..." />
              </div>
            </div>
          ))}
          <button type="button"
            onClick={() => setAboutTraits(prev => [...prev, { icon: "Star", title: "", desc: "" }])}
            className="flex items-center gap-2 text-xs text-dark-500 hover:text-blood-400 font-mono transition-colors">
            <Plus size={12} /> Tambah trait
          </button>
        </div>
      </Section>

      <Section title="About — Bio">
        <div className="space-y-2">
          {aboutParas.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea value={p} onChange={e => setAboutParas(prev => prev.map((v, idx) => idx === i ? e.target.value : v))}
                rows={2} className={`${inputCls} flex-1 resize-none`} placeholder={`Paragraf ${i + 1}`} />
              <button type="button" onClick={() => setAboutParas(prev => prev.filter((_, idx) => idx !== i))}
                className="text-dark-600 hover:text-blood-400 p-1.5 mt-1 rounded hover:bg-blood-950/50 transition-colors">
                <X size={13} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setAboutParas(prev => [...prev, ""])}
            className="flex items-center gap-2 text-xs text-dark-500 hover:text-blood-400 font-mono transition-colors">
            <Plus size={12} /> Tambah paragraf
          </button>
        </div>
      </Section>

      <Section title="Contact — Info">
        {[
          { label: "Email",     value: email,     set: setEmail,     placeholder: "email@example.com"          },
          { label: "GitHub",    value: github,    set: setGithub,    placeholder: "https://github.com/..."     },
          { label: "Instagram", value: instagram, set: setInstagram, placeholder: "https://instagram.com/..." },
          { label: "LinkedIn",  value: linkedin,  set: setLinkedin,  placeholder: "https://linkedin.com/..."  },
          { label: "Location",  value: location,  set: setLocation,  placeholder: "Indonesia"                  },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className={labelCls}>{label}</label>
            <input value={value} onChange={e => set(e.target.value)} className={inputCls} placeholder={placeholder} />
          </div>
        ))}
      </Section>

      {/* Save button */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-50 text-white font-medium text-sm transition-colors"
        >
          {status === "saving" && <Loader2 size={14} className="animate-spin" />}
          {status === "saved"  && <Check size={14} />}
          {status === "saving" ? "Menyimpan..." : status === "saved" ? "Tersimpan!" : "Simpan Semua"}
        </button>
        {status === "error" && (
          <p className="text-xs text-blood-400 font-mono">Gagal menyimpan, coba lagi.</p>
        )}
      </div>
    </div>
  );
}
