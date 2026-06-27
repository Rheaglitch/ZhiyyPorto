import type { Skill } from "@/types/database";

interface SkillsSectionProps {
  skills: Skill[];
}

// Default skills jika Supabase belum ada data
const defaultSkills: Omit<Skill, "id">[] = [
  { name: "Next.js", category: "Frontend", level: 90, icon: null, order_index: 1 },
  { name: "React", category: "Frontend", level: 90, icon: null, order_index: 2 },
  { name: "TypeScript", category: "Frontend", level: 85, icon: null, order_index: 3 },
  { name: "Tailwind CSS", category: "Frontend", level: 90, icon: null, order_index: 4 },
  { name: "Node.js", category: "Backend", level: 80, icon: null, order_index: 5 },
  { name: "Supabase", category: "Backend", level: 85, icon: null, order_index: 6 },
  { name: "PostgreSQL", category: "Backend", level: 75, icon: null, order_index: 7 },
  { name: "REST API", category: "Backend", level: 85, icon: null, order_index: 8 },
  { name: "Git", category: "Tools", level: 85, icon: null, order_index: 9 },
  { name: "Vercel", category: "Tools", level: 90, icon: null, order_index: 10 },
  { name: "Figma", category: "Tools", level: 70, icon: null, order_index: 11 },
  { name: "Docker", category: "Tools", level: 60, icon: null, order_index: 12 },
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
            — Tech Stack —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Skills &amp; <span className="text-gradient-blood">Tools</span>
          </h2>
          <p className="mt-3 text-dark-500 text-sm max-w-md mx-auto">
            Teknologi yang aku pakai sehari-hari dan cukup aku kuasai untuk bikin
            sesuatu yang keren.
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h3 className="font-mono text-xs text-blood-600 uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-dark-800" />
              {category}
              <span className="flex-1 h-px bg-dark-800" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displaySkills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillBar({ skill }: { skill: Skill | Omit<Skill, "id"> }) {
  return (
    <div className="card-dark rounded-lg p-4 hover:border-blood-900 transition-colors group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-dark-200">{skill.name}</span>
        <span className="text-xs font-mono text-blood-600">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blood-700 to-blood-500 rounded-full transition-all duration-700 group-hover:from-blood-600 group-hover:to-blood-400"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  );
}
