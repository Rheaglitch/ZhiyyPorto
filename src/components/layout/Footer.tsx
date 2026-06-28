import Link from "next/link";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

const socials = [
  { href: "https://github.com/", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com/", icon: Instagram, label: "Instagram" },
  { href: "mailto:hello@zhiyy.dev", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t py-12 px-6" style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="font-mono font-bold text-lg text-dark-100 hover:text-blood-500 transition-colors"
          >
            <span className="text-blood-600">&lt;</span>
            Zhiyy
            <span className="text-blood-600">/&gt;</span>
          </Link>
          <p className="mt-1 text-xs text-dark-500 font-mono">
            {`// built with Next.js + Supabase`}
          </p>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-5">
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-dark-500 hover:text-blood-400 transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-dark-600 font-mono">
          &copy; {new Date().getFullYear()} Reavlenia Arezha
        </p>
      </div>
    </footer>
  );
}
