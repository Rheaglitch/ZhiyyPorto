import type { Skill } from "@/types/database";
import { SkillCarousel } from "@/components/ui/SkillCarousel";
import { GlitchReveal } from "@/components/ui/GlitchReveal";

interface SkillsSectionProps {
  skills: Skill[];
}

const defaultSkills: Omit<Skill, "id">[] = [
  { name: "Next.js",      category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/nextdotjs/ffffff",        order_index: 1  },
  { name: "React",        category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/react/61DAFB",            order_index: 2  },
  { name: "TypeScript",   category: "Frontend", level: 85, icon: "https://cdn.simpleicons.org/typescript/3178C6",       order_index: 3  },
  { name: "Tailwind CSS", category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",      order_index: 4  },
  { name: "Node.js",      category: "Backend",  level: 80, icon: "https://cdn.simpleicons.org/nodedotjs/339933",        order_index: 5  },
  { name: "Supabase",     category: "Backend",  level: 85, icon: "https://cdn.simpleicons.org/supabase/3ECF8E",         order_index: 6  },
  { name: "PostgreSQL",   category: "Backend",  level: 75, icon: "https://cdn.simpleicons.org/postgresql/4169E1",       order_index: 7  },
  { name: "Git",          category: "Tools",    level: 85, icon: "https://cdn.simpleicons.org/git/F05032",              order_index: 8  },
  { name: "Figma",        category: "Tools",    level: 85, icon: "https://cdn.simpleicons.org/figma/F24E1E",            order_index: 9  },
  { name: "Vercel",       category: "Tools",    level: 90, icon: "https://cdn.simpleicons.org/vercel/ffffff",           order_index: 10 },
  { name: "Photoshop",    category: "Creative", level: 80, icon: "https://cdn.simpleicons.org/adobephotoshop/31A8FF",   order_index: 11 },
  { name: "Illustrator",  category: "Creative", level: 80, icon: "https://cdn.simpleicons.org/adobeillustrator/FF9A00", order_index: 12 },
  { name: "After Effects",category: "Creative", level: 75, icon: "https://cdn.simpleicons.org/adobeaftereffects/9999FF",order_index: 13 },
  { name: "Premiere",     category: "Creative", level: 70, icon: "https://cdn.simpleicons.org/adobepremierepro/9999FF", order_index: 14 },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const src = (skills.length > 0 ? skills : defaultSkills) as Skill[];

  const skillsCarousel  = src.filter(s => ["Frontend", "Backend"].includes(s.category));
  const toolsCarousel   = src.filter(s => ["Tools", "Creative"].includes(s.category));

  return (
    <section id="skills" className="py-20 overflow-hidden" style={{ background: "var(--section-alt)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <GlitchReveal className="text-center mb-14 px-6">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Expertise —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Skills &amp; <span className="text-gradient-blood">Tools</span>
          </h2>
          <p className="mt-3 text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Dari kode sampai kanvas — tools yang aku kuasai.
          </p>
        </GlitchReveal>

        {/* Carousel 1 — Skills (moves right) */}
        <GlitchReveal delay={100}>
          <SkillCarousel
            skills={skillsCarousel}
            direction="right"
            label="Skills"
          />
        </GlitchReveal>

        {/* Carousel 2 — Tools (moves left, opposite) */}
        <GlitchReveal delay={200}>
          <div className="mt-4">
            <SkillCarousel
              skills={toolsCarousel}
              direction="left"
              label="Tools & Creative"
            />
          </div>
        </GlitchReveal>
      </div>
    </section>
  );
}
