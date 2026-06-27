import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types/database";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group card-dark rounded-xl overflow-hidden hover:border-blood-900 transition-all duration-300 flex flex-col",
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-dark-900 overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-4xl font-black text-dark-800 select-none">
              {project.title.slice(0, 2).toUpperCase()}
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-blood-950/0 group-hover:bg-blood-950/40 transition-colors duration-300" />

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-blood-800/80 text-blood-200 border border-blood-700/50">
            Featured
          </span>
        )}

        {/* Category */}
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-dark-950/80 text-dark-400 border border-dark-800">
          {project.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-dark-100 group-hover:text-blood-400 transition-colors mb-2">
          {project.title}
        </h3>
        <p className="text-xs text-dark-500 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-900 border border-dark-800 text-dark-500"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 4 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-900 border border-dark-800 text-dark-600">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-dark-800">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-blood-400 transition-colors font-mono"
            >
              <ExternalLink size={12} />
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-blood-400 transition-colors font-mono"
            >
              <Github size={12} />
              Source
            </a>
          )}
          {!project.live_url && !project.github_url && (
            <span className="text-xs text-dark-700 font-mono">
              {`// private project`}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
