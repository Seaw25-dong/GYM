"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthPageShell } from "@/components/auth-page-shell";
import { PasswordInput } from "@/components/password-input";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() { return <Suspense><ResetForm /></Suspense>; }
function ResetForm() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirm) return setMessage("Mật khẩu xác nhận không khớp");
    try { await resetPassword(token, password); router.replace("/login?reset=1"); }
    catch (error) { setMessage(error.message); }
  };
  return <AuthPageShell title="Tạo mật khẩu mới an toàn." description="Sau khi đổi, các refresh token cũ sẽ bị vô hiệu hóa.">
    <form onSubmit={submit} className="grid w-full max-w-md gap-5 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
      <h1 className="text-3xl font-bold">Đặt lại mật khẩu</h1>
      <PasswordInput label="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
      <PasswordInput label="Xác nhận mật khẩu" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      {message && <p className="text-sm text-red-400">{message}</p>}
      <button className="rounded-2xl bg-white px-5 py-4 font-medium text-black">Đổi mật khẩu</button>
    </form>
  </AuthPageShell>;
}
