import { GlitchReveal } from "@/components/ui/GlitchReveal";

// ── Icon mapping untuk traits (searchable) ──────────────────────────────────
import {
  Code2, Palette, Camera, Lightbulb, Brush, Music,
  Film, Globe, Cpu, Star, Heart, Zap, BookOpen,
  Layers, Monitor, Smartphone, Package, Pen
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Code2, Palette, Camera, Lightbulb, Brush, Music,
  Film, Globe, Cpu, Star, Heart, Zap, BookOpen,
  Layers, Monitor, Smartphone, Package, Pen,
};

// ── Defaults ────────────────────────────────────────────────────────────────
const DEFAULT_ABOUT_STATS = [
  { value: "10+", label: "Projects"    },
  { value: "15+", label: "Technologies"},
  { value: "5+",  label: "Design Tools"},
  { value: "3+",  label: "Years Active"},
];

const DEFAULT_TRAITS = [
  { icon: "Code2",     title: "Web Development",      desc: "Next.js, TypeScript, Supabase — bikin web yang cepat, clean, dan beneran jalan."   },
  { icon: "Palette",   title: "Design & Illustration", desc: "UI/UX dengan Figma, ilustrasi digital & tradisional, desain logo dan branding."    },
  { icon: "Camera",    title: "Visual Creative",       desc: "Animasi 2D, motion graphics, fotografi — storytelling lewat visual."               },
  { icon: "Lightbulb", title: "Problem Solver",        desc: "Senang ngulik masalah kompleks dan nyari solusi yang paling elegan."               },
];

const DEFAULT_PARAS = [
  "Halo! Aku Reavlenia Arezha, seorang creative multidisiplin yang bergerak di dunia digital.",
  "Bukan cuma ngoding — aku juga bikin animasi 2D, desain logo, UI/UX, fotografi, dan ilustrasi.",
  "Stack utamaku Next.js + TypeScript untuk dev, Figma + Adobe Suite untuk desain, dan After Effects untuk animasi.",
];

interface AboutSectionProps {
  paragraphs?: string[];
  aboutStats?:  { value: string; label: string }[];
  traits?:      { icon: string; title: string; desc: string }[];
}

export function AboutSection({ paragraphs, aboutStats, traits }: AboutSectionProps) {
  const displayParas  = paragraphs  && paragraphs.length  > 0 ? paragraphs  : DEFAULT_PARAS;
  const displayStats  = aboutStats  && aboutStats.length  > 0 ? aboutStats  : DEFAULT_ABOUT_STATS;
  const displayTraits = traits      && traits.length       > 0 ? traits      : DEFAULT_TRAITS;
  return (
    <section id="about" className="py-20 px-6" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <GlitchReveal className="text-center mb-14">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — About Me —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
            Siapa <span className="text-gradient-blood">Aku</span>?
          </h2>
        </GlitchReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Text */}
          <GlitchReveal className="lg:col-span-2 space-y-4 leading-relaxed text-sm" delay={100}>
            <p style={{ color: "var(--text-secondary)" }}>
              {displayParas[0]?.includes("Reavlenia") ? (
                <>Halo! Aku{" "}<span className="text-blood-400 font-semibold">Reavlenia Arezha</span>{", "}{displayParas[0].split("Reavlenia Arezha")[1] ?? ""}</>
              ) : displayParas[0]}
            </p>
            {displayParas.slice(1).map((p, i) => (
              <p key={i} style={{ color: "var(--text-secondary)" }}>{p}</p>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {displayStats.map(({ label, value }, i) => (
                <GlitchReveal key={label} delay={150 + i * 60}>
                  <div className="card-dark rounded-lg p-4 text-center">
                    <div className="text-2xl font-black text-gradient-blood">{value}</div>
                    <div className="text-xs font-mono mt-1" style={{ color: "var(--text-muted)" }}>{label}</div>
                  </div>
                </GlitchReveal>
              ))}
            </div>
          </GlitchReveal>

          {/* Traits */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayTraits.map(({ icon: iconName, title, desc }, i) => {
              const Icon = ICON_MAP[iconName] ?? Lightbulb;
              return (
                <GlitchReveal key={title} delay={200 + i * 80}>
                  <div className="card-dark rounded-xl p-5 hover:border-blood-900 transition-all duration-200 group h-full">
                    <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center mb-3 group-hover:bg-blood-900/60 transition-colors">
                      <Icon size={16} className="text-blood-400" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5" style={{ color: "var(--text-primary)" }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
                  </div>
                </GlitchReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
