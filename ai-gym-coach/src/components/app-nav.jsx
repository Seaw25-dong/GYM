"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Dumbbell,
  Home,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const primaryNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Onboarding", href: "/onboarding", icon: Sparkles },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Workout", href: "/workout", icon: Dumbbell },
  { label: "Nutrition", href: "/nutrition", icon: Activity },
  { label: "Progress", href: "/progress", icon: BarChart3 },
];

const secondaryItems = [
  { label: "AI Coach", icon: Sparkles },
];

function NavLink({ item, compact = false }) {
  const pathname = usePathname();
  const Icon = item.icon;
  const active = pathname === item.href;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
        active
          ? "border-white/15 bg-white text-black shadow-lg shadow-white/10"
          : "border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white",
        compact && "shrink-0 px-3 py-2"
      )}
    >
      <Icon className="size-4" />
      <span>{item.label}</span>
    </Link>
  );
}

function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-white/[0.02] p-6 lg:block">
      <Link href="/" className="mb-10 block">
        <p className="text-2xl font-bold">AI Gym Coach</p>
        <p className="mt-1 text-sm text-zinc-500">Adaptive AI Training</p>
      </Link>

      <nav className="space-y-3" aria-label="Primary navigation">
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-10 border-t border-white/10 pt-6">
        <p className="mb-3 px-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
          Coming soon
        </p>
        <div className="space-y-3">
          {secondaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                disabled
                className="flex w-full items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-left text-sm font-medium text-zinc-700"
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  return (
    <div className="border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <Link href="/" className="font-bold">
          AI Gym Coach
        </Link>
        <Link
          href="/workout"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
        >
          Train
        </Link>
      </div>

      <nav
        className="flex gap-2 overflow-x-auto pb-1"
        aria-label="Primary navigation"
      >
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} compact />
        ))}
      </nav>
    </div>
  );
}

function AppShell({ children }) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="min-w-0 flex-1">
          <MobileNav />
          {children}
        </div>
      </div>
    </main>
  );
}

export { AppShell, AppSidebar, MobileNav, primaryNavItems };
