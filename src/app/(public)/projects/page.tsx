import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Metadata } from "next";
import type { Project } from "@/types/database";

export const metadata: Metadata = {
  title: "Projects",
  description: "All projects by Reavlenia Arezha",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  const projects = (data ?? []) as Project[];
  const categories = [...new Set(projects.map((p) => p.category))];

  return (
    <section className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Work —
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-dark-100">
            All <span className="text-gradient-blood">Projects</span>
          </h1>
          <p className="mt-4 text-dark-400 max-w-xl mx-auto">
            Kumpulan proyek yang pernah aku bangun — dari side project kecil
            sampai produk yang beneran dipakai orang.
          </p>
        </div>

        {/* Category filter labels */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-1.5 rounded-full text-xs font-mono border border-dark-800 text-dark-400 uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-dark-500">
            <p className="font-mono text-sm">{`// belum ada project nih`}</p>
          </div>
        )}
      </div>
    </section>
  );
}
