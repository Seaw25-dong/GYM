"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAuthToken } from "@/lib/auth";
import { clearAuthSession } from "@/lib/auth";
import { refreshAuthSession } from "@/lib/api";

function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (getAuthToken()) {
        if (active) setAllowed(true);
        return;
      }

      try {
        await refreshAuthSession();
        if (active) setAllowed(true);
      } catch {
        clearAuthSession();
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }

    checkSession();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (!allowed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <p className="text-zinc-500">Đang chuyển đến trang đăng nhập...</p>
      </main>
    );
  }

  return children;
}

export { AuthGuard };
