import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { notFound } from "next/navigation";
import type { Project } from "@/types/database";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const project = data as Project;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-100">Edit Project</h1>
        <p className="text-sm text-dark-500 mt-1 font-mono">
          {`// ${project.title}`}
        </p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
