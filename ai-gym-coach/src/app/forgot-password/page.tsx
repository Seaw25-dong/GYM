"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AuthPageShell } from "@/components/auth-page-shell";
import { forgotPassword, resendVerification } from "@/lib/api";

export default function ForgotPasswordPage() {
  return <Suspense><ForgotForm /></Suspense>;
}

function ForgotForm() {
  const verifyMode = useSearchParams().get("mode") === "verify";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setMessage("");
    try {
      const data = verifyMode ? await resendVerification(email) : await forgotPassword(email);
      setMessage(data.message || "Vui lòng kiểm tra email.");
    } catch (error) { setMessage(error.message); } finally { setLoading(false); }
  };
  return (
    <AuthPageShell title="Khôi phục quyền truy cập." description="Link bảo mật có thời hạn và chỉ được gửi đến email tài khoản.">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-zinc-400"><ArrowLeft className="size-4" />Đăng nhập</Link>
        <h1 className="mt-7 text-3xl font-bold">{verifyMode ? "Gửi lại xác thực" : "Quên mật khẩu"}</h1>
        <p className="mt-3 text-zinc-500">Nhập email đã dùng khi đăng ký.</p>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-7 w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none focus:border-white/30" placeholder="email@example.com" />
        {message && <p className="mt-4 text-sm text-zinc-300">{message}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black disabled:opacity-50">{loading ? "Đang gửi..." : "Gửi email"}</button>
      </form>
    </AuthPageShell>
  );
}
