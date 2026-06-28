import Image from "next/image";
import type { Skill } from "@/types/database";

interface SkillsSectionProps {
  skills: Skill[];
}

const defaultSkills: Omit<Skill, "id">[] = [
  { name: "Next.js",     category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/nextdotjs/ffffff",    order_index: 1 },
  { name: "React",       category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/react/61DAFB",        order_index: 2 },
  { name: "TypeScript",  category: "Frontend", level: 85, icon: "https://cdn.simpleicons.org/typescript/3178C6",   order_index: 3 },
  { name: "Tailwind CSS",category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",  order_index: 4 },
  { name: "Node.js",     category: "Backend",  level: 80, icon: "https://cdn.simpleicons.org/nodedotjs/339933",    order_index: 5 },
  { name: "Supabase",    category: "Backend",  level: 85, icon: "https://cdn.simpleicons.org/supabase/3ECF8E",     order_index: 6 },
  { name: "PostgreSQL",  category: "Backend",  level: 75, icon: "https://cdn.simpleicons.org/postgresql/4169E1",   order_index: 7 },
  { name: "Git",         category: "Tools",    level: 85, icon: "https://cdn.simpleicons.org/git/F05032",          order_index: 8 },
  { name: "Vercel",      category: "Tools",    level: 90, icon: "https://cdn.simpleicons.org/vercel/ffffff",       order_index: 9 },
  { name: "Figma",       category: "Tools",    level: 70, icon: "https://cdn.simpleicons.org/figma/F24E1E",        order_index: 10 },
  { name: "Photoshop",   category: "Creative", level: 80, icon: "https://cdn.simpleicons.org/adobephotoshop/31A8FF",order_index: 11 },
  { name: "Illustrator", category: "Creative", level: 75, icon: "https://cdn.simpleicons.org/adobeillustrator/FF9A00",order_index: 12 },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const displaySkills = skills.length > 0 ? skills : (defaultSkills as Skill[]);
  const categories = [...new Set(displaySkills.map((s) => s.category))];

  return (
    <section id="skills" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Expertise —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Skills &amp; <span className="text-gradient-blood">Tools</span>
          </h2>
          <p className="mt-3 text-dark-500 text-sm max-w-md mx-auto">
            Teknologi dan tools yang aku pakai untuk mewujudkan ide jadi karya nyata.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-14">
            <h3 className="font-mono text-xs text-blood-600 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-dark-800" />
              {category}
              <span className="flex-1 h-px bg-dark-800" />
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {displaySkills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill | Omit<Skill, "id"> }) {
  return (
    <div className="card-dark rounded-xl p-4 flex flex-col items-center gap-3 hover:border-blood-900 transition-all duration-200 group text-center">
      {/* Icon */}
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        {skill.icon ? (
          <Image
            src={skill.icon}
            alt={skill.name}
            width={40}
            height={40}
            className="w-9 h-9 object-contain"
            unoptimized
          />
        ) : (
          <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900 flex items-center justify-center">
            <span className="text-blood-400 font-mono font-bold text-xs">
              {skill.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-xs font-medium text-dark-300 group-hover:text-dark-100 transition-colors leading-tight">
        {skill.name}
      </span>
    </div>
  );
}
