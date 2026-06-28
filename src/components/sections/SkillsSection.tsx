"use client";

import { useState } from "react";
import type { Skill } from "@/types/database";

interface SkillsSectionProps {
  skills: Skill[];
}

const defaultSkills: Omit<Skill, "id">[] = [
  // Frontend
  { name: "Next.js",      category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/nextdotjs/ffffff",       order_index: 1  },
  { name: "React",        category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/react/61DAFB",           order_index: 2  },
  { name: "TypeScript",   category: "Frontend", level: 85, icon: "https://cdn.simpleicons.org/typescript/3178C6",      order_index: 3  },
  { name: "Tailwind CSS", category: "Frontend", level: 90, icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",     order_index: 4  },
  // Backend
  { name: "Node.js",      category: "Backend",  level: 80, icon: "https://cdn.simpleicons.org/nodedotjs/339933",       order_index: 5  },
  { name: "Supabase",     category: "Backend",  level: 85, icon: "https://cdn.simpleicons.org/supabase/3ECF8E",        order_index: 6  },
  { name: "PostgreSQL",   category: "Backend",  level: 75, icon: "https://cdn.simpleicons.org/postgresql/4169E1",      order_index: 7  },
  // Tools
  { name: "Git",          category: "Tools",    level: 85, icon: "https://cdn.simpleicons.org/git/F05032",             order_index: 8  },
  { name: "Figma",        category: "Tools",    level: 85, icon: "https://cdn.simpleicons.org/figma/F24E1E",           order_index: 9  },
  { name: "Vercel",       category: "Tools",    level: 90, icon: "https://cdn.simpleicons.org/vercel/ffffff",          order_index: 10 },
  // Creative
  { name: "Photoshop",    category: "Creative", level: 80, icon: "https://cdn.simpleicons.org/adobephotoshop/31A8FF",  order_index: 11 },
  { name: "Illustrator",  category: "Creative", level: 80, icon: "https://cdn.simpleicons.org/adobeillustrator/FF9A00",order_index: 12 },
  { name: "After Effects",category: "Creative", level: 75, icon: "https://cdn.simpleicons.org/adobeaftereffects/9999FF",order_index: 13 },
  { name: "Premiere Pro", category: "Creative", level: 70, icon: "https://cdn.simpleicons.org/adobepremierepro/9999FF",order_index: 14 },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const displaySkills = skills.length > 0 ? skills : (defaultSkills as Skill[]);
  const categories = [...new Set(displaySkills.map((s) => s.category))];

  return (
    <section id="skills" className="py-20 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Expertise —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Skills &amp; <span className="text-gradient-blood">Tools</span>
          </h2>
          <p className="mt-3 text-dark-500 text-sm max-w-md mx-auto">
            Dari kode sampai kanvas — tools yang aku kuasai untuk bikin karya yang solid.
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <div className="flex items-center gap-4 mb-5">
                <span className="font-mono text-xs text-blood-700 uppercase tracking-widest shrink-0">
                  {category}
                </span>
                <div className="flex-1 h-px bg-dark-800/80" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {displaySkills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <SkillCard key={skill.name} skill={skill} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill | Omit<Skill, "id"> }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col items-center gap-2.5 p-3 rounded-xl border border-dark-800/60 bg-dark-900/30 hover:border-blood-900/60 hover:bg-dark-900/60 transition-all duration-200 cursor-default">
      {/* Icon */}
      <div className="w-9 h-9 flex items-center justify-center">
        {skill.icon && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={skill.icon}
            alt={skill.name}
            width={36}
            height={36}
            className="w-8 h-8 object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center">
            <span className="text-blood-500 font-mono font-bold text-[10px]">
              {skill.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <span className="text-[11px] font-medium text-dark-500 group-hover:text-dark-300 transition-colors text-center leading-tight line-clamp-2">
        {skill.name}
      </span>
    </div>
  );
}
