import { Code2, Palette, Camera, Lightbulb } from "lucide-react";

const stats = [
  { label: "Projects",     value: "10+" },
  { label: "Technologies", value: "15+" },
  { label: "Design Tools", value: "5+"  },
  { label: "Years Active", value: "3+"  },
];

const traits = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Next.js, TypeScript, Supabase — bikin web yang cepat, clean, dan beneran jalan.",
  },
  {
    icon: Palette,
    title: "Design & Illustration",
    desc: "UI/UX dengan Figma, ilustrasi digital & tradisional, desain logo dan branding.",
  },
  {
    icon: Camera,
    title: "Visual Creative",
    desc: "Animasi 2D, motion graphics, fotografi — storytelling lewat visual.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solver",
    desc: "Senang ngulik masalah kompleks dan nyari solusi yang paling elegan.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 bg-dark-950">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-14">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — About Me —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Siapa <span className="text-gradient-blood">Aku</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Text — 2 cols */}
          <div className="lg:col-span-2 space-y-4 text-dark-400 leading-relaxed text-sm">
            <p>
              Halo! Aku{" "}
              <span className="text-blood-400 font-semibold">Reavlenia Arezha</span>
              , seorang creative multidisiplin yang bergerak di dunia digital.
            </p>
            <p>
              Bukan cuma ngoding — aku juga bikin{" "}
              <span className="text-dark-200">animasi 2D, desain logo, UI/UX</span>,
              fotografi, dan ilustrasi. Aku percaya karya terbaik lahir dari
              kombinasi logika dan estetika.
            </p>
            <p>
              Stack utamaku Next.js + TypeScript untuk dev, Figma + Adobe Suite
              untuk desain, dan After Effects untuk animasi.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {stats.map(({ label, value }) => (
                <div key={label} className="card-dark rounded-lg p-4 text-center">
                  <div className="text-2xl font-black text-gradient-blood">{value}</div>
                  <div className="text-xs text-dark-600 font-mono mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Traits — 3 cols */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {traits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card-dark rounded-xl p-5 hover:border-blood-900 transition-all duration-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center mb-3 group-hover:bg-blood-900/60 transition-colors">
                  <Icon size={16} className="text-blood-400" />
                </div>
                <h3 className="font-semibold text-dark-100 text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-dark-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
