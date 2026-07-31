"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { clearAllAuth, getAdminToken } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/adminreg", label: "Register Admin" },
];

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(getAdminToken() !== null);
  }, [pathname]);

  const handleLogout = () => {
    clearAllAuth();
    router.push("/admin/login");
  };

  return (
    <nav className="border-b bg-white/80 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white"
            >
              A
            </Link>
            <Link href="/" className="text-xl font-bold">
              AION <span className="text-blue-600">2K26</span>
            </Link>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            {loggedIn &&
              NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors",
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-blue-600 px-4 py-1.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Logout
              </button>
            ) : (
              <span className="text-sm text-gray-600">Admin Portal</span>
            )}
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="text-slate-700 focus:outline-none md:hidden"
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
          <div className="mt-3 space-y-3 border-t pt-3 text-sm font-medium md:hidden">
            {loggedIn ? (
              <>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block",
                      pathname === link.href
                        ? "font-semibold text-blue-600"
                        : "text-gray-700"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg bg-blue-600 py-2 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <span className="block text-gray-600">Admin Portal</span>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
