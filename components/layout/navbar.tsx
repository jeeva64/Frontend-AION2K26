"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/brochure", label: "Brochure" },
  { href: "/login", label: "Login" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-xl font-extrabold tracking-tight"
          onClick={closeMenu}
        >
          <span className="text-white">AION</span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            2K26
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link transition-colors",
                pathname === link.href
                  ? "text-blue-400"
                  : "text-slate-200/85 hover:text-blue-400"
              )}
            >
              {link.label}
            </Link>
          ))}

          <Button
            render={<Link href="/register" />}
            nativeButton={false}
            size="sm"
            className="ml-2 rounded-full"
          >
            Register
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="text-white focus:outline-none md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="space-y-4 border-t border-white/10 bg-slate-900/95 px-6 py-5 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={cn(
                "block font-semibold hover:text-blue-400",
                pathname === link.href ? "text-blue-400" : "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/register"
            onClick={closeMenu}
            className="mt-3 block rounded-full bg-blue-600 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
