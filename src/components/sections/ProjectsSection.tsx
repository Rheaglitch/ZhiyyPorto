import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/types/database";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 px-6 bg-dark-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <div>
            <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
              — Featured Work —
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
              Project <span className="text-gradient-blood">Terbaik</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm text-dark-400 hover:text-blood-400 font-mono transition-colors"
          >
            Lihat Semua
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-dark-800 rounded-xl">
            <p className="font-mono text-sm text-dark-600">
              {`// project akan muncul setelah Supabase dikonfigurasi`}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
