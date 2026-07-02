"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Settings, Mail, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/zhaorukou/dashboard/messages",          label: "Inbox",    icon: Inbox,          exact: true  },
  { href: "/zhaorukou/dashboard/messages/settings", label: "Settings", icon: Settings,        exact: false },
];

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Sub-navbar */}
      <div className="flex items-center gap-1 mb-6 border-b border-dark-800 pb-0">
        <div className="flex items-center gap-2 mr-4">
          <div className="w-7 h-7 rounded-lg bg-blood-950 border border-blood-900 flex items-center justify-center">
            <Mail size={13} className="text-blood-400" />
          </div>
          <span className="text-sm font-semibold text-dark-200">Messages</span>
        </div>

        {tabs.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs font-mono transition-colors border-b-2 -mb-px",
                isActive
                  ? "border-blood-600 text-blood-400"
                  : "border-transparent text-dark-500 hover:text-dark-300"
              )}
            >
              <Icon size={13} />
              {label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
