"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAuthToken } from "@/lib/auth";

function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    window.requestAnimationFrame(() => setAllowed(true));
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
