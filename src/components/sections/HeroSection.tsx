import Link from "next/link";
import { ArrowDown, Download } from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pb-20"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(155,21,21,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155,21,21,0.6) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Red glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blood-900/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blood-900/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blood-900/60 bg-blood-950/40 text-blood-400 text-xs font-mono mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-blood-500 animate-pulse" />
          Available for work
        </div>

        {/* Heading */}
        <h1 className="font-black tracking-tight leading-[0.95]">
          <span className="block text-dark-300 text-2xl md:text-3xl font-semibold tracking-widest uppercase mb-3">
            Hi, I&apos;m
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl text-gradient-blood">
            Reavlenia
          </span>
          <span className="block text-4xl md:text-5xl lg:text-6xl text-dark-400 font-bold mt-2">
            Arezha
          </span>
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blood-900/60" />
          <span className="text-blood-800 text-xs font-mono">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blood-900/60" />
        </div>

        {/* Subtitle */}
        <p className="text-dark-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Full-stack developer · Animator · Designer
          <br />
          <span className="text-dark-500 text-sm">
            Bikin hal yang{" "}
            <span className="text-blood-400">fungsional sekaligus indah</span>.
          </span>
        </p>

        {/* Skill tags */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {["Next.js", "TypeScript", "Figma", "After Effects", "Illustration"].map(
            (tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono rounded-full border border-dark-800/80 text-dark-600 bg-dark-900/30"
              >
                {tech}
              </span>
            )
          )}
        </div>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-all duration-200 hover:shadow-xl hover:shadow-blood-900/40"
          >
            Lihat Karya
            <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
          </Link>
          <a
            href="/cv.pdf"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-dark-700 hover:border-blood-800 text-dark-400 hover:text-blood-400 text-sm font-medium transition-all duration-200"
          >
            <Download size={15} />
            Download CV
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-dark-700">
        <div className="w-px h-10 bg-gradient-to-b from-blood-900/40 to-transparent" />
        <span className="text-[10px] font-mono tracking-widest">SCROLL</span>
      </div>
    </section>
  );
}
