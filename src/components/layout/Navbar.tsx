"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#projects", label: "Projects" },
  { href: "/projects", label: "All Work" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-dark-950/90 backdrop-blur-md border-b border-dark-800"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono font-bold text-xl text-dark-100 hover:text-blood-500 transition-colors"
        >
          <span className="text-blood-600">&lt;</span>
          Zhiyy
          <span className="text-blood-600">/&gt;</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-mono transition-colors hover:text-blood-400",
                  pathname === link.href
                    ? "text-blood-500"
                    : "text-dark-400"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA button desktop */}
        <Link
          href="/#contact"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-colors"
        >
          Hire Me
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-dark-300 hover:text-blood-400 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-950/95 backdrop-blur-md border-b border-dark-800 px-6 pb-6">
          <ul className="flex flex-col gap-4 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block text-sm font-mono py-2 transition-colors hover:text-blood-400",
                    pathname === link.href ? "text-blood-500" : "text-dark-400"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex w-full justify-center items-center gap-2 px-4 py-2 rounded-md bg-blood-700 hover:bg-blood-600 text-white text-sm font-medium transition-colors"
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
