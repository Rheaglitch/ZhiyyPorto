import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeleteSkillButton } from "@/components/admin/DeleteSkillButton";
import type { Skill } from "@/types/database";

export default async function AdminSkillsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("order_index", { ascending: true });

  const skills = (data ?? []) as Skill[];
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-100">Skills</h1>
          <p className="text-sm text-dark-500 mt-1 font-mono">
            {skills.length} skill
          </p>
        </div>
        <Link
          href="/zhaorukou/dashboard/skills/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-colors"
        >
          <Plus size={15} />
          Tambah Skill
        </Link>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-dark-800 rounded-xl">
          <p className="font-mono text-sm text-dark-600">{`// belum ada skill`}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="text-xs font-mono text-blood-600 uppercase tracking-widest mb-3 flex items-center gap-3">
                <span className="flex-1 h-px bg-dark-800" />
                {cat}
                <span className="flex-1 h-px bg-dark-800" />
              </h2>
              <div className="card-dark rounded-xl border border-dark-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-800 text-xs font-mono text-dark-600 uppercase tracking-wider">
                      <th className="text-left px-4 py-3">Name</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Level</th>
                      <th className="text-left px-4 py-3 hidden sm:table-cell">Order</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills
                      .filter((s) => s.category === cat)
                      .map((skill, i, arr) => (
                        <tr
                          key={skill.id}
                          className={`${i < arr.length - 1 ? "border-b border-dark-900" : ""} hover:bg-dark-900/30 transition-colors`}
                        >
                          <td className="px-4 py-3 text-dark-200 font-medium">
                            {skill.name}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-1.5 bg-dark-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blood-700 to-blood-500 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono text-dark-500">
                                {skill.level}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell text-dark-600 font-mono text-xs">
                            {skill.order_index}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/zhaorukou/dashboard/skills/${skill.id}`}
                                className="text-xs text-dark-400 hover:text-blood-400 font-mono transition-colors px-2 py-1 rounded hover:bg-dark-900"
                              >
                                Edit
                              </Link>
                              <DeleteSkillButton id={skill.id} name={skill.name} />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
