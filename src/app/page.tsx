import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { createClient } from "@/lib/supabase/server";
import type { Project, Skill } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();

  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("order_index", { ascending: true })
    .limit(6);

  const { data: skillsData } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  const projects = (projectsData ?? []) as Project[];
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
