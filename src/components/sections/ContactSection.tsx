"use client";

import { useState } from "react";
import { Mail, Github, Linkedin, Instagram, MapPin, Check, Loader2 } from "lucide-react";

interface ContactSectionProps {
  contactInfo?: Record<string, string>;
}

export function ContactSection({ contactInfo = {} }: ContactSectionProps) {
  const email     = contactInfo.email     || "ohmyliinnn@gmail.com";
  const github    = contactInfo.github    || "https://github.com/Rheaglitch";
  const instagram = contactInfo.instagram || "https://instagram.com/";
  const linkedin  = contactInfo.linkedin  || "https://linkedin.com/";
  const location  = contactInfo.location  || "Indonesia";

  const contacts = [
    { icon: Mail,      label: "Email",     value: email,                            href: `mailto:${email}`     },
    { icon: Github,    label: "GitHub",    value: github.replace("https://", ""),   href: github                },
    { icon: Linkedin,  label: "LinkedIn",  value: linkedin.replace("https://",""),  href: linkedin              },
    { icon: Instagram, label: "Instagram", value: instagram.replace("https://",""), href: instagram             },
  ];

  return (
    <section id="contact" className="py-20 px-6" style={{ background: "var(--section-alt)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Get In Touch —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            Let&apos;s <span className="text-gradient-blood">Connect</span>
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Ada project menarik, mau kolaborasi, atau sekadar ngobrol?
            Aku selalu terbuka — reach out kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact links */}
          <div className="space-y-3">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-dark-800/60 bg-dark-900/20 hover:border-blood-900/60 hover:bg-dark-900/50 group transition-all duration-200">
                <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center shrink-0 group-hover:bg-blood-900/60 transition-colors">
                  <Icon size={16} className="text-blood-400" />
                </div>
                <div>
                  <p className="text-[11px] text-dark-600 font-mono">{label}</p>
                  <p className="text-sm text-dark-300 group-hover:text-blood-400 transition-colors">{value}</p>
                </div>
              </a>
            ))}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-dark-800/60 bg-dark-900/20">
              <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-blood-400" />
              </div>
              <div>
                <p className="text-[11px] text-dark-600 font-mono">Location</p>
                <p className="text-sm text-dark-300">{location} 🇮🇩</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Nama wajib diisi.";
    if (!form.email.trim())   e.email   = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = "Format email tidak valid.";
    if (!form.message.trim()) e.message = "Pesan wajib diisi.";
    else if (form.message.trim().length < 10)
                              e.message = "Pesan minimal 10 karakter.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    setErrMsg("");
    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setErrMsg(json.error ?? "Terjadi kesalahan.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setErrMsg("Gagal mengirim pesan. Coba lagi.");
      setStatus("error");
    }
  }

  const inputCls = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors resize-none ${
      errors[field]
        ? "border-2 border-blood-700 bg-dark-900/60 text-dark-200 placeholder-dark-700"
        : "border border-dark-800 bg-dark-900/60 text-dark-200 placeholder-dark-600 focus:border-blood-800"
    }`;

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-blood-950 border border-blood-900 flex items-center justify-center">
          <Check size={24} className="text-blood-400" />
        </div>
        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          Pesan Terkirim!
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Terima kasih telah menghubungi. Aku akan segera membalas.
        </p>
        <button onClick={() => setStatus("idle")}
          className="mt-2 px-5 py-2 rounded-full border border-dark-700 hover:border-blood-700 text-dark-400 hover:text-blood-400 text-xs font-mono transition-colors">
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono text-dark-600 mb-1.5">
            Nama <span className="text-blood-500">*</span>
          </label>
          <input type="text" value={form.name}
            onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
            placeholder="Your name" className={inputCls("name")} />
          {errors.name && <p className="text-[10px] text-blood-400 mt-1 font-mono">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-mono text-dark-600 mb-1.5">
            Email <span className="text-blood-500">*</span>
          </label>
          <input type="email" value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: "" })); }}
            placeholder="your@email.com" className={inputCls("email")} />
          {errors.email && <p className="text-[10px] text-blood-400 mt-1 font-mono">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono text-dark-600 mb-1.5">
          Pesan <span className="text-blood-500">*</span>
        </label>
        <textarea rows={6} value={form.message}
          onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: "" })); }}
          placeholder="Hei, aku mau ngobrol soal..."
          className={inputCls("message")} />
        {errors.message && <p className="text-[10px] text-blood-400 mt-1 font-mono">{errors.message}</p>}
      </div>

      {errMsg && (
        <p className="text-xs text-blood-400 font-mono bg-blood-950/30 border border-blood-900 rounded-lg px-3 py-2">
          {errMsg}
        </p>
      )}

      <button type="submit" disabled={status === "sending"}
        className="w-full py-3 rounded-lg bg-blood-700 hover:bg-blood-600 disabled:opacity-60 text-white font-medium text-sm transition-all flex items-center justify-center gap-2">
        {status === "sending" ? (
          <><Loader2 size={14} className="animate-spin" /> Mengirim...</>
        ) : "Kirim Pesan"}
      </button>

      <p className="text-[10px] text-dark-700 font-mono text-center">
        <span className="text-blood-800">*</span> Semua field wajib diisi
      </p>
    </form>
  );
}
