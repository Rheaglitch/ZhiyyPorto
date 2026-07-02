import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteSkillButton } from "@/components/admin/DeleteSkillButton";
import type { Skill } from "@/types/database";
import Image from "next/image";

// Category color map
const CAT_COLOR: Record<string, string> = {
  Frontend: "text-blue-400  border-blue-900/50  bg-blue-950/30",
  Backend:  "text-green-400 border-green-900/50 bg-green-950/30",
  Tools:    "text-yellow-400 border-yellow-900/50 bg-yellow-950/30",
  Creative: "text-pink-400  border-pink-900/50  bg-pink-950/30",
};
const CAT_BAR: Record<string, string> = {
  Frontend: "from-blue-700  to-blue-500",
  Backend:  "from-green-700 to-green-500",
  Tools:    "from-yellow-700 to-yellow-500",
  Creative: "from-pink-700  to-pink-500",
};

export default async function AdminSkillsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  const skills     = (data ?? []) as Skill[];
  const categories = [...new Set(skills.map((s) => s.category))];

  const catStats = categories.map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    const avg = catSkills.length
      ? Math.round(catSkills.reduce((sum, s) => sum + s.level, 0) / catSkills.length)
      : 0;
    return { cat, count: catSkills.length, avg };
  });

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Skills & Tools</h1>
          <p className="text-sm text-dark-500 mt-1 font-mono">
            {skills.length} skill · {categories.length} kategori
          </p>
        </div>
        <Link
          href="/zhaorukou/dashboard/skills/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-colors"
        >
          <Plus size={15} /> Tambah Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-dark-800 rounded-xl">
          <p className="font-mono text-sm text-dark-600">{`// belum ada skill — tambah sekarang`}</p>
        </div>
      ) : (
        <>
          {/* ── Category summary pills ── */}
          <div className="flex flex-wrap gap-3 mb-8">
            {catStats.map(({ cat, count, avg }) => (
              <div key={cat} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono ${CAT_COLOR[cat] ?? "text-dark-400 border-dark-800 bg-dark-900/30"}`}>
                <span className="font-semibold">{cat}</span>
                <span className="opacity-60">·</span>
                <span>{count} skill</span>
                <span className="opacity-60">·</span>
                <span>avg {avg}%</span>
              </div>
            ))}
          </div>

          {/* ── Per category ── */}
          <div className="space-y-10">
            {categories.map((cat) => {
              const catSkills = skills.filter(s => s.category === cat);
              const barGradient = CAT_BAR[cat] ?? "from-blood-700 to-blood-500";
              const labelColor  = CAT_COLOR[cat]?.split(" ")[0] ?? "text-dark-400";

              return (
                <div key={cat}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-mono uppercase tracking-widest ${labelColor}`}>{cat}</span>
                    <span className="flex-1 h-px bg-dark-800" />
                    <span className="text-[10px] font-mono text-dark-700">{catSkills.length} skill</span>
                  </div>

                  {/* Skill cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {catSkills.map((skill) => (
                      <div key={skill.id}
                        className="group card-dark rounded-xl border border-dark-800 p-4 hover:border-dark-700 transition-all duration-200 flex flex-col gap-3">

                        {/* Top row: icon + name + actions */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {skill.icon ? (
                              <div className="w-9 h-9 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center shrink-0 overflow-hidden p-1">
                                <Image
                                  src={skill.icon}
                                  alt={skill.name}
                                  width={28}
                                  height={28}
                                  className="w-7 h-7 object-contain"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-center shrink-0">
                                <span className="text-dark-600 text-xs font-mono">{skill.name.slice(0,2).toUpperCase()}</span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold text-dark-100">{skill.name}</p>
                              <p className="text-[10px] font-mono text-dark-600">order #{skill.order_index}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <Link
                              href={`/zhaorukou/dashboard/skills/${skill.id}`}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-dark-400 hover:text-blood-400 hover:bg-blood-950/40 border border-transparent hover:border-blood-900/40 transition-colors"
                            >
                              Edit
                            </Link>
                            <DeleteSkillButton id={skill.id} name={skill.name} />
                          </div>
                        </div>

                        {/* Level bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-dark-600">Level</span>
                            <span className={`text-xs font-mono font-bold ${labelColor}`}>{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${barGradient} rounded-full transition-all`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          {/* Level label */}
                          <p className="text-[9px] font-mono text-dark-700 text-right">
                            {skill.level >= 90 ? "Expert" : skill.level >= 75 ? "Advanced" : skill.level >= 60 ? "Intermediate" : skill.level >= 40 ? "Beginner" : "Learning"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
