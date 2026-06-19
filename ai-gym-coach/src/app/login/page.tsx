"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

import { ToastMessage } from "@/components/toast-message";
import { PasswordInput } from "@/components/password-input";
import { AuthPageShell } from "@/components/auth-page-shell";
import { loginUser } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailRegex.test(email)) {
      showToast("Email không đúng định dạng", "error");
      return;
    }

    if (password.length <= 8) {
      showToast("Mật khẩu phải dài hơn 8 ký tự", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginUser({ email, password, rememberLogin });
      saveAuthSession(data);
      router.replace("/");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast(message);
    setToastType(type);
    window.setTimeout(() => setToast(""), 4000);
  };

  return (
    <AuthPageShell
      title="Mỗi buổi tập đều có mục tiêu rõ ràng."
      description="Đăng nhập để tiếp tục plan cá nhân, theo dõi tiến độ và để AI Coach hiểu bạn hơn qua từng buổi tập."
    >
      <ToastMessage message={toast} type={toastType} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Link>

        <h1 className="mt-7 text-3xl font-bold sm:mt-8 sm:text-4xl">Đăng nhập</h1>
        <p className="mt-3 text-zinc-400">
          Đăng nhập để tạo plan AI và lưu dữ liệu cá nhân của bạn.
        </p>

        <div className="mt-8 grid gap-5">
          <label>
            <span className="mb-2 block text-sm text-zinc-500">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-4 outline-none transition focus:border-white/30"
            />
          </label>
          <PasswordInput
            label="Mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={rememberLogin}
              onChange={(event) => setRememberLogin(event.target.checked)}
              className="size-4 rounded border-white/20 bg-black accent-white"
            />
            Ghi nhớ đăng nhập
          </label>
          <div className="flex items-center justify-between gap-3 text-sm">
            <Link href="/forgot-password" className="text-zinc-400 hover:text-white">Quên mật khẩu?</Link>
            <Link href="/forgot-password?mode=verify" className="text-zinc-500 hover:text-white">Gửi lại xác thực</Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.02]"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-500">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-white hover:underline">
            Đăng ký
          </Link>
        </p>
      </form>
    </AuthPageShell>
  );
}

function LoginFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <p className="text-zinc-500">Đang tải trang đăng nhập...</p>
    </main>
  );
}
