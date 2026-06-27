import { Code2, Coffee, Lightbulb, Rocket } from "lucide-react";

const stats = [
  { label: "Projects Built", value: "10+" },
  { label: "Technologies", value: "15+" },
  { label: "Cups of Coffee", value: "∞" },
  { label: "Lines of Code", value: "50k+" },
];

const traits = [
  {
    icon: Code2,
    title: "Clean Code",
    desc: "Nulis kode yang readable dan maintainable, bukan kode yang cuma jalan doang.",
  },
  {
    icon: Rocket,
    title: "Performance First",
    desc: "Setiap millisecond itu penting. Optimasi bukan afterthought, tapi habit.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solver",
    desc: "Senang ngulik masalah kompleks dan nyari solusi yang paling elegan.",
  },
  {
    icon: Coffee,
    title: "Always Learning",
    desc: "Tech landscape berubah cepat. Aku suka ngikutin dan eksplorasi yang baru.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 bg-dark-950">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-16">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — About Me —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Siapa <span className="text-gradient-blood">Aku</span>?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-5 text-dark-400 leading-relaxed">
            <p>
              Hai! Aku{" "}
              <span className="text-blood-400 font-medium">Reavlenia Arezha</span>,
              seorang full-stack developer yang passionate bikin web modern dan
              performa tinggi.
            </p>
            <p>
              Aku mulai coding dari rasa penasaran, dan sekarang udah jadi hobi
              sekaligus kerjaan. Stack utamaku seputar{" "}
              <span className="text-dark-200">Next.js, TypeScript, dan Supabase</span>{" "}
              — tapi aku selalu open buat eksplorasi teknologi baru.
            </p>
            <p>
              Selain ngejar deadline, aku juga suka contribute ke open source,
              belajar hal-hal random di internet, dan sesekali nulis tentang
              pengalaman coding.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="card-dark rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-black text-gradient-blood">
                    {value}
                  </div>
                  <div className="text-xs text-dark-500 font-mono mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {traits.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="card-dark rounded-xl p-5 hover:border-blood-900 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-blood-950 border border-blood-900 flex items-center justify-center mb-4 group-hover:bg-blood-900 transition-colors">
                  <Icon size={18} className="text-blood-400" />
                </div>
                <h3 className="font-semibold text-dark-100 mb-1">{title}</h3>
                <p className="text-xs text-dark-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
