"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Palette, LogOut, Bell, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Restaurants", icon: Store },
  { href: "/templates", label: "Templates", icon: Palette },
];

export function AdminSidebar() {
  const path = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside className="w-[200px] shrink-0 bg-[#140b07] border-r border-[#3d2418] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[#3d2418] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-[#f97316] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">M</span>
        </div>
        <span className="font-semibold text-[#f6ded3] text-sm tracking-tight">MenuCo</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
            path === "/dashboard" || path.startsWith("/restaurants")
              ? "bg-[#f97316]/10 text-[#f97316]"
              : "text-[#a0856f] hover:text-[#f6ded3] hover:bg-[#2a1a12]"
          )}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </Link>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              path.startsWith(href)
                ? "bg-[#f97316]/10 text-[#f97316]"
                : "text-[#a0856f] hover:text-[#f6ded3] hover:bg-[#2a1a12]"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3 border-t border-[#3d2418] space-y-0.5">
        <div className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#a0856f]">
          <div className="w-6 h-6 rounded-full bg-[#2a1a12] flex items-center justify-center text-xs font-medium text-[#f97316]">
            F
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#f6ded3] truncate">François</p>
            <p className="text-[10px] text-[#5a3d2e]">Admin</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-[#5a3d2e] hover:text-[#f6ded3] hover:bg-[#2a1a12] w-full transition-colors"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
}
