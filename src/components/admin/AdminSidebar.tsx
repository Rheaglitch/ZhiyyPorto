"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderOpen, Wrench, LogOut, ExternalLink, FileText, Eye } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/zhaorukou/dashboard",          label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/zhaorukou/dashboard/content",  label: "Content",   icon: FileText,        exact: false },
  { href: "/zhaorukou/dashboard/projects", label: "Projects",  icon: FolderOpen,      exact: false },
  { href: "/zhaorukou/dashboard/skills",   label: "Skills",    icon: Wrench,          exact: false },
  { href: "/zhaorukou/dashboard/preview",  label: "Preview",   icon: Eye,             exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createAdminClient();
    await supabase.auth.signOut();
    router.push("/zhaorukou");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 bg-[#0d0d0d] border-r border-dark-800 flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-dark-800">
        <span className="font-mono font-black text-base text-dark-100">
          <span className="text-blood-600">&lt;</span>
          Zhiyy
          <span className="text-blood-600">/&gt;</span>
        </span>
        <p className="text-[10px] text-dark-600 font-mono mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-blood-950 border border-blood-900 text-blood-400"
                  : "text-dark-500 hover:text-dark-200 hover:bg-dark-900"
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-dark-800 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-500 hover:text-dark-200 hover:bg-dark-900 transition-colors"
        >
          <ExternalLink size={15} />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-500 hover:text-blood-400 hover:bg-blood-950/50 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
