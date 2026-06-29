import { HeroSection }     from "@/components/sections/HeroSection";
import { AboutSection }    from "@/components/sections/AboutSection";
import { SkillsSection }   from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection }  from "@/components/sections/ContactSection";
import { ParallaxSection } from "@/components/layout/ParallaxSection";
import { createClient }    from "@/lib/supabase/server";
import type { ProjectWithRelations, Skill } from "@/types/database";

export default async function Home() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  const [{ data: projectsData }, { data: skillsData }] = await Promise.all([
    supabase
      .from("projects")
      .select("*, project_categories(*), project_images(id, url, storage_path, order_index)")
      .eq("featured", true)
      .order("order_index", { ascending: true })
      .limit(6),
    supabase.from("skills").select("*").order("order_index", { ascending: true }),
  ]);

  // Fetch all site settings
  const keys = ["hero_name","hero_roles","hero_bio","hero_stats","hero_image","about_bio","contact_info"];
  const { data: settingsRows } = await sb.from("site_settings").select("key,value").in("key", keys);
  const cfg: Record<string, Record<string, unknown>> = {};
  for (const row of settingsRows ?? []) cfg[row.key] = row.value ?? {};

  const heroImageUrl: string   = (cfg.hero_image?.url    as string)   ?? "";
  const heroRoles:    string[] = (cfg.hero_roles?.roles  as string[]) ?? [];
  const heroFirst:    string   = (cfg.hero_name?.first   as string)   ?? "REAVLENIA";
  const heroLast:     string   = (cfg.hero_name?.last    as string)   ?? "AREZHA";
  const heroBio:      string   = (cfg.hero_bio?.text     as string)   ?? "";
  const heroStats = (cfg.hero_stats?.items as { value: string; label: string }[]) ?? [];
  const aboutParas = (cfg.about_bio?.paragraphs as string[]) ?? [];
  const contactInfo = (cfg.contact_info as Record<string, string>) ?? {};

  const projects = ((projectsData ?? []) as ProjectWithRelations[]).map((p) => ({
    ...p,
    project_images:     p.project_images     ?? [],
    project_categories: p.project_categories ?? { id: "", name: "—", order_index: 0 },
  }));
  const skills = (skillsData ?? []) as Skill[];

  return (
    <>
      <HeroSection
        heroImageUrl={heroImageUrl}
        roles={heroRoles}
        nameFirst={heroFirst}
        nameLast={heroLast}
        bio={heroBio}
        stats={heroStats}
      />

      <ParallaxSection direction="up" intensity={0.12} delay={0}>
        <AboutSection paragraphs={aboutParas} />
      </ParallaxSection>

      <ParallaxSection direction="left" intensity={0.1} delay={50}>
        <SkillsSection skills={skills} />
      </ParallaxSection>

      <ParallaxSection direction="up" intensity={0.12} delay={0}>
        <ProjectsSection projects={projects} />
      </ParallaxSection>

      <ParallaxSection direction="up" intensity={0.08} delay={100}>
        <ContactSection contactInfo={contactInfo} />
      </ParallaxSection>
    </>
  );
}
