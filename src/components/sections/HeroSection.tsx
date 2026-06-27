import Link from "next/link";
import { ArrowDown, Download } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(155,21,21,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,21,21,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Red glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blood-900/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blood-900 bg-blood-950/50 text-blood-400 text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse-slow" />
          Available for work
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          <span className="block text-dark-100">Hi, I&apos;m</span>
          <span className="block text-gradient-blood mt-2">Reavlenia</span>
          <span className="block text-dark-300 text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            Arezha
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-dark-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Full-stack developer yang suka bikin{" "}
          <span className="text-blood-400">web yang beneran kerja</span> —
          cepat, bersih, dan enak dilihat.
        </p>

        {/* Tech tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Next.js", "TypeScript", "React", "Supabase", "Tailwind"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono rounded border border-dark-800 text-dark-500 bg-dark-900/50"
              >
                {tech}
              </span>
            )
          )}
        </div>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-md bg-blood-700 hover:bg-blood-600 text-white font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blood-900/50"
          >
            Lihat Project
            <ArrowDown
              size={16}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          </Link>
          <a
            href="/cv.pdf"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md border border-dark-700 hover:border-blood-700 text-dark-300 hover:text-blood-400 font-medium transition-all duration-200"
          >
            <Download size={16} />
            Download CV
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-600">
        <span className="text-xs font-mono tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-dark-600 to-transparent" />
      </div>
    </section>
  );
}
