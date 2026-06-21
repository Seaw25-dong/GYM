"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  LogOut,
  Dumbbell,
  Home,
  Info,
  LayoutDashboard,
  MoreHorizontal,
  ShoppingBasket,
  Pill,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { AuthGuard } from "@/components/auth-guard";
import { cn } from "@/lib/utils";
import { clearAuthSession, getAuthUser } from "@/lib/auth";
import { logoutUser } from "@/lib/api";

const primaryNavItems = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Nhập chỉ số", href: "/onboarding", icon: Sparkles },
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tập luyện", href: "/workout", icon: Dumbbell },
  { label: "Dinh dưỡng", href: "/nutrition", icon: Activity },
  { label: "Thực phẩm", href: "/foods", icon: ShoppingBasket },
  { label: "Tiến độ", href: "/progress", icon: TrendingUp },
  { label: "Bài tập", href: "/exercises", icon: Dumbbell },
  { label: "Thuật ngữ", href: "/glossary", icon: Info },
  { label: "Thực phẩm bổ sung", href: "/supplements", icon: Pill },
  { label: "Cài đặt", href: "/settings", icon: Settings },
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
        <p className="mt-1 text-sm text-zinc-500">Huấn luyện cá nhân hóa</p>
      </Link>

      <nav className="space-y-3" aria-label="Primary navigation">
        {primaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      <div className="mt-10 border-t border-white/10 pt-6">
        <p className="mb-3 px-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
          Sắp có
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
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const mobileItems = primaryNavItems.filter((item) =>
    ["/", "/onboarding", "/dashboard", "/workout"].includes(item.href)
  );
  const moreItems = primaryNavItems.filter((item) =>
    ["/nutrition", "/foods", "/progress", "/exercises", "/glossary", "/supplements", "/settings"].includes(item.href)
  );
  const moreActive = moreItems.some((item) => item.href === pathname);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
        <Link href="/" className="font-bold">
          AI Gym Coach
        </Link>
        <Link
          href="/settings"
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300"
        >
          Tài khoản
        </Link>
        </div>
      </div>

      {showMore && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute inset-x-3 bottom-24 rounded-3xl border border-white/10 bg-zinc-950 p-3 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <p className="px-3 pb-2 pt-1 text-xs uppercase tracking-widest text-zinc-600">Khám phá thêm</p>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setShowMore(false)} className={cn("flex items-center gap-3 rounded-2xl px-3 py-3 text-sm", active ? "bg-white text-black" : "bg-white/5 text-zinc-300")}>
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/10 bg-black/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
        aria-label="Điều hướng di động"
      >
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const shortLabel = item.href === "/onboarding" ? "Chỉ số" : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] transition",
                active ? "bg-white text-black" : "text-zinc-500 active:bg-white/10 active:text-white"
              )}
            >
              <Icon className="size-5" />
              <span className="max-w-full truncate">{shortLabel}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setShowMore((current) => !current)}
          className={cn(
            "flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] transition",
            showMore || moreActive ? "bg-white text-black" : "text-zinc-500 active:bg-white/10 active:text-white"
          )}
        >
          <MoreHorizontal className="size-5" />
          <span>Thêm</span>
        </button>
      </nav>
    </>
  );
}

function AppShell({ children }) {
  const user = getAuthUser();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // Clear the local session even if the server is temporarily unavailable.
    }
    clearAuthSession();
    window.location.href = "/";
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="min-w-0 flex-1 pb-24 lg:pb-0">
            <MobileNav />
            <div className="hidden border-b border-white/10 px-6 py-3 text-sm text-zinc-500 lg:flex lg:items-center lg:justify-end lg:gap-4">
              {user && (
                <Link href="/settings" className="flex items-center gap-3 text-zinc-300">
                  {user.avatarUrl ? (
                    <Image
                      unoptimized
                      src={user.avatarUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover ring-1 ring-white/15"
                    />
                  ) : (
                    <span className="grid size-9 place-items-center rounded-full bg-white text-sm font-bold text-black">
                      {(user.username || user.email).charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>{user.username || user.email}</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-zinc-300 transition hover:bg-white/10"
              >
                <LogOut className="size-4" />
                Đăng xuất
              </button>
            </div>
            {children}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}

export { AppShell, AppSidebar, MobileNav, primaryNavItems };
