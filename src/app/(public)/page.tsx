import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { ParallaxSection } from "@/components/layout/ParallaxSection";
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

  const projects = ((projectsData ?? []) as ProjectWithRelations[]).map((p) => ({
    ...p,
    project_images: p.project_images ?? [],
    project_categories: p.project_categories ?? { id: "", name: "—", order_index: 0 },
  }));
  const skills = (skillsData ?? []) as Skill[];

  return (
    <>
      {/* Hero — no parallax, always visible */}
      <HeroSection />

      {/* About — slide up from below */}
      <ParallaxSection direction="up" intensity={0.12} delay={0}>
        <AboutSection />
      </ParallaxSection>

      {/* Skills — slide from right */}
      <ParallaxSection direction="left" intensity={0.1} delay={50}>
        <SkillsSection skills={skills} />
      </ParallaxSection>

      {/* Projects — slide up */}
      <ParallaxSection direction="up" intensity={0.12} delay={0}>
        <ProjectsSection projects={projects} />
      </ParallaxSection>

      {/* Contact — slide up with slight delay */}
      <ParallaxSection direction="up" intensity={0.08} delay={100}>
        <ContactSection />
      </ParallaxSection>
    </>
  );
}
