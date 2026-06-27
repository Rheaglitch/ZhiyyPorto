import { createClient } from "@/lib/supabase/server";
import { FolderOpen, Wrench, Eye } from "lucide-react";
import Link from "next/link";
import type { ProjectWithCategory, Skill } from "@/types/database";
import { ContentProtection } from "@/components/admin/ContentProtection";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: projectsData }, { data: skillsData }] = await Promise.all([
    supabase.from("projects").select("*, project_categories(name)"),
    supabase.from("skills").select("*"),
  ]);

  const projects = (projectsData ?? []) as ProjectWithCategory[];
  const skills = (skillsData ?? []) as Skill[];
  const featured = projects.filter((p) => p.featured).length;

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderOpen,
      href: "/zhaorukou/dashboard/projects",
      color: "text-blood-400",
      bg: "bg-blood-950 border-blood-900",
    },
    {
      label: "Featured",
      value: featured,
      icon: Eye,
      href: "/zhaorukou/dashboard/projects",
      color: "text-dark-300",
      bg: "bg-dark-900 border-dark-800",
    },
    {
      label: "Skills",
      value: skills.length,
      icon: Wrench,
      href: "/zhaorukou/dashboard/skills",
      color: "text-blood-400",
      bg: "bg-blood-950 border-blood-900",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-100">Dashboard</h1>
        <p className="text-sm text-dark-500 mt-1 font-mono">
          {`// welcome back, Reavlenia`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className={`card-dark rounded-xl p-5 border hover:border-blood-800 transition-colors group`}
          >
            <div
              className={`w-9 h-9 rounded-lg border ${bg} flex items-center justify-center mb-3`}
            >
              <Icon size={16} className={color} />
            </div>
            <div className="text-3xl font-black text-dark-100">{value}</div>
            <div className="text-xs text-dark-500 font-mono mt-1">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-mono text-dark-500 uppercase tracking-widest mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/zhaorukou/dashboard/projects/new"
          className="flex items-center gap-3 p-4 card-dark rounded-xl border border-dashed border-dark-700 hover:border-blood-700 text-dark-400 hover:text-blood-400 transition-colors group"
        >
          <span className="text-xl font-black">+</span>
          <div>
            <p className="text-sm font-medium">Tambah Project Baru</p>
            <p className="text-xs text-dark-600">Tambahkan ke portfolio</p>
          </div>
        </Link>
        <Link
          href="/zhaorukou/dashboard/skills/new"
          className="flex items-center gap-3 p-4 card-dark rounded-xl border border-dashed border-dark-700 hover:border-blood-700 text-dark-400 hover:text-blood-400 transition-colors group"
        >
          <span className="text-xl font-black">+</span>
          <div>
            <p className="text-sm font-medium">Tambah Skill Baru</p>
            <p className="text-xs text-dark-600">Update tech stack kamu</p>
          </div>
        </Link>
      </div>

      {/* Recent projects table */}
      {projects.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono text-dark-500 uppercase tracking-widest">
              Recent Projects
            </h2>
            <Link
              href="/zhaorukou/dashboard/projects"
              className="text-xs text-blood-600 hover:text-blood-400 font-mono transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="card-dark rounded-xl border border-dark-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-800 text-xs font-mono text-dark-600 uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Featured</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((p, i) => (
                  <tr
                    key={p.id}
                    className={`${i < projects.slice(0, 5).length - 1 ? "border-b border-dark-900" : ""} hover:bg-dark-900/50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-dark-200 font-medium">
                      <Link
                        href={`/zhaorukou/dashboard/projects/${p.id}`}
                        className="hover:text-blood-400 transition-colors"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-dark-500 hidden sm:table-cell font-mono text-xs">
                      {p.project_categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {p.featured ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blood-950 border border-blood-900 text-blood-400">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-dark-900 border border-dark-800 text-dark-600">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Protection */}
      <ContentProtection />
    </div>
  );
}