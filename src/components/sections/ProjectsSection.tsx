import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { GlitchReveal } from "@/components/ui/GlitchReveal";
import type { ProjectWithRelations } from "@/types/database";

interface ProjectsSectionProps {
  projects: ProjectWithRelations[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 px-6" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <GlitchReveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
              — Featured Work —
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-dark-100">
              Project <span className="text-gradient-blood">Terbaik</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 text-xs text-dark-500 hover:text-blood-400 font-mono transition-colors shrink-0"
          >
            Lihat semua karya
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </GlitchReveal>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          /* Empty state yang lebih informatif */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-dashed border-dark-800 bg-dark-900/20 aspect-[4/3] flex flex-col items-center justify-center gap-3 opacity-40"
              >
                <div className="w-10 h-10 rounded-full border border-dark-700 flex items-center justify-center">
                  <Plus size={16} className="text-dark-600" />
                </div>
                <span className="text-xs font-mono text-dark-700">project #{i}</span>
              </div>
            ))}
            <div className="md:col-span-3 text-center pt-2">
              <p className="text-xs font-mono text-dark-700">
                {`// tambah project via dashboard admin`}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
