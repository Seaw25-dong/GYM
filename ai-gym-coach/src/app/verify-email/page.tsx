"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { verifyEmail } from "@/lib/api";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Đang xác thực tài khoản...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function run() {
      if (!token) {
        setFailed(true);
        setStatus("Thiếu token xác thực.");
        return;
      }

      try {
        const data = await verifyEmail(token);
        setStatus(data.message || "Tài khoản đã được xác thực. Bạn có thể đóng trang này.");
      } catch (error) {
        setFailed(true);
        setStatus(error.message);
      }
    }

    run();
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
        <p className="text-sm uppercase tracking-widest text-zinc-500">
          Xác thực email
        </p>
        <h1 className="mt-5 text-3xl font-bold">
          {failed ? "Không xác thực được" : "Đã nhận yêu cầu"}
        </h1>
        <p className="mt-4 leading-relaxed text-zinc-400">{status}</p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
        >
          Về trang đăng nhập
        </Link>
      </div>
    </main>
  );
}

function VerifyFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <p className="text-zinc-500">Đang tải trang xác thực...</p>
    </main>
  );
}
