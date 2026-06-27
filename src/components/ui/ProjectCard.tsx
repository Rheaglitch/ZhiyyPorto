"use client";

import { useState } from "react";
import { ExternalLink, Github, Play } from "lucide-react";
import type { ProjectWithRelations } from "@/types/database";
import { cn } from "@/lib/utils";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { VideoModal } from "@/components/ui/VideoModal";

interface ProjectCardProps {
  project: ProjectWithRelations;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <article
      className={cn(
        "group card-dark rounded-xl overflow-hidden hover:border-blood-900 transition-all duration-300 flex flex-col",
        className
      )}
    >
      {/* Thumbnail / Carousel */}
      <div className="relative w-full h-48 bg-dark-900 overflow-hidden">
        <ImageCarousel
          images={project.project_images}
          alt={project.title}
          fallbackText={project.title}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-blood-950/0 group-hover:bg-blood-950/40 transition-colors duration-300 pointer-events-none" />

        {/* Video play button overlay */}
        {project.video_url !== null && (
          <button
            onClick={() => setIsVideoOpen(true)}
            className="absolute inset-0 flex items-center justify-center z-10"
            aria-label={`Tonton video ${project.title}`}
          >
            <span className="w-11 h-11 rounded-full bg-black/60 hover:bg-blood-700/80 border border-white/20 flex items-center justify-center transition-colors">
              <Play size={20} className="text-white ml-0.5" />
            </span>
          </button>
        )}

        {/* Featured badge */}
        {project.featured && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono bg-blood-800/80 text-blood-200 border border-blood-700/50 z-10 pointer-events-none">
            Featured
          </span>
        )}

        {/* Category */}
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-dark-950/80 text-dark-400 border border-dark-800 z-10 pointer-events-none">
          {project.project_categories.name}
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

      {/* Video Modal */}
      {project.video_url && (
        <VideoModal
          videoUrl={project.video_url}
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </article>
  );
}
