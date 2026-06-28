"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#about",    label: "About"    },
  { href: "/#skills",   label: "Skills"   },
  { href: "/#projects", label: "Projects" },
  { href: "/projects",  label: "All Work" },
  { href: "/#contact",  label: "Contact"  },
];

export function Navbar() {
  const pathname  = usePathname();
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      // Threshold = hero height (100vh) minus navbar height (~56px)
      setScrolled(window.scrollY > window.innerHeight - 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On homepage: start at bottom of hero, transition to top after scroll
  // On other pages: always sticky top
  const isBottom = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed z-50 left-0 right-0 transition-all duration-500",
        isBottom
          ? "bottom-0 top-auto bg-dark-950/80 backdrop-blur-md border-t border-dark-800/60"
          : "top-0 bottom-auto bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)]"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono font-bold text-lg text-dark-100 hover:text-blood-500 transition-colors shrink-0"
        >
          <span className="text-blood-600">&lt;</span>
          Zhiyy
          <span className="text-blood-600">/&gt;</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-xs font-mono text-dark-400 hover:text-blood-400 transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: Hire Me */}
        <Link
          href="/#contact"
          className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-xs font-medium transition-colors"
        >
          Hire Me
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-dark-400 hover:text-blood-400 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--bg-primary)]/95 backdrop-blur-md border-t border-[var(--border)] px-6 pb-5 pt-3">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-mono py-1.5 text-dark-400 hover:text-blood-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-1">
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="flex justify-center px-4 py-2 rounded-full bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-colors"
              >
                Hire Me
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
