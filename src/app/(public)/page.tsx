import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { createClient } from "@/lib/supabase/server";
import type { ProjectWithRelations, Skill } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from("projects")
    .select("*, project_categories(*), project_images(id, url, storage_path, order_index)")
    .eq("featured", true)
    .order("order_index", { ascending: true })
    .limit(6);

  const { data: skillsData } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  // Pastikan project_images selalu array dan project_categories tidak null
  const projects = ((projectsData ?? []) as ProjectWithRelations[]).map((p) => ({
    ...p,
    project_images: p.project_images ?? [],
    project_categories: p.project_categories ?? { id: "", name: "—", order_index: 0 },
  }));
  const skills = (skillsData ?? []) as Skill[];

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ContactSection />
    </>
  );
}
