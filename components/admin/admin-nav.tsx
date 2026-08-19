"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown, LogOut, User, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { clearAllAuth, getAdminToken, getAdminRole } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/adminreg", label: "Register Admin", role: "1" as const },
];

export function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoggedIn(getAdminToken() !== null);
    setRole(getAdminRole());
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAllAuth();
    router.push("/admin/login");
    setDropdownOpen(false);
  };

  const filteredNavLinks = NAV_LINKS.filter(
    (link) => !link.role || (link.role && role === link.role)
  );

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
              filteredNavLinks.map((link) => (
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
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {role === "1" ? "Super Admin" : "Moderator"}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", dropdownOpen && "rotate-180")} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {role === "1" ? "Super Admin" : "Moderator"}
                      </p>
                    </div>
                    <Link
                      href="/admin/changepassword"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
                {filteredNavLinks.map((link) => (
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
                <div className="border-t pt-3">
                  <Link
                    href="/admin/changepassword"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-2 py-2 text-gray-700 hover:text-blue-600"
                  >
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-2 py-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
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